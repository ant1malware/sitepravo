// Minimal TOTP (RFC 6238) implementation for browser (HMAC-SHA1, 30s step)
// Base32 helper
const ALPH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function randomBase32(len = 16): string {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  let out = '';
  for (let i = 0; i < len; i++) out += ALPH[bytes[i] % 32];
  return out;
}

function base32ToBytes(base32: string): Uint8Array {
  const clean = base32.replace(/=+$/, '').toUpperCase();
  let bits = 0, value = 0, index = 0;
  const out = new Uint8Array(Math.floor((clean.length * 5) / 8));
  for (let i = 0; i < clean.length; i++) {
    const ch = ALPH.indexOf(clean[i]); if (ch < 0) continue;
    value = (value << 5) | ch; bits += 5;
    if (bits >= 8) { out[index++] = (value >>> (bits - 8)) & 0xff; bits -= 8; }
  }
  return out;
}

async function hmacSha1(key: Uint8Array, msg: Uint8Array): Promise<ArrayBuffer> {
  const keyBuf = key.buffer.slice(key.byteOffset, key.byteOffset + key.byteLength) as ArrayBuffer;
  const msgBuf = msg.buffer.slice(msg.byteOffset, msg.byteOffset + msg.byteLength) as ArrayBuffer;
  const cryptoKey = await crypto.subtle.importKey('raw', keyBuf, { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']);
  return crypto.subtle.sign('HMAC', cryptoKey, msgBuf);
}

function counterToBytes(counter: number): Uint8Array {
  const buf = new ArrayBuffer(8); const view = new DataView(buf);
  const hi = Math.floor(counter / 0x100000000);
  const lo = counter >>> 0;
  view.setUint32(0, hi); view.setUint32(4, lo);
  return new Uint8Array(buf);
}

export async function totp(secretBase32: string, stepSec = 30, digits = 6, t = Date.now()): Promise<string> {
  const key = base32ToBytes(secretBase32);
  const counter = Math.floor(t / 1000 / stepSec);
  const mac = new Uint8Array(await hmacSha1(key, counterToBytes(counter)));
  const offset = mac[mac.length - 1] & 0x0f;
  const bin = ((mac[offset] & 0x7f) << 24) | ((mac[offset + 1] & 0xff) << 16) | ((mac[offset + 2] & 0xff) << 8) | (mac[offset + 3] & 0xff);
  const mod = 10 ** digits;
  const code = String(bin % mod).padStart(digits, '0');
  return code;
}

export async function verifyTotp(secret: string, input: string, window = 1, stepSec = 30, digits = 6): Promise<boolean> {
  const now = Date.now();
  for (let w = -window; w <= window; w++) {
    const ok = await totp(secret, stepSec, digits, now + w * stepSec * 1000);
    if (ok === input) return true;
  }
  return false;
}

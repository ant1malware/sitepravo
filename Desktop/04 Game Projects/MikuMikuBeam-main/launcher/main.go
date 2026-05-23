package main

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"runtime"
	"strings"
	"sync"
	"sync/atomic"
	"time"
)

// ── config ──────────────────────────────────────────────────────────────────

type config struct {
	SiteURL         string // e.g. https://angelcore.cc  (hardcoded default if missing)
	AgentToken      string // used to POST /api/admin/backend-url on the live site
	VercelToken     string // optional, legacy fallback
	VercelProjectID string // optional, legacy fallback
	VercelTeamID    string // optional, legacy fallback
	EdgeConfigID    string // optional, legacy fallback
}

func loadEnv(path string) map[string]string {
	m := make(map[string]string)
	f, err := os.Open(path)
	if err != nil {
		return m
	}
	defer f.Close()
	sc := bufio.NewScanner(f)
	for sc.Scan() {
		line := strings.TrimSpace(sc.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		parts := strings.SplitN(line, "=", 2)
		if len(parts) == 2 {
			m[strings.TrimSpace(parts[0])] = strings.TrimSpace(parts[1])
		}
	}
	return m
}

func loadConfig(rootDir string) config {
	env := loadEnv(filepath.Join(rootDir, ".env"))
	siteURL := env["SITE_URL"]
	if siteURL == "" {
		siteURL = "https://angelcore.cc"
	}
	return config{
		SiteURL:         strings.TrimRight(siteURL, "/"),
		AgentToken:      env["AGENT_TOKEN"],
		VercelToken:     env["VERCEL_TOKEN"],
		VercelProjectID: env["VERCEL_PROJECT_ID"],
		VercelTeamID:    env["VERCEL_TEAM_ID"],
		EdgeConfigID:    env["EDGE_CONFIG_ID"],
	}
}

// pushUrlToSite POSTs the current cloudflared wsURL to the live site.
// The site stores it in the DB; /api/ddos/config reads it at runtime — no redeploy needed.
func pushUrlToSite(siteURL, agentToken, wsURL string) error {
	body, _ := json.Marshal(map[string]string{"url": wsURL})
	req, err := http.NewRequest("POST", siteURL+"/api/admin/backend-url", bytes.NewReader(body))
	if err != nil {
		return err
	}
	req.Header.Set("Authorization", "Bearer "+agentToken)
	req.Header.Set("Content-Type", "application/json")
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode >= 400 {
		b, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("site API %d: %s", resp.StatusCode, b)
	}
	return nil
}

// addTeamID appends ?teamId=xxx or &teamId=xxx to a URL when teamID is set.
func addTeamID(rawURL, teamID string) string {
	if teamID == "" {
		return rawURL
	}
	sep := "?"
	if strings.Contains(rawURL, "?") {
		sep = "&"
	}
	return rawURL + sep + "teamId=" + teamID
}

// saveEnvValue upserts KEY=VALUE in the .env file at path.
func saveEnvValue(path, key, value string) error {
	data, _ := os.ReadFile(path)
	lines := strings.Split(string(data), "\n")
	found := false
	prefix := key + "="
	for i, line := range lines {
		if strings.HasPrefix(strings.TrimSpace(line), prefix) {
			lines[i] = key + "=" + value
			found = true
			break
		}
	}
	if !found {
		// trim trailing blank lines then append
		for len(lines) > 0 && strings.TrimSpace(lines[len(lines)-1]) == "" {
			lines = lines[:len(lines)-1]
		}
		lines = append(lines, key+"="+value, "")
	}
	return os.WriteFile(path, []byte(strings.Join(lines, "\n")), 0644)
}

// ── vercel API ───────────────────────────────────────────────────────────────

// vTeamID is set from .env at startup; when non-empty it's added to every Vercel API call.
var vTeamID string

type vercelEnvVar struct {
	ID     string `json:"id"`
	Key    string `json:"key"`
	Value  string `json:"value"`
	Type   string `json:"type"`
	Target []string `json:"target"`
}

func vercelListEnv(token, projectID string) ([]vercelEnvVar, error) {
	req, _ := http.NewRequest("GET",
		addTeamID(fmt.Sprintf("https://api.vercel.com/v9/projects/%s/env", projectID), vTeamID), nil)
	req.Header.Set("Authorization", "Bearer "+token)
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	var result struct {
		Envs []vercelEnvVar `json:"envs"`
	}
	json.NewDecoder(resp.Body).Decode(&result)
	return result.Envs, nil
}

func vercelUpdateMMBEAM(token, projectID, tunnelURL string) error {
	wsURL := strings.Replace(tunnelURL, "https://", "wss://", 1)
	if !strings.HasSuffix(wsURL, "/agent") {
		wsURL += "/agent"
	}

	envs, err := vercelListEnv(token, projectID)
	if err != nil {
		return fmt.Errorf("vercel list env: %w", err)
	}

	var envID string
	for _, e := range envs {
		if e.Key == "MMBEAM_WS" {
			envID = e.ID
			break
		}
	}

	body, _ := json.Marshal(map[string]interface{}{
		"key":    "MMBEAM_WS",
		"value":  wsURL,
		"type":   "plain",
		"target": []string{"production", "preview"},
	})

	var method, rawURL string
	if envID != "" {
		method = "PATCH"
		rawURL = fmt.Sprintf("https://api.vercel.com/v9/projects/%s/env/%s", projectID, envID)
	} else {
		method = "POST"
		rawURL = fmt.Sprintf("https://api.vercel.com/v9/projects/%s/env", projectID)
	}

	req, _ := http.NewRequest(method, addTeamID(rawURL, vTeamID), bytes.NewReader(body))
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode >= 400 {
		b, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("vercel API %d: %s", resp.StatusCode, string(b))
	}
	return nil
}

// ── vercel edge config ───────────────────────────────────────────────────────

type ecCreateResult struct {
	ID               string `json:"id"`
	ConnectionString string `json:"connectionString"`
}

// vercelCreateEdgeConfig creates a new Edge Config store named "mmbeam".
func vercelCreateEdgeConfig(token string) (ecCreateResult, error) {
	body, _ := json.Marshal(map[string]interface{}{"slug": "mmbeam"})
	req, _ := http.NewRequest("POST", addTeamID("https://api.vercel.com/v1/edge-config", vTeamID), bytes.NewReader(body))
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return ecCreateResult{}, err
	}
	defer resp.Body.Close()
	if resp.StatusCode >= 400 {
		b, _ := io.ReadAll(resp.Body)
		return ecCreateResult{}, fmt.Errorf("create edge config %d: %s", resp.StatusCode, b)
	}
	var r ecCreateResult
	json.NewDecoder(resp.Body).Decode(&r)
	return r, nil
}

// vercelEdgeConfigUpsert writes/updates a single key in the Edge Config store.
func vercelEdgeConfigUpsert(token, ecID, key, value string) error {
	type item struct {
		Operation string `json:"operation"`
		Key       string `json:"key"`
		Value     string `json:"value"`
	}
	body, _ := json.Marshal([]item{{Operation: "upsert", Key: key, Value: value}})
	req, _ := http.NewRequest("PATCH",
		addTeamID(fmt.Sprintf("https://api.vercel.com/v1/edge-config/%s/items", ecID), vTeamID),
		bytes.NewReader(body))
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode >= 400 {
		b, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("edge config upsert %d: %s", resp.StatusCode, b)
	}
	return nil
}

// vercelAddProjectEnv adds or updates a plain env var on the Vercel project
// (used once to bake EDGE_CONFIG connection string into the deployment).
func vercelAddProjectEnv(token, projectID, key, value string) error {
	envs, _ := vercelListEnv(token, projectID)
	var existingID string
	for _, e := range envs {
		if e.Key == key {
			existingID = e.ID
			break
		}
	}
	body, _ := json.Marshal(map[string]interface{}{
		"key":    key,
		"value":  value,
		"type":   "plain",
		"target": []string{"production", "preview"},
	})
	var method, rawURL string
	if existingID != "" {
		method = "PATCH"
		rawURL = fmt.Sprintf("https://api.vercel.com/v9/projects/%s/env/%s", projectID, existingID)
	} else {
		method = "POST"
		rawURL = fmt.Sprintf("https://api.vercel.com/v9/projects/%s/env", projectID)
	}
	req, _ := http.NewRequest(method, addTeamID(rawURL, vTeamID), bytes.NewReader(body))
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode >= 400 {
		b, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("add project env %d: %s", resp.StatusCode, b)
	}
	return nil
}

// ── vercel redeploy ──────────────────────────────────────────────────────────

var deployStatus atomic.Value // stores string: "", "deploying", "online", "failed"

func vercelGetLatestDeployID(token, projectID string) (string, error) {
	req, _ := http.NewRequest("GET",
		addTeamID(fmt.Sprintf("https://api.vercel.com/v6/deployments?projectId=%s&target=production&limit=1", projectID), vTeamID), nil)
	req.Header.Set("Authorization", "Bearer "+token)
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	var result struct {
		Deployments []struct {
			UID   string `json:"uid"`
			State string `json:"state"`
		} `json:"deployments"`
	}
	json.NewDecoder(resp.Body).Decode(&result)
	if len(result.Deployments) == 0 {
		return "", fmt.Errorf("no deployments found")
	}
	return result.Deployments[0].UID, nil
}

func vercelTriggerRedeploy(token, projectID string) error {
	uid, err := vercelGetLatestDeployID(token, projectID)
	if err != nil {
		return err
	}
	body, _ := json.Marshal(map[string]interface{}{"target": "production"})
	req, _ := http.NewRequest("POST",
		addTeamID(fmt.Sprintf("https://api.vercel.com/v13/deployments/%s/redeploy", uid), vTeamID),
		bytes.NewReader(body))
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode >= 400 {
		b, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("redeploy %d: %s", resp.StatusCode, b)
	}
	return nil
}

func vercelPollDeployReady(token, projectID string) {
	deployStatus.Store("deploying")
	deadline := time.Now().Add(3 * time.Minute)
	for time.Now().Before(deadline) {
		time.Sleep(8 * time.Second)
		req, _ := http.NewRequest("GET",
			addTeamID(fmt.Sprintf("https://api.vercel.com/v6/deployments?projectId=%s&target=production&limit=1", projectID), vTeamID), nil)
		req.Header.Set("Authorization", "Bearer "+token)
		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			continue
		}
		var result struct {
			Deployments []struct {
				State string `json:"state"`
			} `json:"deployments"`
		}
		json.NewDecoder(resp.Body).Decode(&result)
		resp.Body.Close()
		if len(result.Deployments) > 0 && result.Deployments[0].State == "READY" {
			deployStatus.Store("online")
			return
		}
		if len(result.Deployments) > 0 && result.Deployments[0].State == "ERROR" {
			deployStatus.Store("failed")
			return
		}
	}
	deployStatus.Store("failed")
}

// ── agent count via HTTP poll ────────────────────────────────────────────────

var agentCount atomic.Int32

func pollAgentCount() {
	for {
		time.Sleep(3 * time.Second)
		resp, err := http.Get("http://localhost:3000/agent/token")
		if err != nil {
			continue
		}
		var result struct {
			Agents int `json:"agents"`
		}
		json.NewDecoder(resp.Body).Decode(&result)
		resp.Body.Close()
		agentCount.Store(int32(result.Agents))
	}
}

// ── process management ───────────────────────────────────────────────────────

func rootDir() string {
	exe, _ := os.Executable()
	dir := filepath.Dir(exe)
	// When run from launcher/ subdir during dev, go one level up
	if filepath.Base(dir) == "launcher" {
		dir = filepath.Dir(dir)
	}
	return dir
}

func findCloudflared(root string) string {
	candidates := []string{
		filepath.Join(root, "cloudflared.exe"),
		filepath.Join(root, "cloudflared-windows-amd64.exe"),
		"cloudflared.exe",
	}
	for _, c := range candidates {
		if _, err := os.Stat(c); err == nil {
			return c
		}
	}
	return ""
}

func startMikuMikuBeam(root string, dotEnv map[string]string) *exec.Cmd {
	cmd := exec.Command("node", ".")
	cmd.Dir = root
	cmd.Stdout = io.Discard
	cmd.Stderr = io.Discard
	// Inherit current process env, then overlay .env values + force production mode
	env := os.Environ()
	for k, v := range dotEnv {
		env = append(env, k+"="+v)
	}
	env = append(env, "NODE_ENV=production")
	cmd.Env = env
	cmd.Start()
	return cmd
}

var tunnelURLRe = regexp.MustCompile(`https://[a-z0-9-]+\.trycloudflare\.com`)

func startCloudflared(cfPath string) (cmd *exec.Cmd, urlCh chan string) {
	urlCh = make(chan string, 1)
	cmd = exec.Command(cfPath, "tunnel", "--url", "http://localhost:3000")
	pr, pw, _ := os.Pipe()
	cmd.Stderr = pw
	cmd.Stdout = pw

	go func() {
		sc := bufio.NewScanner(pr)
		sent := false
		for sc.Scan() {
			line := sc.Text()
			if !sent {
				if m := tunnelURLRe.FindString(line); m != "" {
					urlCh <- m
					sent = true
				}
			}
		}
	}()

	cmd.Start()
	return
}

// ── UI ───────────────────────────────────────────────────────────────────────

func clearLine() { fmt.Print("\r\033[K") }
func setTitle(t string) {
	if runtime.GOOS == "windows" {
		exec.Command("cmd", "/c", "title", t).Run()
	}
}

func openBrowser(url string) {
	switch runtime.GOOS {
	case "windows":
		exec.Command("rundll32", "url.dll,FileProtocolHandler", url).Start()
	case "darwin":
		exec.Command("open", url).Start()
	default:
		exec.Command("xdg-open", url).Start()
	}
}

// ── main ─────────────────────────────────────────────────────────────────────

func main() {
	root := rootDir()
	rawEnv := loadEnv(filepath.Join(root, ".env"))
	cfg := loadConfig(root)
	vTeamID = cfg.VercelTeamID // set global for all Vercel API helpers

	setTitle("MikuMikuBeam Launcher")

	fmt.Println("╔══════════════════════════════════════════════╗")
	fmt.Println("║        MikuMikuBeam · angelcore.cc           ║")
	fmt.Println("╚══════════════════════════════════════════════╝")
	fmt.Println()

	// 1. Start MikuMikuBeam backend
	fmt.Print("  [1/3] Запуск MikuMikuBeam...")
	beamCmd := startMikuMikuBeam(root, rawEnv)
	time.Sleep(2 * time.Second)
	if beamCmd.ProcessState != nil && beamCmd.ProcessState.Exited() {
		fmt.Println(" ОШИБКА — node завершился. Проверь npm install и сборку.")
		pause()
		return
	}
	fmt.Println(" OK  (port 3000)")

	// 2. Start cloudflared
	cfPath := findCloudflared(root)
	if cfPath == "" {
		fmt.Println()
		fmt.Println("  [!] cloudflared.exe не найден в папке!")
		fmt.Println("      Скачай: https://github.com/cloudflare/cloudflared/releases")
		fmt.Println("      и положи рядом с START.bat")
		fmt.Println()
		fmt.Println("  Всё равно запускаю MikuMikuBeam без тоннеля.")
		fmt.Println("  Открываю http://localhost:3000 ...")
		openBrowser("http://localhost:3000")
		go pollAgentCount()
		runStatusLoop(root, "", cfg)
		return
	}

	fmt.Print("  [2/3] Запуск cloudflared тоннеля...")
	cfCmd, urlCh := startCloudflared(cfPath)
	_ = cfCmd

	var tunnelURL string
	select {
	case tunnelURL = <-urlCh:
		fmt.Printf(" OK\n      URL: %s\n", tunnelURL)
	case <-time.After(30 * time.Second):
		fmt.Println(" ТАЙМАУТ — не удалось получить URL тоннеля")
		fmt.Println("  Проверь интернет-соединение и повтори запуск")
		pause()
		return
	}

	// 3. Push tunnel URL to Vercel (Edge Config — no redeploy after first setup)
	wsURL := strings.Replace(tunnelURL, "https://", "wss://", 1)
	if !strings.HasSuffix(wsURL, "/agent") {
		wsURL += "/agent"
	}
	// Primary: POST new tunnel URL directly to the live site DB (instant, no redeploy)
	fmt.Printf("  [3/3] Обновляем URL на %s...", cfg.SiteURL)
	if cfg.AgentToken == "" {
		fmt.Println(" ПРОПУЩЕНО (нет AGENT_TOKEN в .env)")
		fmt.Printf("  Добавь AGENT_TOKEN в .env (тот же что и в Vercel)\n")
		fmt.Printf("  Или вручную: MMBEAM_WS = %s\n", wsURL)
		deployStatus.Store("skipped")
	} else if err := pushUrlToSite(cfg.SiteURL, cfg.AgentToken, wsURL); err != nil {
		fmt.Printf(" ОШИБКА: %v\n", err)
		// Fallback: legacy Vercel API path
		if cfg.VercelToken != "" && cfg.VercelProjectID != "" {
			fmt.Printf("  Fallback Vercel API...\n")
			if err2 := vercelUpdateMMBEAM(cfg.VercelToken, cfg.VercelProjectID, tunnelURL); err2 == nil {
				fmt.Printf("  MMBEAM_WS обновлён (вступит после следующего деплоя)\n")
				deployStatus.Store("online")
			} else {
				fmt.Printf("  Vercel тоже не работает: %v\n", err2)
				fmt.Printf("  Вставь вручную: MMBEAM_WS = %s\n", wsURL)
				deployStatus.Store("failed")
			}
		} else {
			fmt.Printf("  Вставь вручную: MMBEAM_WS = %s\n", wsURL)
			deployStatus.Store("failed")
		}
	} else {
		fmt.Println(" OK  (мгновенно, без редеплоя)")
		deployStatus.Store("online")
	}

	fmt.Println()
	fmt.Println("  ✓ Всё запущено! Открываю локальный UI...")
	openBrowser("http://localhost:3000")
	go pollAgentCount()

	var wg sync.WaitGroup
	wg.Add(1)
	go func() {
		defer wg.Done()
		runStatusLoop(root, tunnelURL, cfg)
	}()
	wg.Wait()
}

func runStatusLoop(root, tunnelURL string, cfg config) {
	ticker := time.NewTicker(2 * time.Second)
	defer ticker.Stop()

	start := time.Now()
	for range ticker.C {
		elapsed := time.Since(start)
		h := int(elapsed.Hours())
		m := int(elapsed.Minutes()) % 60
		s := int(elapsed.Seconds()) % 60

		agents := agentCount.Load()
		wsURL := ""
		if tunnelURL != "" {
			wsURL = strings.Replace(tunnelURL, "https://", "wss://", 1) + "/agent"
		}

		ds, _ := deployStatus.Load().(string)
		deployLabel := ""
		switch ds {
		case "deploying":
			deployLabel = "  |  Vercel: деплой..."
		case "online":
			deployLabel = "  |  Vercel: ONLINE ✓"
		case "failed":
			deployLabel = "  |  Vercel: редеплой не удался"
		case "skipped":
			deployLabel = "  |  Vercel: не настроен"
		}

		clearLine()
		if tunnelURL != "" {
			fmt.Printf("\r  Время: %02d:%02d:%02d  |  Агентов: %d  |  Тоннель: %s%s",
				h, m, s, agents, wsURL, deployLabel)
		} else {
			fmt.Printf("\r  Время: %02d:%02d:%02d  |  Агентов: %d  |  localhost:3000%s",
				h, m, s, agents, deployLabel)
		}
	}
}

func pause() {
	fmt.Println("\nНажми Enter для выхода...")
	bufio.NewReader(os.Stdin).ReadString('\n')
}

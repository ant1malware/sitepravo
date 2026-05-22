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
	VercelToken     string
	VercelProjectID string
	AgentToken      string
	EdgeConfigID    string // set after first-run creation; subsequent runs skip redeploy
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
	return config{
		VercelToken:     env["VERCEL_TOKEN"],
		VercelProjectID: env["VERCEL_PROJECT_ID"],
		AgentToken:      env["AGENT_TOKEN"],
		EdgeConfigID:    env["EDGE_CONFIG_ID"],
	}
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

type vercelEnvVar struct {
	ID     string `json:"id"`
	Key    string `json:"key"`
	Value  string `json:"value"`
	Type   string `json:"type"`
	Target []string `json:"target"`
}

func vercelListEnv(token, projectID string) ([]vercelEnvVar, error) {
	req, _ := http.NewRequest("GET",
		fmt.Sprintf("https://api.vercel.com/v9/projects/%s/env", projectID), nil)
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

	var method, url string
	if envID != "" {
		method = "PATCH"
		url = fmt.Sprintf("https://api.vercel.com/v9/projects/%s/env/%s", projectID, envID)
	} else {
		method = "POST"
		url = fmt.Sprintf("https://api.vercel.com/v9/projects/%s/env", projectID)
	}

	req, _ := http.NewRequest(method, url, bytes.NewReader(body))
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
	req, _ := http.NewRequest("POST", "https://api.vercel.com/v1/edge-config", bytes.NewReader(body))
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
		fmt.Sprintf("https://api.vercel.com/v1/edge-config/%s/items", ecID),
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
	var method, url string
	if existingID != "" {
		method = "PATCH"
		url = fmt.Sprintf("https://api.vercel.com/v9/projects/%s/env/%s", projectID, existingID)
	} else {
		method = "POST"
		url = fmt.Sprintf("https://api.vercel.com/v9/projects/%s/env", projectID)
	}
	req, _ := http.NewRequest(method, url, bytes.NewReader(body))
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
		fmt.Sprintf("https://api.vercel.com/v6/deployments?projectId=%s&target=production&limit=1", projectID), nil)
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
		fmt.Sprintf("https://api.vercel.com/v13/deployments/%s/redeploy", uid),
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
			fmt.Sprintf("https://api.vercel.com/v6/deployments?projectId=%s&target=production&limit=1", projectID), nil)
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

func startMikuMikuBeam(root string) *exec.Cmd {
	cmd := exec.Command("node", ".")
	cmd.Dir = root
	cmd.Stdout = io.Discard
	cmd.Stderr = io.Discard
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
	cfg := loadConfig(root)

	setTitle("MikuMikuBeam Launcher")

	fmt.Println("╔══════════════════════════════════════════════╗")
	fmt.Println("║        MikuMikuBeam · angelcore.cc           ║")
	fmt.Println("╚══════════════════════════════════════════════╝")
	fmt.Println()

	// 1. Start MikuMikuBeam backend
	fmt.Print("  [1/3] Запуск MikuMikuBeam...")
	beamCmd := startMikuMikuBeam(root)
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
	envPath := filepath.Join(root, ".env")

	if cfg.VercelToken == "" || cfg.VercelProjectID == "" {
		fmt.Println("  [3/3] ПРОПУЩЕНО (нет VERCEL_TOKEN/VERCEL_PROJECT_ID в .env)")
		fmt.Println()
		fmt.Println("  Вставь вручную в Vercel → Settings → Environment Variables:")
		fmt.Printf("  MMBEAM_WS = %s\n", wsURL)
		deployStatus.Store("skipped")
	} else if cfg.EdgeConfigID != "" {
		// Fast path: Edge Config already set up, just upsert the new URL — instant, no redeploy
		fmt.Print("  [3/3] Edge Config — обновляем URL тоннеля...")
		if err := vercelEdgeConfigUpsert(cfg.VercelToken, cfg.EdgeConfigID, "mmbeam_ws", wsURL); err != nil {
			fmt.Printf(" ОШИБКА: %v\n", err)
			deployStatus.Store("failed")
		} else {
			fmt.Println(" OK  (мгновенно, без редеплоя)")
			deployStatus.Store("online")
		}
	} else {
		// First run: create Edge Config, bake connection string into Vercel env, ONE redeploy
		fmt.Println("  [3/3] Первый запуск — настраиваем Edge Config...")
		fmt.Print("        Создаём Edge Config хранилище...")
		ec, err := vercelCreateEdgeConfig(cfg.VercelToken)
		if err != nil {
			fmt.Printf(" ОШИБКА: %v\n", err)
			fmt.Println("  Fallback: пишем MMBEAM_WS напрямую и делаем редеплой...")
			if err2 := vercelUpdateMMBEAM(cfg.VercelToken, cfg.VercelProjectID, tunnelURL); err2 == nil {
				if err3 := vercelTriggerRedeploy(cfg.VercelToken, cfg.VercelProjectID); err3 == nil {
					fmt.Println("  Редеплой запущен (~60с)")
					go vercelPollDeployReady(cfg.VercelToken, cfg.VercelProjectID)
				}
			}
		} else {
			fmt.Printf(" OK  (id: %s)\n", ec.ID)

			fmt.Print("        Записываем URL тоннеля...")
			if err2 := vercelEdgeConfigUpsert(cfg.VercelToken, ec.ID, "mmbeam_ws", wsURL); err2 != nil {
				fmt.Printf(" ОШИБКА: %v\n", err2)
			} else {
				fmt.Println(" OK")
			}

			fmt.Print("        Добавляем EDGE_CONFIG в проект Vercel...")
			if err3 := vercelAddProjectEnv(cfg.VercelToken, cfg.VercelProjectID, "EDGE_CONFIG", ec.ConnectionString); err3 != nil {
				fmt.Printf(" ОШИБКА: %v\n", err3)
			} else {
				fmt.Println(" OK")
			}

			// Save EC ID locally so next run skips all this
			_ = saveEnvValue(envPath, "EDGE_CONFIG_ID", ec.ID)
			cfg.EdgeConfigID = ec.ID

			fmt.Print("        Запускаем ФИНАЛЬНЫЙ редеплой (последний раз)...")
			if err4 := vercelTriggerRedeploy(cfg.VercelToken, cfg.VercelProjectID); err4 != nil {
				fmt.Printf(" ОШИБКА: %v\n", err4)
				fmt.Println("  Сделай редеплой вручную: Vercel → Deployments → Redeploy last")
				deployStatus.Store("failed")
			} else {
				fmt.Println(" ~60с)")
				fmt.Println("  После этого редеплоя больше не нужны — Edge Config обновляется мгновенно.")
				go vercelPollDeployReady(cfg.VercelToken, cfg.VercelProjectID)
			}
		}
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

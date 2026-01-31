# capsolver-cli

CLI tool for the [CapSolver](https://capsolver.com) captcha solving API. Solve reCAPTCHA, Turnstile, GeeTest, image captchas, and more from your terminal.

Compiles to a single standalone binary via `bun build --compile`.

---

## Setup

```bash
bun install
cp .env.example .env
# Add your API key to .env:
# CAPSOLVER_API_KEY=CAP-xxxxx
```

Get your API key from [dashboard.capsolver.com](https://dashboard.capsolver.com).

---

## Quick Start

```bash
# Check balance
capsolver

# Solve an image captcha
capsolver solve image captcha.png

# Solve reCAPTCHA v2
capsolver solve recaptcha-v2 --url https://example.com --key 6Le-wvkSAAAAAPBMRTvw0Q4Muexq

# Solve Cloudflare Turnstile
capsolver solve turnstile --url https://example.com --key 0x4AAAAAAA

# Get raw JSON output
capsolver solve recaptcha-v2 --url https://example.com --key SITEKEY --json

# Get just the token (for piping)
capsolver solve turnstile --url https://example.com --key SITEKEY --quiet
```

---

## Commands

### `capsolver` (no args)

Shows account balance. Same as `capsolver balance`.

### `capsolver balance`

```
Balance: $25.50

Packages:
  reCAPTCHA v2 500K                500000 calls  active  expires 12/18/2024
```

### `capsolver solve <type>`

Solve a captcha. Creates the task, auto-polls for the result, and prints the solution.

#### `solve image <file>`

OCR / image-to-text. Returns the result immediately (synchronous).

```bash
capsolver solve image captcha.png
capsolver solve image screenshot.jpg --module number
cat captcha.png | capsolver solve image -    # Read from stdin
```

| Flag | Description |
|---|---|
| `--module <module>` | `common` (default) or `number` (digits only) |
| `--url <url>` | Page source URL to improve accuracy |

#### `solve recaptcha-v2`

```bash
capsolver solve recaptcha-v2 --url https://example.com --key 6Le-wvkSAAAA...
capsolver solve recaptcha-v2 --url https://example.com --key SITEKEY --enterprise
capsolver solve recaptcha-v2 --url https://example.com --key SITEKEY --invisible
capsolver solve recaptcha-v2 --url https://example.com --key SITEKEY --proxy 1.2.3.4:8080:user:pass
```

| Flag | Required | Description |
|---|---|---|
| `--url <url>` | Yes | Target page URL |
| `--key <sitekey>` | Yes | reCAPTCHA site key |
| `--enterprise` | No | Use enterprise task type |
| `--invisible` | No | Invisible reCAPTCHA (no checkbox) |
| `--proxy <proxy>` | No | Use your own proxy (switches from ProxyLess) |
| `--page-action <action>` | No | The `sa` parameter from `/anchor` |
| `--data-s <value>` | No | The `s` parameter from `/anchor` |
| `--api-domain <domain>` | No | `google.com` or `recaptcha.net` |

#### `solve recaptcha-v3`

```bash
capsolver solve recaptcha-v3 --url https://example.com --key SITEKEY
capsolver solve recaptcha-v3 --url https://example.com --key SITEKEY --action login --min-score 0.7
```

| Flag | Required | Description |
|---|---|---|
| `--url <url>` | Yes | Target page URL |
| `--key <sitekey>` | Yes | reCAPTCHA site key |
| `--action <action>` | No | Page action value |
| `--min-score <score>` | No | Minimum score (0.1-0.9) |
| `--enterprise` | No | Use enterprise task type |
| `--proxy <proxy>` | No | Use your own proxy |
| `--api-domain <domain>` | No | `google.com` or `recaptcha.net` |

#### `solve turnstile`

```bash
capsolver solve turnstile --url https://example.com --key 0x4AAAAAAA
capsolver solve turnstile --url https://example.com --key KEY --action login --cdata session-id
```

| Flag | Required | Description |
|---|---|---|
| `--url <url>` | Yes | Target page URL |
| `--key <sitekey>` | Yes | Turnstile site key |
| `--action <action>` | No | `data-action` attribute value |
| `--cdata <cdata>` | No | `data-cdata` attribute value |

#### `solve geetest`

Supports both v3 and v4. Provide `--gt` + `--challenge` for v3, or `--captcha-id` for v4.

```bash
# GeeTest v3
capsolver solve geetest --url https://example.com --gt GT_VALUE --challenge CHALLENGE_VALUE

# GeeTest v4
capsolver solve geetest --url https://example.com --captcha-id CAPTCHA_ID
```

| Flag | Required | Description |
|---|---|---|
| `--url <url>` | Yes | Target page URL |
| `--gt <gt>` | v3 only | GeeTest gt parameter |
| `--challenge <challenge>` | v3 only | GeeTest challenge parameter |
| `--captcha-id <id>` | v4 only | GeeTest v4 captchaId |
| `--subdomain <sub>` | No | GeeTest API server subdomain |

#### `solve datadome`

```bash
capsolver solve datadome --url https://example.com --captcha-url https://geo.captcha-delivery.com/...
```

| Flag | Required | Description |
|---|---|---|
| `--url <url>` | Yes | Target page URL |
| `--captcha-url <url>` | Yes | DataDome captcha URL |
| `--proxy <proxy>` | No | Proxy string |

#### `solve aws-waf`

```bash
capsolver solve aws-waf --url https://example.com
capsolver solve aws-waf --url https://example.com --proxy 1.2.3.4:8080
```

| Flag | Required | Description |
|---|---|---|
| `--url <url>` | Yes | Target page URL |
| `--proxy <proxy>` | No | Proxy string (switches from ProxyLess) |

#### `solve mtcaptcha`

```bash
capsolver solve mtcaptcha --url https://example.com --key SITEKEY
```

| Flag | Required | Description |
|---|---|---|
| `--url <url>` | Yes | Target page URL |
| `--key <sitekey>` | Yes | MTCaptcha site key |

#### `solve cloudflare-challenge`

```bash
capsolver solve cloudflare-challenge --url https://example.com
```

| Flag | Required | Description |
|---|---|---|
| `--url <url>` | Yes | Target page URL |
| `--proxy <proxy>` | No | Proxy string |

### `capsolver task <taskId>`

Check the status or retrieve the result of an existing task.

```bash
capsolver task 37223a89-06ed-442c-a0b8-22067b79c5b4
capsolver task 37223a89 --json
```

### `capsolver config`

Show or update configuration.

```bash
capsolver config                          # Show current config (masked key)
capsolver config set-key CAP-xxxxx        # Save API key to .env
```

---

## Global Flags

| Flag | Description |
|---|---|
| `--json` | Output raw JSON (for scripting/piping) |
| `--quiet` | Output only the solution value (token, text, etc.) |
| `--timeout <seconds>` | Polling timeout, default 120s |
| `--version` | Show version |
| `--help` | Show help |

---

## Output Modes

**Default** — Pretty-printed with colors and a spinner while polling:

```
Task: 37223a89-06ed-442c-a0b8-22067b79c5b4
Status: ready
Solution:
  gRecaptchaResponse: 03AGdBq25SxXT-pmS...
  userAgent: Mozilla/5.0...
```

**`--json`** — Raw JSON, no colors, no spinner:

```json
{
  "errorId": 0,
  "taskId": "37223a89-06ed-442c-a0b8-22067b79c5b4",
  "status": "ready",
  "solution": {
    "gRecaptchaResponse": "03AGdBq25SxXT-pmS..."
  }
}
```

**`--quiet`** — Just the token/text value, nothing else. Best for piping:

```bash
TOKEN=$(capsolver solve recaptcha-v2 --url ... --key ... --quiet)
curl -d "g-recaptcha-response=$TOKEN" https://example.com/submit
```

---

## Environment

| Variable | Description |
|---|---|
| `CAPSOLVER_API_KEY` | Your CapSolver API key (required) |

Bun auto-loads `.env` from the working directory.

---

## Development

```bash
bun run dev -- balance                     # Run in dev mode
bun run dev -- solve image captcha.png
bun test                                   # Run all tests
bun test test/unit                         # Unit tests only
bun test test/integration                  # Integration tests only
```

## Building

```bash
bun run build    # Produces ./capsolver binary
```

The binary is standalone — no Bun or Node required to run it.

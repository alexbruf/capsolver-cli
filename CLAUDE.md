# capsolver-cli

CLI tool for the CapSolver captcha solving API.

## Stack
- Bun runtime + TypeScript
- commander for CLI, chalk for colors
- `bun build --compile` for standalone binary

## Commands
- `bun run dev -- <args>` — run CLI in dev mode
- `bun run build` — compile to `./capsolver` binary
- `bun test` — run all tests

## Environment
- `CAPSOLVER_API_KEY` — required, from https://dashboard.capsolver.com

#!/usr/bin/env node
// pnpm dev — boots the whole local stack. Ctrl-C tears everything down.
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";

const procs = [];
function boot(name, command, args, opts = {}) {
  const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"], ...opts });
  const prefix = `[${name}]`.padEnd(9);
  child.stdout.on("data", (d) => process.stdout.write(String(d).replace(/^/gm, prefix)));
  child.stderr.on("data", (d) => process.stderr.write(String(d).replace(/^/gm, prefix)));
  child.on("exit", (code) => {
    if (code !== 0 && !shuttingDown) shutdown(`${name} exited (${code})`, 1);
  });
  procs.push(child);
}
let shuttingDown = false;
function shutdown(reason, code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`\n${reason} — shutting down`);
  for (const p of procs) p.kill("SIGTERM");
  setTimeout(() => process.exit(code), 500);
}
process.on("SIGINT", () => shutdown("interrupted"));
process.on("SIGTERM", () => shutdown("terminated"));

if (!existsSync(".env.local"))
  console.warn("hint: cp .env.example .env.local and set your LLM key");

// Dealio's agent is DECLARATIVE (`guuey.json` mode) — no worker build, no
// `src/`: `guuey dev` boots the platform harness straight from guuey.json +
// prompts/. The generative-UI rail is the platform DEFAULT (guuey.json
// deliberately has no mcpServers key — see README) and `guuey dev` points
// that default at the local `ggui serve` process below.
boot("agent", "pnpm", ["exec", "guuey", "dev", "--serve", "--port", "6790"]);
boot("ggui", "pnpm", ["exec", "ggui", "serve", "--mcp-only", "--dev-allow-all", "--port", "6781"], {
  cwd: "ggui",
});
// The web app's own `dev` script pins its port (`vite --port 6890`).
boot("web", "pnpm", ["--filter", "@dealio/web", "dev"]);

console.log("\n  agent  http://localhost:6790   ggui http://localhost:6781");
console.log("  web    http://localhost:6890\n");

# Orderly

**Orderly is a fictional e-commerce operations SaaS — with a real, live agent inside.** It is
one of guuey's public demos: a complete agentic app — product frontend, brand
config, and a hosted agent — where the entire agent is a declarative
definition that guuey runs for you. Clone it, run the whole thing locally, and
deploy your own copy with one command.

## The whole agent is two files

```
guuey.json          # the agent definition: mode, framework, model, prompt, endpoint
prompts/system.md   # the system prompt guuey.json points at
```

That's it — this is a **declarative agent**. There is no worker code and no
build step: `guuey deploy` ships the definition as-is, and guuey runs it on an
isolated, scale-to-zero pod with streaming responses (`endpoint.streaming:
true`), persistent thread history, and generative UI already wired. Visitors
chat anonymously (`auth: "anonymous"`) and the agent remembers within a thread
(`memory: "thread"`).

Two deliberate absences in `guuey.json`, worth reading twice:

- **No `mcpServers` key.** The ggui generative-UI rail is the _platform
  default_ and merges in automatically — that is how this agent renders order
  cards, refund reviews, and late-shipment timelines without declaring a single MCP
  server. Don't add a `ggui` entry to "turn it on": the absence _is_ the
  configuration. (Locally, `guuey dev` points that same default at the
  `ggui serve` process on :6781.)
- **No `appId`.** The definition isn't bound to any deployment, so
  `guuey deploy` from a clone creates/uses _your_ app. The ids of the hosted
  demo deployments are documented below.

## Quick start

```bash
pnpm install
pnpm bootstrap               # brand, theme, copy → guuey.app.json + AGENTS.md (no account
                             #   needed; the web pages are gated on this and production
                             #   builds fail without it — this repo ships already bootstrapped).
                             #   On a fresh extraction this ALSO unbinds the hosted demo app,
                             #   so your chat talks to YOUR local agent, not guuey's demo pod
cp .env.example .env.local   # then set ANTHROPIC_API_KEY for local dev
pnpm dev
```

`pnpm dev` (`scripts/dev.mjs`) boots three processes with prefixed,
interleaved logs; Ctrl-C tears them all down together:

| process      | port  | what                                                                                                     |
| ------------ | ----- | -------------------------------------------------------------------------------------------------------- |
| `guuey dev`  | :6790 | local agent host — no worker build exists, so it boots the platform harness straight from `guuey.json`   |
| `ggui serve` | :6781 | local generative-UI server, over `ggui/`                                                                  |
| `web`        | :6890 | the Orderly product frontend (Vite + React on `@guuey/chat`): landing · login · operations pages · the chat |

Open http://localhost:6890 and talk to the agent.

## Deploying your own

```bash
npx guuey login                        # device-flow auth
npx guuey apps create --name my-orderly    # create an app (creating is free)
npx guuey deploy                       # ship the definition — declarative, so no build leg;
                                       #   your 7-day trial starts at this first successful deploy
pnpm bootstrap -- --link           # bind the deployed app into the web frontend
```

The repo pins `@guuey/cli`, so `npx guuey` runs the local bin — no global
install needed. (Bare `guuey` is not on PATH in a plain shell.)

**Cost note for forks:** this manifest carries `agent.deploy.size: "md"`
(the hosted demo's pod size). If you are deploying your own copy and want
the cheapest footprint, delete that block — the platform default (`xs`)
applies, and you can scale later with `guuey agent config --max-pods` /
`deploy.size`.

`guuey deploy` prints your agent's endpoint URL and a Portal deep link; once
deployed, your agent is reachable from the guuey Portal with zero frontend
code — `web/` is the bring-your-own-frontend path this demo uses to be a
believable product.

## The deployed demo fixture

This directory is the source of truth for the hosted Orderly demo agent — the
same definition, deployed per environment:

| Environment          | App id                                 |
| -------------------- | -------------------------------------- |
| production (release) | `e6d33b33-6759-4efc-81fc-1f1bed457228` |
| dev (sandbox)        | `259d3f29-a7c4-44fa-a38d-a14067928b7a` |

These ids are public by design — they identify the demo deployments guuey
embeds on its own pages. The AGENT definition is not bound to them:
`guuey.json` carries no `appId` on purpose (see above), so `guuey deploy`
from a clone ships _your_ app. The WEB frontend is a different story —
`guuey.app.json` here ships with `link` bound to the production demo app,
because that is exactly what the hosted demo pages build from. Your first
`pnpm bootstrap` drops that binding (see Quick start), and
`pnpm bootstrap -- --link` re-points it at your own deployed app.

## demoMode

`guuey.app.json` ships with `"demoMode": true`: the web frontend renders the
demo chrome — the honesty strip telling visitors that Orderly is a fictional
product and everything they see is a live agent demo. Customer clones scaffold
with it off; set it to `false` if you are turning this repo into a real
product, and nothing else changes.

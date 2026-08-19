# Guuey demos

Open-source demo applications built with [Guuey](https://guuey.com) — each
one a real, deployable app that shows an agent with generative UI embedded
three ways: as a widget, as an in-app chat, and through the Guuey portal.

Every demo is also a starter template. Pull one out and make it yours:

```bash
npx @guuey/create-agentic-app my-app --example trimly
```

| Directory  | Vertical            | Live demo                          |
| ---------- | ------------------- | ---------------------------------- |
| `trimly/`  | booking / scheduling| coming soon                        |
| `deskly/`  | support / helpdesk  | coming soon                        |
| `orderly/` | e-commerce ops      | coming soon                        |
| `dealio/`  | CRM                 | coming soon                        |

Each directory is self-contained (its own `package.json`, no cross-directory
imports) — the shape a customer's own app would have.

## Building your own

Start from the templates directly:

```bash
npx @guuey/create-agentic-app my-app --template agentic-app
```

Docs: https://docs.guuey.com

## Contributing

This repository is public. A leak-scan gate (`scripts/leak-scan.sh`) runs on
every push and pull request; enable the same check locally with
`git config core.hooksPath .githooks`. Secrets are never committed — CI uses
GitHub Actions secrets, local config lives in gitignored `.env` files, and
`.env.example` documents the names.

## License

MIT — see [LICENSE](./LICENSE).

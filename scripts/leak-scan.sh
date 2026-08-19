#!/usr/bin/env bash
# leak-scan.sh — publication-hygiene gate for this PUBLIC repository.
#
# Fails (exit 1) when any tracked file carries information that must never
# be published: cloud account identifiers, credential prefixes, internal
# hostnames/profiles/paths, private e-mail domains, and a short list of
# files that are secrets-by-shape (env files, generated cloud outputs).
#
# Runs in CI on every push and pull request, and locally as a pre-push
# hook (`git config core.hooksPath .githooks`). The scan covers EVERY
# tracked file's full contents, so a leak inside an already-tracked file
# fails just like a newly added one.
#
# Rules are described (not just matched) so a hit is self-explaining.
# Extending the allowlist is a REVIEW action, never a way past a failure:
# a genuinely public value goes into ALLOW below with a one-line reason.
set -euo pipefail

# Rules: "description|extended-regex" — patterns are matched with grep -E,
# case-sensitive unless the pattern itself lowers case. Keep each rule
# narrow enough to be explainable, broad enough to catch variants.
RULES=(
  'AWS account id (sandbox)|285851439369'
  'AWS account id (release)|364660314633'
  'user API key prefix|guuey_user_'
  'workspace API key prefix|guuey_wkz_'
  'service token prefix|guuey_svc_'
  'anthropic key prefix|sk-ant-'
  'openai key prefix|sk-proj-'
  'private e-mail domain|@loqu\.co\b'
  'demo identity recovery|demo@guuey\.com'
  'local scratch path|/private/tmp'
  'local scratch path|/Users/[a-z]+/'
  'internal ops docs|docs/operations/'
  'internal spec docs|docs/superpowers/'
  'agent seat config|(^|[^a-zA-Z0-9_])\.claude/'
  'internal cluster name|ggui-agents-'
  'internal cluster name|ggui-engine-'
  'internal aws profile|guuey-sandbox'
  'internal aws profile|guuey-release'
  'internal aws profile|guuey-prod-admin'
  'internal amplify app id|\bd[0-9a-z]{13}\.amplifyapp\.com'
)

# Deliberately public values that would otherwise trip a rule above.
# One per line: "regex|why it is public". Reviewed additions only.
ALLOW=(
)

# Files that are secrets by shape and must never be tracked, anywhere.
FORBIDDEN_FILES=(
  'amplify_outputs.json'
  '.env'
  '.env.local'
  '.env.development'
  '.env.production'
  'auth.json'
)

# Paths the scan skips (binary/vendored). Keep tiny.
SKIP_PATH_RE='(^|/)(pnpm-lock\.yaml|package-lock\.json|yarn\.lock)$|\.(png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf|pdf|zip|gz)$'

main() {
  local fail=0 files
  files="$(git ls-files)"
  if [ -z "$files" ]; then
    echo "leak-scan: no tracked files"
    return 0
  fi
  # This script names every pattern — exclude itself by path, not by name,
  # so a copy elsewhere still gets scanned.
  files="$(printf '%s\n' "$files" | grep -vE '^scripts/leak-scan\.sh$' | grep -vE "$SKIP_PATH_RE" || true)"

  local rule desc pattern hits allow allow_re allow_why
  for rule in "${RULES[@]}"; do
    desc="${rule%%|*}"
    pattern="${rule#*|}"
    # -I skips binaries; -n gives reviewers the line.
    hits="$(printf '%s\n' "$files" | xargs -r grep -InE -- "$pattern" 2>/dev/null || true)"
    # Drop allowlisted matches (line-level). ${ALLOW[@]+...} keeps bash 3.2
    # (macOS) happy under set -u when the list is empty.
    for allow in ${ALLOW[@]+"${ALLOW[@]}"}; do
      allow_re="${allow%%|*}"
      hits="$(printf '%s\n' "$hits" | grep -vE -- "$allow_re" || true)"
    done
    hits="$(printf '%s\n' "$hits" | sed '/^$/d')"
    if [ -n "$hits" ]; then
      echo "LEAK [$desc] pattern '$pattern':" >&2
      printf '%s\n' "$hits" | sed 's/^/    /' >&2
      fail=1
    fi
  done

  local f
  for f in "${FORBIDDEN_FILES[@]}"; do
    if printf '%s\n' "$files" | grep -qE "(^|/)${f//./\\.}$"; then
      echo "LEAK [forbidden file] '$f' is tracked" >&2
      fail=1
    fi
  done

  if [ "$fail" -ne 0 ]; then
    cat >&2 <<'EOF'

leak-scan FAILED — this repository is public.
Fix the content. If a hit is a genuinely public value, add it to ALLOW in
scripts/leak-scan.sh WITH A REASON, in a reviewed change — never delete or
loosen a rule to get past a failure.
EOF
    return 1
  fi
  echo "leak-scan: clean ($(printf '%s\n' "$files" | sed '/^$/d' | wc -l | tr -d ' ') tracked files scanned)"
}

main "$@"

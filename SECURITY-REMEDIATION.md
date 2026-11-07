# Security Remediation — Flowstack

This repo previously shipped with demo-grade auth. The following were fixed
before the Flowstack rebrand. Kept short so the history lesson survives
without a 2000-line report.

## Critical (fixed)

| ID | Was | Now |
|----|-----|-----|
| C1 | `if (password === 'demo')` bypass | Removed. Real register/login only. |
| C2 | Token was `user.id.toString()` — unexpirable | Signed JWTs, 15-min access, `jti` rotation + reuse detection (`backend/services/auth/src/routes/auth.ts`, `src/security/tokens.ts`) |
| C3 | Gateway proxied everything, enforced nothing | Gateway verifies JWT, strips `X-User-*` twice, backends re-verify (`gateway/src/middleware/auth.ts`, `shared/auth.ts`) |
| C4 | `JWT_SECRET \|\| 'your-secret-key'` fallback | Required, min-length, fail-fast on boot (`shared/env.ts`). Services refuse to start without `.env`. |

## Secrets policy

- No live secrets in Git. `gitops/secrets.yml` deleted, gitignored.
- `docker-compose.yml` uses `${VAR:?message}` — missing secret aborts boot.
- `JWT_ACCESS_SECRET` != `JWT_REFRESH_SECRET` enforced.
- K8s Secret created out-of-band via `scripts/bootstrap-secrets.sh`, annotated `argocd.argoproj.io/sync-options: Prune=false`.

## Still required before public demo

1. Purge `REMOVED_PASSWORD` from history:
   `git filter-repo --path gitops/secrets.yml --invert-paths` + rotate password + force-push.
2. Set `public_access_cidrs` in `terraform.tfvars` (validation rejects `0.0.0.0/0`).
3. Use OIDC (`AWS_ROLE_ARN`) for CI. Delete long-lived `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` if present.

## Later hardening (non-blocking)

- Product-service parity: allowlist CORS, rate-limit, `/healthz` — done in Flowstack slice (see `product-service/src/index.ts`).
- Profile split-brain (`auth_db.users` vs `users_db.users`) — fixed via lazy-provision on `GET /profile`.
- CI scans (`gitleaks`, Trivy) are advisory (`exit-code 0`) — flip to blocking after backlog triage.

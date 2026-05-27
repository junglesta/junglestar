# 🚀 DEPLOY — junglestar.org

## TL;DR — architecture at a glance

| Thing | Value |
|---|---|
| **Repo** | `github.com/junglesta/junglestar` (`origin`, branch `master`) |
| **Framework** | Astro `output: 'static'` → builds to `./dist` |
| **Host / CDN** | **Cloudflare Workers** (static assets), Worker name `junglestar` → `junglestar.me-b52.workers.dev`, custom domains `junglestar.org` + `www`. Sole production host. |
| **Deploy method** | **Local `wrangler deploy`** — the Worker is **NOT git-connected**. Pushing `master` ships **nothing**; only `pnpm deploy:cf` updates production. |
| **DNS** | Zone on Cloudflare (NS `aryanna`/`julio.ns.cloudflare.com`); registrar **Squarespace** |
| **Email** | **Mailgun** — preserve `MX` (mxa/mxb) + SPF + `k1._domainkey` DKIM on any DNS change |
| **Node** | `24.15.0` (pinned in `.node-version`) |
| **Package manager** | **pnpm only** (`pnpm@10.28.2`) — never npm/yarn |
| **Trailing slash** | `trailingSlash: 'never'`; wrangler `html_handling: "drop-trailing-slash"` keeps canonicals consistent |

**The one fact that matters:** `git push` only updates GitHub history — it deploys nothing.
Production (Cloudflare) updates **only** when you run **`pnpm deploy:cf`** from your machine.

---

## One-time setup
```bash
pnpm install            # install deps (Node 24.15.0 — use the pinned version)
pnpm dlx wrangler login # authenticate wrangler to Cloudflare (browser, once)
```

## Deploy — step by step

**1. Preflight** (format → lint → build → version bump → changelog → STOP). Run the skill:
```bash
# in Claude Code:  /preflight       (stops before commit for human review)
```

**2. Commit** (only after preflight passes and you've reviewed it):
```bash
git add -A && git commit -m "4.x.x | short description"
```

**3. Push** — updates GitHub history only (no deploy is triggered by a push):
```bash
git push origin master
```

**4. Deploy the Worker to production** — the step that actually ships the live site:
```bash
pnpm deploy:cf          # = pnpm build && wrangler deploy  (rebuilds dist, uploads to Cloudflare)
```

**5. Tag the release:**
```bash
git tag v4.x.x && git push origin v4.x.x
```

## Verify
```bash
curl -sI https://junglestar.org | head -n 1          # expect 200
curl -sI https://junglestar.org/about | head -n 1    # expect 200 (no 307 — drop-trailing-slash)
```

---

## Handy one-liners
```bash
pnpm dev                # local dev server (opens browser)
pnpm build              # production build to ./dist (strips .DS_Store first)
pnpm preview            # serve the built ./dist locally
pnpm deploy:cf          # build + deploy Worker to Cloudflare (PRODUCTION)
pnpm dlx wrangler deploy --dry-run   # validate the deploy without shipping
pnpm dlx wrangler deployments list   # recent Cloudflare deployments
pnpm clean              # nuke .astro / dist / vite cache
```

## ⚠️ Gotchas
- **Push ≠ deploy.** `git push` does not update Cloudflare (and nothing else builds on push — Netlify is gone). Always finish with `pnpm deploy:cf`.
- **Never touch email DNS blindly.** Any DNS change must preserve Mailgun `MX` + SPF + `k1._domainkey` DKIM.
- **pnpm only** — the lockfile and `packageManager` field assume it.
- Future option: connect **Workers Builds** for push-to-deploy, which would retire the manual `pnpm deploy:cf` step.

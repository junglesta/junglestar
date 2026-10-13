# junglestar — agent notes

## Stack & conventions

- Astro 7, `output: 'static'` → `./dist`, served by Cloudflare Workers static assets.
- **pnpm only** (`pnpm@10.28.2`), Node `24.15.0` (`.node-version`).
- **Biome** formats/lints `src` (`pnpm format`, `pnpm lint`); Prettier +
  `prettier-plugin-astro` only for `.astro` files in the editor.
- Type check: `npx astro check` (TypeScript stays on 6.x until `@astrojs/check`
  supports 7).
- CSS: follow the global `css-conventions` skill; colour system in `COLOR.md`.
- `@bookbat/*` deps are `link:` to the sibling repo `../bookbat` — it must exist
  next to this one for install/build.

## Docs map

- `DEPLOY.md` — deploy runbook · `COLOR.md` — colour system
- `BOOKS-TODO.md` — open `/books` work · `docs/SYNOPSYS.md` — deferred synopsis plan
- `docs/archive/` — shipped plans (`PLAN.md` baobab extraction, `ROADMAP.md` redesign)

## Release flow

Use the global `/preflight` skill (changelog first → version bump → build → stop
for review). Commit format: `X.Y.Z | short description`. Deploy command below.

## 🛑 Book covers are ADD-ONLY — never delete them

The `/books` page caches covers under **`public/book-covers/<title-slug>.webp`**.
The maintainer hand-uploads important covers there for books openlibrary has no
cover for. Those files are sacred.

**Rules — no exceptions:**

- **NEVER** `rm -rf public/book-covers` (or delete the folder, or bulk-delete
  covers). Doing so wipes hand-uploaded covers that cannot be re-fetched.
- `scripts/cache-covers.mjs` (`pnpm covers`) is **add-only**: it skips any file
  already on disk and never removes one. Keep it that way.
- To **add a missing cover**: drop a webp (~400px wide) at
  `public/book-covers/<title-slug>.webp` and run `pnpm covers`. It's preserved
  as-is and wired into `library.generated.json` (its `coverUrl` becomes the local
  path), even for books that have no remote cover URL.
- The `<title-slug>` is `slugify(book.title)` (lowercase, accent-stripped,
  dashed — see `slugify()` in `scripts/cache-covers.mjs`). Match it exactly.
- To refresh **one** stale cover: delete just **that single file**, then
  `pnpm covers`. Never the whole folder.
- Renamed-title orphans (old slug files) are left in place on purpose — leave
  them; do not "clean up" by deleting.

## Covers / data pipeline (how it works)

- `src/data/library.json` — source of truth (maintainer edits this).
- `pnpm covers` → `scripts/cache-covers.mjs` reads it, downloads/keeps covers,
  writes `src/data/library.generated.json` (the file the page imports) with
  local `/book-covers/...` cover paths. Runs automatically as `prebuild`.
- `src/pages/books/index.astro` imports `library.generated.json`.

## Deploy

Cloudflare Workers, local only: `pnpm deploy:cf` (build + wrangler deploy). A
`git push` deploys nothing. See `DEPLOY.md`.

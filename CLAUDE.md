# junglestar — agent notes

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

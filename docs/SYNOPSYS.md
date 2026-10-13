# SYNOPSYS — build-time synopsis enrichment for `/books` (future work)

> **Status: deferred, not implemented.** This documents how to finish it later.
> The cover-caching pipeline it plugs into already exists (`scripts/cache-covers.mjs`,
> `src/data/library.generated.json`, `pnpm covers`). Synopsis enrichment is the
> same idea — fetch once at build, store, ship — applied to descriptions.

## Why it's deferred

`/books` has **221 books; 42 have a `synopsis`, 179 don't** (the missing ones are
heavily Italian: ~99 `it`/`ita`, ~66 English `eng`/`en`, plus a few DE/ES/NL/TH).

We measured the free sources before committing to it:

- **OpenLibrary** — across a 25-book sample of the missing ones, **0 had a
  description** (7 had an edition record but no description, 18 had no edition at
  all). Effectively useless for this collection, especially the Italian titles.
- **Google Books** — has good descriptions (including Italian), **but returns
  HTTP 429 (rate limited) on almost every request without an API key.**

So a keyless build-time fetch would add real complexity for ~0% yield. The
unblock is a **free Google Books API key**. Once that exists, the plan below is
straightforward.

## Step 1 — get a free Google Books API key

1. Go to <https://console.cloud.google.com/> and create (or pick) a project.
2. **APIs & Services → Library →** search **"Books API" →** click **Enable**.
3. **APIs & Services → Credentials → Create credentials → API key.** Copy it.
4. (Recommended) **Restrict** the key: **API restrictions → Books API only.**
   No billing or OAuth is needed — the Books API has a free daily quota
   (~1,000 requests/day), which comfortably covers 179 books plus reruns.
5. Make it available to the build, e.g. in `.env` (gitignored) or the shell:

   ```sh
   export GOOGLE_BOOKS_API_KEY="AIza...your-key..."
   ```

## Step 2 — `scripts/fetch-synopsis.mjs`

Mirror the structure of `scripts/cache-covers.mjs`. It should:

- Read `src/data/library.json` (source of truth — **do not mutate it**).
- For each book **without** a `synopsis`, fetch a description, trying in order:
  1. **Google Books** —
     `https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn13}&key={KEY}`
     → `items[0].volumeInfo.description`. Primary source; best yield.
  2. **OpenLibrary** (free fallback, low yield) —
     `GET https://openlibrary.org/isbn/{isbn13}.json` (follow redirects); use the
     edition `description` (string or `{ value }`), else follow `works[0].key` →
     `https://openlibrary.org{key}.json` and use its `description`.
- **Rate-limit handling** (even with a key): concurrency 1–2, ~300–600 ms delay
  between requests, and exponential backoff + retry (≈4 tries, doubling the wait)
  on 429/5xx. Per-request timeout ~12 s. Catch every error per-book and continue —
  never crash the whole run.
- **Clean** the text: strip HTML tags, collapse whitespace, cap at ~700 chars on
  a word boundary with `…`.
- **Cache with negative results** → `src/data/synopsis.cache.json`:
  `{ "<isbn13>": "<text>" | "" }` where `""` means "checked, none found".
  On each run, **skip any ISBN already in the cache** (positive *or* negative) so
  it's idempotent and resumable across days/quota windows.
- Log a final summary: fetched / cached / none-found, broken down by source.

## Step 3 — merge into the shipped data

In `scripts/cache-covers.mjs`, when building `library.generated.json`, for any
book still missing `synopsis`, fill it from `synopsis.cache.json` (when non-empty).
Keep all existing cover behavior. `books.astro` already imports
`library.generated.json`, so nothing else changes.

> The cleanest order is to fold the synopsis step into the same generated-data
> build so there's one source of truth for "page data": run synopsis fetch first,
> then cover cache (which merges the synopsis cache in). Optionally add
> `"synopsis": "node scripts/fetch-synopsis.mjs"` to `package.json` scripts.

## Step 4 — run & verify

```sh
export GOOGLE_BOOKS_API_KEY="AIza..."
node scripts/fetch-synopsis.mjs     # populates src/data/synopsis.cache.json
node scripts/cache-covers.mjs       # regenerates library.generated.json
pnpm build                          # must still succeed
```

Acceptance: `library.generated.json` now has **more than 42** books with a
`synopsis`; `/books` shows descriptions in the expanded card detail without any
runtime network call.

## Rendering note (important)

Like the covers, an enriched synopsis **ships inside the page's embedded book
data and is rendered client-side** by the BAOBAB component when a card is
expanded — i.e. it's bundled into the SSG output (no runtime fetch), but the DOM
is still built by JS. Rendering the synopsis into the *static HTML itself* would
require server-rendering the card list (a larger change to the component's render
model — see the "Localize covers + SSR the grid" option that was not taken).

## Cost / weight caveat

179 synopses at ~700 chars each adds roughly ~100–125 KB (uncompressed) to the
embedded `data-books` payload on `/books`. Fine, but if it ever feels heavy,
lower the per-synopsis char cap or move to the SSR-the-grid approach so the data
isn't duplicated in an inline attribute.

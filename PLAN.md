# PLAN — Make BAOBAB third-party consumable, then wire it into junglestar `/books`

> **✅ STATUS 2026-06-04 — Phase 1 & Phase 3 DONE & verified. Phase 2 (npm publish) NOT done.**
> Both repos under `/Users/admi/Sites/0/` (bookbat was formerly `books-freedom`).
> - **Phase 1 (bookbat):** `packages/baobab` created (`@bookbat/baobab`; exports `.` +
>   `./BookBatClient.astro`; astro = peerDep; library-core = workspace:* dep). Component + config
>   `git mv`'d in. Decoupled from the editor app — deleted the `apps/bookbat/package.json` version
>   import; `bookbatVersion` is now an optional prop. Old `apps/baobab` renamed `@bookbat/baobab-demo`
>   and now consumes the package; root scripts' baobab filters updated. Demo build is green.
> - **Phase 3 (junglestar):** linked both pkgs via `link:../bookbat/packages/*`; copied sample
>   `library.json` → `src/data/`; created `src/pages/books.astro`. `pnpm build` green, `/books`
>   renders the grid. (4 pre-existing `astro check` errors in `og` route + `sty.astro` are unrelated.)
> - **Decisions:** library-core ships raw TS · junglestar uses local `library.json` · no `background_frama`.
> - **Remaining = Phase 2 below** (needs npm scope + 2FA): changesets → publish, then swap junglestar's
>   `link:` deps for published versions. `styles.css` extraction was deferred (inline scoped styles +
>   the `unstyled` override hook remain the contract).

> **Handoff note:** This plan spans **two repos** — `bookbat` (the open-source monorepo,
> github.com/junglesta/bookbat) and `junglestar25` (this site). It was written from inside
> `junglestar25` alone. Next session, relaunch from a **parent directory that contains both
> repos** so all paths below are reachable. Adjust the leading path segments to match wherever
> the two repos sit relative to your new cwd.

---

## Context

`BookBatClient.astro` (the searchable/sortable/filterable book-grid display component) currently
lives inside `apps/baobab` in the `bookbat` pnpm monorepo. It is an **app**, not a **package**,
and is wired to its monorepo siblings in three ways that make it impossible for an outside Astro
site to `import` and receive updates:

1. **`@bookbat/library-core` is `workspace:*`** — resolvable only inside the monorepo.
2. **Sideways app dependency** — `BookBatClient.astro` imports `../../../../bookbat/package.json`
   (the sibling *editor* app's version string). A package must never reach into a sibling app.
3. **It lives in `apps/`** — apps are deployed; packages are imported. The reusable unit is
   trapped inside a deployable.

**Goal:** Refactor `bookbat` so the display component is a real, published npm package, then
consume it in `junglestar25` on a new `/books` page using the site's `Layout`, with styles
overridable. Distribution choice (confirmed with user): **npm package (proper)** — npm is the
update mechanism (`pnpm update`).

Reference dependency graph confirmed from upstream source:
- `BookBatClient.astro` imports: `type { LibraryBook }` from `@bookbat/library-core`;
  `resolveBookBatClientConfig` + `type BookBatClientConfigOverride` from local
  `config/bookbat-client.config.ts`; `version` from `apps/baobab/package.json`; `version` from
  `apps/bookbat/package.json` (← the bad coupling). Browser logic is a **self-contained
  `is:inline` script** (vanilla JS, no bundler imports) — ships fine as source.
- `apps/baobab/src/pages/index.astro` imports: `parseLibraryPayload` from `@bookbat/library-core`;
  `BookBatClient`; `defaultBookBatClientConfig`; and `../data/library.json`.
- `@bookbat/library-core` `package.json` exports raw TS: `"exports": { ".": "./src/index.ts" }`,
  `type: module`. Exports include `parseLibraryPayload` (runtime) and `LibraryBook` (type).
- `config/bookbat-client.config.ts` is self-contained (no imports). Config already has a
  **`styled` / `unstyled` flag** — the built-in style-override hook for third parties.
- Astro versions already match: bookbat `^6.3.7`, junglestar `^6.3.7`.

---

## Target architecture

```
bookbat/                        (the open-source monorepo)
  packages/
    library-core/               ← already a clean pure-TS lib. Keep. (publish as-is or build)
    baobab/                     ← NEW package: the publishable Astro display component
      package.json              ← name "@bookbat/baobab", type module, exports map (below)
      src/
        index.ts                ← re-export config helpers + types (optional convenience)
        BookBatClient.astro     ← MOVED from apps/baobab/src/components/Astro/
        bookbat-client.config.ts← MOVED from apps/baobab/src/config/
        styles.css              ← extracted component CSS, exported for opt-in / override
  apps/
    baobab/                     ← becomes a thin DEMO that consumes packages/baobab (dogfood)
    bookbat/                    ← editor app, unchanged
```

Consumers (junglestar and anyone else):
```sh
pnpm add @bookbat/baobab @bookbat/library-core
```
```astro
---
import BookBatClient from '@bookbat/baobab/BookBatClient.astro';
import { parseLibraryPayload } from '@bookbat/library-core';
import library from '@data/library.json';
const books = parseLibraryPayload(library);
---
<BookBatClient books={books} config={{ unstyled: true }} />
```

---

## Phase 1 — Refactor `bookbat` into a consumable package

1. **Create `packages/baobab/`** and move the reusable files out of `apps/baobab`:
   - `apps/baobab/src/components/Astro/BookBatClient.astro` → `packages/baobab/src/BookBatClient.astro`
   - `apps/baobab/src/config/bookbat-client.config.ts` → `packages/baobab/src/bookbat-client.config.ts`
   - Extract the component's `<style>` (and any global CSS it relies on) → `packages/baobab/src/styles.css`.

2. **Decouple from the editor app (critical):** in `BookBatClient.astro`, **delete**
   `import { version as bookbatVersion } from "../../../../bookbat/package.json"`. If a version
   badge is wanted, use only baobab's own version, or inject via an Astro/Vite `define` at build,
   or accept it as an optional prop. The relative `../../../package.json` (baobab's own) becomes
   `../package.json` after the move — verify and fix the relative depth.

3. **`packages/baobab/package.json`:**
   ```jsonc
   {
     "name": "@bookbat/baobab",
     "version": "0.1.0",
     "type": "module",
     "exports": {
       ".": "./src/index.ts",
       "./BookBatClient.astro": "./src/BookBatClient.astro",
       "./styles.css": "./src/styles.css"
     },
     "files": ["src"],
     "peerDependencies": { "astro": ">=6" },
     "dependencies": { "@bookbat/library-core": "workspace:*" }
   }
   ```
   - `@bookbat/library-core` stays `workspace:*` **inside the monorepo**; changesets/publish
     rewrites it to the published semver range on `npm publish` (standard pnpm + changesets flow).
   - Decide on `library-core` publish form: simplest is **ship raw TS source** (its current
     `exports: ./src/index.ts`) — works for all bundler/Astro consumers. If you want broader
     (non-bundler) compatibility or `.d.ts` guarantees, add a `tsup`/`unbuild` step emitting
     `dist/` + types and point `exports` at the built artifacts. **Recommendation: ship source
     now, add a build later if needed.**

4. **`packages/baobab/src/index.ts`** — convenience re-exports:
   ```ts
   export { defaultBookBatClientConfig, resolveBookBatClientConfig } from './bookbat-client.config';
   export type { BookBatClientConfigOverride } from './bookbat-client.config';
   ```

5. **Convert `apps/baobab` into a demo that consumes the package:** replace its local component
   imports with `@bookbat/baobab/BookBatClient.astro` and `@bookbat/baobab`. This dogfoods the
   public API and keeps the deployed demo working. Keep `apps/baobab/src/data/library.json` as
   the demo dataset. (workspace resolution makes the package available with no publish needed for
   local dev.)

6. **Styles / override contract:** ensure `styles.css` targets **stable, documented class names**
   and/or CSS custom properties so consumers can override. Document the `config: { unstyled: true }`
   path (component renders structure + classes, no opinionated CSS) as the primary override hook.
   Add a short "Using BAOBAB in your own Astro site" section to `apps/baobab/README.md`.

---

## Phase 2 — Publish to npm

1. Create/own the **`@bookbat` npm scope** (scoped public packages are free).
2. Add **changesets**: `pnpm add -Dw @changesets/cli && pnpm changeset init`.
3. Mark `@bookbat/library-core` and `@bookbat/baobab` as publishable (`"private": false` / not
   present). Ensure `apps/*` stay `"private": true`.
4. Release: `pnpm changeset` (write a changeset) → `pnpm changeset version` (bumps + rewrites
   `workspace:*` to real ranges) → `pnpm changeset publish` (with `--access public` for first
   publish of scoped packages).
5. (Optional, recommended) Wire a GitHub Action to run `changeset publish` on merge to `main`,
   so "third parties get updates" is fully automated on your side.

---

## Phase 3 — Consume in `junglestar25` (`/books` page)

1. `pnpm add @bookbat/baobab @bookbat/library-core` in `junglestar25`.
2. **Data source — DECISION STILL OPEN** (was deferred): pick one for the first ship —
   (a) a local `src/data/library.json` parsed at build, or (b) the component's `dataUrl` prop to
   fetch a hosted `library.json` at runtime. Default assumption for the plan: local sample
   `src/data/library.json` so the page renders immediately; swap later.
3. **Create `src/pages/books.astro`**, following the existing page pattern (cf.
   `src/pages/services.astro` and the `Layout` API in `src/layouts/Layout.astro`):
   ```astro
   ---
   // src/pages/books.astro
   import Layout from "@layouts/Layout.astro";
   import BookBatClient from "@bookbat/baobab/BookBatClient.astro";
   import { parseLibraryPayload } from "@bookbat/library-core";
   import library from "@data/library.json";

   const pageTitle = "Junglestar | Books";
   const description = "Books I track / recommend.";
   const books = parseLibraryPayload(library);
   ---
   <Layout title={pageTitle} description={description} bodyClass="books">
     <main class="wrap">
       <h1>Books</h1>
       <BookBatClient books={books} config={{ unstyled: true }} />
     </main>
   </Layout>
   ```
   - Note `@data/*` alias already maps to `src/data/*` (see `tsconfig.json`). `@layouts`/`@components`
     aliases already exist.
4. **Style override (the "later" the user mentioned):** start with `config: { unstyled: true }`
   and add a scoped `<style>` in `books.astro` (or a file in `src/styles/layers/compo/`) targeting
   the component's documented classes / custom props, matching junglestar's token system
   (`--brand`, luma ramp, etc.). If keeping `styled`, override via higher specificity / custom props.
5. Optional: the untracked `src/components/shared/background_frama.astro` (a fixed full-viewport
   bordered frame, "added for future use") is **unrelated** to this task but could be dropped onto
   `/books` as a page background if desired — confirm with user; do not assume.

---

## Verification

- **bookbat (local, pre-publish):** `pnpm --filter @bookbat/baobab ...` / run `apps/baobab` demo
  (`pnpm --filter baobab dev`) — confirm the grid renders, search/sort/filter/export all work via
  the package import (proves the public API + decoupling). Confirm `astro build` of the demo
  succeeds with NO reference to `apps/bookbat/package.json`.
- **publish:** `pnpm changeset publish --dry-run` (or `npm pack` in each package) — inspect the
  tarball `files` to confirm `src/**` and `styles.css` ship and `workspace:*` was rewritten.
- **junglestar:** `pnpm dev`, open `/books` — grid renders from `library.json`; `pnpm build`
  succeeds (local build → `wrangler deploy` per `deploy:cf`). Toggle `unstyled` and confirm CSS
  override lands. Run `pnpm lint` (biome) and `astro check`.
- **updates loop end-to-end:** bump `@bookbat/baobab` in bookbat → publish → `pnpm update
  @bookbat/baobab` in junglestar → change appears. This is the "gets the updates" acceptance test.

---

## Open decisions to confirm next session
1. `library-core` publish form: ship raw TS source (recommended now) vs add a `dist` build.
2. junglestar book data: local `library.json` sample vs remote `dataUrl`.
3. Whether `/books` should use the `background_frama.astro` frame.
4. npm scope ownership / 2FA / CI publish token setup.

# BOOKS /books — TODO

**Status (2026-06-05): shipped & LIVE.** bookbat is merged to `main`, junglestar
to `master`, both deployed:
- `https://junglestar.org/books` — full library, dark theme.
- `https://baobab.junglestar.org` — curated 12-title demo, light-on-lime theme.

The `/books` design lives in the component (`@bookbat/baobab` `BookBatClient.astro`):
dark theme, sticky one-line control bar, sliding view toggle, collapsible search,
synopsis clamp+expand, even-height cards w/ pinned footer, min-width card grid,
keyed node-reuse (no cover reload on filter/sort), build-time cover cache,
configurable default sort (rating/desc on junglestar). See `PLAN.md` for the full
"done" list and the one remaining infra item (npm publish).

---

## The one real UI TODO: custom Sort dropdown (match the bat app)

**Goal:** replace the native `<select data-bfc-sort>` with a custom dropdown like
the **bat app** (the Svelte editor, `bookbat/apps/bookbat`). A native select's
popup is browser-drawn and can't be styled to match (we only set its
`color-scheme` — `dark` on junglestar, `light` on the demo).

**History:** attempted once, **reverted** — swapping the select markup without
finishing the JS left `sortInput.addEventListener(...)` pointing at a missing
element → the inline script throws → the grid won't render. **Do markup + JS + CSS
together**, then build + click-test.

### Reference — the bat app's custom dropdown (copy this pattern)
- Markup: `bookbat/apps/bookbat/src/pages/LibraryPage.svelte` (~the sort block):
  `.sort_menu_wrap` > `.sort_menu_controls` > `.sort_direction_trigger` +
  `.sort_trigger` (icon); then `.sort_dropdown` with `.sort_option` buttons
  (`.active` on the current one).
- CSS: `bookbat/apps/bookbat/src/assets/styles.css` (`.sort_menu_wrap`,
  `.sort_trigger`, `.sort_direction_trigger`, `.sort_dropdown`, `.sort_option`,
  `.sort_option.active`). Map to the baobab tokens so it themes correctly on BOTH
  hosts (the demo overrides these tokens to its light palette):
  `--border`→`--border-card/-input`, `--primary`→`--accent`, `--bg-card`→`--bg-card`,
  `--radius-sm`→`--radius`, `--text`→`--text`, `--shadow-lg`→ a soft box-shadow.
  Because the demo re-points those tokens, a token-based dropdown auto-fits its
  light theme — don't hardcode colors.

### Implementation steps (in `bookbat/packages/baobab/src/BookBatClient.astro`)
1. **Markup** — replace the `.bfc_sort_row` `<select>` with a `[data-bfc-sort-menu]`
   wrap: a `[data-bfc-sort-trigger]` button (label span `[data-bfc-sort-label]` +
   chevron) and a `[data-bfc-sort-dropdown]` listbox of
   `[data-bfc-sort-option="recent|title|author|publisher|year|rating"]` buttons.
   Keep the existing `[data-bfc-sort-direction]` button.
2. **Script** (inside the IIFE mount) — replace the `sortInput` ref + its `change`
   listener + the `if (sortInput) sortInput.value = sort;` init line. Add:
   - refs: menu / trigger / dropdown / label / optionBtns;
   - `syncSortControl()`: toggle `.bfc_sort_option--active` + `aria-selected`, set
     the trigger label to the active option's text; call it at init (the config
     default `sort` already lives in `viewConfig.sort`);
   - trigger click → toggle `dropdown.hidden` + `aria-expanded`;
   - option click → `sort = value; syncSortControl(); close; render();`
   - outside-click close — VT-safe: dedupe the document listener via a
     `window.__bfcSortOutside` guard (inline script re-runs on view-transition
     nav), or close on `focusout` of the wrap.
3. **CSS** (component `<style>`) — port `.sort_*` to `.bfc_sort_trigger` /
   `.bfc_sort_menu_wrap` / `.bfc_sort_dropdown` / `.bfc_sort_option(.--active)`
   using the tokens above.
4. **Verify** — `pnpm --filter @bookbat/baobab-demo build` AND junglestar `pnpm build`;
   then `pnpm dev` (restart — linked dep, no HMR) and click: open dropdown, pick
   each option (grid re-sorts), active highlight + label update, outside-click
   closes, direction button still flips, default is still rating/desc on junglestar.
   Then deploy both (`pnpm deploy:baobab`, `pnpm deploy:cf`).

### Open decision
- Trigger style: icon-only (most faithful to the bat app) vs icon+label (shows the
  current sort at a glance). Leaning icon+label.

---

## Other open items
- **npm publish (Phase 2)** — `@bookbat/baobab` + `@bookbat/library-core` are still
  consumed via `link:` from the sibling bookbat repo; not published. See `PLAN.md`.
- **Synopsis enrichment** — deferred; full plan in `SYNOPSYS.md` (needs a free
  Google Books API key). 44/222 books have a synopsis.

## Resolved since this file was written
- Branches merged (bookbat `main`, junglestar `master`) and deployed to both URLs.
- The whole design ported into the component ("Baobab = junglestar look").
- Language filter + Expand-all icon are now hidden **in the component** (no longer
  a junglestar-only CSS override).
- Covers renamed to `<title-slug>.webp` and are **add-only — never delete** (`CLAUDE.md`).

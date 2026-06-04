# BOOKS /books — TODO (resume tomorrow)

Shipped & working today. The page builds clean, grid renders, covers are
locally cached, default sort is rating/desc, synopsis clamps with click-to-
expand, dark palette, sliding view toggle, collapsible search, language filter
hidden. Branches: `junglestar` → `feat/books-page`, `bookbat` → `feat/baobab-package`
(both pushed, nothing merged to main/master yet).

## The one unfinished thing: the Sort control "look alike"

**Goal:** make the Sort control match the **bat app** (the Svelte editor,
`bookbat/apps/bookbat`), which does NOT use a native `<select>` — it uses a
custom dropdown. Our Astro component (`@bookbat/baobab` `BookBatClient.astro`)
still uses a native `<select data-bfc-sort>`, whose browser-drawn popup can't be
styled to match (we only patched it with `color-scheme: dark`).

**What was attempted today and REVERTED** (so the grid kept working): swapping
the native sort `<select>` for a custom dropdown *markup* in the component
without finishing the JS wiring left `sortInput.addEventListener(...)` pointing
at a missing element → the inline script throws → grid won't render. So it was
reverted to the working native select. **Do the markup + JS + CSS together.**

### Reference — the bat app's custom dropdown (copy this pattern)
- Markup: `bookbat/apps/bookbat/src/pages/LibraryPage.svelte` ~lines 281–312
  (`.sort_menu_wrap` > `.sort_menu_controls` > `.sort_direction_trigger` +
  `.sort_trigger` (icon) ; then `.sort_dropdown` with `.sort_option` buttons,
  `.active` on the current one).
- CSS: `bookbat/apps/bookbat/src/assets/styles.css` lines **1087–1178**
  (`.sort_menu_wrap`, `.sort_trigger`, `.sort_direction_trigger`,
  `.sort_dropdown`, `.sort_option`, `.sort_option.active`). Token mapping into
  the baobab component: `--border`→`--border-card`, `--primary`→`--accent`,
  `--bg-card`→`--bg-card`, `--radius-sm`→`--radius`, `--text`→`--text`,
  `--shadow-lg`→ a soft box-shadow.

### Implementation steps (in the component `BookBatClient.astro`)
1. **Markup** (replace the `.bfc_sort_row` `<select>`): a `[data-bfc-sort-menu]`
   wrap containing a `[data-bfc-sort-trigger]` button (label span
   `[data-bfc-sort-label]` + chevron) and a `[data-bfc-sort-dropdown]` listbox of
   `[data-bfc-sort-option="recent|title|author|publisher|year|rating"]` buttons.
   Keep the existing `[data-bfc-sort-direction]` button.
2. **Script** (inside the IIFE mount): replace the `sortInput` ref + its
   `change` listener + `sortInput.value = sort`. Add:
   - refs: menu/trigger/dropdown/label/optionBtns
   - `syncSortControl()`: set `.bfc_sort_option--active` + `aria-selected`, set the
     trigger label to the active option's text.
   - trigger click → toggle `dropdown.hidden` + `aria-expanded`.
   - option click → `sort = value; syncSortControl(); close; render();`
   - close on outside click — to stay view-transition-safe, dedupe the document
     listener with a `window.__bfcSortOutside` guard (the inline script re-runs
     on VT navigation), or close on `focusout` of the wrap.
   - call `syncSortControl()` at init (replaces the reverted `sortInput.value`).
3. **CSS** (component `<style>`): port the `.sort_*` rules from the bat app to
   `.bfc_sort_trigger` / `.bfc_sort_menu_wrap` / `.bfc_sort_dropdown` /
   `.bfc_sort_option(.--active)` using the component tokens above.
4. Build the demo (`pnpm --filter @bookbat/baobab-demo build`) AND junglestar
   (`pnpm build`); since it's interactive and can't be clicked headlessly, also
   `pnpm dev` and click: open dropdown, pick each option (grid re-sorts), active
   highlight + trigger label update, outside-click closes, direction button still
   flips. **Restart dev** — the component is a linked dep, Vite won't HMR it.

### Decisions to confirm
- Trigger style: icon-only (most faithful to bat app) vs icon+label (shows
  current sort at a glance). Leaning icon+label.
- Language filter: today it's just **hidden via CSS** in junglestar
  (`.books .bfc_lang_filter { display:none }`). If it should be gone for all
  consumers, remove the markup from the component instead (its JS already
  no-ops via optional chaining + `if (!languageInput) return`).

## Still-open from earlier (not today)
- **Synopsis enrichment** for the 179 missing — deferred; full plan in
  `SYNOPSYS.md` (needs a free Google Books API key).
- **Phase 2 publish** of `@bookbat/baobab` + `@bookbat/library-core` to npm —
  see `PLAN.md`; currently consumed via `link:` from the sibling bookbat repo.
- Neither feature branch is merged; npm not published.

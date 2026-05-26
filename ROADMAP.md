# 🗺️ ROADMAP — Header & Hero refactor (paused 2026-05-25)

Working state of the header + landing-hero restyle. Build passes (34 pages),
lint clean. **Nothing committed** — per project rule we stop before commit for
human review. A version bump (~`3.12.0`) + changelog is pending.

---

## ✅ Done this session

### Header (`src/components/header/Header.astro`)
- New site header: outlined **logo mark** (`logo_stroke.svg`, `--logo-stroke: 22`) + **JUNGLESTAR wordmark** on the left, nav chips pushed **far right**, single line.
- **Mobile (≤600px):** nav collapses to a **hamburger** → opens a **full-page `<dialog>`** (`showModal()`). The dialog has a **replica top bar** (reuses `.top_nav`) so the header "stays present" and the hamburger slot shows the **X** in place. Wired on `astro:page-load` (survives view transitions); closes on link tap / Esc / backdrop / resize-to-desktop.
- **Token-based sizing:** `--header_text_size` / `--header_text_spacing` on `.top_nav` — wordmark + chips share one source (no `em`).
- Wordmark mirrors the big brand-name style (`--h1-weight`, uppercase, no tracking).
- Renamed `shared/NavScroll.astro` → `header/Header.astro` (git mv); wraps a semantic `<header class="site_header">`. `Layout.astro`'s old hero `<header>` is now `<div class="page_intro">` (one banner landmark).

### Hero / `LandingScreen` (`src/components/UI/LandingScreen.astro`)
- Removed `<Logo>` + the big `h1.brand_name` from the hero.
- **Single `<h1>` per page**, declared by what's passed: pages that want a hero h1 pass `title`; pages whose h1 is in the body don't. (Dropped the `titleAsH1` boolean — now just `{title && <h1>…}`.)
  - Hero-title h1: `index`, `about`, `offer`, `discoverability`.
  - Body `h2→h1`: `showcase`, `design/index`, `content/index`.
- **Killed the onscroll effect:** removed the `.animatio` scroll-timeline fade and the tall ~200svh scroll region. Cleaned dead grid machinery.
- **Normalized DOM** to plain, classless elements inside one `.landing_screen` hook (+ `.landing_height` wrapper). `.landing_height`: `100svh` portrait / `188svh` landscape.
- Baseline hero styling added (flex column, centered, token spacing, fluid h1/p, slotted-icon sizing via `:global(svg)`).

### Discoverability lists (`src/components/brand/Gmap.astro`)
- `WHAT WE DO / WHAT YOU GET / THEN YOU CAN` → real `<h4>` headings (centered).
- Lists: equal width (full-width blocks of a centered 34rem column), left-aligned items, even rhythm. Removed the `margin-left: 15dvw` shift.

### Icons (all stroke = `currentColor`)
- `design` → `island.svg` · `showcase` → `pen-tool.svg` · `discoverability` → `gmap_pin.svg` ⚠️ (see below).
- `delivery_truck.svg` paths changed `#000000` → `currentColor` (no longer used on a page, but fixed).

### Cross-cutting (via subagents)
- **`COLOR.md`** written — documents the single-`--brand` → region-luma colour system.
- **`em` units purged sitewide** → `rem` / spacing tokens (a few legit `em` kept).
- **AutoContrast OKLCH bug fixed** (`AutoContrast.astro`) — canvas luminance fallback no longer silently returns black for `oklch()` colours; **styleguide `sty.astro` refreshed** to the new palette (brand scale + harmonizer ramps).

---

## 🔜 TODO — next session

### 0. ▶ RESUME HERE — finish page colours + top landing icons
**(a) Page colours** — make each page's `master` colour deliberate (the
`<Layout master="--brand|--jgreen|--jorange">` knob → region ramp, see
`COLOR.md`). Currently only `content/*` uses `--jorange`; the rest default to
blue. Decide per page and apply.

**(b) Top landing icons** — the `<Icono>` passed to `LandingScreen` per page.
Make them consistent (all `stroke="currentColor"`, matching visual stroke
weight, 24-viewBox where possible). Current state:

| Page | icon | status |
|---|---|---|
| index | `radio.svg` | review |
| about | `paperclip.svg` | review |
| showcase | `junglestar_awards.svg` | ✅ recoloured (Illustrator keeps re-hardcoding `#000` on re-export — flip `stroke:#000000`→`currentColor`) |
| design/index | `island.svg` | ✅ |
| content/index | `what.svg` | review |
| discoverability | `gmap_pin.svg` | ✅ (path `stroke-width="6.2"` to match) |
| offer | `radio.svg`? | review |

> Note: hero rule `.landing_screen :global(svg){ stroke-width: 0.37 }` assumes
> 24-viewBox icons. Non-24 icons (gmap_pin=400) need their own path
> stroke-width to match. Considered: a build step to auto-rewrite
> `stroke:#000000`→`currentColor` in `src/assets/svgs/*.svg` (offered, not yet
> done).

### 1. Finish the `.landing_screen` restyle (main task)
Current styling is a **baseline**, not final. Refine:
- **Visual hierarchy between overtitle vs onScroll lines** — they're all identical `<p>` right now (classless by design). Decide whether to add 1–2 small class hooks to differentiate, or keep uniform.
- **Slotted-icon size** — `.landing_screen :global(svg)` is `width: clamp(255px, 40svw, 660px)` (very large) — review per page.
- Spacing/`justify-content: space-around`, `188svh` landscape value — confirm these feel right across pages.
- Re-add casing if wanted (the old `onScroll_line1.toUpperCase()` was dropped).

### 2. ~~Resolve `gmap_pin.svg` stroke-width~~ ✅ DONE
`gmap_pin` is 400-viewBox; the hero forces `~0.37` → was hairline. Fixed by
setting the pin **path** `stroke-width="6.2"` (= `0.37 × 400/24`), which
overrides the inherited value and matches the other icons' visual weight.
Side effect: the Gmap content-section pin (in `Gmap.astro`) also went `5 → 6.2`
— minor; add a scoped `stroke-width: 5` override there if it bothers.

### 3. Loose ends / decisions
- `.site_header` and `.page_intro` are **unstyled class hooks** — keep for future styling or drop to bare tags?
- `<h4>` for the Gmap group labels — confirm size, or drop to `<h5>`.
- Slot name `inside_header` now feeds a `<div>` (mildly stale) — optional rename across the 7 pages that use it.
- Footer still uses `Logo.astro` (`variant="bottom"`) — intentional, leave.

### 4. Ship
- Run **`/preflight`** (format → lint → build → version bump → changelog → STOP).
- Suggested commit message:
  `3.12.0 | Header: logo+wordmark, mobile hamburger modal, token sizing; static hero (kill onscroll), single h1 per page; fix AutoContrast OKLCH; COLOR.md; purge em units`
- New untracked files to include: `COLOR.md`, `ROADMAP.md`.

---

## 📌 Key files
| File | What |
|---|---|
| `src/components/header/Header.astro` | Header + mobile hamburger/modal |
| `src/components/UI/LandingScreen.astro` | Hero — **restyle in progress** |
| `src/layouts/Layout.astro` | `<Header/>` + `.page_intro` wrapper |
| `src/components/brand/Gmap.astro` | Discoverability lists |
| `COLOR.md` | Colour-system docs |

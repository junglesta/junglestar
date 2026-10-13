# 🗺️ ROADMAP — Header / Hero / Colour / Social-card redesign

**Status: ✅ SHIPPED.** This arc began as a paused header + landing-hero
restyle (2026-05-25) and grew into the full redesign milestone. Everything
tracked here is now committed, tagged, and deployed across **`3.12.0` → `4.1.0`**.
Kept as a record of where each piece landed.

---

## ✅ Shipped

### Header (`src/components/header/Header.astro`) — `3.12.0`
- Outlined **logo mark** + **JUNGLESTAR wordmark** left, nav chips far right, single line.
- **Mobile (≤600px):** hamburger → full-page `<dialog>` (`showModal()`) with replica top bar; wired on `astro:page-load`, closes on tap / Esc / backdrop / resize.
- Token-based sizing (`--header_text_size` / `--header_text_spacing`).
- Renamed `shared/NavScroll.astro` → `header/Header.astro`; semantic `<header class="site_header">`, hero now `<div class="page_intro">`.
- `4.0.1`: header sized to fit logo; `3.13.0`: tablet wordmark hide + nav vertical-align.

### Hero / `LandingScreen` (`src/components/UI/LandingScreen.astro`) — `3.12.0`
- Dropped `<Logo>` + big `h1.brand_name` from hero; **single `<h1>` per page** (pages pass `title`, or promote a body `h2→h1`).
- Killed the onscroll scroll-timeline fade + tall scroll region; normalized to plain elements in `.landing_screen` (+ `.landing_height`).
- Landing-icon restyle finalized in the `4.0.0` redesign milestone.

### Page colour system — `3.11.0`, `3.13.0`
- Single `master` colour per page → luma-derived head/main/footer (`COLOR.md`).
- `content/*` use `--jorange`; rest default `--brand`. `4.0.1`: tag pages off-white (no blue/orange clash). `3.12.1`: CTA buttons tied to per-page region ramp.

### Landing icons (stroke = `currentColor`)
- index `radio` · about `junglestar_people` · offer `feather` · discoverability `gmap_pin` (path `stroke-width="6.2"`) · showcase `junglestar_awards` · design `island` · content `what`.

### Social cards + design system
- `3.13.0`–`4.0.0`: dynamic OG cards (big uppercase site-font title, brand-blue thin bg-less logo, "Tip tagged" tag cards); `/sty` hidden from crawlers.
- `4.1.0`: `/sty` rebuilt — click-to-copy tokens, oklch values, grids, aspect/print/AutoContrast docs, new lightest tokens.

### Cross-cutting — `3.12.0`
- `COLOR.md` written; `em` units purged sitewide → `rem`/tokens; AutoContrast OKLCH luminance bug fixed.

---

## ✅ Polish — resolved 2026-05-27
- **`.site_header` / `.page_intro`** → **kept.** `.site_header` is referenced by `print.css` (not bare); `.page_intro` is the deliberate wrapper that demotes the old hero `<header>` to a `<div>` (single banner landmark). Both stay as styling hooks.
- **`<h4>` Gmap group labels** → **kept as `<h4>`.** They follow the section's `<h3>`, so `<h4>` is the correct document outline (visual size is handled by the scoped CSS, independent of level).
- **`inside_header` slot** → **renamed `page_intro`** across `Layout.astro` + the 7 pages, matching the `<div class="page_intro">` it feeds.
- **Illustrator re-hardcoding `#000`** → **build-step shipped.** A custom svgo plugin (`black-to-currentcolor`) in `astro.config.mjs`'s `experimental.svgOptimizer` rewrites black `stroke`/`fill` → `currentColor` at build, on the **output only** (source SVGs stay as-exported). A re-export that re-hardcodes `#000` is normalised every build — no manual flip needed.

---

## 📌 Key files
| File | What |
|---|---|
| `src/components/header/Header.astro` | Header + mobile hamburger/modal |
| `src/components/UI/LandingScreen.astro` | Hero |
| `src/layouts/Layout.astro` | `<Header/>` + `.page_intro` wrapper, `master` colour knob |
| `src/components/brand/Gmap.astro` | Discoverability lists |
| `src/pages/sty.astro` | Design-system / styleguide page |
| `COLOR.md` | Colour-system docs |

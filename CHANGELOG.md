# Changelog

## 3.9.3

- **Performance**: moved Google Analytics (`gtag.js`) off the main thread via `@astrojs/partytown`. The GA loader + config now run in a web worker (`type="text/partytown"`), with `forward: ['dataLayer.push']` so `gtag()` calls reach the worker. Removes GA's main-thread/parse cost from the critical path. Still prod-only (Netlify `CONTEXT === "production"`). **Verify GA Realtime receives hits after deploy** — Partytown proxies the `collect` beacons cross-origin.

## 3.9.2

- **Performance**: collapsed the client-script request chain flagged by Lighthouse ("avoid chaining critical requests"). New build-time integration `preload-script-deps` injects a `<link rel="modulepreload">` for the shared chunk that each page's script stub imports (e.g. `page.[hash].js` → `index.[hash].js`, the prefetch runtime), so the browser fetches it in parallel instead of after parsing the stub. Hash-agnostic; pure resource hint — no change to View Transitions or prefetch behaviour.
- **Showcase**: fixed a two-tone background seam — the header used `--white` while the projects section used `--whiteOFF`. Both now use `--whiteOFF` for a single uniform page colour (added `--whiteOFF` to the Layout `background` prop).
- **Modals**: restyled `Modal` and `QRmodalLink` dialogs — solid black background with white text, opaque backdrop, and viewport-relative padding/sizing.

## 3.9.1

- Added showcase projects: **BOOK BAT** (bat.junglestar.org) and **BA ZI Calculator** (bazi.junglestar.org), with their icons.
- Refreshed showcase dates/subtitles for Jungle Speak, Casa Asia, and Divino.
- Removed Junglo Shoes from the showcase.

## 3.9.0

- **Color system → single source of truth**: `--brand` is now the only seed; added a derived `--brand-50…900` shade scale via OKLCH relative color (`oklch(from var(--brand) …)`), remapped legacy `--brand_lighter/light/dark/darker` aliases onto it, and derived `--brandT25/50/75` from `--brand`. Change `--brand` and the whole palette retunes.
- **Removed all gradients**: deleted the animated `gradient-move` footer radial gradients (green/orange/blue) in favour of a flat `var(--brand)` footer; replaced `WaveSection` purple/coral linear-gradient defaults with brand tokens.
- **Hybrid by page**: `showcase` and `about` switched from full brand/green floods to calm light pages. `WorksCard` restyled for light backgrounds (raised white tiles, resting shadow) and fixed the `service`/`webapp` variants whose white text was invisible on light.
- **Offer page**: recommended tier now visually wins — "Best Seller" solid-brand pill + elevation, "Best Value" lighter brand shade, "Awesome" outlined pill (all three labels now share a badge). Fixed the broken "See Demo" link (anchor self-closed, text fell outside it).
- **Homepage**: removed leftover debug `background:red`; calmed intro-block scroll spacing; homogenised intro body text (one size/line-height/weight, `<strong>` bold kept); CTA buttons are now solid filled brand instead of a faint outline.
- **About**: intro wrapped in a white block with a brand border and a monochrome `award`-icon "25 years of expertise" badge.
- **Copy**: fixed "breifly" → "briefly" and "fight to help to help the planet. Change." → "fight climate change".
- **Version display**: moved out of the homepage meta title into the footer copyright line.
- **Tooling**: added `clean` (`rm -rf .astro dist node_modules/.vite`) and `dev:clean` scripts.

## 3.8.3

- Reverted tracking measurement ID to the correct value for junglestar.org

## 3.8.2

- Corrected tracking measurement ID in `site.json`

## 3.8.1

- GA now gated on Netlify `CONTEXT === "production"` — excludes dev, local preview, deploy-previews, and branch builds (only fires on live junglestar.org)

## 3.8.0

- Upgraded Astro v5.17.3 → v6.3.7 (+ `@astrojs/mdx` v4 → v5, `@astrojs/check` 0.9.9, `@astrojs/ts-plugin` 1.10.9)
- Bumped `@biomejs/biome` to 2.4.15
- Migrated `experimental.fonts` → top-level `fonts` (stabilized in Astro 6)
- Migrated `experimental.svgo` → `experimental.svgOptimizer(svgoOptimizer({...}))` (renamed API)
- Added Google Analytics (gtag.js) via new `GoogleAnalytics.astro` component, prod-only, async, ID sourced from `site.json`

## 3.7.0

Release rollup of 3.6.1–3.6.7:

- Offer page responsive card grid + landscape phone layout
- Per-section OG images (1200x630) + article metadata (`article:author`, `article:section`, `article:tag`)
- Social media section polish + `text-wrap: pretty` everywhere
- SVG stroke scoping: thin strokes on `.four_icon_group`, proper `stroke-width` on large-viewBox icons
- Tags moved to bottom of post content
- Fixed `--brand_lighter` oklch out-of-gamut rendering
- Centered h1/subtitle on slug pages + unified `--logo-stroke: 4.5`
- Fixed lodash prototype pollution vulnerability via pnpm override

## 3.6.7

- Fixed mean_icon SVG strokes: scoped thin `--logo-stroke-icon` to `.four_icon_group` only
- Offer page cards: responsive grid (single col → 3-col at 850px), constrained heading width
- Fixed card padding and text wrapping (`text-align: pretty` → `text-wrap: pretty`)
- Landscape phones: hide logo, overtitle, and scroll animation — single-screen header

## 3.6.6

- Fixed mean_icon SVG strokes: scoped thin `--logo-stroke-icon` to `.four_icon_group` only
- Large-viewBox icons (desperate, jumping, gmap) now use proper `stroke-width: 5` from `.outlined` class

## 3.6.5

- Fixed lodash prototype pollution vulnerability (4.17.21 → 4.17.23) via pnpm override

## 3.6.4

- Article OG metadata: `article:author`, `article:section`, `article:tag` on slug pages
- Per-section OG images (1200x630 stroke logo): blue for design, orange for content, black for discoverability, white for offer, green for about
- OG image selection via pathname map in Head.astro
- Tags prop wired through Layout → Head pipeline

## 3.6.3

- `text-wrap: pretty` on all on_scroll_msg children
- Social media section: ul centered with inline padding, evenly spaced rows
- Thinner SVG strokes in mean_title sections, YouTube play icon stroke refined
- Share icon responsive sizing on mobile via clamp
- Icons group wider on mobile (95%/90dvw)

## 3.6.2

- Moved Tags nav to bottom of post content in all 10 MDX files
- Fixed `--brand_lighter` oklch out-of-gamut rendering (two-tone blue on design page)
- Fixed undefined `--bg_brand_lighter` variable in `.bg_brand_light` class

## 3.6.1

- Centered h1 and subtitle on slug pages at all screen sizes
- Tags row centered at all sizes (was only 1024px+)
- Unified `--logo-stroke: 4.5` across all breakpoints for consistent logo weight

## 3.6.0

- Tag navigation system: tags are now clickable links to tag index pages
- Shared `Tags.astro` component replaces duplicated inline JSX in all 10 MDX files
- `src/utils/tags.ts` utility for tag URL generation and static path building
- Unified tag pages at `/tag/[tag]` showing posts from both design and content sections
- Tags reuse `.button` base class (no more duplicate CSS)
- SEO tag portfolio refactoring: 33 tags → 15 searchable tags, fixed typos
- Tag page cards show section color (blue for design, orange for content)
- Simplified link exclusions: `:not(.button)` covers both buttons and tags
- NavScroll centered at 1024px+
- Tags row centered at 1024px+

## 3.5.12

- Rescaled all content SVGs to unified 400x400 viewBox (was mix of 24x24 and 400x400)
- Added `--stroke_unitless` CSS token for responsive SVG stroke-width control
- Grid cards get thick strokes (10), single pages get thin strokes (3)
- Fixed SVG color inheritance: compass, bright-star, building now use currentColor
- Stripped building.svg to phone outline + text (removed CC logo circle)
- Bento box grid layout for design/content index pages
- SVG icon sizing: 80px mobile → 96px tablet → 112px desktop
- Single page hero SVG click navigates back (history.back)
- Hidden top nav on slug pages (hideNav Layout prop)
- Moved h1/subtitle inside .post_content for consistent column alignment
- Centered headings in .grida landing screens
- Fixed ul/ol alignment in post content
- Consolidated .post_hero_image styles into post_image.css (single source of truth)

## 3.5.11

- Removed about page header gradient animation (consistent with index header cleanup)

## 3.5.10

- NavScroll: active/hover states use border opacity instead of background color
- NavScroll: border uses `currentColor` with `color-mix` for automatic dark/light adaptation
- Fixed `.bg_brand .nav_scroll` forcing black background — now uses `var(--brand)`
- Removed index header gradient animation (inconsistent — no other page had one)
- Fixed heading font weights at 1024px breakpoint (h1–h5 values were too low)
- Migrated skills to `<name>/SKILL.md` directory format
- Added `READMEs/font-weights.md` documenting the responsive weight system

## 3.5.9

- NavScroll: removed opacity dimming for better text contrast (Lighthouse a11y fix)

## 3.5.8

- Added NavScroll component: horizontal touch-scrollable nav driven by `menu.json`
- NavScroll shows active page state via `aria-current`
- Added NavScroll to Layout (appears on all pages)
- Global `--tap_size` reduced to 44px (WCAG minimum)
- Global `--radius` bumped to `clamp(7px, 0.5rem, 1.25rem)`
- Reduced `.on_scroll_msg` font-size on sub-375px screens
- Removed details borders in post_content for design/content pages

## 3.5.7

- PWA: added `start_url`, `scope`, `id`, `description` to web manifest
- PWA: added service worker (`sw.js`) with network-first caching
- PWA: added `apple-mobile-web-app-capable` and `mobile-web-app-capable` meta tags
- PWA: site is now installable on mobile and desktop

## 3.5.6

- SVG sizes fixes

## 3.5.5

- SVG fix

## 3.5.4

- More SVG improvements and fixes
- SVG stroke fix

## 3.5.3

- Stroke color + pad fix

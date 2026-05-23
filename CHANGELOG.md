# Changelog

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

# Changelog

## 4.0.0

Milestone release marking the completed header / hero / colour-system / social-card redesign (the 3.12.x–3.13.x arc). Final tweaks in this version:

- **OG card logo**: now drawn in the brand blue (`#0069cc`) with a thinner stroke (a transparent, background-less mark), for a subtler tonal look on the dark-blue gradient.
- **Tag OG cards**: description copy changed from “Posts tagged …” to “Tip tagged …”.

## 3.13.1

- **OG card template polish**: title now uses the website's thin heading weight (Light) instead of heavy Black, and the logo is a larger (≈2.5×), transparent **background-less** white outlined mark (rasterised from `logo_stroke.svg` → `public/assets/og_logo.png`) instead of the old blue-square logo. Title size tuned so the longest two-line titles keep clear margin above the description.
- **Hide the style guide from crawlers**: `/sty` now ships `<meta name="robots" content="noindex,nofollow,nosnippet">` (via `sitemap={false}`) and is disallowed in `robots.txt`.

## 3.13.0

- **Dynamic Open Graph cards**: every page now gets its own 1200×630 social card, generated at build time via `astro-og-canvas` (`src/pages/og/[...route].ts`) — page title set BIG, uppercase, heavy-weight, in the site font (Source Sans 3, vendored), on a brand-blue gradient with the logo. Replaces the old static-image map (home/services/showcase had been falling back to a cropped square logo). `Head.astro` derives each page's card URL from its pathname.
- **OG / head meta fixes**: `og:type` is now `website` by default and `article` only on blog posts (was `article` everywhere); added `og:image:width`/`height` (1200/630) and `og:image:alt`/`twitter:image:alt`; `description` falls back to the site description when a page (e.g. a subtitle-less article) passes none. Moved `<meta charset>` to the very top of `<head>` (it was being pushed past the byte limit by the font-preload links). Collapsed the double space in the site-wide `title_start | title_end` pattern at the source.
- **Section bands**: new shared `.section_band` component (`styles/layers/compo/bands.css`) — a full-width band behind each page's intro heading, coloured `var(--brand)` to match the post-card borders, with white heading text. Applied to design, content, showcase, about, and offer. Content keeps dark heading text (its orange master is light); offer uses a lighter blue tint so the band stands out on that darker page.
- **Per-page colour diversification (luma only)**: each page now sits at a distinct lightness of the same brand blue — discoverability (deepest) → showcase → offer → design → about (lightest) — while content stays orange. Footers are intentionally left uniform (the footer tier uses an absolute lightness and only the unchanged chroma/hue of `--brand`).
- **Hero icons** now take the page colour: the big landing icon is tinted via `currentColor` (`color: var(--brand)`), recolouring both fill- and stroke-based icons; home uses the footer tint instead.
- **Header**: the JUNGLESTAR wordmark hides in the tablet band (601–900px) to give the scrolling nav room (logo icon stays; phones/desktop unchanged); nav chips are now vertically centred against the brand mark (were defaulting to top-aligned).
- **Footer modal** fixed: its trigger is now wired on `astro:page-load`, so it survives View-Transitions navigations (previously it stopped working after the first client-side navigation).
- **Offer page**: pricing grid switches to 3 columns at `> 820px` (so landscape phones get the 3-up layout); minor copy tweaks.

## 3.12.1

- **CTA buttons tied to the page palette**: `.cta` now derives from the per-page region ramp — fill = `--region_foot` (the footer's light tier), text = `--fg_foot`, outline = black — so every CTA matches its page's footer and re-tunes automatically when a page's master colour changes. Hover inverts to a white fill with brand-coloured text **and** a matching brand-coloured outline, which "lights up" while staying AA-accessible on any background (the previous `--brand-600`/`--brand-400` hovers either darkened or broke white-text contrast). Fixes the content page's CTA blending into its deep-orange section (fill no longer equals the section background) and the design page's too-dark blue.
- **Removed an instance-level override** that fought the shared class: `CTAMailBanner` no longer hard-sets `color`/`border-color: currentColor`, so the single `.cta` recipe governs every CTA site-wide (homepage intro, offer, Gmap, SlowWebsite, etc.).
- **Docs**: documented the "style the component, not the instance" rule in the `css-conventions` skill (shared button classes are the single source of truth; only genuine non-identity one-offs may be scoped in a page's `<style>`).

## 3.12.0

- **Header refactor (logo + wordmark + chips)**: rebuilt the site header — an outlined **logo mark** + **JUNGLESTAR wordmark** on the left, nav chips pushed far right, on a single line. Token-based sizing (`--header_text_size` / `--header_text_spacing`) so the wordmark and chips share one source (no `em`). Renamed `shared/NavScroll.astro` → `header/Header.astro`; it now wraps a semantic `<header>`, and `Layout.astro`'s old hero `<header>` became `<div class="page_intro">` (one banner landmark).
- **Mobile nav → hamburger + full-page modal**: on ≤600px the nav collapses to a hamburger that opens a full-page `<dialog>` with a replica top bar (the header "stays present" and the hamburger slot shows the X). Wired on `astro:page-load` so it survives view transitions; closes on link tap / Esc / backdrop / resize-to-desktop.
- **Static hero, single `<h1>` per page**: removed the big brand-name `h1` and logo from the hero and killed the on-scroll scroll-timeline fade (and its tall scroll region) sitewide. Each page now declares exactly one `<h1>` — pages pass `title` to `LandingScreen` for a hero h1, or promote a body heading. Hero DOM normalized to plain, classless elements inside `.landing_screen` / `.landing_height` (`100svh` portrait, `188svh` landscape) with fresh baseline styling.
- **AutoContrast OKLCH fix**: the canvas-luminance fallback no longer silently returns black for `oklch()` colours (sentinel + `color-mix` sRGB probe, bails to the CSS default if unresolvable). Styleguide `sty.astro` refreshed to the current palette (brand scale + harmonizer ramps).
- **Discoverability lists**: `WHAT WE DO / WHAT YOU GET / THEN YOU CAN` are now real centered `<h4>` headings; the three blocks are equal-width within a centered 34rem column with left-aligned items and even rhythm (dropped the `margin-left: 15dvw` shift).
- **Landing icons** unified to `stroke="currentColor"`: `design` → `island.svg`, `showcase` → `junglestar_awards.svg`, `discoverability` → `gmap_pin.svg` (path `stroke-width="6.2"` to match the hero's forced weight at its 400-viewBox), `about` → `junglestar_people.svg`.
- **Copy & layout tweaks**: hero paragraph `max-width` 30ch → 75ch; footer credit line restructured (repo name + `v{version}` on their own line); About page — new `junglestar_people` icon, FAQ reordered (LIVE Projects first), TLDR copy reworked; refreshed Design and Discoverability hero copy.
- **Docs**: added `COLOR.md` (single-`--brand` → region-luma colour system) and `ROADMAP.md`. Purged stray `em` units sitewide → `rem` / spacing tokens.

## 3.11.1

- **Homepage main is dark again**: the intro background SVGs are line art drawn for a black canvas, so the home `<main>` now uses a black background with light text (scoped to `body.index` — the rest of the site keeps the near-white main from the region ramp). `IntroSection` text returned to light.
- **Design icon outline**: `truck.svg` had `stroke="#000"` hardcoded on its paths, so it stayed black instead of inheriting the head's text colour; switched to `currentColor` so the animated icon shows a white outline on the deep header.

## 3.11.0

- **Colour system — one master per page, luma-derived regions**: head / main / footer backgrounds are now luma variations of a single per-page master colour instead of three independently-set colours. The master is just `--brand` (overridable per page); `base.css` derives `--region_head` (deep, light text), `--region_main` (near-white, dark text) and `--region_foot` (light tint, dark text) from it via OKLCH relative colour, all declared on `<body>` so overriding the master re-tunes the whole page. Fixes footers that clashed with page tops (the "electric two-blues" vs "soft pastel" split).
- **Layout**: replaced the `background` prop with `master?: "--brand" | "--jgreen" | "--jorange"` (sets `--brand` inline). Removed the parallel `bg_*` body-class mechanism (`awesome_colours.css` emptied) — it set head/main/footer independently, which was the root cause of the mismatch. Footer rule in `animatio.css` collapsed from a 6-page hand-list to a single `.footer_site` using `--region_foot`.
- **Menus**: unified top (`.nav_scroll_item`) and bottom (footer `.button`) menus to one hard-outline recipe (full-strength `currentColor` border, transparent fill); active top-nav item is a filled chip. Removed redundant per-page button overrides.
- **Pages**: migrated all 12 pages off `background=`/`bg_*`/`mainClass="bg_white"`; `content` uses `master="--jorange"`, the rest use the brand-blue ramp. Homepage `IntroSection` now renders dark-on-light (was white-on-blue). Fixed `sty.astro`'s contradictory body class and a broken/`--brand_lightest` undefined-var rule on `content`.

## 3.10.3

- **Security**: added `/.well-known/security.txt` (RFC 9116) so researchers have a clear vulnerability-disclosure contact (`info@junglestar.org`).

## 3.10.2

- **Housekeeping**: stop shipping macOS `.DS_Store` files — the `build` script now strips them from `public/` before building (they were being served publicly at `/.DS_Store`). `deploy:cf` reuses `pnpm build`, so the Worker gets the same guard. Deleted the throwaway DNS-import file.

## 3.10.1

- **Cloudflare deploy tooling**: added `wrangler` (dev dependency) and a `deploy:cf` script (`astro build && wrangler deploy`), a `$schema` reference on `wrangler.jsonc`, and ignored `.wrangler/`. Enables GitHub auto-deploy (Workers Builds) and local `pnpm deploy:cf`. Validated with `wrangler deploy --dry-run` (reads `dist`, config OK).

## 3.10.0

- **Hosting → Cloudflare (migration in progress)**: added `wrangler.jsonc` for Cloudflare Workers static assets (serves `./dist`), with `html_handling: "drop-trailing-slash"` to match Astro's `trailingSlash: 'never'` (the Workers default otherwise 307-redirects `/about` → `/about/`, contradicting our no-slash canonicals). Production DNS cutover is still pending — the site remains live on Netlify until then.
- **Analytics**: removed Google Analytics (`gtag.js`) and the `@astrojs/partytown` integration entirely. Cloudflare Web Analytics (cookieless, first-party) will be wired in at DNS cutover. No analytics ships in this interim release.
- **Node pinned**: added `.node-version` (`24.15.0`) — a single source of truth honoured by nvm/fnm, Netlify, and Cloudflare builds.
- **Dead code removed**: deleted 11 unused components (`ExternalLinks`, `CTAMailButton`, `AnimHeader2Brand`, `AutoContrastScroll`, `TableOfContents`, `QrModalButton`, `Accordion`, `CTAButton`, `brand/SVGstar`, `brand/QR`, `heads/asciiartdude`) and the unused `utils/getPosts.ts`.
- **Housekeeping**: `site.json` `deploy_check` → Workers URL, dropped the Netlify status badge; README points to Cloudflare hosting.
- **QR modal**: bumped the copyable URL text to `font-size: 1rem`.

## 3.9.4

- **About**: fixed the same two-tone background seam as the showcase page — the header inherited the body's `--white` while `<main>` used `bg_white` (`--whiteOFF`). Body now set to `--whiteOFF` for one uniform page colour. (`services`/`offer`/`tag` pages don't set `bg_white` on `<main>`, so they were already seamless.)

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

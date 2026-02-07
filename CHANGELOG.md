# Changelog

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

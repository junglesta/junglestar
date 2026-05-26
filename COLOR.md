# 🎨 COLOR.md — How colour works on this site

The whole site is coloured from **one knob per page**. You set a single
master hue, and the page's header, main area, and footer are all computed
from it as lightness variations of that one colour. Change the master →
the entire page re-tunes itself, contrast included.

No per-region background classes, no hand-picked footer colours, no
hex-by-hex tweaking. Pick a hue, the rest is math.

---

## 1. The single source of truth: `--brand`

Everything starts from one custom property, defined in
[`src/styles/layers/tokens.css`](src/styles/layers/tokens.css):

```css
:root {
  --brand: oklch(0.57 0.24 255); /* Junglestar blue */
}
```

Colours are written in **OKLCH** — `oklch(Lightness Chroma Hue)`:

- **L** = lightness, `0` (black) → `1` (white)
- **C** = chroma (saturation), `0` (grey) → ~`0.37`
- **H** = hue angle, `0–360°` (255 = blue, 144 = green, 45 = orange)

OKLCH is used everywhere because it's *perceptually uniform*: changing only
the lightness keeps the hue looking like the same colour, which is exactly
what the region ramp (below) relies on.

### The shade scale

From that one `--brand`, a 50→900 scale is derived with **OKLCH relative
colour** (`oklch(from … )`), so the whole palette re-tunes if you change the
master:

```css
--brand-50:  oklch(from var(--brand) 0.97 calc(c * 0.22) h); /* lightest tint */
--brand-500: var(--brand);                                   /* the master   */
--brand-900: oklch(from var(--brand) 0.24 calc(c * 0.7)  h); /* darkest shade */
```

`from var(--brand)` pulls the master's `l c h` apart so each shade can
override lightness/chroma while **keeping the hue**. Legacy aliases
(`--brand_light`, `--brand_dark`, …) map onto this scale.

### The three brand hues

Three master hues exist as ready-made tokens (tuned in
[`palette.css`](src/styles/layers/palette.css) via the
[Evil Martians Harmonizer](https://harmonizer.evilmartians.com)):

| Token       | Hue | Used for                       |
|-------------|-----|--------------------------------|
| `--brand`   | 255 | Junglestar blue (default)      |
| `--jgreen`  | 144 | green-mastered pages           |
| `--jorange` | 45  | content / blog pages           |

---

## 2. How a page picks its colour — the `master` prop

The colour changes **page to page** through one prop on the layout.
[`src/layouts/Layout.astro`](src/layouts/Layout.astro) accepts:

```ts
master?: "--brand" | "--jgreen" | "--jorange";
```

and applies it as an inline override on `<body>`:

```astro
<body style={master ? `--brand: var(${master})` : undefined}>
```

So a page just says which hue it wants:

```astro
<Layout title="…" master="--jorange">   <!-- content pages -->
<Layout title="…">                       <!-- defaults to blue -->
```

Because the override lands on `<body>`, it **redefines `--brand` for that
page's whole subtree**. Every region colour below recomputes automatically.
That's the entire page-to-page mechanism — one attribute.

Currently:
- **Most pages** → no prop → default blue.
- **Content index + posts** (`src/pages/content/index.astro`,
  `src/pages/content/[slug].astro`) → `master="--jorange"`.

---

## 3. The region luma ramp — head / main / footer

This is the heart of it, in
[`src/styles/layers/layout/base.css`](src/styles/layers/layout/base.css).
A page has three stacked regions, and each is a **lightness variation of the
single master**:

```css
body {
  --region_head: oklch(from var(--brand) 0.45 c h);           /* deep, saturated */
  --region_main: oklch(from var(--brand) 0.97 calc(c * 0.18) h); /* near-white tint */
  --region_foot: oklch(from var(--brand) 0.9  calc(c * 0.4)  h); /* light tint      */

  --fg_head: var(--white);       /* light text on the deep head  */
  --fg_main: var(--text_color);  /* near-black text on pale main  */
  --fg_foot: var(--black);       /* black text on light footer    */
}
```

| Region   | Lightness | Chroma     | Result                | Text        |
|----------|-----------|------------|-----------------------|-------------|
| `head`   | 0.45      | full       | deep & saturated      | white       |
| `main`   | 0.97      | 18% of brand | almost white, faint hue | near-black |
| `footer` | 0.90      | 40% of brand | light tint of the hue | black       |

Each takes the master's **hue and chroma, but overrides the lightness** —
so all three are visibly "the same colour family," just darker at the top
and lighter going down. The text colours are paired so contrast holds for
any hue you choose.

Wiring:

- `<body>` / `<header>` sit in the **head** region (deep).
- `main` (in `base.css`) → `--region_main` (near-white).
- `.footer_site` (in
  [`compo/animatio.css`](src/styles/layers/compo/animatio.css)) →
  `--region_foot` (light tint).

> **Why it's built this way:** the old approach used independent
> `.bg_brand` / `.bg_white` / `.bg_black` helpers that coloured head, main,
> and footer separately — which is exactly what made footers clash with page
> tops. Deriving all three from one master guarantees they always belong
> together. See the note in
> [`compo/awesome_colours.css`](src/styles/layers/compo/awesome_colours.css)
> (now just a tombstone explaining the removal).

---

## 4. The nav — outlined, reads against the head

[`src/components/shared/NavScroll.astro`](src/components/shared/NavScroll.astro)
sits in the head region, so it styles itself relative to `currentColor`
(the head's light text):

```css
border: 2px solid currentColor;   /* hard outline, no fill */
```

The **active page** inverts into a filled chip against that outline set:

```css
background-color: var(--fg_head);   /* fill with the head's text colour */
color:            var(--region_head); /* text becomes the head bg        */
```

So the nav never hard-codes a colour — it flips automatically with whatever
master the page is using.

---

## 5. Per-page exceptions

A page can still override a single region when its content demands it.

**Homepage** (`src/pages/index.astro`) forces `main` to pure black, because
the intro SVGs are drawn for a black canvas:

```css
:global(body.index main) {
  --bg: var(--black);
  --fg: var(--white);
  background-color: var(--black);
  color: var(--white);
}
```

This is scoped to `body.index` only — every other page keeps the near-white
main from the ramp. The homepage's intro SVGs and the design truck icon use
`fill="currentColor"`, so they inherit whatever the region's text colour is
rather than baking in a colour.

---

## 6. Auto-contrast (forward-looking)

[`src/styles/layers/auto_contrast.css`](src/styles/layers/auto_contrast.css)
holds utilities built on the native CSS Color 6 `contrast-color()` function,
which picks black-or-white text automatically for any background:

```css
.btn-auto {
  --btn-bg: var(--brand);
  background-color: var(--btn-bg);
  color: contrast-color(var(--btn-bg)); /* auto black/white */
}
```

It's gated behind `@supports (color: contrast-color(red))` with a manual
fallback, because Chrome/Edge didn't support it as of Dec 2025 (Safari 26+
and Firefox 146+ do). Today the region ramp pairs text colours by hand
(`--fg_head` etc.); `contrast-color()` is the path to making even those
automatic.

---

## TL;DR

1. **One token, `--brand` (OKLCH), is the source of truth.**
2. **A page picks its hue with `<Layout master="--brand | --jgreen | --jorange">`,**
   which redefines `--brand` on `<body>`.
3. **Header / main / footer are lightness variations of that one master**
   (deep → near-white → light tint), with paired text colours, so contrast
   and colour-harmony hold for any hue.
4. **The nav and SVGs follow `currentColor`,** so they re-tune for free.
5. **Pages override a single region only when needed** (e.g. homepage's
   black `main` for the intro art).

Change one knob, the page re-colours itself — top to bottom, consistently.

---

### File map

| File | Role |
|------|------|
| `src/styles/layers/tokens.css` | `--brand` source of truth + shade scale |
| `src/styles/layers/palette.css` | harmonizer-tuned hue ramps (jstar/jgreen/jorange) |
| `src/styles/layers/layout/base.css` | the head/main/footer region luma ramp |
| `src/styles/layers/compo/animatio.css` | `.footer_site` → footer region |
| `src/styles/layers/auto_contrast.css` | `contrast-color()` utilities (progressive) |
| `src/layouts/Layout.astro` | `master` prop → inline `--brand` override |
| `src/components/shared/NavScroll.astro` | outlined nav, active-chip inversion |
| `src/pages/index.astro` | homepage black-`main` exception |
| `src/styles/layers/compo/awesome_colours.css` | tombstone: why the old per-region helpers were removed |

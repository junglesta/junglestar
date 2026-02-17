# Font Weight System

Source: `src/styles/layers/tokens.css` + `src/styles/layers/layout/headings.css`

Font: **Source Sans 3** (variable, min weight 200)

## Principle

Larger screens render text at larger sizes, so weights get **thinner** as viewport grows. This keeps optical density consistent. Low-DPI screens get heavier weights to compensate for reduced rendering quality.

## Body Text Tokens

| Token             | Value |
|-------------------|-------|
| `--weight_thinner`| 100   |
| `--weight_thin`   | 200   |
| `--weight`        | 300   |
| `--weight_med`    | 400   |
| `--weight_bold`   | 600   |
| `--weight_heavy`  | 900   |

Body base weight (`--weight`) is applied to `<body>` via `font-weight: var(--weight)`.

## Heading Weights by Breakpoint

Values cascade — a cell with `—` means the value is inherited from the previous breakpoint.

| Heading | base (<480) | 480px | 768px | 1024px | 1280px | 1600px |
|---------|-------------|-------|-------|--------|--------|--------|
| h1      | 250         | 250   | 200   | 200    | 200    | 200    |
| h2      | 283         | 280   | 230   | 220    | 220    | 200    |
| h3      | 300         | 320   | 280   | 260    | 250    | 220    |
| h4      | 333         | —     | 350   | 320    | 300    | 280    |
| h5      | 366         | —     | —     | 350    | 350    | 320    |
| h6      | 400         | —     | —     | —      | 400    | 380    |

Values decrease smoothly across breakpoints — no dips or reversals.

## Low-DPI Override (`max-resolution: 1.5dppx`)

Overrides all breakpoint values to ensure legibility on coarse displays:

| Token              | Value |
|--------------------|-------|
| `--weight`         | 350   |
| `--weight_thin`    | 250   |
| `--weight_thinner` | 150   |
| h1                 | 250   |
| h2                 | 280   |
| h3                 | 310   |
| h4                 | 350   |
| h5                 | 380   |
| h6                 | 400   |

## Logo Stroke (same optical principle)

| Breakpoint | `--logo-stroke` | `--logo-stroke-icon` |
|------------|-----------------|----------------------|
| base       | 5               | 0.37                 |
| 600px      | 5.6             | 0.4                  |
| 820px      | 4.8             | 0.35                 |
| low-DPI    | 6.5             | 0.5                  |

## Where Weights Are Used

- `base.css` — body: `var(--weight)`
- `headings.css` — h1–h6: `var(--h1-weight)` through `var(--h6-weight)`
- `strong.css` — bold: `var(--weight_bold)`
- `links.css` — links: `200`
- `buttons.css` — buttons: `var(--weight_med)`
- `NavScroll.astro` — nav items: `var(--weight_med)`

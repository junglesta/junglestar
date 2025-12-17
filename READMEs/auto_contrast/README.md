# Auto-Contrast Text

Automatically choose readable text color (black or white) based on background color.

**Two solutions included:**

1. **Pure CSS** — zero JavaScript, uses native `contrast-color()`
2. **Astro Component** — CSS-first with JS fallback for Chrome/Edge

## Browser Support (December 2025)

| Browser        | `contrast-color()` |
| -------------- | ------------------ |
| Safari 26+     | ✅                 |
| iOS Safari 26+ | ✅                 |
| Firefox 146+   | ✅                 |
| Chrome         | ❌                 |
| Edge           | ❌                 |

**Global support:** ~1.5% (but growing fast)

---

## Solution 1: Pure CSS

For projects where you can require Safari/Firefox, or provide manual fallbacks.

### Usage

```css
/* Import or copy the utilities */
@import "./auto-contrast.css";

/* Apply to any element */
.my-button {
  --bg-color: #e11d48; /* rose-600 */
}
```

```html
<button class="auto-contrast-safe my-button">Subscribe</button>
```

### Available Classes

| Class                 | Description                               |
| --------------------- | ----------------------------------------- |
| `.auto-contrast`      | Basic auto-contrast (no fallback)         |
| `.auto-contrast-safe` | With fallback for unsupported browsers    |
| `.auto-contrast-bg`   | Inverted: auto background from text color |
| `.btn-auto`           | Pre-styled button                         |
| `.badge-auto`         | Pre-styled badge/pill                     |
| `.card-auto`          | Pre-styled card                           |

### Custom Colors

```css
.my-element {
  --bg-color: oklch(65% 0.25 30); /* Any CSS color */
}
```

### Inline Usage

```html
<div class="auto-contrast" style="--bg-color: #7c3aed">
  Purple background, auto text
</div>
```

---

## Solution 2: Astro Component

For Astro projects. Uses CSS `contrast-color()` where supported, falls back to JavaScript luminance calculation for Chrome/Edge.

### Installation

Copy `AutoContrast.astro` to your components folder.

### Basic Usage

```astro
---
import AutoContrast from "@/components/AutoContrast.astro";
---

<AutoContrast backgroundColor="#0ea5e9">
  Sky blue with auto text color
</AutoContrast>
```

### Props

| Prop              | Type     | Default                 | Description                                    |
| ----------------- | -------- | ----------------------- | ---------------------------------------------- |
| `backgroundColor` | `string` | `var(--brand, #3b82f6)` | Background color                               |
| `tag`             | `string` | `div`                   | HTML element to render                         |
| `class`           | `string` | `""`                    | Additional CSS classes                         |
| `lightText`       | `string` | `white`                 | Text color for dark backgrounds (JS fallback)  |
| `darkText`        | `string` | `black`                 | Text color for light backgrounds (JS fallback) |
| `threshold`       | `number` | `0.5`                   | Luminance threshold 0-1 (JS fallback)          |

### Examples

#### Buttons with different colors

```astro
<AutoContrast tag="button" backgroundColor="#16a34a" class="px-4 py-2 rounded">
  Green Button
</AutoContrast>

<AutoContrast tag="button" backgroundColor="#fbbf24" class="px-4 py-2 rounded">
  Yellow Button
</AutoContrast>
```

#### Using CSS variables

```astro
<AutoContrast backgroundColor="var(--brand-primary)">
  Uses your theme color
</AutoContrast>
```

#### Custom text colors (for JS fallback)

```astro
<AutoContrast
  backgroundColor="#1e293b"
  lightText="oklch(98% 0 0)"
  darkText="oklch(15% 0 0)"
>
  Custom light/dark text colors
</AutoContrast>
```

#### Dynamic color updates (JavaScript)

```html
<AutoContrast id="dynamic-box" backgroundColor="#3b82f6">
  Click to change color
</AutoContrast>

<script>
  const box = document.getElementById("dynamic-box");
  box.addEventListener("click", () => {
    // Random color
    const hue = Math.floor(Math.random() * 360);
    box.setBackgroundColor(`oklch(50% 0.2 ${hue})`);
  });
</script>
```

---

## How It Works

### CSS `contrast-color()` (Native)

```css
.element {
  background: var(--bg);
  color: contrast-color(var(--bg)); /* Returns black or white */
}
```

The browser calculates which of black or white has better contrast against the background using WCAG 2.1 algorithm.

### JavaScript Fallback

For Chrome/Edge, we:

1. Render the background color to a 1×1 canvas
2. Read the RGB values
3. Calculate relative luminance
4. Compare against threshold to pick light or dark text

---

## Limitations

1. **Only black or white** — `contrast-color()` currently only returns pure black or white, not custom colors
2. **WCAG 2.1 algorithm** — Known issues with mid-tone colors (e.g., `#317CFF` blue returns black when white is more readable)
3. **No threshold control in CSS** — The JS fallback supports custom thresholds, CSS does not

---

## Future

The CSS Working Group is working on expanded `contrast-color()` that will:

- Support custom color lists (not just black/white)
- Allow specifying target contrast ratios
- Use improved contrast algorithms (APCA/WCAG 3)

See [CSS Color Level 6 spec](https://drafts.csswg.org/css-color-6/) for details.

---

## Resources

- [MDN: contrast-color()](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/contrast-color)
- [WebKit Blog: How to have the browser pick a contrasting color](https://webkit.org/blog/16929/contrast-color/)
- [Lea Verou: On compliance vs readability](https://lea.verou.me/blog/2024/contrast-color/)
- [Can I Use: contrast-color()](https://caniuse.com/mdn-css_types_color_contrast-color)

# AutoContrast

An Astro component that automatically adjusts text color based on background lightness using the **OKLCH** color space. No more hex colors — just perceptually uniform, modern CSS.

## Features

- **OKLCH native** — works with `oklch()`, CSS variables, `color-mix()`, etc.
- **Perceptually accurate** — uses OKLCH lightness (L) for contrast decisions
- **Customizable text colors** — define your own light/dark text in OKLCH
- **Adjustable threshold** — fine-tune when to switch text color
- **Dynamic updates** via `setBackgroundColor()` method
- **View Transitions ready** — works with Astro client-side navigation

## Installation

Copy `AutoContrast.astro` to your components folder.

## Props

| Prop              | Type     | Default            | Description                                  |
| ----------------- | -------- | ------------------ | -------------------------------------------- |
| `backgroundColor` | `string` | `"var(--brand)"`   | Background color (OKLCH, CSS variable, etc.) |
| `lightText`       | `string` | `"oklch(98% 0 0)"` | Text color for dark backgrounds              |
| `darkText`        | `string` | `"oklch(15% 0 0)"` | Text color for light backgrounds             |
| `threshold`       | `number` | `0.6`              | Lightness threshold (0-1) for switching      |
| `tag`             | `string` | `"div"`            | HTML element to render                       |
| `class`           | `string` | `""`               | Additional CSS classes                       |
| `style`           | `string` | `""`               | Inline styles                                |

## Usage

### Basic with OKLCH

```astro
---
import AutoContrast from "./AutoContrast.astro";
---

<AutoContrast backgroundColor="oklch(45% 0.3 264)">
  White text on vibrant blue
</AutoContrast>

<AutoContrast backgroundColor="oklch(85% 0.15 85)">
  Dark text on soft yellow
</AutoContrast>
```

### With CSS Variables

```astro
<AutoContrast backgroundColor="var(--brand)">
  Text adapts to your brand color
</AutoContrast>
```

### Custom Text Colors

```astro
<AutoContrast
  backgroundColor="oklch(30% 0.15 270)"
  lightText="oklch(95% 0.05 270)"
  darkText="oklch(25% 0.1 270)"
>
  Tinted text that matches the background hue
</AutoContrast>
```

### Adjust Threshold

```astro
<!-- Switch to light text earlier (more sensitive) -->
<AutoContrast backgroundColor="oklch(50% 0.2 150)" threshold={0.5}>
  Custom threshold
</AutoContrast>
```

### Custom Tag

```astro
<AutoContrast tag="section" backgroundColor="oklch(25% 0.05 260)" class="p-8">
  <h2>Section Title</h2>
  <p>Content with auto-contrasting text</p>
</AutoContrast>
```

### Dynamic Color Change

```astro
<AutoContrast id="dynamic-box" backgroundColor="oklch(55% 0.25 27)">
  Click to change my color
</AutoContrast>

<script>
  document.addEventListener("astro:page-load", () => {
    const box = document.getElementById("dynamic-box");
    box?.addEventListener("click", () => {
      (box as any).setBackgroundColor("oklch(65% 0.2 145)");
    });
  });
</script>
```

### Scroll Trigger (IntersectionObserver)

```astro
<AutoContrast id="scroll-box" backgroundColor="oklch(55% 0.25 27)">
  I change color when scrolled into view
</AutoContrast>

<script>
  document.addEventListener("astro:page-load", () => {
    const box = document.getElementById("scroll-box");
    if (!box) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          (box as any).setBackgroundColor(
            entry.isIntersecting ? "oklch(65% 0.2 145)" : "oklch(55% 0.25 27)",
          );
        });
      },
      { threshold: 0.5 },
    );

    observer.observe(box);
  });
</script>
```

### Scroll Progress (Gradual Color Change)

```astro
<AutoContrast
  id="progress-box"
  class="h-64"
  data-scroll-colors='["oklch(55% 0.25 27)", "oklch(70% 0.18 55)", "oklch(80% 0.18 95)", "oklch(65% 0.2 145)"]'
>
  My color changes as you scroll past me
</AutoContrast>

<script>
  document.addEventListener("astro:page-load", () => {
    document
      .querySelectorAll<HTMLElement>("[data-scroll-colors]")
      .forEach((box) => {
        const colors: string[] = JSON.parse(box.dataset.scrollColors || "[]");
        if (colors.length === 0) return;

        const updateColor = () => {
          const rect = box.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const progress = Math.max(
            0,
            Math.min(1, 1 - rect.top / windowHeight),
          );
          const index = Math.min(
            Math.floor(progress * colors.length),
            colors.length - 1,
          );
          (box as any).setBackgroundColor(colors[index]);
        };

        window.addEventListener("scroll", updateColor, { passive: true });
        document.addEventListener("scroll", updateColor, { passive: true });
        document.body.addEventListener("scroll", updateColor, {
          passive: true,
        });

        const main = document.querySelector("main");
        if (main)
          main.addEventListener("scroll", updateColor, { passive: true });

        updateColor();
      });
  });
</script>
```

## How It Works

1. Reads the computed background color via `getComputedStyle()`
2. Converts to RGB using a canvas (handles any CSS color format)
3. Calculates OKLCH lightness using `∛(luminance)`
4. Compares against threshold to pick light or dark text
5. Sets `--text-color` CSS variable

## OKLCH Quick Reference

```
oklch(L% C H)
│     │ │ └── Hue: 0-360 (red=27, orange=70, yellow=95, green=145, blue=264, purple=300)
│     │ └──── Chroma: 0-0.4 (0=gray, 0.15=muted, 0.3=vivid)
│     └────── Lightness: 0-100% (0=black, 50=mid, 100=white)
```

## License

MIT

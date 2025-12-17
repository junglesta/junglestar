# WaveSection - Astro Component

A reusable Astro component that creates a responsive wave clip-path effect between two stacked divs.

## How It Works

The component uses an SVG `<clipPath>` with `clipPathUnits="objectBoundingBox"` to clip the top layer, revealing the bottom layer through a wave shape. This approach is fully responsive since all coordinates are relative (0-1).

```
┌─────────────────────────┐
│      Top Layer          │  ← z-index: 1 (clipped)
│                         │
│ ~~~~~~~~~~~~~~~~~~~~~~~ │  ← wave clip-path
│                         │
│     Bottom Layer        │  ← z-index: 0 (revealed)
└─────────────────────────┘
```

## Installation

Copy `WaveSection.astro` to your components folder:

```
src/
  components/
    WaveSection.astro
```

## Usage

### Basic

```astro
---
import WaveSection from "../components/WaveSection.astro";
---

<WaveSection>
  <div slot="top">Top content</div>
  <div slot="bottom">Bottom content</div>
</WaveSection>
```

### With Custom Props

```astro
<WaveSection
  topBackground="linear-gradient(135deg, #667eea, #764ba2)"
  bottomBackground="#f5f5f5"
  waveHeight={0.65}
  height="600px"
  class="my-section"
>
  <header slot="top">
    <h1>Welcome</h1>
  </header>
  <section slot="bottom">
    <p>Revealed content below the wave</p>
  </section>
</WaveSection>
```

## Props

| Prop               | Type     | Default                                     | Description                                                 |
| ------------------ | -------- | ------------------------------------------- | ----------------------------------------------------------- |
| `topBackground`    | `string` | `linear-gradient(135deg, #5f27cd, #341f97)` | CSS background for the top layer                            |
| `bottomBackground` | `string` | `linear-gradient(135deg, #ff6b6b, #feca57)` | CSS background for the bottom layer                         |
| `waveHeight`       | `number` | `0.7`                                       | Where the wave starts (0-1 range, e.g., 0.7 = 70% from top) |
| `height`           | `string` | `400px`                                     | Container height (any CSS unit)                             |
| `class`            | `string` | `''`                                        | Additional CSS classes for the container                    |

## Slots

| Slot     | Description                                     |
| -------- | ----------------------------------------------- |
| `top`    | Content rendered in the top (clipped) layer     |
| `bottom` | Content rendered in the bottom (revealed) layer |

## Component Code

```astro
---
interface Props {
  topBackground?: string;
  bottomBackground?: string;
  waveHeight?: number;
  height?: string;
  class?: string;
}

const {
  topBackground = "linear-gradient(135deg, #5f27cd, #341f97)",
  bottomBackground = "linear-gradient(135deg, #ff6b6b, #feca57)",
  waveHeight = 0.7,
  height = "400px",
  class: className = "",
} = Astro.props;

const clipId = `wave-${Math.random().toString(36).slice(2, 9)}`;

const wavePath = `M0,0 L1,0 L1,${waveHeight} Q0.75,${waveHeight + 0.15} 0.5,${waveHeight} Q0.25,${waveHeight - 0.15} 0,${waveHeight} Z`;
---

<div class:list={["wave-section", className]} style={`height: ${height};`}>
  <svg width="0" height="0" aria-hidden="true">
    <defs>
      <clipPath id={clipId} clipPathUnits="objectBoundingBox">
        <path d={wavePath}></path>
      </clipPath>
    </defs>
  </svg>

  <div class="wave-bottom" style={`background: ${bottomBackground};`}>
    <slot name="bottom" />
  </div>

  <div
    class="wave-top"
    style={`background: ${topBackground}; clip-path: url(#${clipId});`}
  >
    <slot name="top" />
  </div>
</div>

<style>
  .wave-section {
    position: relative;
    width: 100%;
  }

  .wave-bottom,
  .wave-top {
    position: absolute;
    inset: 0;
  }

  .wave-bottom {
    z-index: 0;
  }

  .wave-top {
    z-index: 1;
  }
</style>
```

## Understanding the Wave Path

The SVG path creates the wave shape:

```
M0,0                        → Start at top-left
L1,0                        → Line to top-right
L1,0.7                      → Line down to 70% height
Q0.75,0.85 0.5,0.7          → Quadratic curve (down then up)
Q0.25,0.55 0,0.7            → Quadratic curve (up then down)
Z                           → Close path
```

With `clipPathUnits="objectBoundingBox"`, all values are relative (0-1), making it fully responsive.

## Examples

### Hero Section

```astro
<WaveSection
  topBackground="url('/hero-bg.jpg') center/cover"
  bottomBackground="#ffffff"
  waveHeight={0.75}
  height="100vh"
>
  <div slot="top" class="hero-content">
    <h1>My Website</h1>
    <p>Welcome to the future</p>
  </div>
  <div slot="bottom" class="intro">
    <h2>About Us</h2>
  </div>
</WaveSection>
```

### Stacked Sections

```astro
<WaveSection
  topBackground="#1a1a2e"
  bottomBackground="#16213e"
  waveHeight={0.8}
>
  <nav slot="top">...</nav>
  <main slot="bottom">...</main>
</WaveSection>

<WaveSection
  topBackground="#16213e"
  bottomBackground="#0f3460"
  waveHeight={0.6}
>
  <section slot="top">...</section>
  <footer slot="bottom">...</footer>
</WaveSection>
```

## Browser Support

CSS `clip-path` with SVG references is supported in all modern browsers. For older browsers, the top layer will simply display without the wave effect (graceful degradation).

## License

MIT

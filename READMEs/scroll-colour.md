# ScrollColour

Astro component that animates OKLCH color values on scroll, darkening (or lightening) backgrounds based on scroll position.

## Installation

1. Copy `ScrollColour.astro` to your components folder
2. Import and use in your Astro pages

## Usage

```astro
---
import ScrollColour from "./ScrollColour.astro";
---

<ScrollColour
  targetClass="header_astro"
  lumaInitial={0.5286}
  lumaFinal={0}
  chromaInitial={0.1735}
  chromaFinal={0}
  hue="255deg"
  animationRange="0vh 100vh"
/>

<header class="header_astro">
  <!-- Your content -->
</header>
```

## Props

| Prop             | Type   | Required | Default  | Description                                       |
| ---------------- | ------ | -------- | -------- | ------------------------------------------------- |
| `targetClass`    | string | Yes      | -        | CSS class name to apply animation to              |
| `lumaInitial`    | number | Yes      | -        | Starting lightness (0-1, where 0=black, 1=white)  |
| `lumaFinal`      | number | Yes      | -        | Ending lightness                                  |
| `chromaInitial`  | number | Yes      | -        | Starting chroma/saturation (0=gray, higher=vivid) |
| `chromaFinal`    | number | Yes      | -        | Ending chroma                                     |
| `hue`            | string | Yes      | -        | Hue angle (e.g., "255deg", "0.5turn")             |
| `animationRange` | string | No       | "0 100%" | Scroll range for animation                        |

## Examples

### Darken to black in first viewport

```astro
<ScrollColour
  targetClass="hero"
  lumaInitial={0.8}
  lumaFinal={0}
  chromaInitial={0.2}
  chromaFinal={0}
  hue="200deg"
  animationRange="0vh 100vh"
/>
```

### Lighten over 500px scroll

```astro
<ScrollColour
  targetClass="section"
  lumaInitial={0.3}
  lumaFinal={0.9}
  chromaInitial={0.15}
  chromaFinal={0.05}
  hue="120deg"
  animationRange="0px 500px"
/>
```

### Desaturate (keep same lightness)

```astro
<ScrollColour
  targetClass="banner"
  lumaInitial={0.6}
  lumaFinal={0.6}
  chromaInitial={0.25}
  chromaFinal={0}
  hue="45deg"
  animationRange="0vh 50vh"
/>
```

## Animation Range Options

- `"0vh 100vh"` - Completes in first viewport height
- `"0vh 50vh"` - Completes in half viewport
- `"0px 500px"` - Completes after 500px scroll
- `"0 100%"` - Completes over entire page (default)

## Browser Support

Requires:

- CSS Houdini `@property` support
- `animation-timeline: scroll()` support

Supported in Chrome 115+, Edge 115+, Opera 101+. Not yet supported in Firefox/Safari.

## Notes

- OKLCH is a perceptually uniform color space (better than HSL/RGB for smooth animations)
- Lightness (luma): 0 = black, 1 = white
- Chroma: 0 = grayscale, ~0.4 = very saturated
- Component uses `is:global` styles, so animations apply globally to the target class

## Component Code

```astro
---
// ScrollColour.astro
interface Props {
  targetClass: string;
  lumaInitial: number;
  lumaFinal: number;
  chromaInitial: number;
  chromaFinal: number;
  hue: string;
  animationRange?: string;
}

const {
  targetClass,
  lumaInitial,
  lumaFinal,
  chromaInitial,
  chromaFinal,
  hue,
  animationRange = "0 100%",
} = Astro.props;
---

<style
  is:global
  set:html={`
  @property --luma {
    syntax: "<number>";
    initial-value: ${lumaInitial};
    inherits: false;
  }

  @property --chroma {
    syntax: "<number>";
    initial-value: ${chromaInitial};
    inherits: false;
  }

  @keyframes darken {
    to {
      --luma: ${lumaFinal};
      --chroma: ${chromaFinal};
    }
  }

  .${targetClass} {
    background: oklch(var(--luma) var(--chroma) ${hue});
    animation: darken linear;
    animation-timeline: scroll();
    animation-range: ${animationRange};
  }
`}
></style>
```

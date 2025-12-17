# CardAnimate

A scroll-driven animation component for Astro that slides elements into view with alternating left/right directions.

## What it does

- Odd children slide in from the left
- Even children slide in from the right
- Animation is tied to scroll position, not time
- Respects `prefers-reduced-motion`
- Gracefully falls back if `animation-timeline` is unsupported

## Props

| Prop       | Default  | Description                                              |
| ---------- | -------- | -------------------------------------------------------- |
| `end`      | `"50%"`  | Where the animation completes within the `contain` range |
| `distance` | `"50px"` | How far the element slides from                          |
| `class`    | —        | Additional CSS classes                                   |

## Usage

```astro
---
import CardAnimate from "@/components/CardAnimate.astro";
---

<div class="card-list">
  <CardAnimate>Card 1</CardAnimate>
  <CardAnimate>Card 2</CardAnimate>
  <CardAnimate>Card 3</CardAnimate>
</div>

<!-- Custom values -->
<CardAnimate end="30%" distance="100px">Faster, longer slide</CardAnimate>
<CardAnimate end="80%" distance="1rem">Slower, shorter slide</CardAnimate>
```

## Code

```astro
---
interface Props {
  class?: string;
  end?: string;
  distance?: string;
}

const { class: className, end = "50%", distance = "50px" } = Astro.props;
---

<div
  class:list={["card-animate", className]}
  style={`--end: ${end}; --distance: ${distance}`}
>
  <slot />
</div>

<style>
  @keyframes slide-from-left {
    from {
      opacity: 0;
      transform: translateX(calc(var(--distance) * -1));
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slide-from-right {
    from {
      opacity: 0;
      transform: translateX(var(--distance));
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .card-animate {
    @media (prefers-reduced-motion: no-preference) {
      @supports (animation-timeline: view()) {
        animation-timeline: view();
        animation-range: contain 0% contain var(--end);
        animation-fill-mode: both;

        &:nth-child(odd) {
          animation-name: slide-from-left;
        }

        &:nth-child(even) {
          animation-name: slide-from-right;
        }
      }
    }
  }
</style>
```

## How `end` works

The `animation-range: contain 0% contain [end]` means:

- **Start (0%)**: Animation begins when element is fully inside the viewport
- **End**: Animation completes at the specified percentage of the contain range

Lower `end` = faster animation, higher `end` = slower animation.

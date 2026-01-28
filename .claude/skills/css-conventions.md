# CSS Naming and Styling Conventions

## Naming Convention: snake_case

**CRITICAL**: Always use snake_case (underscores) for ALL CSS class names and custom properties.

```css
/* ✅ CORRECT */
.flex_cols
.button_dark
.post_title
.max_width_100ch
.txt_white_on_black
--space_block
--font_family

/* ❌ WRONG */
.flexCols
.button-dark
.post-title
.maxWidth100ch
```

## CSS Architecture: Cascade Layers

This project uses `@layer` directive for explicit cascade control. Layers are defined in priority order (lowest to highest):

```css
@layer reset, tokens, landscape, layout, components, utilities, print;
```

**When adding new styles:**
- Element resets/normalizations → `@layer reset`
- Design tokens (variables) → `@layer tokens`
- Viewport/responsive → `@layer landscape`
- Semantic element styling → `@layer layout`
- Component-specific styles → `@layer components`
- Utility classes → `@layer utilities`
- Print overrides → `@layer print`

**Never use `!important`** - the layer system handles specificity.

## Class Naming Patterns

### 1. Component-Based Naming
```css
.button                    /* Base component */
.button_dark              /* Component modifier */
.button_row               /* Component variation */

.card
.card:hover
.card:focus

.post
.post_title
.post_subtitle
.post_tags
.post_image
.post_content
```

### 2. Utility Classes
```css
/* Layout */
.flex
.flex_cols
.flex_justify_center
.flex_align_center
.relative
.hide

/* Spacing */
.space_block
.space_between
.margin3bottom
.margin_topx2

/* Typography */
.weight100, .weight200, ... .weight900
.capitalize
.uppercase
.small_text
.pretty                   /* text-wrap: pretty */
.max_width_100ch
.max_width_60ch
.reader_friendly

/* Display */
.center
.centred
.centre
```

### 3. Color/Background Classes
```css
/* Text on background combinations */
.txt_white_on_black
.txt_white_on_brand
.txt_black_on_white
.txt_black_on_brand

/* Background colors */
.bg_green
.bg_green_light
.bg_orange
.bg_orange_light
.bg_brand
.bg_brand_light
.bg_white
.bg_black

/* Contrast utilities */
.auto_contrast
.auto_contrast_safe
.auto_contrast_bg

/* Simple color utilities */
.color_black
.color_white
.brand_color
.light_bg
.dark_bg
```

### 4. Animation Classes
```css
.animatio
.animatioSLIDE
.animatio_slide_pulse
.card_anima
.card_static              /* Disables animations */
```

### 5. Contextual/Semantic Classes
```css
.section_height
.section_height_half
.print_only
.clickScrollTrigger
.no_select
.justify
.stretch
```

## Design Tokens (CSS Custom Properties)

### Color System - OKLCH Color Space
Always use OKLCH for colors, never hex/rgb for new colors:

```css
/* Whites */
--white: oklch(0.9624 0.0062 75.41 / 100%);
--whiteOFF
--whiteDIRTY
--whiteT50, --whiteT25, --whiteT15, --whiteT10, --whiteT05  /* Transparency variants */

/* Blacks */
--black: oklch(0 0 0);
--black_fumes: #161616;
--blackT75, --blackT50, --blackT30, --blackT15, --blackT10, --blackT05

/* Brand Colors */
--brand: oklch(0.57 0.24 255 / 100%);
--brand_lighter
--brand_light
--brand_dark
--brandT25, --brandT50, --brandT75

/* Brand Palette (hue-based) */
--jstar-100, --jstar-500, --jstar-675, --jstar-1040
--jgreen-100, --jgreen-500, --jgreen-675, --jgreen-1040
--jorange-100, --jorange-500, --jorange-675, --jorange-1040
```

### Spacing Tokens
```css
--space_block: 1.75rem;
--space_inline: 1.25rem;
--tap_size: 48px;                    /* Touch target minimum */
--safe_padding: env(safe-area-inset-left);  /* TV/device notch support */
```

### Typography Tokens
```css
--font_family: var(--font_variable), -apple-system, BlinkMacSystemFont, ...;
--font_clamp: clamp(18px, 18px + 0.3svw, 28px);
--font_rem: 18px;
--line_height: 1.5;

/* Font weights */
--weight_thinner: 100;
--weight_thin: 200;
--weight: 300;
--weight_med: 400;
--weight_bold: 600;
--weight_heavy: 900;
```

### Responsive Typography
Use clamp with SVH units for fluid typography:

```css
--h1_responsive: 4svh;
--h1_min: 1.75rem;
--h1_max: 4.6svh;

h1 {
  font-size: clamp(var(--h1_min), var(--h1_responsive), var(--h1_max));
  font-weight: var(--h1-weight);
  line-height: 1.1;
  text-transform: uppercase;
}
```

### Sizing Tokens
```css
--windowH: 100svh;
--section_height: 100svh;
--section_height_half: 50svh;
--big_card_width: 27.5svw;
```

### Shadow Tokens
```css
--header_shadow: 0 0.2svh 1svh 0 rgba(0, 0, 0, 0.16);
--card_shadow: 0px 0px 0.2svh 0px rgba(0, 0, 0, 0.12), ...;
--card_shadow_hover: 0px 0px 0.8svh 0px rgba(0, 0, 0, 0.12), ...;
--main_shadow: ...;
```

## Responsive Design

### Breakpoint Tokens
```css
--width_min: 400px;
--width_xs: 480px;
--width_sm: 600px;
--width_md: 820px;
--width_lg: 1024px;
--width_xl: 1280px;
--width_2x: 1420px;
--width_max: 1920px;
```

### Aspect-Ratio Media Queries
Prefer aspect-ratio queries over width breakpoints for layout changes:

```css
@media (min-aspect-ratio: 4/3) { /* landscape */ }
@media (min-aspect-ratio: 16/9) { /* standard landscape */ }
@media (min-aspect-ratio: 1.85/1) { /* wide screens */ }
@media (min-aspect-ratio: 21/9) { /* ultra-wide */ }
@media (min-aspect-ratio: 4/3) and (max-height: 500px) { /* phone landscape */ }
```

### Container Queries
Use container queries for component-level responsiveness:

```css
.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card_title { font-size: 2rem; }
}
```

## Modern CSS Features

### 1. Scroll-Driven Animations
```css
@supports (animation-timeline: view()) {
  .card:not(.card_static) {
    animation: slide-fade-in both;
    animation-timeline: view();
    animation-range: contain 0% contain 50%;
  }
}
```

### 2. Dynamic Color Contrast
```css
@supports (color: contrast-color(red)) {
  .auto_contrast_safe {
    color: contrast-color(var(--bg-color));
  }
}
```

### 3. Nested Selectors
Use nesting for component-scoped styles:

```css
.cover {
  .pretty_heading { padding: 0; }
  .title_wrap > * { padding-inline: var(--space_inline); }
}
```

### 4. GPU Optimization
```css
.animated_element {
  will-change: transform;
  animation: gradient-move 49s ease-in-out infinite;
}
```

## Component Patterns

### Cards
```css
.card {
  position: relative;
  z-index: 10;
  display: block;
  width: 100%;
  cursor: pointer;
  background-color: var(--whiteT50);
  border: 1px solid var(--brand);
  border-radius: var(--radius);
}

.card:focus,
.card:hover {
  box-shadow: var(--card_shadow_hover);
  background-color: var(--white);
}
```

### Buttons
```css
.button {
  display: inline-block;
  height: var(--tap_size);
  width: max-content;
  user-select: none;
  font-weight: var(--weight_med);
}

.button:hover,
.button:focus {
  transform: scale(1.025);
}

.button:active {
  transform: translateY(calc(var(--space_block) * 0.145));
}
```

### Tags
```css
.tag {
  padding: 0.25rem 0.75rem;
  background-color: var(--whiteT25);
  border: 2px solid var(--brand);
  border-radius: calc(var(--radius) / 2);
  font-size: calc(var(--font_rem) * 0.75);
  text-transform: uppercase;
}
```

## Layout Patterns

### Wrapper/Content Container
```css
.wrap {
  padding-inline: max(var(--space_inline), var(--safe_padding));
}

@media (min-width: 820px) {
  .wrap {
    max-width: 650px;
    margin: 0 auto;
  }
}
```

### Grid System
```css
.grid_projects {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space_block) var(--space_inline);
}

@media (min-width: 500px) {
  .grid_projects {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

## Accessibility & Performance

### Motion Preferences
```css
@media (prefers-reduced-motion: no-preference) {
  .card:not(.card_static) {
    animation: slide-fade-in both;
  }
}
```

### Safe Area Support
```css
.tv-safe {
  padding-inline: var(--safe_padding);
}

.tv-safe-all {
  padding: var(--safe_padding);
}
```

## Key Principles

1. **No CSS Framework** - Pure vanilla CSS with modern features
2. **Snake_case Only** - Consistent underscore-separated names
3. **Design Token-Driven** - Use custom properties, not magic numbers
4. **OKLCH Color Space** - Modern perceptually uniform colors
5. **Mobile-First** - Start with mobile, enhance for larger screens
6. **SVH/SVW Units** - Prefer viewport units over px/rem for viewport-relative sizing
7. **Cascade Layers** - Never use `!important`, use layers instead
8. **Container Queries** - Component-level responsiveness
9. **Accessibility First** - Motion preferences, contrast, touch targets
10. **No Preprocessor** - Plain CSS, no SCSS/LESS needed

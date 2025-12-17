# Astro Assets Setup & Organization

## 📁 Correct Asset Structure for Optimization

Keep your assets in `src/` for Astro to optimize them:

```
src/
├── assets/
│   ├── favicons/
│   │   ├── favicon.ico
│   │   ├── apple-touch-icon.png
│   │   └── ...
│   ├── images/
│   │   ├── junglestar_logo.png
│   │   └── ...
│   ├── svgs/
│   │   ├── logo.svg
│   │   ├── icons.svg
│   │   └── ...
│   ├── p/           # Your 'p' folder
│   └── pdf/         # Your PDF files
├── components/
├── layouts/
├── pages/
└── styles/
```

## 🎯 How to Use Assets with Optimization

### 1. **For Images (PNG, JPG, WebP)**

Use Astro's `Image` component and import the image:

```astro
---
// In any .astro file
import { Image } from "astro:assets";
import logo from "@assets/images/junglestar_logo.png";
---

<Image src={logo} alt="Junglestar Logo" />
```

### 2. **For SVGs as Components**

Import SVGs directly as components:

```astro
---
// Option 1: Import as component
import LogoIcon from "@assets/svgs/logo.svg?raw";
---

<!-- Use as HTML -->
<div set:html={LogoIcon} />

<!-- Or import as URL -->
--- import logoUrl from '@assets/svgs/logo.svg'; ---
<img src={logoUrl.src} alt="Logo" />
```

### 3. **For Favicons (Special Case)**

Favicons are an exception - they should go in `public/` because browsers expect them at specific URLs:

```
public/
├── favicon.ico          # Must be at root
└── assets/
    └── favicons/
        ├── apple-touch-icon.png
        ├── favicon-32x32.png
        └── ...
```

## 📝 Update Your Components

### Update Head.astro for Optimized Assets:

```astro
---
// src/components/heads/Head.astro
import { getImage } from "astro:assets";
import ogImageSrc from "@assets/images/junglestar_logo.png";

// Generate optimized OG image
const ogImage = await getImage({
  src: ogImageSrc,
  format: "png",
  width: 1200,
  height: 630,
});

const siteUrl = import.meta.env.SITE || "https://junglestar.org";
const ogImageUrl = new URL(ogImage.src, siteUrl).href;
---

<head>
  <!-- ... other meta tags ... -->

  <!-- Favicons (from public folder) -->
  <link rel="icon" href="/favicon.ico" />
  <link rel="apple-touch-icon" href="/assets/favicons/apple-touch-icon.png" />

  <!-- Open Graph with optimized image -->
  <meta property="og:image" content={ogImageUrl} />
  <!-- ... -->
</head>
```

### Create an SVG Icon Component:

```astro
---
// src/components/SvgIcon.astro
export interface Props {
  name: string;
  class?: string;
  alt?: string;
}

const { name, class: className, alt } = Astro.props;

// Dynamic import based on icon name
const icons = import.meta.glob("@assets/svgs/*.svg", { as: "raw" });
const iconPath = `/src/assets/svgs/${name}.svg`;
const iconContent = await icons[iconPath]?.();
---

{
  iconContent && (
    <div class={className} aria-label={alt} set:html={iconContent} />
  )
}
```

### Update Footer.astro to Use Optimized Assets:

```astro
---
// src/components/footer/Footer.astro
import { Image } from "astro:assets";
import logoImage from "@assets/images/junglestar_logo.png";
import SvgIcon from "./SvgIcon.astro";
// ... rest of imports
---

<footer>
  <a href="/" class="footer_icon">
    <!-- Option 1: Use Image component for PNG logo -->
    <Image src={logoImage} alt="Junglestar Logo" width={100} height={100} />

    <!-- Option 2: Or use SVG component -->
    <SvgIcon name="logo_white" class="logo" alt="Back to homepage" />
  </a>

  <!-- Email icon using SVG component -->
  <SvgIcon name="email" class="email" />

  <!-- ... rest of footer ... -->
</footer>
```

## 🚀 Setup Steps

1. **Create the asset folders:**

```bash
mkdir -p src/assets/{favicons,images,svgs,p,pdf}
```

2. **Move your existing assets:**

```bash
# Move images and SVGs to src/assets
mv your-images/* src/assets/images/
mv your-svgs/* src/assets/svgs/

# Only favicons go to public
mkdir -p public/assets/favicons
mv favicon.ico public/
mv other-favicons/* public/assets/favicons/
```

3. **Update your tsconfig paths** (already done!):

```json
{
  "compilerOptions": {
    "paths": {
      "@assets/*": ["src/assets/*"],
      "@svg/*": ["src/assets/svgs/*"],
      "@p/*": ["src/assets/p/*"],
      "@pdf/*": ["src/assets/pdf/*"]
    }
  }
}
```

## ✅ Benefits of This Approach

- **Automatic optimization**: Astro optimizes images (WebP conversion, lazy loading, sizing)
- **Cache busting**: Filenames are hashed automatically
- **Better performance**: Smaller file sizes, responsive images
- **Type safety**: TypeScript knows about your imports
- **Build-time optimization**: No runtime processing

## 🎨 For Your Existing CSS

Your CSS stays exactly the same! Just make sure background images reference the correct paths:

```css
/* If using background images in CSS */
.site_title:before {
  /* For inline SVGs, keep as data URIs (already done) */
  background-image: url("data:image/svg+xml;...");

  /* For file references, use paths from public folder */
  /* background-image: url("/assets/images/bg.png"); */
}
```

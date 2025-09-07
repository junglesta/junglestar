# Jekyll to Astro Conversion Guide

## Key Conversion Patterns

### 1. Layout Files
**Jekyll:**
```html
<!-- _includes/head.html -->
<title>{{ page.title }}</title>
<meta name="description" content="{% if page.description %}{{ page.description }}{% else %}{{ site.description }}{% endif %}">
```

**Astro:**
```astro
<!-- src/components/Head.astro -->
---
const { title, description = 'Default description' } = Astro.props;
---
<title>{title}</title>
<meta name="description" content={description}>
```

### 2. Component Includes
**Jekyll:**
```html
{% include footer.html %}
{% include svg/use.html id="icn--logo_white" class="logo" %}
```

**Astro:**
```astro
---
import Footer from '@components/Footer.astro';
import SvgIcon from '@components/SvgIcon.astro';
---
<Footer />
<SvgIcon id="icn--logo_white" class="logo" />
```

### 3. Loops and Conditionals
**Jekyll:**
```html
{% for item in site.services %}
  {% if item.footer_listed %}
    <a href="{{ item.url | prepend: site.baseurl }}">{{ item.title }}</a>
  {% endif %}
{% endfor %}
```

**Astro:**
```astro
---
import { getCollection } from 'astro:content';
const services = await getCollection('services');
const footerServices = services.filter(item => item.data.footer_listed);
---
{footerServices.map(item => (
  <a href={`/${item.slug}`}>{item.data.title}</a>
))}
```

### 4. Variables and Filters
**Jekyll:**
```html
{{ site.time | date: '%Y' }}
{{ page.url | replace:'index.html','' | prepend: site.baseurl }}
```

**Astro:**
```astro
---
const currentYear = new Date().getFullYear();
const pageUrl = Astro.url.pathname.replace('index.html', '');
---
{currentYear}
{pageUrl}
```

## Conversion Steps for Your Files

### 1. Create Layout Component (`src/layouts/Layout.astro`)
```astro
---
import Head from '@components/Head.astro';
import Header from '@components/Header.astro';
import Footer from '@components/Footer.astro';
import '@styles/global.css';

const { title, description, language = 'english' } = Astro.props;
---
<!DOCTYPE html>
<html lang="en">
  <Head title={title} description={description} />
  <body>
    <Header language={language} />
    <main class="main">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

### 2. Convert Footer Component (`src/components/Footer.astro`)
```astro
---
import { getCollection } from 'astro:content';
import SvgIcon from '@components/SvgIcon.astro';

const services = await getCollection('services');
const offers = await getCollection('offer');

const footerServices = services.filter(item => item.data.footer_listed);
const footerOffers = offers.filter(item => item.data.footer_listed);

const currentYear = new Date().getFullYear();
const siteEmail = 'info@junglestar.org'; // Move to config
---

<footer class="flex flex_cols flex_align_center flex_justify_center flex_align_content_center">
  <a
    title="clicking this link will send you back to this junglestar.org homepage"
    href="/"
    class="footer_icon action_button back_home">
    <SvgIcon id="icn--logo_white" class="logo" alt="click to go back to the homepage" />
  </a>

  <div class="footer_block">
    <div class="action_title revealed">Junglestar</div>

    <div class="footer_block_pages" role="menu">
      {footerServices.map(item => (
        <a
          class="menu_item center"
          role="menuitem"
          title={item.data.title}
          href={`/${item.collection}/${item.slug}`}>
          <span class="page_title">{item.data.title}</span>
        </a>
      ))}

      {footerOffers.map(item => (
        <a
          class="menu_item center"
          role="menuitem"
          title={item.data.title}
          href={`/${item.collection}/${item.slug}`}>
          <span class="page_title">{item.data.title}</span>
        </a>
      ))}
    </div>

    <div class="footer_block_contacts">
      <a title="send us an email" class="action_button mail" href={`mailto:${siteEmail}`}>
        <span class="action_title revealed">get in touch</span>
        <span class="action_title reveal_on_hover">send email</span>
        <SvgIcon id="icn--email" class="email" />
      </a>

      <div class="flex_item qr white">
        <div class="action_title">phone link</div>
        <SvgIcon id="icn--qr" class="qr" />
      </div>
    </div>

    <div class="footer_block_carbonbadge">
      <div id="wcb" class="carbonbadge"></div>
      <script src="https://unpkg.com/website-carbon-badges@1.1.3/b.min.js" defer></script>
    </div>

    <p class="fontsizefixed centertext">
      &copy; {currentYear} Junglestar.org | All rights reserved
    </p>
  </div>
</footer>
```

### 3. Convert Head Component (`src/components/Head.astro`)
```astro
---
const {
  title,
  description = 'Default site description',
  sitemap = true
} = Astro.props;

const siteUrl = import.meta.env.SITE || 'https://junglestar.org';
const canonicalUrl = new URL(Astro.url.pathname, siteUrl);
---

<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>{title}</title>

{!sitemap && <meta name="robots" content="noindex,nofollow,nosnippet">}

<meta name="description" content={description}>

<!-- Font Loading -->
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="preload" as="style"
      href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@400;600;700&display=swap" />
<link rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@400;600;700&display=swap"
      media="print" onload="this.media='all'" />

<link rel="canonical" href={canonicalUrl}>

<!-- Favicons -->
<link rel="apple-touch-icon" href="/assets/favicons/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicons/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="192x192" href="/assets/favicons/android-chrome-192x192.png">
<link rel="icon" type="image/png" sizes="16x16" href="/assets/favicons/favicon-16x16.png">
<link rel="manifest" href="/assets/favicons/site.webmanifest">
<link rel="mask-icon" href="/assets/favicons/safari-pinned-tab.svg" color="#0069cc">
<link rel="shortcut icon" href="/assets/favicons/favicon.ico">
<meta name="apple-mobile-web-app-title" content="Junglestar">
<meta name="application-name" content="Junglestar">
<meta name="msapplication-TileColor" content="#0069cc">
<meta name="msapplication-TileImage" content="/assets/favicons/mstile-144x144.png">
<meta name="msapplication-config" content="/assets/favicons/browserconfig.xml">
<meta name="theme-color" content="#0069cc">

<!-- Open Graph -->
<meta property="og:locale" content="en">
<meta property="og:type" content="article">
<meta property="og:title" content={title}>
<meta property="og:image" content={`${siteUrl}/assets/junglestar_logo.png`}>
<meta property="og:description" content={description}>
<meta property="og:url" content={canonicalUrl}>
<meta property="og:site_name" content="Junglestar">

<!-- Twitter Cards -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@rokmatwit">
<meta name="twitter:creator" content="@rokmatwit">
<meta name="twitter:image:src" content={`${siteUrl}/assets/junglestar_logo.png`}>
<meta name="twitter:title" content={title}>
<meta name="twitter:description" content={description}>
```

### 4. Convert Intro Component (`src/components/Intro.astro`)
```astro
---
// Import SVG components or use inline SVGs
---

<span class="scrolltarget"></span>
<div class="wrapper wrapper--slim full_height wrapper--vert_pad">
  <a class="section flex flex_cols flex_align_self_start to_design" href="/design/">
    <div class="color_icon blasting_brands">
      <!-- Replace with actual SVG or component -->
      <svg>...</svg>
    </div>

    <div class="section_block">
      <span>
        <h1 class="header_title">It's a Jungle out there.</h1>
        <h2 class="h3 header_title color_white">Can customers reach you?</h2>
        <h3 class="h4 header_title color_white">
          When I google your company name which infos can I get?
        </h3>
      </span>

      <div class="text">
        <p>To get noticed, ones need to be easy, customer-friendly and recognizable.</p>
        <p>Today 60% of internet traffic comes from phones. Is your website ready for that?</p>
        <p>It's never been easier to launch a brand new internet presence.</p>
        <p>
          Needing a landing page or an online shop? Marketing using social media? Tired to try to
          manage it all yourself?
        </p>
        <small class="button button--dark">Know how we design</small>
      </div>
    </div>
  </a>

  <!-- Repeat for other sections... -->
</div>
```

### 5. Create Pages (`src/pages/index.astro`)
```astro
---
import Layout from '@layouts/Layout.astro';
import Intro from '@components/Intro.astro';

const pageTitle = "Junglestar - Web Design & Development";
const pageDescription = "Sustainable Web Design to help fight Climate Change";
---

<Layout title={pageTitle} description={pageDescription}>
  <div class="page_content">
    <Intro />
  </div>
</Layout>
```

### 6. File Structure
```
src/
├── components/
│   ├── Head.astro
│   ├── Header.astro
│   ├── Footer.astro
│   ├── Intro.astro
│   ├── Nav.astro
│   └── SvgIcon.astro
├── layouts/
│   └── Layout.astro
├── pages/
│   ├── index.astro
│   ├── about.astro
│   └── design.astro
├── content/
│   ├── services/
│   ├── offer/
│   ├── product/
│   └── works/
└── styles/
    └── global.css (already done!)
```

## Migration Tips

1. **Content Collections**: Your `content.config.ts` is already set up correctly. Use `getCollection()` to fetch data.

2. **CSS**: Your CSS can stay mostly the same - just import in layouts/components as needed.

3. **Assets**: Move static assets to `public/` folder for direct access.

4. **Dynamic Routes**: For collection pages, create dynamic routes like `src/pages/services/[...slug].astro`.

5. **Site Config**: Create a `src/config.ts` file for site-wide configuration instead of Jekyll's `_config.yml`.

6. **Build Scripts**: Your package.json scripts are already configured for Astro!

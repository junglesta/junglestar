# Quick Deploy Guide - Match junglestar.org

## 🎯 Missing Pages to Create

Based on your live site, create these pages:

### 1. **src/pages/about.astro**
```astro
---
import Layout from '@layouts/Layout.astro';
import Intro from '@components/Intro.astro';
---

<Layout
  title="About Junglestar"
  description="We are a small, flexible web agency"
>
  <div class="wrap">
    <div class="section">
      <h1>About Junglestar</h1>
      <p>We are a small, flexible web agency. We help companies and individuals organise their communication.</p>
      <p>We take care of information architecture, screen design, deploy. We can help develop your Content Marketing Strategy.</p>
      <p>We grow relationships with clients. We design, produce & develop well thought user experiences.</p>
      <p>We've been in the communication business for over 30 years.</p>

      <h2>What We Do</h2>
      <ul>
        <li>Information Architecture</li>
        <li>Screen Design</li>
        <li>Development & Deploy</li>
        <li>Content Marketing Strategy</li>
      </ul>

      <div class="button_row">
        <a href="/contact" class="button">Let's start talking</a>
        <a href="/offer" class="button button_dark">See our packages</a>
      </div>
    </div>
  </div>
</Layout>
```

### 2. **src/pages/design.astro**
```astro
---
import Layout from '@layouts/Layout.astro';
---

<Layout
  title="Design and development - junglestar"
  description="We design and develop websites that work well on all devices"
>
  <div class="wrap">
    <div class="section">
      <h1>Design and Development</h1>
      <p>Your brand will develop a voice, a recognisable style, to organically grow a meaningful followers base quickly.</p>

      <h2>Our Process</h2>
      <p>At Junglestar we design and develop websites and simple web-apps that work well on phones, tablets, laptops and desktops.</p>
      <ol>
        <li>With our client we make a plan</li>
        <li>We study and produce Design Concept</li>
        <li>Once approved, we develop, write the code and deploy it</li>
      </ol>

      <h2>Mobile First</h2>
      <p>Today more than 60% of internet traffic originates from mobile devices. Phone in hand and on the go, users expect your website to be fast, phone-friendly and easy to use.</p>

      <div class="button_row">
        <a href="/offer" class="button">See our packages</a>
      </div>
    </div>
  </div>
</Layout>
```

### 3. **src/pages/content.astro**
```astro
---
import Layout from '@layouts/Layout.astro';
---

<Layout
  title="Content production and management - junglestar"
  description="We help produce your brand communication content"
>
  <div class="wrap">
    <div class="section">
      <h1>Content Production and Management</h1>
      <p>We can help your company produce your brand COMMUNICATION CONTENT.</p>

      <h2>Content Strategy</h2>
      <p>From establishing a meaningful content strategy, to creating the proper memes. Selecting photos, combining product shots and emotional images, copywriting, writing captions and posts text.</p>

      <h2>Social Media Management</h2>
      <p>Today, brands leverage social media channels to grow their audience and drive interest to their website or online shop.</p>
      <p>We offer Social media management service so you can focus on your business, while the plan gets executed.</p>

      <h2>Creative Guidance</h2>
      <p>The Creative Process can indeed be overwhelming. We offer Guidance. We have been managing creative processes in the marketing communication field for more than 25 years.</p>

      <div class="button_row">
        <a href="/contact" class="button">Get Started</a>
      </div>
    </div>
  </div>
</Layout>
```

## 📦 Create Your Three Main Packages

Add these to `/src/content/offer/`:

### **starter-landing.md**
```markdown
---
title: "Starter Landing"
subtitle: "The perfect digital brochure"
description: "Fast-loading landing page with zero maintenance cost"
footer_listed: true
prices_rp: true
product_group: "starter"
---

## What's Included

- Responsive landing page
- Designed for phones... and desktops
- Social media friendly
- SEO optimised
- Domain name
- Hosting on global CDN
- Secure SSL/https
- Sustainable Web Design

**Starting at €490**
```

### **pro-website.md**
```markdown
---
title: "Pro Website"
subtitle: "Clean performant website ready to compete"
description: "Full website with data entry and editing system"
footer_listed: true
prices_rp: true
product_group: "bestseller"
---

## What's Included

- Responsive full website
- Social media friendly
- SEO optimised
- Domain name
- Hosting on global CDN
- Secure SSL/https
- Data entry
- Editing system for collaborators
- Sustainable Web Design

**Starting at €990**
```

### **custom-brand.md**
```markdown
---
title: "Custom Brand"
subtitle: "Special design for your brand"
description: "Well thought user experiences embracing your brand identity"
footer_listed: true
prices_rp: true
product_group: "bestvalue"
---

## What's Included

- Custom brand design
- Responsive full website
- Social media friendly
- SEO optimised
- Domain name
- Hosting on global CDN
- Secure SSL/https
- Complete brand guidelines
- Sustainable Web Design

**Starting at €3,990**
```

## 🚀 Deploy to Production

### Option 1: **Deploy to Netlify** (Easiest)
```bash
# Build your site
pnpm build

# Install Netlify CLI
npm install -g netlify-cli

# Deploy (creates new site)
netlify deploy --prod --dir=dist

# Or link to existing site
netlify init
netlify deploy --prod
```

### Option 2: **Deploy to Cloudflare Pages**
```bash
# Build
pnpm build

# Install Wrangler
npm install -g wrangler

# Deploy
wrangler pages deploy dist --project-name=junglestar
```

### Option 3: **GitHub Pages**
```bash
# Add to astro.config.mjs
export default defineConfig({
  site: 'https://junglestar.org',
  base: '/',
})

# Build
pnpm build

# Push dist folder to gh-pages branch
git add dist -f
git commit -m "Deploy"
git subtree push --prefix dist origin gh-pages
```

## 🔄 Quick Migration Checklist

1. **Create missing pages** ✅
   - [ ] about.astro
   - [ ] design.astro
   - [ ] content.astro
   - [ ] contact.astro (simple contact form)

2. **Add content** ✅
   - [ ] 3 offer packages
   - [ ] Any existing services
   - [ ] Any existing portfolio items

3. **Assets** ✅
   - [ ] Move all images to src/assets/images/
   - [ ] Move SVGs to src/assets/svgs/
   - [ ] favicon.ico to public/

4. **Test locally** ✅
   ```bash
   pnpm build
   pnpm preview
   ```

5. **Deploy** ✅
   - Choose platform (Netlify/Cloudflare/GitHub Pages)
   - Point domain to new host
   - Enable SSL

## 📊 Site Structure Matching junglestar.org

```
/                 ✅ Homepage (done)
/about            ⏳ About page (create above)
/design           ⏳ Design page (create above)
/content          ⏳ Content page (create above)
/offer            ✅ Offers listing (done)
/offer/[slug]     ✅ Individual offers (done)
/services         ✅ Services listing (done)
/services/[slug]  ✅ Individual services (done)
```

## ⚡ Quick Deploy in 10 Minutes

```bash
# 1. Create missing pages
cp the-code-above to respective files

# 2. Build
pnpm build

# 3. Test locally
pnpm preview

# 4. Deploy to Netlify (fastest)
npx netlify-cli deploy --prod --dir=dist

# 5. Point domain
# In Netlify: Add custom domain junglestar.org
```

## 🎯 CSS is Already Perfect!
Your CSS with SVH units and layers is production-ready. No changes needed!

## 🔗 Redirects from Old URLs
Create `public/_redirects` for Netlify:
```
# Preserve old Jekyll URLs
/about.html     /about      301
/design.html    /design     301
/content.html   /content    301
/offer.html     /offer      301
```

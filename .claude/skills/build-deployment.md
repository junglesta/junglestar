# Build and Deployment Configuration

## Package Manager

**Use pnpm exclusively** for all package operations. Never use npm or yarn.

```bash
# ✅ CORRECT
pnpm install
pnpm add package-name
pnpm remove package-name
pnpm dev
pnpm build

# ❌ WRONG
npm install
yarn add package-name
```

**Version:** pnpm 10.28.2
**Lock File:** pnpm-lock.yaml - Never commit package-lock.json or yarn.lock

## npm Scripts Reference

### Development Scripts

```bash
pnpm dev              # Start dev server with browser auto-open (localhost:4321)
pnpm check            # Type checking + dev server in parallel
```

### Code Quality Scripts

```bash
pnpm format           # Auto-format code with Biome
pnpm lint             # Lint code with Biome
```

### Build Scripts

```bash
pnpm build            # Production build (--force flag, fast)
pnpm buildv           # Build with verbose logging
pnpm builddev         # Build with dev output (for debugging)
pnpm buildwithtest    # Full validation: astro check + tsc + build
```

### Preview & Maintenance

```bash
pnpm preview          # Preview production build locally
pnpm upg              # Upgrade Astro framework
pnpm astro            # Direct Astro CLI access
```

## Astro Build Configuration

**File:** `astro.config.mjs`

### Core Settings

```javascript
export default defineConfig({
  output: "static",                    // Static site generation (no SSR)
  site: "https://junglestar.org",     // Production URL
  outDir: "./dist",                   // Build output directory
  build: {
    assets: "_JSTAR",                 // Custom asset prefix (prevents direct browsing)
    format: "directory",              // Directory-based URLs (/about/index.html)
    inlineStylesheets: "always",      // All CSS inlined in <head> (no separate .css files)
  },
  trailingSlash: "never",             // No trailing slashes in URLs
  scopedStyleStrategy: "where",       // :where() selectors (no specificity increase)
});
```

### Image & Prefetch Options

```javascript
{
  image: {
    responsiveStyles: true,           // Generate responsive image CSS
    layout: "full-width",             // Full-width image layout
  },

  prefetch: {
    prefetchAll: true,                // Prefetch all internal links
  },
}
```

### Experimental Features

```javascript
{
  experimental: {
    fonts: [{                         // Google Fonts integration
      provider: fontProviders.google(),
      name: "Source Sans 3",
      weights: [200, 300, 400, 500, 600, 700, 800, 900],
      cssVariable: "--font_variable",
    }],
    chromeDevtoolsWorkspace: true,    // Chrome DevTools workspace support
    svgo: { ... },                    // SVG optimization (see below)
  },
}
```

### Custom Redirects

```javascript
redirects: {
  "/o": "/",                          // Old offer path
  "/_JSTAR": "/",                     // Prevent direct asset access
  "/assets": "/",                     // Legacy assets redirect
}
```

### Vite Configuration

```javascript
vite: {
  build: {
    sourcemap: true,                  // Enable JS sourcemaps
  },
  css: {
    devSourcemap: true,               // Enable CSS sourcemaps in dev
  },
  resolve: {
    alias: {
      "@utils": "/src/utils"          // Path alias
    }
  },
  server: {
    fs: {
      deny: [
        "**/src/_lab/**",             // Restrict lab directory access
        "**/_lab/**"
      ]
    }
  }
}
```

### SVGO Optimization (experimental)

```javascript
experimental: {
  svgo: {
    floatPrecision: 3,                // 3 decimal precision
    multipass: true,                  // Multiple optimization passes
    plugins: [
      "preset-default",
      { name: "removeViewBox", active: false },   // Keep viewBox for responsiveness
      { name: "removeMetadata", active: true },    // Strip metadata
    ],
  },
}
```

## Development Workflow

### Starting Development

```bash
# 1. Install dependencies
pnpm install

# 2. Start dev server
pnpm dev                    # Opens browser automatically at localhost:4321

# 3. Or with type checking
pnpm check                  # Runs astro check --watch & astro dev
```

### Development Features

- **Hot Module Replacement (HMR)** - Instant updates
- **Dev Toolbar** - Astro development tools
- **TypeScript Checking** - Live type validation with `pnpm check`
- **CSS Sourcemaps** - Debug CSS in DevTools
- **File System Restrictions** - `_lab/` directory is denied access

### VS Code Debug Configuration

```json
{
  "command": "./node_modules/.bin/astro dev",
  "name": "Development server",
  "request": "launch",
  "type": "node-terminal"
}
```

## Production Build Workflow

### Quick Build (Standard)

```bash
pnpm build                  # Uses --force flag for clean rebuild
```

### Full Validation Build (Recommended)

```bash
pnpm buildwithtest
```

This runs:
1. `astro check` - Validates TypeScript in Astro components
2. `tsc --noEmit` - Type checking without output
3. `astro build` - Production build

### Build with Debugging

```bash
pnpm buildv                 # Verbose logging
pnpm builddev               # Dev output for debugging
```

### Preview Build Locally

```bash
pnpm build                  # Build first
pnpm preview                # Serve at localhost:4321
```

## Build Output

### Output Structure

```
/dist/                      # Build output (~2.0MB)
  /_JSTAR/                  # Asset directory (JS, images, fonts)
    index.html              # Redirect page (prevents directory browsing)
    /*.js                   # Hashed scripts
    /images/                # Optimized images
  /index.html               # Home page
  /about/index.html         # About page
  /design/index.html        # Design page
  /content/index.html       # Content page
  /offer/index.html         # Offer page
  /services/index.html      # Services page
  /showcase/index.html      # Showcase page
  /discoverability/index.html # Discoverability page
  /robots.txt               # SEO robots file
```

### Asset Handling

- **Asset Prefix:** `_JSTAR/` (custom, not default `_astro/`)
- **Directory Protection:** `/_JSTAR` redirects to `/` (prevents direct browsing)
- **File Naming:** Content-hashed for cache busting
- **Image Optimization:** Automatic via Sharp
- **CSS:** All inlined in `<head>` (no separate CSS files in output)
- **Fonts:** Auto-fetched via experimental Google Fonts integration

## Environment Variables

### Environment Detection

```typescript
import.meta.env.PROD        // true in production
import.meta.env.DEV         // true in development
import.meta.env.MODE        // "production" | "development"
import.meta.env.SITE        // "https://junglestar.org"
```

### Draft Content Filtering

Used in content utilities (`getPosts.ts`, `getMDXPosts.ts`):

```typescript
const posts = await getCollection(collectionName, ({ data }) => {
  return !import.meta.env.PROD || data.draft !== true;
});
```

**Behavior:**
- **Development:** Shows all posts including drafts
- **Production:** Filters out posts with `draft: true`

### Environment Files

```
.env                        # Local development (gitignored)
.env.production             # Production (gitignored)
```

**NEVER commit `.env` files to repository.**

## Deployment Configuration

### Deployment Target

**Platform:** Netlify

**Netlify Settings (Inferred):**
```
Build Command:    pnpm build
Publish Directory: dist
Node Version:     22.19.0 (from .nvmrc)
```

### Netlify State

- Directory: `.netlify/` (gitignored)
- Latest geolocation: Milan, Italy
- No `netlify.toml` in repository (using defaults)

### Deployment Triggers

- Manual push to main branch
- Netlify UI manual deploy
- No CI/CD automation configured

## Dependencies

### Core Dependencies

```json
{
  "astro": "^5.17.1",                 // Core framework
  "@astrojs/mdx": "^4.3.13",          // MDX support
  "@astrojs/check": "^0.9.6",         // Type checking
  "@astrojs/ts-plugin": "^1.10.6",    // IDE integration
  "typescript": "^5.9.3"              // TypeScript
}
```

### Runtime Dependencies

```json
{
  "@astro-community/astro-embed-link-preview": "^0.3.1"  // Link preview embeds
}
```

### Build Tools

```json
{
  "@biomejs/biome": "^2.3.14",        // Linting & formatting
  "prettier": "3.7.4",                // Code formatting
  "prettier-plugin-astro": "0.14.1",  // Astro formatting
  "sharp": "^0.34.5"                  // Image optimization
}
```

### pnpm Workspace Configuration

**File:** `pnpm-workspace.yaml`

```yaml
ignoredBuiltDependencies:
  - sharp                             # Ignore sharp builds

onlyBuiltDependencies:
  - esbuild                           # JS bundler
  - protobufjs                        # Protocol buffers
  - swup                              # Page transitions
```

## Code Quality Enforcement

### Biome Configuration

**File:** `biome.jsonc`

**Formatter:**
```json
{
  "indentStyle": "tab",
  "indentWidth": 2,
  "lineWidth": 100,
  "quoteStyle": "single"
}
```

**Linter Rules:**
- `noConsole`: warn (allows error, warn, info, debug)
- `noUnusedVariables`: error (with `ignoreRestSiblings`)
- `noUnusedFunctionParameters`: error
- `noUnusedImports`: error
- `useImportType`: error (enforces type-only imports)
- `useNodejsImportProtocol`: error

**Overrides:**
- `.astro`, `.vue`, `.svelte` files: formatting disabled, unused vars/imports off

**Run Before Commit:**
```bash
pnpm format                 # Auto-fix formatting
pnpm lint                   # Check for errors
```

### Prettier Configuration

**File:** `.prettierrc.cjs`

```javascript
module.exports = {
  plugins: [require.resolve("prettier-plugin-astro")],
  overrides: [{ files: "*.astro", options: { parser: "astro" } }],
  astroAllowShorthand: true,
  printWidth: 100,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  trailingComma: "all",
};
```

## Content Collections

### Collection Sources

**File:** `src/content.config.ts`

```javascript
// MDX Collections
loader: glob({
  pattern: "**/*.{md,mdx}",
  base: "./src/content/design"
})

// JSON Collections
loader: file("src/data/slogans.json", {
  parser: (text) => JSON.parse(text).intro,
})
```

### Data Files

```
/src/data
  /pricing/                 # Product/offer JSON
    pricing_fullsite.json
    pricing_landingpage.json
    pricing_maintenance.json
    pricing_productimage.json
    pricing_webshop.json
  site.json                 # Site metadata
  slogans.json              # Introduction content
  works.json                # Portfolio data
  works_archive.json        # Archived portfolio
```

## Git Configuration

### Current Branch

```
Branch: master
Main Branch: master (for PRs)
```

### Excluded from Repository (.gitignore)

```
_J25lab/                    # Experimental directory
Icon                        # macOS system file
dist/                       # Build output
node_modules/               # Dependencies
.env                        # Environment variables
.env.production             # Production env
.netlify/                   # Netlify state
npm-debug.log*              # NPM logs
pnpm-debug.log*             # pnpm logs
.DS_Store                   # macOS files
```

## Node.js Version

**File:** `.nvmrc`

```
v22.19.0
```

Use Node Version Manager:
```bash
nvm use                     # Uses version from .nvmrc
```

## Build Optimizations Applied

### Automatic Optimizations

1. **Static Site Generation** - No server runtime
2. **Inline Critical CSS** - Faster First Contentful Paint
3. **Responsive Images** - Automatic srcset generation
4. **SVG Optimization** - SVGO with 3-decimal precision
5. **Content Hashing** - Cache-busting filenames
6. **Link Prefetching** - Faster page transitions
7. **Variable Fonts** - Source Sans 3 (weights 200-900)
8. **Draft Filtering** - Excludes unpublished content in production

### Manual Optimizations

- **Sourcemaps** - Enabled for debugging production issues
- **Custom Asset Directory** - `_JSTAR/` for consistent caching
- **File System Restrictions** - Prevents access to lab directory

## Pre-Build Checklist

Before running production build:

1. ✅ Run `pnpm format` to format code
2. ✅ Run `pnpm lint` to check for errors
3. ✅ Set `draft: false` on content ready to publish
4. ✅ Update content in `/src/content/` and `/src/data/`
5. ✅ Test locally with `pnpm dev`
6. ✅ Run `pnpm buildwithtest` for full validation
7. ✅ Preview with `pnpm preview`
8. ✅ Commit and push to trigger Netlify deploy

## Build Troubleshooting

### TypeScript Errors

```bash
pnpm buildwithtest          # Shows all type errors
astro check                 # Check Astro components only
tsc --noEmit                # Check all TypeScript files
```

### Build Failures

```bash
pnpm buildv                 # Verbose logging
rm -rf dist/ .astro/        # Clean build cache
pnpm build                  # Rebuild
```

### Content Schema Errors

Check `src/content.config.ts` for Zod schema definitions. Ensure all frontmatter matches schema.

### Missing Dependencies

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install                # Fresh install
```

## CI/CD Considerations

**Current Status:** No automated CI/CD

**Future Recommendations:**
1. Add GitHub Actions for automated testing
2. Run `pnpm buildwithtest` on PR creation
3. Run `pnpm lint` and `pnpm format --check` in CI
4. Deploy preview builds for PRs
5. Automated Lighthouse performance tests

## Performance Targets

- **Build Time:** ~4-5 seconds for full build
- **Output Size:** ~2.0MB total
- **Lighthouse Scores:** Aim for 90+ in all categories
- **First Contentful Paint:** <1.5s
- **Time to Interactive:** <3.5s

## Key Principles

1. **pnpm Only** - Never use npm or yarn
2. **Static Generation** - No server-side rendering
3. **Type Safety** - Run `buildwithtest` before deploy
4. **Code Quality** - Format and lint before commit
5. **Environment Separation** - Draft content in dev, published in prod
6. **Asset Optimization** - Automatic image and SVG optimization
7. **Netlify Deployment** - Push to main branch triggers deploy
8. **Node Version** - Always use version from .nvmrc
9. **Clean Builds** - Use `--force` flag for fresh builds
10. **Sourcemaps** - Enabled for production debugging

// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config'
export default defineConfig({
  output: "static",

  // Specify the strategy used for scoping styles within Astro components.
  // Choose from:
  // where - Use :where selectors, causing no specificity increase.
  // class - Use class-based selectors, causing a +1 specificity increase.
  scopedStyleStrategy: "where",

  experimental: {
    chromeDevtoolsWorkspace: true,
  },

  image: {
    responsiveStyles: true,
    layout: "full-width",
  },

  build: {
    assets: "_JSTAR",
    format: "directory",
    inlineStylesheets: "always",
  },

  prefetch: {
    // defaultStrategy: "viewport",
    prefetchAll: true,
  },

  trailingSlash: "never",
  root: "./",
  site: "https://junglestar.org",
  outDir: "./dist",

  devToolbar: {
    // keep the toolbar on in dev; data-astro-* hints show in dev
    enabled: true,
  },

  redirects: {
    // No root hitting for these dir. No index needed. Astro will take care of it.
    "/o": {
      status: 302,
      destination: "/",
    },
  },

  // Sourcemaps in production builds
  vite: {
    build: { sourcemap: true }, // JS sourcemaps
    css: { devSourcemap: true }, // CSS sourcemaps in dev (optional)
    resolve: {
      alias: {
        "@utils": "/src/utils",
      },
    },
    server: {
      fs: {
        deny: ["**/src/_lab/**", "**/_lab/**"],
      },
    },
  },
});

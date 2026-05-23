// @ts-check

import mdx from '@astrojs/mdx';
import { defineConfig, fontProviders, svgoOptimizer } from 'astro/config';

// https://astro.build/config'
export default defineConfig({
	output: 'static',

	// Specify the strategy used for scoping styles within Astro components.
	// Choose from:
	// where - Use :where selectors, causing no specificity increase.
	// class - Use class-based selectors, causing a +1 specificity increase.
	scopedStyleStrategy: 'where',

	fonts: [
		{
			provider: fontProviders.google(),
			name: 'Source Sans 3',
			weights: [200, 300, 400, 500, 600, 700, 800, 900],
			cssVariable: '--font_variable',
			fallbacks: [
				'-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;',
			],
		},
	],

	experimental: {
		chromeDevtoolsWorkspace: true,
		svgOptimizer: svgoOptimizer({
			floatPrecision: 3,
			multipass: true,
			plugins: [
				'preset-default',
				// @ts-expect-error Astro experimental svgo types incomplete
				{ name: 'removeViewBox', active: false },
				// @ts-expect-error Astro experimental svgo types incomplete
				{ name: 'removeMetadata', active: true },
			],
		}),
	},

	image: {
		responsiveStyles: true,
		layout: 'full-width',
	},

	build: {
		assets: '_JSTAR',
		format: 'directory',
		inlineStylesheets: 'always',
	},

	prefetch: {
		// defaultStrategy: "viewport",
		prefetchAll: true,
	},

	trailingSlash: 'never',
	root: './',

	// Enable sitemap generation by setting your URL as site
	site: 'https://junglestar.org',

	outDir: './dist',

	devToolbar: {
		// keep the toolbar on in dev; data-astro-* hints show in dev
		enabled: true,
	},

	integrations: [mdx()],

	redirects: {
		// No root hitting for these dir. No index needed. Astro will take care of it.
		'/o': {
			status: 302,
			destination: '/',
		},
		'/_JSTAR': {
			status: 302,
			destination: '/',
		},
		'/assets': {
			status: 302,
			destination: '/',
		},
	},

	// Sourcemaps in production builds
	vite: {
		build: { sourcemap: true }, // JS sourcemaps
		css: { devSourcemap: true }, // CSS sourcemaps in dev (optional)
		resolve: {
			alias: {
				'@utils': '/src/utils',
			},
		},
		server: {
			fs: {
				deny: ['**/src/_lab/**', '**/_lab/**'],
			},
		},
	},
});

// @ts-check

import mdx from '@astrojs/mdx';
import { defineConfig, fontProviders, svgoOptimizer } from 'astro/config';
import preloadScriptDeps from './integrations/preload-script-deps.mjs';

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
				// Force black stroke/fill → currentColor so icons inherit the page
				// luma colour. Runs at build on the *output* only (source SVGs stay
				// as Illustrator exports), so a re-export that re-hardcodes #000
				// can't regress — it's normalised every build. preset-default runs
				// first and collapses black/#000000 → #000, which this then catches.
				{
					name: 'black-to-currentcolor',
					fn: () => ({
						element: {
							enter: (node) => {
								for (const attr of ['stroke', 'fill']) {
									if (/^(#0{3,6}|black)$/i.test(node.attributes[attr] ?? '')) {
										node.attributes[attr] = 'currentColor';
									}
								}
								if (node.attributes.style) {
									node.attributes.style = node.attributes.style.replace(
										/\b(stroke|fill)\s*:\s*(#0{3,6}\b|black)/gi,
										'$1:currentColor',
									);
								}
							},
						},
					}),
				},
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

	integrations: [mdx(), preloadScriptDeps()],

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
		// @bookbat/* are linked source packages that ship raw TS (extensionless
		// relative imports). Force Vite to process them through its own resolver
		// instead of externalising to Node's ESM loader, which can't resolve
		// `./books` without an extension. Build bundles them already; this fixes dev.
		ssr: {
			noExternal: ['@bookbat/baobab', '@bookbat/library-core'],
		},
		build: {
			sourcemap: true, // JS sourcemaps
			// Vite 8 (Astro 7) switched the default CSS minifier to lightningcss,
			// which chokes on some of this project's CSS ("Unexpected token
			// Ident"). Pin back to esbuild — the Astro 6 / Vite <8 default.
			cssMinify: 'esbuild',
		},
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

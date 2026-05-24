import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Astro integration: collapse the client-script request chain.
 *
 * Astro ships client scripts as a tiny per-page entry that statically imports a
 * shared chunk (e.g. `page.[hash].js` → `index.[hash].js`, the prefetch runtime).
 * The browser only discovers the shared chunk *after* downloading and parsing the
 * stub, producing a serial request chain — Lighthouse's "Avoid chaining critical
 * requests" / network dependency tree.
 *
 * This walks the static imports of every module `<script src>` in each built page
 * and injects a `<link rel="modulepreload">` for the dependencies, so the browser
 * fetches them in parallel with the stub instead of after it. Pure resource hint:
 * no behavioural change to View Transitions (`<ClientRouter />`) or prefetch.
 */
export default function preloadScriptDeps() {
	return {
		name: 'preload-script-deps',
		hooks: {
			'astro:build:done': async ({ dir, logger }) => {
				const outDir = fileURLToPath(dir);
				const htmlFiles = await collectHtml(outDir);
				let touched = 0;

				for (const htmlPath of htmlFiles) {
					let html = await readFile(htmlPath, 'utf8');

					// Module scripts that point at a built chunk (skip inline scripts).
					const scriptSrcs = (html.match(/<script\b[^>]*>/g) ?? [])
						.filter((tag) => /type="module"/.test(tag))
						.map((tag) => tag.match(/\bsrc="([^"]+)"/)?.[1])
						.filter((src) => src?.startsWith('/'));

					// Static deps of those entries, minus chunks already loaded directly.
					const deps = new Set();
					for (const src of scriptSrcs) {
						for (const dep of await staticDeps(outDir, src)) {
							if (!scriptSrcs.includes(dep)) deps.add(dep);
						}
					}

					const links = [...deps]
						.filter((href) => !html.includes(`rel="modulepreload" href="${href}"`))
						.map((href) => `<link rel="modulepreload" href="${href}">`)
						.join('');

					if (links && html.includes('</head>')) {
						await writeFile(htmlPath, html.replace('</head>', `${links}</head>`));
						touched++;
					}
				}

				logger.info(`Injected modulepreload hints into ${touched} page(s)`);
			},
		},
	};
}

/** Recursively collect every .html file under a directory. */
async function collectHtml(dir) {
	const out = [];
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) out.push(...(await collectHtml(full)));
		else if (entry.name.endsWith('.html')) out.push(full);
	}
	return out;
}

/** Read a built chunk and return the site-absolute paths of its static imports. */
async function staticDeps(outDir, src) {
	let code;
	try {
		code = await readFile(path.join(outDir, src), 'utf8');
	} catch {
		return [];
	}

	const fromDir = path.posix.dirname(src);
	const deps = [];
	// Static `import ...from"./x.js"` / `import"./x.js"` / `export ...from"./x.js"`.
	// The negative lookahead skips dynamic `import(...)`; `[^'"]` can't cross a
	// quote, so non-.js specifiers simply fail to match rather than over-reaching.
	const re = /\b(?:import|export)\b(?!\s*\()[^'"]*?["'](\.\.?\/[^'"]+\.js)["']/g;
	for (const m of code.matchAll(re)) {
		deps.push(path.posix.normalize(path.posix.join(fromDir, m[1])));
	}
	return deps;
}

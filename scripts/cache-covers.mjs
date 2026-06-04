// Build-time book-cover cache for the /books page.
//
// Reads src/data/library.json (the source of truth), downloads each cover ONCE
// into public/book-covers/<title-slug>.webp (resized + sharpened via sharp), and
// writes src/data/library.generated.json with coverUrl rewritten to the local
// /book-covers/<title-slug>.webp path. Books whose cover can't be fetched keep
// their original remote URL as a graceful fallback.
//
// ┌─────────────────────────────────────────────────────────────────────────┐
// │ ADD-ONLY — NEVER DELETE COVERS.                                          │
// │ This script ONLY adds covers (it skips any file already on disk) and     │
// │ NEVER removes one. Hand-placed covers are sacred: to fill a missing      │
// │ cover, drop a webp at public/book-covers/<title-slug>.webp (~400px wide) │
// │ and run `pnpm covers` — it's preserved as-is and wired into the data.    │
// │ Do NOT `rm -rf public/book-covers` (you'd wipe hand-uploaded covers).    │
// │ To refresh ONE cover, delete just that single file, then `pnpm covers`.  │
// └─────────────────────────────────────────────────────────────────────────┘
//
// Idempotent: a cover already on disk is used as-is (no network). Run via
// `pnpm covers`; also runs automatically before `pnpm build` (prebuild).

import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "src/data/library.json");
const OUT_DATA = path.join(ROOT, "src/data/library.generated.json");
const COVERS_DIR = path.join(ROOT, "public/book-covers");
const PUBLIC_PREFIX = "/book-covers";

const WIDTH = 400; // cards render covers at ~350px; upscale small sources to fit
const QUALITY = 82;
const CONCURRENCY = 8;
const MIN_BYTES = 1000; // smaller responses are openlibrary's blank placeholder
const TIMEOUT_MS = 15000;

// Where to fetch a book's cover from: an explicit https/http coverUrl wins,
// otherwise derive from ISBN. `?default=false` makes openlibrary 404 on a
// missing cover instead of returning a blank placeholder.
function sourceUrl(book) {
	const u = book.coverUrl;
	if (u && /^https?:\/\//.test(u)) return u.includes("?") ? u : `${u}?default=false`;
	if (book.isbn13)
		return `https://covers.openlibrary.org/b/isbn/${encodeURIComponent(book.isbn13)}-L.jpg?default=false`;
	return null;
}

const stats = { cached: 0, downloaded: 0, missing: 0 };

// Human-friendly file name from the book title (so covers are easy to find on
// disk). Strips accents, lowercases, dashes. Falls back to the id when a title
// has no latin characters (e.g. CJK); collisions get an isbn suffix (see main).
function slugify(value) {
	return String(value || "")
		.normalize("NFKD")
		.replace(/[̀-ͯ]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 80);
}

async function processBook(book, name) {
	if (!name) return book;
	const dest = path.join(COVERS_DIR, `${name}.webp`);
	const localUrl = `${PUBLIC_PREFIX}/${name}.webp`;

	// Any cover already on disk wins — downloaded earlier OR hand-placed by the
	// maintainer for a book openlibrary has no cover for. Never re-fetch/replace.
	if (existsSync(dest)) {
		stats.cached++;
		return { ...book, coverUrl: localUrl };
	}

	const src = sourceUrl(book);
	if (!src) {
		stats.missing++;
		return book;
	}

	try {
		const ctrl = new AbortController();
		const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
		const res = await fetch(src, { redirect: "follow", signal: ctrl.signal });
		clearTimeout(t);
		if (!res.ok) {
			stats.missing++;
			return book; // keep remote fallback
		}
		const buf = Buffer.from(await res.arrayBuffer());
		if (buf.byteLength < MIN_BYTES) {
			stats.missing++;
			return book; // blank placeholder → no real cover
		}
		await sharp(buf)
			.resize({ width: WIDTH, kernel: "lanczos3" })
			.sharpen()
			.webp({ quality: QUALITY })
			.toFile(dest);
		stats.downloaded++;
		return { ...book, coverUrl: localUrl };
	} catch {
		stats.missing++;
		return book; // network/decoder error → keep remote fallback
	}
}

async function main() {
	const data = JSON.parse(await readFile(SRC, "utf8"));
	const books = Array.isArray(data) ? data : data.books || [];
	await mkdir(COVERS_DIR, { recursive: true });

	// Precompute file names once, in stable array order, so they don't shift
	// between runs. Title slug; falls back to id; isbn suffix on collision.
	const seen = new Set();
	const names = books.map((b) => {
		const id = b.isbn13 || b.id || "";
		let name = slugify(b.title) || id;
		if (!name) return "";
		if (seen.has(name)) name = `${name}-${id}`;
		seen.add(name);
		return name;
	});

	const out = new Array(books.length);
	let next = 0;
	async function worker() {
		while (next < books.length) {
			const idx = next++;
			out[idx] = await processBook(books[idx], names[idx]);
		}
	}
	await Promise.all(Array.from({ length: CONCURRENCY }, worker));

	const generated = Array.isArray(data) ? out : { ...data, books: out };
	await writeFile(OUT_DATA, `${JSON.stringify(generated, null, 2)}\n`);

	console.log(
		`📚 covers: ${stats.downloaded} downloaded, ${stats.cached} cached, ${stats.missing} unavailable (kept remote) · ${books.length} books → library.generated.json`,
	);
}

main().catch((err) => {
	console.error("cache-covers failed:", err);
	process.exit(1);
});

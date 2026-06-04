// Build-time book-cover cache for the /books page.
//
// Reads src/data/library.json (the source of truth, with remote cover URLs),
// downloads each cover ONCE into public/book-covers/<isbn>.webp (resized +
// recompressed via sharp), and writes src/data/library.generated.json with
// coverUrl rewritten to the local /book-covers/<isbn>.webp path. Books whose
// cover can't be fetched keep their original remote URL as a graceful fallback.
//
// Idempotent + cached: a cover already on disk is skipped (no network). Delete
// public/book-covers to force a full refresh. Run via `pnpm covers`, and it
// runs automatically before `pnpm build` (see package.json prebuild).

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

const WIDTH = 320; // cover renders ~140-200px; 320 covers retina
const QUALITY = 80;
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

async function processBook(book) {
	const key = book.isbn13 || book.id;
	if (!key) return book;
	const dest = path.join(COVERS_DIR, `${key}.webp`);
	const localUrl = `${PUBLIC_PREFIX}/${key}.webp`;

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
			.resize({ width: WIDTH, withoutEnlargement: true })
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

	const out = new Array(books.length);
	let next = 0;
	async function worker() {
		while (next < books.length) {
			const idx = next++;
			out[idx] = await processBook(books[idx]);
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

// src/utils/slugify.ts
export function slugify(text: string | undefined | null): string {
	if (!text) return "";

	return text
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, "")
		.replace(/[\s_-]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

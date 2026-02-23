// Eager-load all SVGs from content directories as raw strings
const designSvgs = import.meta.glob('/src/content/design/*.svg', {
	eager: true,
	query: '?raw',
	import: 'default',
}) as Record<string, string>;

const productionSvgs = import.meta.glob('/src/content/production/*.svg', {
	eager: true,
	query: '?raw',
	import: 'default',
}) as Record<string, string>;

const allSvgs = { ...designSvgs, ...productionSvgs };

function getBaseName(path: string): string {
	const filename = path.split('/').pop() || '';
	return filename.split('.')[0];
}

/** Match a content collection image field to its raw SVG string */
export function getSvgContent(imageSrc: { src: string; format: string }): string | null {
	if (imageSrc.format !== 'svg') return null;

	const targetBase = getBaseName(imageSrc.src);

	for (const [path, content] of Object.entries(allSvgs)) {
		if (getBaseName(path) === targetBase) return content;
	}
	return null;
}

// src/utils/tags.ts
import { slugify } from './slugify';
import { getMDXPosts } from './getMDXPosts';
import type { MDXPost } from './getMDXPosts';

type ContentCollection = 'designConcepts' | 'productionConcepts';

const collections: { name: ContentCollection; basePath: string }[] = [
	{ name: 'designConcepts', basePath: 'design' },
	{ name: 'productionConcepts', basePath: 'content' },
];

/** Build the href for a tag link. */
export function getTagHref(tag: string): string {
	return `/tag/${slugify(tag)}`;
}

/** Get all unique tags across both collections for getStaticPaths. */
export async function getTagPaths() {
	const tagMap = new Map<
		string,
		{ posts: { post: MDXPost<ContentCollection>; basePath: string }[]; label: string }
	>();

	for (const { name, basePath } of collections) {
		const posts = await getMDXPosts(name);
		for (const post of posts) {
			for (const tag of post.data.tags) {
				const slug = slugify(tag);
				if (!tagMap.has(slug)) {
					tagMap.set(slug, { posts: [], label: tag });
				}
				tagMap.get(slug)!.posts.push({ post, basePath });
			}
		}
	}

	return Array.from(tagMap.entries()).map(([slug, { posts, label }]) => ({
		params: { tag: slug },
		props: { tag: label, posts },
	}));
}

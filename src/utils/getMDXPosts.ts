import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

type ContentCollection = 'designConcepts' | 'productionConcepts';

export type MDXPost<T extends ContentCollection> = CollectionEntry<T>;

export async function getMDXPosts<T extends ContentCollection>(
	collectionName: T,
): Promise<MDXPost<T>[]> {
	const posts = await getCollection(collectionName, ({ data }) => {
		return !import.meta.env.PROD || data.draft !== true;
	});

	posts.sort((a, b) => {
		const orderA = a.data.sort_order ?? 999;
		const orderB = b.data.sort_order ?? 999;
		return orderA - orderB;
	});

	return posts;
}

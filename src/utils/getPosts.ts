import { getCollection, render } from "astro:content";
import type { CollectionEntry } from "astro:content";

type ContentCollection = "designConcepts" | "productionConcepts";

export type RenderedPost<T extends ContentCollection> = CollectionEntry<T> & {
  Content: Awaited<ReturnType<typeof render>>["Content"];
};

export async function getRenderedPosts<T extends ContentCollection>(collectionName: T): Promise<RenderedPost<T>[]> {
  const posts = await getCollection(collectionName, ({ data }) => {
    return !import.meta.env.PROD || data.draft !== true;
  });

  posts.sort((a, b) => {
    const orderA = a.data.sort_order ?? 999;
    const orderB = b.data.sort_order ?? 999;
    return orderA - orderB;
  });

  return Promise.all(
    posts.map(async (post) => {
      const { Content } = await render(post);
      return { ...post, Content };
    }),
  );
}

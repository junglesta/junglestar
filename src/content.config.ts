import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const works = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/works" }),
  schema: z.object({
    title: z.string(),
    category: z.string(),
    tag: z.string(),
    redir: z.string().url(), // The external project URL
    ico_url: z.string().optional(),
    ico_name: z.string().optional(),
    // Add any other fields you need
    featured: z.boolean().default(false),
    order: z.number().optional(),
  }),
});

export const collections = {
  works,
};

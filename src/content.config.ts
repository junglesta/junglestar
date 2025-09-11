import { defineCollection, z } from "astro:content";
import { glob, file } from "astro/loaders";

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

const slogans = defineCollection({
  loader: file("src/data/slogans.json"),
  schema: z.object({
    id: z.string(),
    p1: z.string(),
    p2: z.string().optional().nullable(),
    p3: z.string().optional().nullable(),
    p4: z.string().optional().nullable(),
    p5: z.string().optional().nullable(),
    // Add more if needed
  }),
});

const intro = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/intro" }),
  schema: z.object({
    title: z.string(),
    subtile: z.string(),
    subsubtile: z.string(),
    image: z.string(),
    cta: z.string(),
    link: z.string(),
    theme: z.string(),
  }),
});

const packages = defineCollection({
  loader: file("src/data/packages.json"),
  schema: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      type: z.string().optional(),
      description: z.string(),
      permalink: z.string(),
      question: z.string(),
      publish: z.boolean(),
      bestseller: z.boolean().optional(),
      bestvalue: z.boolean().optional(),
      product: z.object({
        group: z.string(),
        name: z.string(),
        type: z.string(),
        subname: z.string(),
        desc: z.string(),
        starting_at: z.string(),
        starting_at_rp: z.string(),
        starting_at_agent: z.string(),
        agent_gets: z.string(),
        demo_url: z.string().url(),
      }),
      selling_points: z.record(z.string(), z.string()),
    }),
  ),
});

export const collections = {
  works,
  slogans,
  intro,
  packages,
};

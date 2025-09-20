import { defineCollection, z } from "astro:content";
import { glob, file } from "astro/loaders";

// Define the schema for your offer/product JSON structure
const offerSchema = z.object({
  name: z.string(),
  slug: z.string(),
  title: z.string(),
  type: z.string().optional(),
  description: z.string(),
  permalink: z.string(),
  question: z.string(),
  publish: z.boolean(),
  bestseller: z.boolean(),
  bestvalue: z.boolean(),
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
  selling_points: z.record(z.string()),
});

// Define the collections with loaders
const offers = defineCollection({
  loader: glob({
    pattern: "**/*.json",
    base: "./src/data/pricing",
  }),
  schema: offerSchema,
});

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
  schema: (
    { image }, // Get the image helper from the schema function
  ) =>
    z.object({
      title: z.string(),
      subtitle: z.string(),
      tagline: z.string(),
      image: z.object({
        src: image(), // Use image() helper instead of z.string()
        alt: z.string().default("Junglestar"),
      }),
      cta: z.string(),
      link: z.string(),
      theme: z.string(),
    }),
});

const designConcepts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/design" }),
  schema: (
    { image }, // Get the image helper from the schema function
  ) =>
    z.object({
      title: z.string(),
      subtitle: z.string().optional().nullable(),
      draft: z.boolean().optional().default(false),
      image: z
        .object({
          src: image(), // Use image() helper instead of z.string()
          alt: z.string().default("Junglestar"),
        })
        .optional()
        .nullable(),
    }),
});

export const collections = {
  offers,
  works,
  slogans,
  intro,
  designConcepts,
};

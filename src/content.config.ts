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

//M
const works = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/works" }),
  schema: z.object({
    id: z.string(),
    date: z.string(), // or z.coerce.date() if you want Date objects
    title: z.string(),
    subtitle: z.string().optional().nullable(),
    category: z.string(),
    tags: z.array(z.string()),
    url: z.string().url(), // renamed from 'redir'
    icon: z.object({
      url: z.string(),
      name: z.string(),
    }),
    permalink: z.string().optional(),
    description: z.string().optional().nullable(),
  }),
});

const slogans_help = defineCollection({
  loader: file("src/data/slogans_help.json"),
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

const slogans_intro = defineCollection({
  loader: file("src/data/slogans_intro.json"),
  schema: (
    { image }, // Get the image helper from the schema function
  ) =>
    z.object({
      id: z.string(),
      title: z.string(),
      subtitle: z.string(),
      tagline: z.string(),
      // image: z.object({
      //   src: z.string(),
      //   alt: z.string(),
      // }),
      cta: z.string(),
      link: z.string(),
      theme: z.string(),
      p1: z.string(),
      p2: z.string().optional().nullable(),
      p3: z.string().optional().nullable(),
      p4: z.string().optional().nullable(),
      p5: z.string().optional().nullable(),
      p6: z.string().optional().nullable(),
      p7: z.string().optional().nullable(),
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
      sort_order: z.number().optional().nullable(),
      image: z
        .object({
          src: image(), // Use image() helper instead of z.string()
          alt: z.string().default("Junglestar"),
        })
        .optional()
        .nullable(),
    }),
});

// PARSERS!!! Coolio
const introJ = defineCollection({
  loader: file("src/data/slogans.json", { parser: (text) => JSON.parse(text).intro }),
});

const intro = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/intro" }),
  schema: (
    { image }, // Get the image helper from the schema function
  ) =>
    z.object({
      title: z.string(),
      subtitle: z.string().optional().nullable(),
      tagline: z.string().optional().nullable(),
      cta: z.string(),
      link: z.string(),
      theme: z.string(),
      image: z
        .object({
          src: image(), // Use image() helper instead of z.string()
          alt: z.string().default("Junglestar"),
        })
        .optional()
        .nullable(),
      draft: z.boolean().optional().default(false),
    }),
});

export const collections = {
  offers,
  works,
  introJ,
  intro,
  slogans_help,
  slogans_intro,
  designConcepts,
};

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

const site = defineCollection({
  loader: file("src/data/site.json"),
  schema: z.object({
    brand: z.string(),
    description: z.string(),
    keywords: z.string(),
    lang: z.string(),
    email: z.string().email(),
    url: z.string().url(),
    repo: z.string().url(),
    deploy_check: z.string().url(),
    status_badge_markdown_snippet: z.string(),
    license_url: z.string().url(),
    google: z.object({
      analytics: z.string(),
      verification: z.string(),
    }),
    author: z.object({
      name: z.string(),
      email: z.string().email(),
      github: z.string(),
    }),
    brandColorFallback: z.string(),
    bandColor: z.string(),
  }),
});
const slogans = defineCollection({
  loader: file("src/data/slogans.json"),
  schema: z.object({
    offer: z.object({
      question: z.string(),
      sub_question: z.string(),
      answer: z.string(),
      sub_answer: z.string(),
    }),
    cover: z.object({
      line1: z.string(),
      line2: z.string(),
      line3: z.string(),
    }),
    design: z.object({
      question: z.string(),
    }),
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
      name: z.string(),
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
  site,
  slogans,
  intro,
  packages,
};

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

export const collections = {
  works,
  site,
  slogans,
};

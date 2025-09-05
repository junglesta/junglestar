import { defineCollection, z } from "astro:content";

// Schema for pages with standard fields
const pageSchema = z.object({
  title: z.string(),
  description: z.string(),
  language: z.string().default("english"),
  header: z.string().optional(),
  subheader: z.string().optional(),
  svgicon: z.string().optional(),
});

// Schema for offer/services pages with additional fields
const offerSchema = pageSchema.extend({
  subtitle: z.string().optional(),
  product_group: z.string().optional(),
  footer_listed: z.boolean().optional(),
  permalink: z.string().optional(),
  prices_rp: z.boolean().optional(),
  show_agent_prices: z.boolean().optional(),
  slogan: z.string().optional(),
  print_imperatif: z.string().optional(),
  print_title: z.string().optional(),
  print_subtitle: z.string().optional(),
  print_footer: z.string().optional(),
});

// Schema for products
const productSchema = z.object({
  name: z.string(),
  type: z.string().optional(),
  english: z
    .object({
      header: z.string(),
      title: z.string(),
      paragraph1: z.string().optional(),
      paragraph2: z.string().optional(),
      paragraph3: z.string().optional(),
      paragraph4: z.string().optional(),
      paragraph5: z.string().optional(),
      paragraph6: z.string().optional(),
      paragraph7: z.string().optional(),
    })
    .optional(),
  indonesia: z
    .object({
      header: z.string(),
      title: z.string(),
      paragraph1: z.string().optional(),
      paragraph2: z.string().optional(),
      paragraph3: z.string().optional(),
      paragraph4: z.string().optional(),
      paragraph5: z.string().optional(),
      paragraph6: z.string().optional(),
      paragraph7: z.string().optional(),
    })
    .optional(),
});

// Schema for works/portfolio
const worksSchema = z.object({
  title: z.string(),
  category: z.string(),
  tag: z.string().optional(),
  redir: z.string().url().optional(),
  ico_url: z.string().optional(),
  ico_name: z.string().optional(),
  permalink: z.string().optional(),
});

// Define each folder as its own collection
export const collections = {
  about: defineCollection({
    type: "content",
    schema: pageSchema,
  }),
  content: defineCollection({
    type: "content",
    schema: pageSchema,
  }),
  design: defineCollection({
    type: "content",
    schema: pageSchema,
  }),
  offer: defineCollection({
    type: "content",
    schema: offerSchema,
  }),
  product: defineCollection({
    type: "content",
    schema: productSchema,
  }),
  services: defineCollection({
    type: "content",
    schema: offerSchema, // services uses similar fields to offer
  }),
  works: defineCollection({
    type: "content",
    schema: worksSchema,
  }),
};
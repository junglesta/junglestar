import { defineCollection, z } from 'astro:content';
import { file, glob } from 'astro/loaders';

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
	selling_points: z.record(z.string(), z.string()),
});

// Define the collections with loaders
const offers = defineCollection({
	loader: glob({
		pattern: '**/*.json',
		base: './src/data/pricing',
	}),
	schema: offerSchema,
});

const designConcepts = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/design' }),
	schema: (
		{ image }, // Get the image helper from the schema function
	) =>
		z.object({
			title: z.string(),
			subtitle: z.string().optional().nullable(),
			draft: z.boolean().optional().default(false),
			sort_order: z.number().optional().nullable(),
			tags: z.array(z.string()),
			image: z
				.object({
					src: image(), // Use image() helper instead of z.string()
					alt: z.string().default('Junglestar'),
				})
				.optional()
				.nullable(),
		}),
});

const productionConcepts = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/production' }),
	schema: (
		{ image }, // Get the image helper from the schema function
	) =>
		z.object({
			title: z.string(),
			subtitle: z.string().optional().nullable(),
			draft: z.boolean().optional().default(false),
			sort_order: z.number().optional().nullable(),
			tags: z.array(z.string()),
			image: z
				.object({
					src: image(), // Use image() helper instead of z.string()
					alt: z.string().default('Junglestar'),
				})
				.optional()
				.nullable(),
		}),
});

// PARSERS!!! Coolio
const introJ = defineCollection({
	loader: file('src/data/slogans.json', {
		parser: (text) => JSON.parse(text).intro,
	}),
});

// FAQ (about page + FAQPage JSON-LD). Array order = display order: the parser
// stamps each entry's index, since getCollection() doesn't preserve file order.
const faq = defineCollection({
	loader: file('src/data/faq.json', {
		parser: (text) => JSON.parse(text).map((entry: object, order: number) => ({ ...entry, order })),
	}),
	schema: z.object({
		order: z.number(),
		question: z.string(),
		answer: z.array(z.string()), // HTML paragraphs
		open: z.boolean().optional().default(false),
	}),
});

export const collections = {
	offers,
	faq,
	introJ,
	designConcepts,
	productionConcepts,
};

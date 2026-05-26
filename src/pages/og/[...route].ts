// Dynamic Open Graph card generator (astro-og-canvas).
// Every page gets a 1200×630 branded card rendered at build time.
//
// Image keys mirror the page's pathname so Head.astro can derive the matching
// URL from `Astro.url.pathname` (see heads/Head.astro):
//   "/"                 → index            → /og/index.png
//   "/about"            → about            → /og/about.png
//   "/design/<slug>"    → design/<slug>    → /og/design/<slug>.png
//   "/tag/<slug>"       → tag/<slug>       → /og/tag/<slug>.png
import { OGImageRoute } from 'astro-og-canvas';
import { getPostPaths } from '@utils/getMDXPosts';
import { getTagPaths } from '@utils/tags';
import * as siteData from '@data/site.json';

type Card = { title: string; description: string };

// Static (non-collection) pages → punchy card copy.
const staticPages: Record<string, Card> = {
	index: { title: 'Junglestar', description: siteData.description },
	about: {
		title: 'About Junglestar',
		description: 'A small, flexible web agency — 30+ years of communication expertise.',
	},
	services: {
		title: 'Services',
		description: 'We design, code & deploy — packaged solutions and custom builds.',
	},
	showcase: {
		title: 'Showcase',
		description: 'Live projects we built for small enterprises.',
	},
	offer: {
		title: 'Pricing & Offer',
		description: 'Flexible one-stop web agency. Quality at reasonable prices.',
	},
	discoverability: {
		title: 'Be Found',
		description: 'Location, maps & content production — discoverability that works.',
	},
	design: {
		title: 'Communication Design',
		description: 'Sustainable web design to help the planet.',
	},
	content: {
		title: 'Content Production',
		description: 'Your brand narrative — what people remember you for.',
	},
	sty: {
		title: 'Style Guide',
		description: 'Junglestar design system & palette.',
	},
};

// Collection posts + tag pages → drift-free, built from the same path utils
// the real routes use (slug = slugify(title)).
const [designPosts, contentPosts, tagPaths] = await Promise.all([
	getPostPaths('designConcepts'),
	getPostPaths('productionConcepts'),
	getTagPaths(),
]);

const postCard = (slug: string, title: string, subtitle?: string): [string, Card] => [
	slug,
	{ title, description: subtitle?.trim() || siteData.description },
];

const pages: Record<string, Card> = {
	...staticPages,
	...Object.fromEntries(
		designPosts.map((p) =>
			postCard(`design/${p.params.slug}`, p.props.post.data.title, p.props.post.data.subtitle),
		),
	),
	...Object.fromEntries(
		contentPosts.map((p) =>
			postCard(`content/${p.params.slug}`, p.props.post.data.title, p.props.post.data.subtitle),
		),
	),
	...Object.fromEntries(
		tagPaths.map((t) => [
			`tag/${t.params.tag}`,
			{ title: `#${t.props.tag}`, description: `Posts tagged “${t.props.tag}”` },
		]),
	),
};

export const { getStaticPaths, GET } = await OGImageRoute({
	param: 'route',
	pages,
	getImageOptions: (_path, page: Card) => ({
		// Uppercase the rendered title (FontConfig has no text-transform option).
		title: page.title.toUpperCase(),
		description: page.description,
		// Transparent (no-background) white logo, much larger than before.
		// Rasterised from logo_stroke.svg → public/assets/og_logo.png.
		logo: { path: './public/assets/og_logo.png', size: [230] },
		// Brand-blue gradient (deep → --brand) for one cohesive identity.
		bgGradient: [
			[3, 28, 68],
			[0, 105, 204],
		],
		padding: 64,
		font: {
			// Thin uppercase headline, matching the website's light heading weight.
			title: { color: [255, 255, 255], weight: 'Light', size: 94, lineHeight: 1.05 },
			description: { color: [219, 231, 247], weight: 'Normal', size: 34, lineHeight: 1.3 },
		},
		fonts: ['./src/assets/fonts/SourceSans3.ttf'],
		format: 'PNG',
	}),
});

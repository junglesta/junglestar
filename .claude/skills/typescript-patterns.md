# TypeScript Patterns and Conventions

## TypeScript Configuration

**Version:** TypeScript 5.9.3
**Base Config:** Extends `astro/tsconfigs/strict`

### Path Aliases (tsconfig.json)

Always use path aliases for imports. Never use relative paths beyond the same directory.

```typescript
// ✅ CORRECT
import { getMDXPosts } from "@utils/getMDXPosts";
import Logo from "@components/UI/Logo.astro";
import BaseLayout from "@layouts/Base.astro";
import "@styles/global.css";

// ❌ WRONG
import { getMDXPosts } from "../../utils/getMDXPosts";
import Logo from "../components/UI/Logo.astro";
```

**Available Path Aliases:**
```typescript
@root/*          → src/*
@components/*    → src/components/*
@layouts/*       → src/layouts/*
@utils/*         → src/utils/*
@styles/*        → src/styles/*
@assets/*        → src/assets/*
@data/*          → src/data/*
@footer/*        → src/components/footer/*
@fav/*           → src/assets/favicons/*
@p/*             → src/assets/p/*
@pdf/*           → src/assets/pdf/*
@svgs/*          → src/assets/svgs/*
@intro/*         → src/assets/intro/*
```

## Import Patterns

### Type-Only Imports

**CRITICAL:** Always use `import type` for type-only imports. Biome enforces this with `useImportType: error`.

```typescript
// ✅ CORRECT
import type { CollectionEntry } from "astro:content";
import type { MDXPost } from "@utils/getMDXPosts";
import type { Props } from "./types";

// ❌ WRONG
import { CollectionEntry } from "astro:content";  // If only used as type
```

### Mixed Imports

Separate type and value imports:

```typescript
// ✅ CORRECT
import { getCollection, render } from "astro:content";
import type { CollectionEntry } from "astro:content";

// Also acceptable for single type
import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
```

## Content Collection Schemas (Zod)

### Basic Schema Pattern

Use Zod for all content validation in `content.config.ts`:

```typescript
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const myCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/mycollection" }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional().nullable(),
    draft: z.boolean().optional().default(false),
    sort_order: z.number().optional().nullable(),
    tags: z.array(z.string()),
  }),
});
```

### Schema with Image Helper

For schemas with images, use the schema function form:

```typescript
const designConcepts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/design" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      image: z
        .object({
          src: image(),
          alt: z.string().default("Junglestar"),
        })
        .optional()
        .nullable(),
    }),
});
```

### Nested Object Schemas

For complex data structures:

```typescript
const offerSchema = z.object({
  name: z.string(),
  slug: z.string(),
  title: z.string(),
  type: z.string().optional(),
  description: z.string(),
  permalink: z.string(),
  publish: z.boolean(),
  bestseller: z.boolean(),
  product: z.object({
    group: z.string(),
    name: z.string(),
    type: z.string(),
    subname: z.string(),
    desc: z.string(),
    starting_at: z.string(),
    demo_url: z.string().url(),  // URL validation
  }),
  selling_points: z.record(z.string()),  // Key-value pairs
});
```

### File Loader with Custom Parser

For JSON data with custom parsing:

```typescript
import { file } from "astro/loaders";

const introJ = defineCollection({
  loader: file("src/data/slogans.json", {
    parser: (text) => JSON.parse(text).intro,  // Extract nested data
  }),
});
```

### Common Zod Patterns

```typescript
// Optional with nullable
z.string().optional().nullable()

// Default values
z.boolean().optional().default(false)

// Arrays
z.array(z.string())

// URL validation
z.string().url()

// Record (key-value map)
z.record(z.string())

// Enums
z.enum(["design", "production", "marketing"])

// Numbers with constraints
z.number().min(0).max(100)
z.number().int().positive()
```

## Generic Type Patterns

### Generic Functions with Constraints

Use generic constraints for reusable collection utilities:

```typescript
import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

type ContentCollection = "designConcepts" | "productionConcepts";

export type MDXPost<T extends ContentCollection> = CollectionEntry<T>;

export async function getMDXPosts<T extends ContentCollection>(
  collectionName: T,
): Promise<MDXPost<T>[]> {
  const posts = await getCollection(collectionName, ({ data }) => {
    return !import.meta.env.PROD || data.draft !== true;
  });

  posts.sort((a, b) => {
    const orderA = a.data.sort_order ?? 999;
    const orderB = b.data.sort_order ?? 999;
    return orderA - orderB;
  });

  return posts;
}
```

**Key Patterns:**
- `<T extends ContentCollection>` - Constrains generic to union type
- `Promise<MDXPost<T>[]>` - Returns typed promise
- `??` - Null coalescing operator for defaults

### Advanced Generics with Type Intersection

For extending types with additional properties:

```typescript
import { render } from "astro:content";
import type { CollectionEntry } from "astro:content";

type ContentCollection = "designConcepts" | "productionConcepts";

// Intersection type combining base + extensions
export type RenderedPost<T extends ContentCollection> = CollectionEntry<T> & {
  Content: Awaited<ReturnType<typeof render>>["Content"];
};

export async function getRenderedPosts<T extends ContentCollection>(
  collectionName: T,
): Promise<RenderedPost<T>[]> {
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
      return { ...post, Content };  // Spread for type extension
    }),
  );
}
```

**Advanced Patterns:**
- `Type1 & Type2` - Type intersection
- `Awaited<ReturnType<typeof fn>>` - Extract async return types
- `Promise.all()` - Parallel async operations
- `{ ...obj, newProp }` - Spread for type extension

## Component Props Interfaces

### Basic Props Interface

Every Astro component should have a Props interface:

```typescript
// Simple props
interface Props {
  color: string;
  position?: "top" | "bottom";
  height?: string;
}

const { color, position = "top", height = "100px" } = Astro.props;
```

### Complex Props with Nested Objects

```typescript
interface Props {
  id: string;
  title: string;
  subtitle?: string | null;
  tags: string[];
  url: string;
  icon?: {
    url: string;
    name: string;
  };
}
```

### Props with Union Types

```typescript
interface Props {
  variant: "top" | "bottom" | "default";
  size?: "sm" | "md" | "lg";
  align?: "left" | "center" | "right";
}
```

### Props with Imported Types

```typescript
import type { MDXPost } from "@utils/getMDXPosts";

interface Props {
  posts: MDXPost<"designConcepts" | "productionConcepts">[];
  title?: string;
}
```

### Props with Catch-All (Rest Props)

For components that pass through unknown props:

```typescript
interface Props {
  backgroundColor?: string;
  class?: string;
  tag?: string;
  id?: string;
  style?: string;
  [key: string]: any;  // Flexible catch-all for pass-through props
}
```

### Exported Props Interfaces

Export interfaces when used by multiple components:

```typescript
export interface Props {
  variant: "top" | "bottom";
}
```

## Utility Function Patterns

### String Utilities

```typescript
export function slugify(text: string | undefined | null): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
```

**Pattern:** Accept nullable inputs, return non-null with guard clause.

### DOM Utilities with Explicit Return Types

```typescript
export function openExternalLinksInNewWindow(): void {
  const links = document.links;
  for (let i = 0; i < links.length; i++) {
    if (links[i].hostname !== window.location.hostname) {
      if (!links[i].target || links[i].target !== "_blank") {
        links[i].target = "_blank";
      }
      if (!links[i].rel || !links[i].rel.includes("noopener")) {
        links[i].rel = "noreferrer noopener";
      }
      if (!links[i].classList.contains("open_in_new_window")) {
        links[i].classList.add("open_in_new_window");
      }
    }
  }
}

export function markMailtoLinks(): void {
  const links = document.querySelectorAll('a[href^="mailto:"]');
  links.forEach((link) => {
    if (!link.classList.contains("mailto_link")) {
      link.classList.add("mailto_link");
    }
  });
}
```

**Patterns:**
- Explicit `: void` return type
- Guard clauses for safety
- DOM type inference

### Event Handlers with Typed Events

```typescript
export function initPopipasta(siteName: string, siteUrl: string): void {
  const currentYear = new Date().getFullYear();

  document.oncopy = (e: ClipboardEvent): void => {
    const selection = window.getSelection();
    if (!selection || selection.toString().length < 30) return;

    const range = selection.getRangeAt(0);
    const clonedContent = range.cloneContents();

    // ... attribution logic

    e.preventDefault();
    e.clipboardData?.setData("text/plain", plainText);
    e.clipboardData?.setData("text/html", wrapper.innerHTML);
  };
}
```

**Patterns:**
- Typed event parameters: `(e: ClipboardEvent)`
- Optional chaining: `?.setData()`
- Early returns for validation

## Type Organization

### File Structure

```
/src
├── /utils
│   ├── getMDXPosts.ts       # Generic collection utilities
│   ├── getPosts.ts          # Generic rendering utilities
│   ├── el.ts                # DOM utilities
│   ├── slugify.ts           # String utilities
│   └── popipasta.ts         # Event handler utilities
├── content.config.ts        # Content schemas (Zod)
└── /components
    └── *.astro              # Props interfaces inline
```

### Export Patterns

**Named Exports for Types:**
```typescript
export type MDXPost<T extends ContentCollection> = CollectionEntry<T>;
export type RenderedPost<T extends ContentCollection> = CollectionEntry<T> & { ... };
```

**Named Exports for Functions:**
```typescript
export async function getMDXPosts<T extends ContentCollection>(...) { ... }
export function slugify(text: string): string { ... }
```

**Default Exports for Config:**
```typescript
// astro.config.mjs
export default defineConfig({ ... });

// content.config.ts
export const collections = { ... };
```

## Common TypeScript Patterns Reference

| Pattern | Example | Use Case |
|---------|---------|----------|
| **Generic Constraints** | `<T extends CollectionType>` | Limit generic to specific types |
| **Type Intersection** | `TypeA & TypeB` | Combine multiple types |
| **Union Types** | `"a" \| "b" \| "c"` | Limit to specific values |
| **Optional Chaining** | `obj?.prop?.method()` | Safe property access |
| **Null Coalescing** | `value ?? defaultValue` | Default for null/undefined |
| **Type Guards** | `if (!value) return` | Runtime type narrowing |
| **Awaited Types** | `Awaited<ReturnType<typeof fn>>` | Extract async return types |
| **Record Types** | `Record<string, number>` | Key-value maps |
| **Literal Types** | `type Dir = "up" \| "down"` | String/number literals |
| **Index Signatures** | `[key: string]: any` | Dynamic property names |

## Environment Variables

Use `import.meta.env` for environment detection:

```typescript
// Development vs Production filtering
const posts = await getCollection(collectionName, ({ data }) => {
  return !import.meta.env.PROD || data.draft !== true;
});

// Available env variables
import.meta.env.PROD      // true in production
import.meta.env.DEV       // true in development
import.meta.env.MODE      // "production" | "development"
import.meta.env.SITE      // Site URL from astro.config
```

## Biome Linting Rules

These rules are enforced in the project:

```typescript
// ✅ CORRECT - Type-only imports
import type { Props } from "./types";

// ❌ ERROR - useImportType
import { Props } from "./types";

// ✅ CORRECT - No unused variables
const { title, subtitle } = data;

// ❌ ERROR - noUnusedVariables
const { title, subtitle, unused } = data;

// ✅ CORRECT - Node.js import protocol
import fs from "node:fs";

// ❌ ERROR - useNodejsImportProtocol
import fs from "fs";
```

## Code Quality Checklist

Before committing TypeScript code:

1. ✅ Use path aliases (`@utils/`, `@components/`, etc.)
2. ✅ Separate type imports with `import type`
3. ✅ Add Props interface to all Astro components
4. ✅ Use generic constraints for collection utilities
5. ✅ Provide explicit return types for functions
6. ✅ Use null coalescing (`??`) instead of `||` for defaults
7. ✅ Use optional chaining (`?.`) for safe property access
8. ✅ Add Zod schemas for all content collections
9. ✅ Export types that are used across files
10. ✅ Run `pnpm buildwithtest` to validate types

## Auto-Generated Types

Astro automatically generates types in `.astro/content.d.ts`. Never edit this file manually.

Access generated types:
```typescript
import type { CollectionEntry, CollectionKey } from "astro:content";

// Get entry type for specific collection
type DesignEntry = CollectionEntry<"designConcepts">;

// Access data schema
type DesignData = DesignEntry["data"];
```

## Key Principles

1. **Strict Mode** - Use Astro's strict TypeScript config
2. **Path Aliases** - Never use relative imports beyond same directory
3. **Type Separation** - Always use `import type` for types
4. **Generic Utilities** - Use generics for reusable collection functions
5. **Zod Validation** - All content schemas use Zod for runtime safety
6. **Explicit Returns** - Always specify return types for functions
7. **Props Interfaces** - Every component has a Props interface
8. **No Any** - Avoid `any` except for catch-all props (`[key: string]: any`)
9. **Optional Safety** - Use `?.` and `??` for null safety
10. **Auto-Generation** - Leverage Astro's auto-generated types

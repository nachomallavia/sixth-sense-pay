import { defineCollection } from "astro:content"
import { glob } from "astro/loaders"
import { z } from "astro/zod"

const legal = defineCollection({
	loader: glob({ base: "./src/content/legal", pattern: "**/*.md" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		locale: z.enum(["en", "es"]),
		document: z.enum(["privacy-policy", "terms-of-service"]),
		effectiveDate: z.coerce.date(),
	}),
})

export const collections = { legal }

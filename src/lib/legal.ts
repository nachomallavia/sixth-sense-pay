import { getCollection, type CollectionEntry } from "astro:content"

export type LegalDocument = "privacy-policy" | "terms-of-service"
export type LegalLocale = "en" | "es"

/** Official legal locales today. hr/bs/sr fall back to English. */
export function resolveLegalLocale(locale: string | undefined): LegalLocale {
	return locale === "es" ? "es" : "en"
}

export async function resolveLegalDoc(
	document: LegalDocument,
	locale: string | undefined,
): Promise<CollectionEntry<"legal">> {
	const legalLocale = resolveLegalLocale(locale)
	const entries = await getCollection(
		"legal",
		(entry) =>
			entry.data.document === document && entry.data.locale === legalLocale,
	)

	const entry = entries[0]
	if (!entry) {
		throw new Error(
			`Missing legal document "${document}" for locale "${legalLocale}"`,
		)
	}

	return entry
}

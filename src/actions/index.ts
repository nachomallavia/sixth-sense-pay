import { defineAction } from 'astro:actions';
import type { Astro } from 'astro';
import { z } from 'astro:schema';
import i18nContent from "@/i18n/content.json"
export const server = {
  getLocaleContent: defineAction({
    input: z.object({locale: z.string()}),
    handler: async ( input, context ) => {

        return { i18n: i18nContent[input.locale as keyof typeof i18nContent]}
    }
  }),
  setLocale: defineAction({
    input: z.string(),
    handler: async ( input: string, context: Astro.Context ) => {
        try {
            context.session?.set('locale', input)
            const check = await context.session?.get('locale')
            console.log('locale set to', input, 'and check is', check)
        } catch (error) {
            console.error('error setting locale', error)
            return { success: false }
        }    finally {
            return { success: true }
        }
       



    },
  }),
}
import { defineAction } from 'astro:actions';
import type { Astro } from 'astro';
import { db, ContactFormSubmission } from 'astro:db';
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
  // Basic contact form action
  sendContactForm: defineAction({
    accept:'form',
    input: z.object({
      name: z.string(),
      email: z.string(),
      message: z.string().optional(),
    }),
    handler: async ( input, context ) => {
      console.log('sending contact form', input)
      try {
        const insert = await db.insert(ContactFormSubmission).values(input).returning();
        
        console.log('insert', insert)
        return { success: true, data: insert }
      } catch (error) {
        console.error('error inserting contact form submission', error)
        return { success: false, error: error }
      }
    }
  }),
}
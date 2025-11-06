import { defineAction } from 'astro:actions';
import type { Astro } from 'astro';
import { db, ContactFormSubmission } from 'astro:db';
import { z } from 'astro:schema';
import { Resend } from 'resend';
import i18nContent from "@/i18n/content.json"
import { FormSubmitEmail } from "@/emails/formSubmitEmail";
import { FormSubmitThankYouEmail } from "@/emails/formSubmitThankYouEmail";
import { render } from "@react-email/components";
const resend = new Resend(process.env.RESEND_API_KEY);

const localesContent = {
  "en":{
    thankYouEmailSubject: 'Thank you for your message',
    thankYouEmailText: 'We received your message and will be in touch with you soon.',
    contactFormSubmissionSubject: 'Contact Form Submission',
  },
  "es":{
    thankYouEmailSubject: 'Gracias por tu mensaje',
    thankYouEmailText: 'Recibimos tu mensaje y nos pondremos en contacto contigo pronto.',
    contactFormSubmissionSubject: 'Nuevo ingreso de formulario de contacto',
  }
}

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
      email: z.string().email(),
      message: z.string().optional(),
      locale: z.string(),
    }),
    handler: async ( input, context ) => {
      const content = localesContent[input.locale as keyof typeof localesContent]
      console.log('sending contact form', input)
      const thankYouEmailHtml = await render(FormSubmitThankYouEmail({
        url: 'https://www.6sense.com',
        name: input.name,
        email: input.email,
        message: input.message || '',
        locale: input.locale,
      }))
      const thankYouEmailText = await render(FormSubmitThankYouEmail({
        url: 'https://www.6sense.com',
        name: input.name,
        email: input.email,
        message: input.message || '',
        locale: input.locale,
      }),{plainText: true})
      const emailHtml = await render(FormSubmitEmail({
        url: 'https://www.6sense.com',
        name: input.name,
        email: input.email,
        message: input.message || '',
        locale: input.locale,
      }))
      const emailText = await render(FormSubmitEmail({
        url: 'https://www.6sense.com',
        name: input.name,
        email: input.email,
        message: input.message || '',
        locale: input.locale,
      }),{plainText: true})
      try {
        const insert = await db.insert(ContactFormSubmission).values(input).returning();
        if (insert) {
          const email = await resend.emails.send({
            from: 'dev@blockspage.com',
            to: 'nachomallavia@gmail.com',
            subject: content.contactFormSubmissionSubject,
            html: emailHtml,
            text: emailText,
          })
          const thankYouEmail = await resend.emails.send({
            from: 'dev@blockspage.com',
            to: input.email,
            subject: content.thankYouEmailSubject,
            html: thankYouEmailHtml,
            text: thankYouEmailText,
          })
        }
        console.log('insert', insert)
        return { success: true, data: insert }
      } catch (error) {
        console.error('error inserting contact form submission', error)
        return { success: false, error: error }
      }
    }
  }),
}
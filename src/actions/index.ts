import { defineAction } from 'astro:actions';
import { db, ContactFormSubmission } from 'astro:db';
import { z } from 'astro:schema';
import { Resend } from 'resend';
import i18nContent from "@/i18n/content.json"
import { FormSubmitEmail } from "@/emails/formSubmitEmail";
import { FormSubmitThankYouEmail } from "@/emails/formSubmitThankYouEmail";
import { AccountDeletionEmail } from "@/emails/accountDeletionEmail";
import { render } from "@react-email/components";
const resend = new Resend(process.env.RESEND_API_KEY);

const MAX_ID_DOCUMENT_BYTES = 4 * 1024 * 1024;
const ALLOWED_ID_DOCUMENT_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];
const ALLOWED_ID_DOCUMENT_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".pdf"];

function isAllowedIdDocument(file: File) {
  if (ALLOWED_ID_DOCUMENT_TYPES.includes(file.type)) return true;
  const name = file.name.toLowerCase();
  return ALLOWED_ID_DOCUMENT_EXTENSIONS.some((ext) => name.endsWith(ext));
}

function isInlineImageDocument(file: File) {
  if (["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)) return true
  return /\.(jpe?g|png|webp)$/i.test(file.name)
}

function sanitizeFilename(name: string) {
  const cleaned = name.replace(/[^\w.\-]+/g, "_").replace(/^\.+/, "");
  return cleaned || "id-document";
}

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
        url: 'https://www.sixthsensepay.com',
        name: input.name,
        email: input.email,
        message: input.message || '',
        locale: input.locale,
      }))
      const thankYouEmailText = await render(FormSubmitThankYouEmail({
        url: 'https://www.sixthsensepay.com',
        name: input.name,
        email: input.email,
        message: input.message || '',
        locale: input.locale,
      }),{plainText: true})
      const emailHtml = await render(FormSubmitEmail({
        url: 'https://www.sixthsensepay.com',
        name: input.name,
        email: input.email,
        message: input.message || '',
        locale: input.locale,
      }))
      const emailText = await render(FormSubmitEmail({
        url: 'https://www.sixthsensepay.com',
        name: input.name,
        email: input.email,
        message: input.message || '',
        locale: input.locale,
      }),{plainText: true})
      try {
        const insert = await db.insert(ContactFormSubmission).values(input).returning();
        if (insert) {
          const email = await resend.emails.send({
            from: 'dev@sixthsensepay.com',
            to: 'soporte@sixthsensepay.com',
            subject: content.contactFormSubmissionSubject,
            html: emailHtml,
            text: emailText,
          })
          const thankYouEmail = await resend.emails.send({
            from: 'welcome@sixthsensepay.com',
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
  sendAccountDeletionRequest: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string().trim().min(1),
      email: z.string().email(),
      locale: z.string(),
      idDocument: z
        .instanceof(File)
        .refine((file) => file.size > 0, { message: 'required' })
        .refine((file) => file.size <= MAX_ID_DOCUMENT_BYTES, { message: 'too_large' })
        .refine((file) => isAllowedIdDocument(file), { message: 'invalid_type' }),
    }),
    handler: async (input) => {
      const subjects: Record<string, string> = {
        en: 'Account deletion request',
        es: 'Solicitud de baja de cuenta',
        hr: 'Zahtjev za brisanje računa',
        bs: 'Zahtjev za brisanje računa',
        sr: 'Zahtev za brisanje naloga',
      }
      const filename = sanitizeFilename(input.idDocument.name)
      const inlineDocumentCid = isInlineImageDocument(input.idDocument) ? "id-document" : undefined
      const emailHtml = await render(AccountDeletionEmail({
        name: input.name,
        email: input.email,
        locale: input.locale,
        filename,
        inlineDocumentCid,
      }))
      const emailText = await render(AccountDeletionEmail({
        name: input.name,
        email: input.email,
        locale: input.locale,
        filename,
        inlineDocumentCid,
      }), { plainText: true })

      try {
        const attachmentContent = Buffer.from(await input.idDocument.arrayBuffer())
        const contentType = input.idDocument.type || undefined
        const attachments = [
          {
            filename,
            content: attachmentContent,
            contentType,
          },
          ...(inlineDocumentCid
            ? [
                {
                  filename,
                  content: attachmentContent,
                  contentType,
                  contentId: inlineDocumentCid,
                },
              ]
            : []),
        ]
        const { data, error } = await resend.emails.send({
          from: 'dev@sixthsensepay.com',
          to: 'soporte@sixthsensepay.com',
          replyTo: input.email,
          subject: subjects[input.locale] || subjects.es,
          html: emailHtml,
          text: emailText,
          attachments,
        })

        if (error || !data) {
          console.error('error sending account deletion email', error)
          return { success: false, error: 'send_failed' }
        }

        return { success: true }
      } catch (error) {
        console.error('error sending account deletion request', error)
        return { success: false, error: 'send_failed' }
      }
    }
  }),
}
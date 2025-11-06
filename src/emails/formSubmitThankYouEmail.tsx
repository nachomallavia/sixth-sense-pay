import * as React from 'react';
import { Html, Button, Head, Body, Heading, Text, Link, Container, Img, Section, Hr } from "@react-email/components";
const domainUrl = process.env.DOMAIN_URL || 'https://sixthsensepay.com';
export function FormSubmitThankYouEmail(props: { url: string, name: string, email: string, message: string, locale: string }) {
  const localesContent = {
    "en":{
        heading: "Thank you for your message, ",
        description: "We received your message and will be in touch with you soon.",
        name: "Name:",
        message: "Message:",
        email: "Email:",
    },
    "es":{
        heading: "Gracias por tu mensaje, ",
        description: "Recibimos tu mensaje y nos pondremos en contacto contigo pronto.",

        name: "Nombre:",
        message: "Mensaje:",
        email: "Email:",
    }
  }

  const content = localesContent[props.locale as keyof typeof localesContent]

    return (
    <Html lang={props.locale}>
        <Head>
            <title>{content.heading}</title>
        </Head>
        <Body style={{ backgroundColor: "#e0e0e0" }}>
          <Container style={{ padding: "20px" }}>
            <Section style={{ backgroundColor: "#ff3a00", padding: "12px" }}>
              <Link href={domainUrl} style={{ textDecoration: "none" }}>
                <Img src="https://sixth-sense-pay.vercel.app/_astro/logo-main-1color-fondo-claro@2x.akFm-fl-.png" width="120px" height="auto"></Img>
              </Link>
            </Section>
            <Section style={{backgroundColor:"#fafafa"}}>
              <Img src="https://sixth-sense-pay.vercel.app/_astro/home-section-3.BRZnFW9p.png" width="100%" height="auto"></Img>
              </Section>
            <Section style={{ backgroundColor: "#fafafa", padding: "20px" }}>
              <Heading as="h2">{content.heading}{props.name}!</Heading>
              <Text>{content.description}</Text>
            </Section>
          </Container>
        </Body>
    </Html>
  );
}
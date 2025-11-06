import * as React from 'react';
import { Html, Button, Head, Body, Heading, Text, Link, Container, Img, Section, Hr } from "@react-email/components";
const domainUrl = process.env.DOMAIN_URL || 'https://sixthsensepay.com';
export function FormSubmitEmail(props: { url: string, name: string, email: string, message: string, locale: string }) {
  const localesContent = {
    "en":{
        heading: "New contact form submission",

        name: "Name:",
        message: "Message:",
        email: "Email:",
    },
    "es":{
        heading: "Nuevo ingreso de formulario de contacto",

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
              <Heading as="h2">{content.heading}</Heading>
              <Hr />
              <Text><strong>{content.name}</strong> {props.name}</Text>
              <Text><strong>{content.message}</strong> {props.message}</Text>
              <Hr />
              <Link href={`mailto:${props.email}`}><Heading as="h3"><strong>{content.email}</strong> {props.email}</Heading></Link>
            </Section>
          </Container>
        </Body>
    </Html>
  );
}
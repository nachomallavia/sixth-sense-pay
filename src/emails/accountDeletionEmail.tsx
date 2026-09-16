import * as React from "react"
import { Html, Head, Body, Heading, Text, Link, Container, Img, Section, Hr } from "@react-email/components"

const domainUrl = process.env.DOMAIN_URL || "https://sixthsensepay.com"

export function AccountDeletionEmail(props: {
	name: string
	email: string
	locale: string
	filename: string
	inlineDocumentCid?: string
}) {
	const localesContent = {
		en: {
			heading: "New account deletion request",
			name: "Name:",
			email: "Email:",
			locale: "Locale:",
			attachment: "ID document:",
			inlineNote: "The identity document is shown below and also attached to this email.",
			pdfNote: "The identity document is attached to this email as a PDF.",
		},
		es: {
			heading: "Nueva solicitud de baja de cuenta",
			name: "Nombre:",
			email: "Email:",
			locale: "Idioma:",
			attachment: "Documento de identidad:",
			inlineNote: "El documento de identidad se muestra abajo y también va adjunto a este email.",
			pdfNote: "El documento de identidad va adjunto a este email (PDF).",
		},
	}

	const content = localesContent[props.locale as keyof typeof localesContent] ?? localesContent.es

	return (
		<Html lang={props.locale}>
			<Head>
				<title>{content.heading}</title>
			</Head>
			<Body style={{ backgroundColor: "#e0e0e0" }}>
				<Container style={{ padding: "20px" }}>
					<Section style={{ backgroundColor: "#ff3a00", padding: "12px" }}>
						<Link href={domainUrl} style={{ textDecoration: "none" }}>
							<Img
								src={`${domainUrl}/emails/logo.png`}
								alt="Sixth Sense Pay"
								width="120"
								height="auto"
							/>
						</Link>
					</Section>
					<Section style={{ backgroundColor: "#fafafa", padding: "20px" }}>
						<Heading as="h2">{content.heading}</Heading>
						<Hr />
						<Text>
							<strong>{content.name}</strong> {props.name}
						</Text>
						<Text>
							<strong>{content.locale}</strong> {props.locale}
						</Text>
						<Text>
							<strong>{content.attachment}</strong> {props.filename}
						</Text>
						<Text>{props.inlineDocumentCid ? content.inlineNote : content.pdfNote}</Text>
						{props.inlineDocumentCid ? (
							<Img
								src={`cid:${props.inlineDocumentCid}`}
								alt={props.filename}
								width="100%"
								style={{ maxWidth: "100%", height: "auto", marginTop: "12px" }}
							/>
						) : null}
						<Hr />
						<Link href={`mailto:${props.email}`}>
							<Heading as="h3">
								<strong>{content.email}</strong> {props.email}
							</Heading>
						</Link>
					</Section>
				</Container>
			</Body>
		</Html>
	)
}

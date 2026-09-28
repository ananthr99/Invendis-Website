import { Link } from "react-router-dom";
import PageSEO from "../components/shared/PageSEO.jsx";

function Section({ title, children }) {
	return (
		<div>
			<h2 className="font-heading text-lg font-bold text-brand-text">{title}</h2>
			<div className="mt-3 space-y-3 text-[15px] leading-relaxed text-brand-muted">
				{children}
			</div>
		</div>
	);
}

function BulletList({ items }) {
	return (
		<ul className="list-disc space-y-1.5 pl-6">
			{items.map((item, i) => <li key={i} dangerouslySetInnerHTML={{ __html: item }} />)}
		</ul>
	);
}

export default function Privacy() {
	return (
		<>
			<PageSEO title="Privacy Policy — INVENDIS Technologies" path="/privacy" />
			<div className="min-h-screen bg-brand-light">
				<div className="mx-auto max-w-3xl px-6 py-14 sm:px-8">

					<Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-muted transition-colors hover:text-brand-blue">
						← Back to Home
					</Link>

					<div className="mt-6 border-b border-black/10 pb-6">
						<p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-brand-red">Legal</p>
						<h1 className="font-heading text-3xl font-bold text-brand-text sm:text-4xl">Privacy Policy</h1>
						<p className="mt-2 text-sm text-brand-muted">Last updated: September 2026</p>
					</div>

					<div className="mt-10 space-y-10">

						<Section title="1. Introduction">
							<p>Invendis Technologies India Private Limited ("Invendis", "we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our websites (<strong>www.invendis.com</strong> and <strong>www.silbonetworks.com</strong>), use our Industrial IoT products and platforms, or engage with us in a business capacity.</p>
							<p>By using our websites or products, you agree to the collection and use of information in accordance with this policy. If you do not agree, please discontinue use of our services.</p>
						</Section>

						<Section title="2. Information We Collect">
							<p>We may collect the following categories of information:</p>
							<p><strong className="text-brand-text">a) Information you provide directly:</strong></p>
							<BulletList items={[
								"Contact details (name, company name, job title, email address, phone number) when you fill out our contact or enquiry forms",
								"Job application data (resume, qualifications, work history) when you apply for a career opportunity",
								"Business correspondence and project requirements shared during sales or support interactions",
							]} />
							<p><strong className="text-brand-text">b) Information collected automatically:</strong></p>
							<BulletList items={[
								"Browser type, IP address, operating system, and referring URLs via standard web server logs",
								"Pages visited, session duration, and clickstream data via analytics tools",
								"Cookie identifiers and similar tracking technologies (see Section 6)",
							]} />
							<p><strong className="text-brand-text">c) Device and platform telemetry (for product users):</strong></p>
							<BulletList items={[
								"Device identifiers, firmware version, uptime, and connectivity status of SILBO routers, gateways, and associated hardware",
								"Operational metrics (data throughput, port status, alarm events) collected via our PizGloria RMS Platform or SILBO Health Monitoring (SHM) software",
								"Site-level GPS coordinates or installation metadata where provided by the operator for remote management purposes",
							]} />
						</Section>

						<Section title="3. How We Use Your Information">
							<p>We use the information we collect to:</p>
							<BulletList items={[
								"Respond to enquiries, quotation requests, and technical support tickets",
								"Process and fulfil product orders and OEM/ODM engagements",
								"Provide remote monitoring and management services through our software platforms",
								"Send product updates, firmware release notes, and service notifications relevant to your deployment",
								"Evaluate job applications and manage the recruitment process",
								"Improve our website, products, and customer experience through aggregated analytics",
								"Comply with applicable laws, regulations, and contractual obligations",
								"Detect and prevent fraud, security incidents, or misuse of our platforms",
							]} />
							<p>We do not sell, rent, or trade your personal information to third parties for marketing purposes.</p>
						</Section>

						<Section title="4. Legal Basis for Processing">
							<p>Where applicable under data protection legislation (including the Indian Digital Personal Data Protection Act, 2023), we process your data on the following legal bases:</p>
							<BulletList items={[
								"<strong>Contract</strong>: Processing necessary to fulfil a contract with you or your organisation",
								"<strong>Legitimate interests</strong>: Operating and improving our business, products, and communications",
								"<strong>Legal obligation</strong>: Compliance with applicable laws and regulations",
								"<strong>Consent</strong>: Where you have explicitly opted in (e.g., marketing communications)",
							]} />
						</Section>

						<Section title="5. Sharing of Information">
							<p>We may share your information with:</p>
							<BulletList items={[
								"<strong>Service providers</strong> who assist us in operating our websites and platforms (e.g., cloud hosting, CRM, email delivery) under strict confidentiality obligations",
								"<strong>Business partners and distributors</strong> where necessary to fulfil a product order or support engagement in your region",
								"<strong>Legal and regulatory authorities</strong> when required by applicable law, court order, or to protect our legal rights",
								"<strong>Successors</strong> in the event of a merger, acquisition, or sale of assets, subject to equivalent privacy protections",
							]} />
							<p>We do not share device telemetry or customer operational data with third parties without explicit authorisation from the data controller.</p>
						</Section>

						<Section title="6. Cookies and Tracking Technologies">
							<p>Our websites use cookies and similar technologies to enhance your experience:</p>
							<BulletList items={[
								"<strong>Essential cookies</strong>: Required for the website to function correctly",
								"<strong>Analytics cookies</strong>: Used to understand how visitors interact with our site using tools such as Google Analytics",
								"<strong>Preference cookies</strong>: Remember your settings and choices across visits",
							]} />
							<p>You can control or disable cookies through your browser settings. Disabling essential cookies may affect website functionality.</p>
						</Section>

						<Section title="7. Data Retention">
							<p>We retain personal information only as long as necessary:</p>
							<BulletList items={[
								"Enquiry and contact form data: up to 3 years from last interaction",
								"Customer account and contract data: duration of business relationship plus 7 years",
								"Device telemetry and operational logs: as defined in your service agreement, typically 90 days to 12 months",
								"Job application data: up to 12 months from date of application if unsuccessful",
							]} />
						</Section>

						<Section title="8. Data Security">
							<p>We implement appropriate technical and organisational measures to protect your information against unauthorised access, alteration, disclosure, or destruction. These include TLS encryption for data in transit, access controls, and regular security assessments.</p>
							<p>No method of transmission over the Internet is 100% secure. We encourage you to report any suspected security incidents to us promptly.</p>
						</Section>

						<Section title="9. International Data Transfers">
							<p>Invendis operates globally, and your information may be processed or stored in countries outside your country of residence, including India. We ensure appropriate safeguards are in place for any cross-border transfer of personal data in accordance with applicable data protection laws.</p>
						</Section>

						<Section title="10. Your Rights">
							<p>Depending on your location, you may have the right to:</p>
							<BulletList items={[
								"Access the personal data we hold about you",
								"Request correction of inaccurate or incomplete data",
								"Request deletion of your data (subject to legal retention obligations)",
								"Object to or restrict certain processing activities",
								"Withdraw consent where processing is based on consent",
								"Lodge a complaint with your relevant data protection authority",
							]} />
							<p>To exercise any of these rights, please contact us at <a href="mailto:sales@invendis.com" className="text-brand-blue underline">sales@invendis.com</a>.</p>
						</Section>

						<Section title="11. Third-Party Links">
							<p>Our websites may contain links to third-party websites or partner portals. We are not responsible for the privacy practices of those sites and encourage you to review their privacy policies before providing any personal information.</p>
						</Section>

						<Section title="12. Changes to This Policy">
							<p>We may update this Privacy Policy from time to time. The updated policy will be posted on this page with a revised "Last updated" date. Continued use of our website or services after changes are posted constitutes acceptance of the revised policy.</p>
						</Section>

						<Section title="13. Contact Us">
							<p>If you have any questions or requests relating to this Privacy Policy, please contact us:</p>
							<div className="rounded-xl border border-black/8 bg-white p-5 text-sm">
								<p className="font-semibold text-brand-text">Invendis Technologies India Private Limited</p>
								<p className="mt-1 text-brand-muted">No. 230, 1st Cross, 38th Main, BOOHBCS Layout,<br />BTM 2nd Stage, Bangalore – 560 068, India</p>
								<p className="mt-2"><a href="mailto:sales@invendis.com" className="text-brand-blue underline">sales@invendis.com</a></p>
								<p><a href="tel:+916361509463" className="text-brand-blue underline">+91 6361509463</a></p>
							</div>
						</Section>

					</div>

					<div className="mt-12 border-t border-black/10 pt-6 text-center text-xs text-brand-muted">
						<p>© {new Date().getFullYear()} Invendis Technologies India Private Limited. All rights reserved.</p>
						<div className="mt-2 flex justify-center gap-4">
							<Link to="/privacy" className="underline hover:text-brand-blue">Privacy Policy</Link>
							<Link to="/terms" className="underline hover:text-brand-blue">Terms of Use</Link>
						</div>
					</div>

				</div>
			</div>
		</>
	);
}

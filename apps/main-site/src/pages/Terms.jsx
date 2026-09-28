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

export default function Terms() {
	return (
		<>
			<PageSEO title="Terms of Use — INVENDIS Technologies" path="/terms" />
			<div className="min-h-screen bg-brand-light">
				<div className="mx-auto max-w-3xl px-6 py-14 sm:px-8">

					<Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-muted transition-colors hover:text-brand-blue">
						← Back to Home
					</Link>

					<div className="mt-6 border-b border-black/10 pb-6">
						<p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-brand-red">Legal</p>
						<h1 className="font-heading text-3xl font-bold text-brand-text sm:text-4xl">Terms of Use</h1>
						<p className="mt-2 text-sm text-brand-muted">Last updated: September 2026</p>
					</div>

					<div className="mt-10 space-y-10">

						<Section title="1. Acceptance of Terms">
							<p>By accessing or using the websites <strong>www.invendis.com</strong> and <strong>www.silbonetworks.com</strong> (collectively, the "Sites"), or by purchasing, installing, or using any product or service offered by Invendis Technologies India Private Limited ("Invendis", "we", "us", or "our"), you agree to be bound by these Terms of Use ("Terms").</p>
							<p>If you are accessing the Sites or using our products on behalf of a company or other legal entity, you represent that you have the authority to bind that entity to these Terms.</p>
							<p>If you do not agree to these Terms, please do not use our Sites or products.</p>
						</Section>

						<Section title="2. Use of the Website">
							<p>You agree to use our Sites only for lawful purposes and in a manner that does not infringe the rights of others. You must not:</p>
							<BulletList items={[
								"Use the Sites in any way that violates applicable local, national, or international laws or regulations",
								"Transmit any unsolicited or unauthorised advertising or promotional material",
								"Attempt to gain unauthorised access to any part of the Sites, servers, or networks connected to the Sites",
								"Use automated tools (bots, scrapers, crawlers) to extract data from the Sites without our prior written consent",
								"Introduce viruses, trojans, worms, or other malicious or technologically harmful material",
							]} />
						</Section>

						<Section title="3. Intellectual Property">
							<p>All content on the Sites — including text, graphics, logos, product images, software code, firmware, documentation, and the SILBO and INVENDIS brand names and marks — is the property of Invendis Technologies India Private Limited or its licensors and is protected under applicable intellectual property laws.</p>
							<p>You may not reproduce, distribute, modify, create derivative works of, publicly display, or commercially exploit any content from our Sites without prior written permission from Invendis.</p>
						</Section>

						<Section title="4. Products, Hardware, and Software">
							<p><strong className="text-brand-text">a) Hardware products:</strong> SILBO routers, gateways, network switches, protocol converters, energy meters, and other Invendis hardware are sold subject to separate purchase agreements, product specifications, and warranty terms provided at the time of sale. Nothing on the Sites constitutes a binding offer to sell hardware at any particular price or specification.</p>
							<p><strong className="text-brand-text">b) Software and platforms:</strong> Use of the PizGloria RMS Platform, SILBO Health Monitoring (SHM), Mobile Apps, and any other Invendis software is governed by the applicable End User Licence Agreement (EULA) or Software Subscription Agreement entered into at the time of deployment. These Terms do not override any such agreements.</p>
							<p><strong className="text-brand-text">c) OEM/ODM engagements:</strong> Custom hardware design, manufacturing, and white-labelling services are governed exclusively by the terms of the signed OEM/ODM agreement between Invendis and the client.</p>
							<p><strong className="text-brand-text">d) Firmware and updates:</strong> Invendis may release firmware updates for its hardware products. Installation of updates is the responsibility of the operator. Invendis is not liable for issues arising from failure to apply recommended updates.</p>
						</Section>

						<Section title="5. Accuracy of Information">
							<p>We strive to keep product specifications, datasheets, and other information on the Sites accurate and up to date. However, we do not warrant that such information is complete, current, or error-free. Product specifications are subject to change without notice. Always confirm current specifications with our sales team before placing an order.</p>
						</Section>

						<Section title="6. Export Control">
							<p>Invendis products — including networking hardware, routers, gateways, and related software — may be subject to export control laws and regulations of India and other jurisdictions. By purchasing or using our products, you agree to comply with all applicable export control laws and not to export, re-export, or transfer our products to any country, entity, or person in violation of such laws.</p>
						</Section>

						<Section title="7. Disclaimers">
							<p>THE SITES AND ALL CONTENT, PRODUCTS, AND SERVICES PROVIDED ARE ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.</p>
							<p>Invendis does not warrant that the Sites will be uninterrupted, error-free, or free of viruses or other harmful components.</p>
						</Section>

						<Section title="8. Limitation of Liability">
							<p>To the fullest extent permitted by applicable law, Invendis Technologies India Private Limited and its directors, employees, partners, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising out of or in connection with:</p>
							<BulletList items={[
								"Your use of or inability to use the Sites",
								"Any products or services purchased through or described on the Sites",
								"Unauthorised access to or alteration of your data or transmissions",
								"Any other matter relating to the Sites or our products",
							]} />
							<p>Our total liability for any claim arising from these Terms shall not exceed the amount paid by you (if any) for access to the specific product or service giving rise to the claim in the twelve months preceding the claim.</p>
						</Section>

						<Section title="9. Indemnification">
							<p>You agree to indemnify and hold harmless Invendis Technologies India Private Limited, its affiliates, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses (including legal fees) arising out of or in connection with your use of the Sites, violation of these Terms, or infringement of any third-party rights.</p>
						</Section>

						<Section title="10. Third-Party Links and Services">
							<p>The Sites may contain links to third-party websites, distributor portals, or partner resources. These links are provided for convenience only. Invendis does not endorse, control, or accept responsibility for the content or practices of any linked third-party site. Your use of third-party sites is at your own risk and subject to their respective terms.</p>
						</Section>

						<Section title="11. Governing Law and Dispute Resolution">
							<p>These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any dispute arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts located in Bangalore, Karnataka, India.</p>
						</Section>

						<Section title="12. Changes to These Terms">
							<p>We reserve the right to modify these Terms at any time. Updated Terms will be posted on this page with a revised "Last updated" date. Your continued use of the Sites following any changes constitutes your acceptance of the updated Terms. We encourage you to review this page periodically.</p>
						</Section>

						<Section title="13. Contact Us">
							<p>For any questions regarding these Terms of Use, please contact us:</p>
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

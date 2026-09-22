import PageSEO from "../components/shared/PageSEO.jsx";

// Static legal page — deliberately NOT CMS-driven (legal text shouldn't
// be editable through the same low-friction flow as marketing copy).
export default function Privacy() {
	return (
		<>
			<PageSEO title="Privacy Policy" path="/privacy" />
			<section className="mx-auto max-w-3xl px-6 py-16">
				<h1 className="font-heading text-3xl font-bold">Privacy Policy</h1>
				<p className="mt-4 text-brand-muted">Replace this with the real privacy policy text.</p>
			</section>
		</>
	);
}

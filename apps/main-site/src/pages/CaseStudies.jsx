import { useContent } from "../hooks/useContent.js";
import PageSEO from "../components/shared/PageSEO.jsx";

export default function CaseStudies() {
	const { data, loading } = useContent("pages/caseStudies.json", { withLoading: true });

	if (loading) return null;

	return (
		<>
			<PageSEO title="Case Studies" description={data?.hero?.subtitle} path="/case-studies" />
			<section className="bg-brand-dark px-6 py-24 text-white">
				<div className="mx-auto max-w-4xl text-center">
					<h1 className="font-heading text-4xl font-bold">{data?.hero?.title ?? "Case studies"}</h1>
					<p className="mt-4 text-white/70">
						{data?.hero?.subtitle ?? "Real-world deployments and measurable outcomes."}
					</p>
				</div>
			</section>
			<section className="mx-auto max-w-3xl px-6 py-16 text-center text-brand-muted">
				This page reads from <code className="rounded bg-black/5 px-1.5 py-0.5">caseStudies.json</code> — build out its
				sections here the same way Home.jsx and Contact.jsx do.
			</section>
		</>
	);
}

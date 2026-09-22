import { useContent } from "../hooks/useContent.js";
import PageSEO from "../components/shared/PageSEO.jsx";

// STUB PAGE. The real Resources page is a blog listing that reads
// public/content/blog/_index.json rather than pages/resources.json —
// that listing + ResourceDetail's markdown rendering is a later step.
export default function Resources() {
	const { data, loading } = useContent("pages/resources.json", { withLoading: true });

	if (loading) return null;

	return (
		<>
			<PageSEO title="Resources" description={data?.hero?.subtitle} path="/resources" />
			<section className="bg-brand-dark px-6 py-24 text-white">
				<div className="mx-auto max-w-4xl text-center">
					<h1 className="font-heading text-4xl font-bold">{data?.hero?.title ?? "Technical articles & insights"}</h1>
					<p className="mt-4 text-white/70">{data?.hero?.subtitle}</p>
				</div>
			</section>
			<section className="mx-auto max-w-3xl px-6 py-16 text-center text-brand-muted">
				Blog listing (reading <code className="rounded bg-black/5 px-1.5 py-0.5">content/blog/_index.json</code>) is a
				later step — see README.
			</section>
		</>
	);
}

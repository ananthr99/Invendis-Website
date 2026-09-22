import { useContent } from "../hooks/useContent.js";
import PageSEO from "../components/shared/PageSEO.jsx";

// STUB PAGE — routed and wired to its content file, but rendering only
// the hero. Follow the pattern in Home.jsx or Contact.jsx to build out
// this page's real sections from sectors.json.
export default function Sectors() {
	const { data, loading } = useContent("pages/sectors.json", { withLoading: true });

	if (loading) return null;

	return (
		<>
			<PageSEO title="Sectors" description={data?.hero?.subtitle} path="/sectors" />
			<section className="bg-brand-dark px-6 py-24 text-white">
				<div className="mx-auto max-w-4xl text-center">
					<h1 className="font-heading text-4xl font-bold">{data?.hero?.title ?? "Industries we serve"}</h1>
					<p className="mt-4 text-white/70">
						{data?.hero?.subtitle ?? "Purpose-built IIoT solutions across multiple industrial verticals."}
					</p>
				</div>
			</section>
			<section className="mx-auto max-w-3xl px-6 py-16 text-center text-brand-muted">
				This page reads from <code className="rounded bg-black/5 px-1.5 py-0.5">sectors.json</code> — build out its
				sections here the same way Home.jsx and Contact.jsx do.
			</section>
		</>
	);
}

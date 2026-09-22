import { useContent } from "../hooks/useContent.js";
import PageSEO from "../components/shared/PageSEO.jsx";

// STUB PAGE. Note: the real Invendis Products page also pulls from a much
// larger generated catalog (src/data/products.js, built by a script from
// many per-product JSON files) — that catalog pipeline is a separate,
// later step. This page is just the CMS-driven hero + marketing copy.
export default function Products() {
	const { data, loading } = useContent("pages/products.json", { withLoading: true });

	if (loading) return null;

	return (
		<>
			<PageSEO title="Products" description={data?.hero?.subtitle} path="/products" />
			<section className="bg-brand-dark px-6 py-24 text-white">
				<div className="mx-auto max-w-4xl text-center">
					<h1 className="font-heading text-4xl font-bold">{data?.hero?.title ?? "Our products"}</h1>
					<p className="mt-4 text-white/70">
						{data?.hero?.subtitle ?? "A complete portfolio of industrial-grade hardware and software."}
					</p>
				</div>
			</section>
			<section className="mx-auto max-w-3xl px-6 py-16 text-center text-brand-muted">
				This page reads from <code className="rounded bg-black/5 px-1.5 py-0.5">products.json</code> — the full product
				catalog + filtering UI is a separate build step (see README).
			</section>
		</>
	);
}

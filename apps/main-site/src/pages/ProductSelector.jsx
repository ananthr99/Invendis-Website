import PageSEO from "../components/shared/PageSEO.jsx";

// STUB PAGE — the guided product selector tool. This one isn't
// CMS-content-driven like the others; it's an interactive filter over
// the product catalog (src/data/products.js), which is a later build
// step once the catalog pipeline exists. Routed here so the URL
// structure matches the original site from day one.
export default function ProductSelector() {
	return (
		<>
			<PageSEO title="Product Selector" path="/products/product-selector" />
			<section className="bg-brand-dark px-6 py-24 text-white">
				<div className="mx-auto max-w-4xl text-center">
					<h1 className="font-heading text-4xl font-bold">Product Selector</h1>
					<p className="mt-4 text-white/70">
						Guided product selector — to be built once the product catalog pipeline is in place.
					</p>
				</div>
			</section>
		</>
	);
}

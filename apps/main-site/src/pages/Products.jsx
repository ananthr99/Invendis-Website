import { useContent } from "../hooks/useContent.js";
import PageSEO from "../components/shared/PageSEO.jsx";
import { PRODUCT_SECTIONS } from "../sections/products/registry.js";

export default function Products() {
	const { data, loading, error } = useContent("pages/products.json", { withLoading: true });
	if (loading) return null;
	if (error || !data) return (
		<div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
			<p style={{ color: "#6b7280", fontSize: 15 }}>Content temporarily unavailable. Please try again later.</p>
		</div>
	);

	return (
		<>
			<PageSEO title="Industrial IoT Hardware & Software" description={data.hero?.subtitle} path="/products" />
			{(data.sections ?? []).map((key) => {
				const Section = PRODUCT_SECTIONS[key];
				return Section ? <Section key={key} data={data[key]} /> : null;
			})}
		</>
	);
}

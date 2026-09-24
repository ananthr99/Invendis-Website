import { useContent } from "../hooks/useContent.js";
import PageSEO from "../components/shared/PageSEO.jsx";
import { PRODUCT_SECTIONS } from "../sections/products/registry.js";

export default function Products() {
	const { data, loading } = useContent("pages/products.json", { withLoading: true });

	if (loading || !data) return null;

	return (
		<>
			<PageSEO title="Products" description={data.hero?.subtitle} path="/products" />
			{(data.sections ?? []).map((key) => {
				const Section = PRODUCT_SECTIONS[key];
				return Section ? <Section key={key} data={data[key]} /> : null;
			})}
		</>
	);
}

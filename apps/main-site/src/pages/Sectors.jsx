import { useContent } from "../hooks/useContent.js";
import PageSEO from "../components/shared/PageSEO.jsx";
import { SECTOR_SECTIONS } from "../sections/sectors/registry.js";

export default function Sectors() {
	const { data, loading } = useContent("pages/sectors.json", { withLoading: true });

	if (loading || !data) return null;

	return (
		<>
			<PageSEO title="Sectors — Industries We Serve" description={data.hero?.subtitle} path="/sectors" />
			{(data.sections ?? []).map((key) => {
				const Section = SECTOR_SECTIONS[key];
				return Section ? <Section key={key} data={data[key]} /> : null;
			})}
		</>
	);
}

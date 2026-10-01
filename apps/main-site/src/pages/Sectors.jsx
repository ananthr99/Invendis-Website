import { useContent } from "../hooks/useContent.js";
import PageSEO from "../components/shared/PageSEO.jsx";
import { SECTOR_SECTIONS } from "../sections/sectors/registry.js";

export default function Sectors() {
	const { data, loading, error } = useContent("pages/sectors.json", { withLoading: true });
	if (loading) return null;
	if (error || !data) return (
		<div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
			<p style={{ color: "#6b7280", fontSize: 15 }}>Content temporarily unavailable. Please try again later.</p>
		</div>
	);

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

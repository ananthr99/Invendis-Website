import { useContent } from "../hooks/useContent.js";
import PageSEO from "../components/shared/PageSEO.jsx";
import { RESOURCES_SECTIONS } from "../sections/resources/registry.js";

export default function Resources() {
	const { data, loading, error } = useContent("pages/resources.json", { withLoading: true });
	if (loading) return null;
	if (error || !data) return (
		<div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
			<p style={{ color: "#6b7280", fontSize: 15 }}>Content temporarily unavailable. Please try again later.</p>
		</div>
	);

	return (
		<>
			<PageSEO title="Resources" description={data.hero?.subtitle} path="/resources" />
			{(data.sections ?? []).map((key) => {
				const Section = RESOURCES_SECTIONS[key];
				return Section ? <Section key={key} data={data[key]} /> : null;
			})}
		</>
	);
}

import { useContent } from "../hooks/useContent.js";
import PageSEO from "../components/shared/PageSEO.jsx";
import { SILBO_SECTIONS } from "../sections/silbo/registry.js";

export default function Silbo() {
	const { data, loading, error } = useContent("pages/silbo.json", { withLoading: true });
	if (loading) return null;
	if (error || !data) return (
		<div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
			<p style={{ color: "#6b7280", fontSize: 15 }}>Content temporarily unavailable. Please try again later.</p>
		</div>
	);

	return (
		<>
			<PageSEO title="SILBO" description={data.hero?.description} path="/silbo" />
			{(data.sections ?? []).map((key) => {
				const Section = SILBO_SECTIONS[key];
				return Section ? <Section key={key} data={data[key]} /> : null;
			})}
		</>
	);
}

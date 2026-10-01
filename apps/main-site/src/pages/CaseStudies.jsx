import { useContent } from "../hooks/useContent.js";
import PageSEO from "../components/shared/PageSEO.jsx";
import { CASE_STUDIES_SECTIONS } from "../sections/case-studies/registry.js";

export default function CaseStudies() {
	const { data, loading, error } = useContent("pages/caseStudies.json", { withLoading: true });
	if (loading) return null;
	if (error || !data) return (
		<div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
			<p style={{ color: "#6b7280", fontSize: 15 }}>Content temporarily unavailable. Please try again later.</p>
		</div>
	);

	return (
		<>
			<PageSEO title="Case Studies" description={data.hero?.subtitle} path="/case-studies" />
			{(data.sections ?? []).map((key) => {
				const Section = CASE_STUDIES_SECTIONS[key];
				return Section ? <Section key={key} data={data[key]} /> : null;
			})}
		</>
	);
}

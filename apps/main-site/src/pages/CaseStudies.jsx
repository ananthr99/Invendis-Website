import { useContent } from "../hooks/useContent.js";
import PageSEO from "../components/shared/PageSEO.jsx";
import { CASE_STUDIES_SECTIONS } from "../sections/case-studies/registry.js";

export default function CaseStudies() {
	const { data, loading } = useContent("pages/caseStudies.json", { withLoading: true });

	if (loading || !data) return null;

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

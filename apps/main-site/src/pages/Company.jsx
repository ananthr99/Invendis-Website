import { useContent } from "../hooks/useContent.js";
import PageSEO from "../components/shared/PageSEO.jsx";
import { COMPANY_SECTIONS } from "../sections/company/registry.js";

export default function Company() {
	const { data, loading } = useContent("pages/company.json", { withLoading: true });

	if (loading || !data) return null;

	return (
		<>
			<PageSEO title="Company" description={data.hero?.subtitle} path="/company" />
			{(data.sections ?? []).map((key) => {
				const Section = COMPANY_SECTIONS[key];
				return Section ? <Section key={key} data={data[key]} /> : null;
			})}
		</>
	);
}

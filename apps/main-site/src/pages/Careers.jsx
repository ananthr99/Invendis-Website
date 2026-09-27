import { useContent } from "../hooks/useContent.js";
import PageSEO from "../components/shared/PageSEO.jsx";
import { CAREERS_SECTIONS } from "../sections/careers/registry.js";

export default function Careers() {
	const { data, loading } = useContent("pages/careers.json", { withLoading: true });

	if (loading || !data) return null;

	return (
		<>
			<PageSEO title="Careers" description={data.hero?.subtitle} path="/careers" />
			{(data.sections ?? []).map((key) => {
				const Section = CAREERS_SECTIONS[key];
				return Section ? <Section key={key} data={data[key]} /> : null;
			})}
		</>
	);
}

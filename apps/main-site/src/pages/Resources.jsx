import { useContent } from "../hooks/useContent.js";
import PageSEO from "../components/shared/PageSEO.jsx";
import { RESOURCES_SECTIONS } from "../sections/resources/registry.js";

export default function Resources() {
	const { data, loading } = useContent("pages/resources.json", { withLoading: true });

	if (loading || !data) return null;

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

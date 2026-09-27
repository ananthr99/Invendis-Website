import { useContent } from "../hooks/useContent.js";
import PageSEO from "../components/shared/PageSEO.jsx";
import { SILBO_SECTIONS } from "../sections/silbo/registry.js";

export default function Silbo() {
	const { data, loading } = useContent("pages/silbo.json", { withLoading: true });

	if (loading || !data) return null;

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

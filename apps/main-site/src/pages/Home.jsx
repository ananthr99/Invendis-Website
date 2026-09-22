import { useContent } from "../hooks/useContent.js";
import PageSEO from "../components/shared/PageSEO.jsx";
import { HOME_SECTIONS } from "../sections/home/registry.js";

export default function Home() {
	const { data, loading } = useContent("pages/home.json", { withLoading: true });

	if (loading || !data) return null;

	return (
		<>
			<PageSEO title="Home" description={data.hero?.subtitle} path="/" />
			{(data.sections ?? []).map((key) => {
				const Section = HOME_SECTIONS[key];
				return Section ? <Section key={key} data={data[key]} /> : null;
			})}
		</>
	);
}

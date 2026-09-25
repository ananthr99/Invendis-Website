import { useContent } from "../hooks/useContent.js";
import PageSEO from "../components/shared/PageSEO.jsx";
import { GALLERY_SECTIONS } from "../sections/gallery/registry.js";

export default function Gallery() {
	const { data, loading } = useContent("pages/gallery.json", { withLoading: true });

	if (loading || !data) return null;

	return (
		<>
			<PageSEO title="Gallery" description={data.hero?.subtitle} path="/gallery" />
			{(data.sections ?? []).map((key) => {
				const Section = GALLERY_SECTIONS[key];
				return Section ? <Section key={key} data={data[key]} /> : null;
			})}
		</>
	);
}

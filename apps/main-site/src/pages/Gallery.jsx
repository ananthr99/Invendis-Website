import { useContent } from "../hooks/useContent.js";
import PageSEO from "../components/shared/PageSEO.jsx";
import { GALLERY_SECTIONS } from "../sections/gallery/registry.js";

export default function Gallery() {
	const { data, loading, error } = useContent("pages/gallery.json", { withLoading: true });
	if (loading) return null;
	if (error || !data) return (
		<div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
			<p style={{ color: "#6b7280", fontSize: 15 }}>Content temporarily unavailable. Please try again later.</p>
		</div>
	);

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

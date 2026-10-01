import { useContent } from "../hooks/useContent.js";
import PageSEO from "../components/shared/PageSEO.jsx";
import { CONTACT_SECTIONS } from "../sections/contact/registry.js";

export default function Contact() {
	const { data, loading, error } = useContent("pages/contact.json", { withLoading: true });
	if (loading) return null;
	if (error || !data) return (
		<div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
			<p style={{ color: "#6b7280", fontSize: 15 }}>Content temporarily unavailable. Please try again later.</p>
		</div>
	);

	return (
		<>
			<PageSEO title="Contact" description={data.hero?.subtitle} path="/contact" />
			{(data.sections ?? []).map((key) => {
				const Section = CONTACT_SECTIONS[key];
				return Section ? <Section key={key} data={data[key]} /> : null;
			})}
		</>
	);
}

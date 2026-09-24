import { useContent } from "../hooks/useContent.js";
import PageSEO from "../components/shared/PageSEO.jsx";
import { CONTACT_SECTIONS } from "../sections/contact/registry.js";

export default function Contact() {
	const { data, loading } = useContent("pages/contact.json", { withLoading: true });

	if (loading || !data) return null;

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

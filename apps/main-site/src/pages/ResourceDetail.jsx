import { useParams } from "react-router-dom";
import PageSEO from "../components/shared/PageSEO.jsx";

// STUB PAGE — will fetch /content/blog/{slug}.json and render its
// markdown `body` field (react-markdown + remark-gfm, same as the
// original site) once the blog pipeline is built.
export default function ResourceDetail() {
	const { slug } = useParams();

	return (
		<>
			<PageSEO title="Article" path={`/resources/${slug}`} />
			<section className="mx-auto max-w-3xl px-6 py-24 text-center text-brand-muted">
				Blog post rendering for <code className="rounded bg-black/5 px-1.5 py-0.5">{slug}</code> is a later step.
			</section>
		</>
	);
}

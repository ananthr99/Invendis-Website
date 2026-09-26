import { Link } from "react-router-dom";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function siteImg(path) { return path ? BASE + path : path; }

function ContentBlock({ block }) {
	switch (block.type) {
		case "paragraph":
			return <p style={{ margin: "0 0 1.25rem", fontSize: 15, color: "#374151", lineHeight: 1.8 }}>{block.text}</p>;
		case "heading":
			return block.level === 3
				? <h3 style={{ margin: "2rem 0 0.6rem", fontSize: 18, fontWeight: 700, color: "#1B2A6B" }}>{block.text}</h3>
				: <h2 style={{ margin: "2.5rem 0 0.75rem", fontSize: 22, fontWeight: 700, color: "#1B2A6B" }}>{block.text}</h2>;
		case "bulletList":
			return (
				<ul style={{ margin: "0 0 1.25rem", paddingLeft: "1.5rem" }}>
					{(block.items ?? []).map((item, i) => (
						<li key={i} style={{ margin: "0 0 0.4rem", fontSize: 15, color: "#374151", lineHeight: 1.7 }}>{item}</li>
					))}
				</ul>
			);
		case "numberedList":
			return (
				<ol style={{ margin: "0 0 1.25rem", paddingLeft: "1.5rem" }}>
					{(block.items ?? []).map((item, i) => (
						<li key={i} style={{ margin: "0 0 0.4rem", fontSize: 15, color: "#374151", lineHeight: 1.7 }}>{item}</li>
					))}
				</ol>
			);
		case "image":
			return (
				<figure style={{ margin: "1.5rem 0 2rem" }}>
					<img src={siteImg(block.src)} alt={block.caption ?? ""} style={{ width: "100%", borderRadius: 10, border: "1px solid #e2e8f0", display: "block" }} />
					{block.caption && (
						<figcaption style={{ marginTop: 8, fontSize: 12, color: "#9ca3af", textAlign: "center" }}>{block.caption}</figcaption>
					)}
				</figure>
			);
		case "callout":
			return (
				<div style={{ margin: "1.5rem 0", padding: "14px 18px", background: "#eff6ff", borderLeft: "4px solid #1B2A6B", borderRadius: "0 8px 8px 0" }}>
					{block.title && <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 700, color: "#1B2A6B" }}>{block.title}</p>}
					<p style={{ margin: 0, fontSize: 14, color: "#374151", lineHeight: 1.65 }}>{block.text}</p>
				</div>
			);
		default:
			return null;
	}
}

export default function ArticleBodySection({ data }) {
	const { content = [] } = data ?? {};

	return (
		<section className="bg-white px-4 py-16 sm:px-8">
			<div style={{ maxWidth: 760, margin: "0 auto" }}>
				{content.map((block, i) => (
					<ContentBlock key={i} block={block} />
				))}
				{content.length === 0 && (
					<p style={{ color: "#9ca3af", textAlign: "center", padding: "3rem 0" }}>Article content coming soon.</p>
				)}
				<div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid #e2e8f0" }}>
					<Link to="/resources" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#1B2A6B", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
						← Back to Resources
					</Link>
				</div>
			</div>
		</section>
	);
}

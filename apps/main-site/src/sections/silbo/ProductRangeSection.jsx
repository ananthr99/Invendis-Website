import { Link } from "react-router-dom";

const CATEGORY_ICONS = {
	router: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
			<path d="M5 12.55a11 11 0 0 1 14.08 0" />
			<path d="M1.42 9a16 16 0 0 1 21.16 0" />
			<path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
			<line x1="12" y1="20" x2="12.01" y2="20" />
		</svg>
	),
	gateway: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
			<rect x="4" y="4" width="16" height="16" rx="2" />
			<rect x="9" y="9" width="6" height="6" />
			<line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
			<line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />
			<line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" />
			<line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" />
		</svg>
	),
	switch: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
			<polygon points="12 2 2 7 12 12 22 7 12 2" />
			<polyline points="2 17 12 22 22 17" />
			<polyline points="2 12 12 17 22 12" />
		</svg>
	),
};

const ICON_COLORS = { router: "#3b82f6", gateway: "#f59e0b", switch: "#0891b2" };

function CategoryCard({ item }) {
	const icon = CATEGORY_ICONS[item.icon] ?? CATEGORY_ICONS.router;
	const color = ICON_COLORS[item.icon] ?? "#1B2A6B";

	return (
		<div className="rounded-xl border border-t-4 border-black/5 border-t-transparent bg-brand-light p-6 transition-all hover:border-t-brand-red hover:shadow-md">
			<div style={{ width: 48, height: 48, borderRadius: 12, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", color, marginBottom: 16 }}>
				{icon}
			</div>
			<p className="font-heading" style={{ fontSize: 36, fontWeight: 800, color: "#1B2A6B", lineHeight: 1, marginBottom: 4 }}>
				{item.count}
			</p>
			<h3 style={{ fontSize: 16, fontWeight: 700, color: "#1B2A6B", marginBottom: 8 }}>{item.label}</h3>
			<p style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.65, marginBottom: 16 }}>{item.description}</p>
			{item.link && (
				<Link to={item.link} style={{ fontSize: 13, fontWeight: 600, color: "#E63946", textDecoration: "none" }}>
					{item.linkLabel ?? "Browse →"}
				</Link>
			)}
		</div>
	);
}

export default function ProductRangeSection({ data }) {
	const d = data ?? {};

	return (
		<section className="bg-white px-4 py-16 sm:px-8">
			<div style={{ maxWidth: "1536px", margin: "0 auto" }}>
				<div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
					{d.eyebrow && <p className="mb-3 text-[10px] font-semibold tracking-widest text-brand-red uppercase">{d.eyebrow}</p>}
					<h2 className="font-heading text-3xl font-bold text-brand-blue sm:text-4xl">{d.title}</h2>
				</div>
				<div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
					{(d.categories ?? []).map((item, i) => (
						<CategoryCard key={i} item={item} />
					))}
				</div>
			</div>
		</section>
	);
}

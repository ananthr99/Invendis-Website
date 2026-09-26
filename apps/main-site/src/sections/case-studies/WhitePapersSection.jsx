import { Link } from "react-router-dom";

const ICONS = {
	file: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
			<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
		</svg>
	),
	cpu: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
			<rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" />
		</svg>
	),
	globe: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
			<circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
		</svg>
	),
	sun: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
			<circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
		</svg>
	),
	chart: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
			<line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" />
		</svg>
	),
	shield: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
			<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
		</svg>
	),
};

function WhitePaperCard({ item }) {
	const icon = ICONS[item.icon] ?? ICONS.file;
	const color = item.iconColor ?? "#1B2A6B";

	return (
		<div className="overflow-hidden rounded-xl border border-t-4 border-black/5 border-t-transparent bg-white transition-all hover:border-t-brand-red hover:shadow-md"
	        style={{ display: "flex", gap: 16, padding: "18px 20px", alignItems: "flex-start" }}>
			<div style={{ width: 42, height: 42, borderRadius: 10, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color }}>
				{icon}
			</div>
			<div style={{ flex: 1, minWidth: 0 }}>
				<h3 style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 700, color: "#1B2A6B", lineHeight: 1.4 }}>{item.title}</h3>
				<p style={{ margin: "0 0 10px", fontSize: 13, color: "#4b5563", lineHeight: 1.65 }}>{item.description}</p>
				<Link to={item.requestLink ?? "/contact"} style={{ fontSize: 13, fontWeight: 600, color: "#E63946", textDecoration: "none" }}>
					Request PDF →
				</Link>
			</div>
		</div>
	);
}

export default function WhitePapersSection({ data }) {
	const { eyebrow, title, titleHighlight, subtitle, items = [] } = data ?? {};

	return (
		<section className="bg-white px-4 py-16 sm:px-8">
			<div style={{ maxWidth: "1536px", margin: "0 auto" }}>
				<div style={{ marginBottom: "2.5rem" }}>
					{eyebrow && <p className="mb-3 text-[10px] font-semibold tracking-widest text-brand-red uppercase">{eyebrow}</p>}
					<h2 className="font-heading text-4xl font-bold text-brand-blue lg:text-5xl">
						{title}
						{titleHighlight && <span className="text-brand-red"> {titleHighlight}</span>}
					</h2>
					{subtitle && <p style={{ marginTop: 12, fontSize: 15, color: "#4b5563", maxWidth: "42rem", lineHeight: 1.7 }}>{subtitle}</p>}
				</div>

				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
					{items.map((item, i) => (
						<WhitePaperCard key={i} item={item} />
					))}
				</div>
			</div>
		</section>
	);
}

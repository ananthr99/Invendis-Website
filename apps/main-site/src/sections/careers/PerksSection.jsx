const ICONS = {
	heart: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
			<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
		</svg>
	),
	book: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
			<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
			<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
		</svg>
	),
	clock: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
			<circle cx="12" cy="12" r="10" />
			<polyline points="12 6 12 12 16 14" />
		</svg>
	),
	shield: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
			<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
		</svg>
	),
	award: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
			<circle cx="12" cy="8" r="6" />
			<path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
		</svg>
	),
	coffee: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
			<path d="M18 8h1a4 4 0 0 1 0 8h-1" />
			<path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
			<line x1="6" y1="1" x2="6" y2="4" />
			<line x1="10" y1="1" x2="10" y2="4" />
			<line x1="14" y1="1" x2="14" y2="4" />
		</svg>
	),
};

const ICON_COLORS = { heart: "#E63946", book: "#3b82f6", clock: "#10b981", shield: "#1B2A6B", award: "#f59e0b", coffee: "#8b5cf6" };

export default function PerksSection({ data }) {
	const d = data ?? {};

	return (
		<section className="bg-slate-50 px-4 py-16 sm:px-8">
			<div style={{ maxWidth: "1536px", margin: "0 auto" }}>
				<div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
					{d.eyebrow && <p className="mb-3 text-[10px] font-semibold tracking-widest text-brand-red uppercase">{d.eyebrow}</p>}
					<h2 className="font-heading text-3xl font-bold text-brand-blue sm:text-4xl">{d.title}</h2>
				</div>
				<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{(d.items ?? []).map((item, i) => {
						const icon = ICONS[item.icon] ?? ICONS.heart;
						const color = ICON_COLORS[item.icon] ?? "#1B2A6B";
						return (
							<div key={i} className="rounded-xl border border-t-4 border-black/5 border-t-transparent bg-white transition-all hover:border-t-brand-red hover:shadow-md" style={{ padding: "20px 22px", display: "flex", gap: 14, alignItems: "flex-start" }}>
								<div style={{ width: 40, height: 40, borderRadius: 10, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", color, flexShrink: 0 }}>
									{icon}
								</div>
								<div>
									<h3 style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 700, color: "#1B2A6B" }}>{item.title}</h3>
									<p style={{ margin: 0, fontSize: 13, color: "#4b5563", lineHeight: 1.65 }}>{item.description}</p>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}

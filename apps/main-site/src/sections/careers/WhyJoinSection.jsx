const ICONS = {
	rocket: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
			<path d="M4.5 16.5c-1.5 1.5-1.5 3 0 4.5 1.5 0 3 0 4.5-1.5L12 16.5l-4.5-4.5L4.5 16.5z" />
			<path d="M12 16.5l7.5-7.5c1.5-3 0-6-1.5-7.5-1.5 1.5-4.5 0-7.5 1.5L3 10.5l4.5 2.5 2.5 4.5 2-1z" />
			<circle cx="15" cy="9" r="1.5" />
		</svg>
	),
	users: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
			<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
			<circle cx="9" cy="7" r="4" />
			<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
			<path d="M16 3.13a4 4 0 0 1 0 7.75" />
		</svg>
	),
	trending: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
			<polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
			<polyline points="17 6 23 6 23 12" />
		</svg>
	),
	globe: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
			<circle cx="12" cy="12" r="10" />
			<line x1="2" y1="12" x2="22" y2="12" />
			<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
		</svg>
	),
};

const ICON_COLORS = { rocket: "#E63946", users: "#3b82f6", trending: "#10b981", globe: "#f59e0b" };

export default function WhyJoinSection({ data }) {
	const d = data ?? {};

	return (
		<section className="bg-brand-light px-4 py-16 sm:px-8">
			<div style={{ maxWidth: "1536px", margin: "0 auto" }}>
				<div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
					{d.eyebrow && <p className="mb-3 text-[10px] font-semibold tracking-widest text-brand-red uppercase">{d.eyebrow}</p>}
					<h2 className="font-heading text-3xl font-bold text-brand-blue sm:text-4xl">{d.title}</h2>
					{d.subtitle && <p style={{ marginTop: 12, fontSize: 15, color: "#4b5563", maxWidth: "38rem", lineHeight: 1.7, margin: "12px auto 0" }}>{d.subtitle}</p>}
				</div>
				<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
					{(d.items ?? []).map((item, i) => {
						const icon = ICONS[item.icon] ?? ICONS.rocket;
						const color = ICON_COLORS[item.icon] ?? "#1B2A6B";
						return (
							<div key={i} className="rounded-2xl border border-t-4 border-black/5 border-t-transparent bg-white p-6 transition-all hover:border-t-brand-red hover:shadow-md">
								<div style={{ width: 44, height: 44, borderRadius: 10, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", color, marginBottom: 14 }}>
									{icon}
								</div>
								<h3 style={{ fontSize: 15, fontWeight: 700, color: "#1B2A6B", marginBottom: 8 }}>{item.title}</h3>
								<p style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.65, margin: 0 }}>{item.description}</p>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}

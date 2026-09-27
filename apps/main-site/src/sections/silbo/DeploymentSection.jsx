const DEPLOY_ICONS = {
	tower: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
			<path d="M12 2L2 7v10l10 5 10-5V7L12 2z" />
			<polyline points="2 7 12 12 22 7" />
			<line x1="12" y1="22" x2="12" y2="12" />
		</svg>
	),
	network: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
			<rect x="2" y="2" width="6" height="6" rx="1" />
			<rect x="16" y="2" width="6" height="6" rx="1" />
			<rect x="9" y="16" width="6" height="6" rx="1" />
			<path d="M5 8v3a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V8" />
			<line x1="12" y1="8" x2="12" y2="16" />
		</svg>
	),
	factory: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
			<path d="M2 20h20V10l-6-4-4 4-4-4-6 4v10z" />
			<line x1="12" y1="20" x2="12" y2="14" />
			<line x1="8" y1="20" x2="8" y2="16" />
			<line x1="16" y1="20" x2="16" y2="16" />
		</svg>
	),
	outdoor: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
			<circle cx="12" cy="12" r="5" />
			<line x1="12" y1="1" x2="12" y2="3" />
			<line x1="12" y1="21" x2="12" y2="23" />
			<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
			<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
			<line x1="1" y1="12" x2="3" y2="12" />
			<line x1="21" y1="12" x2="23" y2="12" />
			<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
			<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
		</svg>
	),
};

export default function DeploymentSection({ data }) {
	const d = data ?? {};

	return (
		<section className="bg-slate-50 px-4 py-16 sm:px-8">
			<div style={{ maxWidth: "1536px", margin: "0 auto" }}>
				<div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
					{d.eyebrow && <p className="mb-3 text-[10px] font-semibold tracking-widest text-brand-red uppercase">{d.eyebrow}</p>}
					<h2 className="font-heading text-3xl font-bold text-brand-blue sm:text-4xl">
						{d.title}
						{d.titleHighlight && <span className="text-brand-red"> {d.titleHighlight}</span>}
					</h2>
				</div>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					{(d.items ?? []).map((item, i) => (
						<div key={i} className="border border-t-4 border-black/5 border-t-transparent bg-white transition-all hover:border-t-brand-red hover:shadow-md" style={{ borderRadius: 12, padding: "20px 22px", display: "flex", gap: 14, alignItems: "flex-start" }}>
							<div style={{ width: 40, height: 40, borderRadius: 10, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#1B2A6B" }}>
								{DEPLOY_ICONS[item.icon] ?? DEPLOY_ICONS.network}
							</div>
							<div>
								<h3 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 700, color: "#1B2A6B" }}>{item.title}</h3>
								<p style={{ margin: 0, fontSize: 13, color: "#4b5563", lineHeight: 1.65 }}>{item.description}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

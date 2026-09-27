const OFFER_ICONS = {
	layers: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
			<polygon points="12 2 2 7 12 12 22 7 12 2" />
			<polyline points="2 17 12 22 22 17" />
			<polyline points="2 12 12 17 22 12" />
		</svg>
	),
	shield: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
			<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
		</svg>
	),
	wifi: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
			<path d="M5 12.55a11 11 0 0 1 14.08 0" />
			<path d="M1.42 9a16 16 0 0 1 21.16 0" />
			<path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
			<line x1="12" y1="20" x2="12.01" y2="20" />
		</svg>
	),
};

export default function AboutSection({ data }) {
	const d = data ?? {};

	return (
		<section className="bg-white px-4 py-16 sm:px-8">
			<div style={{ maxWidth: "1536px", margin: "0 auto" }}>
				<div className="grid items-start gap-12 lg:grid-cols-2">
					<div>
						{d.eyebrow && (
							<p className="mb-3 text-[10px] font-semibold tracking-widest text-brand-red uppercase">{d.eyebrow}</p>
						)}
						<h2 className="font-heading mb-5 text-3xl font-bold text-brand-blue sm:text-4xl">{d.title}</h2>
						<p style={{ fontSize: 15, lineHeight: 1.8, color: "#4b5563" }}>{d.description}</p>
					</div>

					<div>
						{d.offersEyebrow && (
							<p className="mb-6 text-[10px] font-semibold tracking-widest text-brand-red uppercase">{d.offersEyebrow}</p>
						)}
						<div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
							{(d.offers ?? []).map((offer, i) => (
								<div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
									<div style={{ width: 38, height: 38, borderRadius: 10, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#1B2A6B" }}>
										{OFFER_ICONS[offer.icon] ?? OFFER_ICONS.layers}
									</div>
									<div>
										<h3 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: "#1B2A6B" }}>{offer.title}</h3>
										<p style={{ margin: 0, fontSize: 13, color: "#4b5563", lineHeight: 1.65 }}>{offer.description}</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default function TechPartnersSection({ data }) {
	const d = data ?? {};

	return (
		<section className="bg-brand-light px-4 py-16 sm:px-8">
			<div style={{ maxWidth: "1536px", margin: "0 auto" }}>
				<div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
					{d.eyebrow && <p className="mb-3 text-[10px] font-semibold tracking-widest text-brand-red uppercase">{d.eyebrow}</p>}
					<h2 className="font-heading text-3xl font-bold text-brand-blue sm:text-4xl">
						{d.title}
						{d.titleHighlight && <span className="text-brand-red"> {d.titleHighlight}</span>}
					</h2>
					{d.subtitle && <p style={{ marginTop: 12, fontSize: 15, color: "#4b5563", lineHeight: 1.75, maxWidth: "44rem", margin: "12px auto 0" }}>{d.subtitle}</p>}
				</div>
				<div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
					{(d.partners ?? []).map((partner, i) => (
						<div key={i} className="border border-[#e2e8f0] transition-colors hover:border-brand-blue" style={{ flex: "1 1 160px", minWidth: 160, background: "#f8fafc", borderRadius: 12, padding: "18px 20px" }}>
							<p style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 800, color: "#1B2A6B" }}>{partner.name}</p>
							<p style={{ margin: 0, fontSize: 12, color: "#64748b", lineHeight: 1.4 }}>{partner.role}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

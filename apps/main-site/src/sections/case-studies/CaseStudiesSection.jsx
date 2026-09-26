function CaseStudyCard({ item }) {
	return (
		<div className="overflow-hidden rounded-xl border border-t-4 border-black/5 border-t-transparent bg-white transition-all hover:border-t-brand-red hover:shadow-md"
			style={{ display: "flex", flexDirection: "column" }}>

			{/* Dark header: tag, title, client */}
			<div style={{ background: "#1B2A6B", padding: "18px 20px 20px" }}>
				{item.tag && (
					<span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>
						{item.tag}
					</span>
				)}
				<h3 style={{ margin: "6px 0 8px", fontSize: 15, fontWeight: 700, lineHeight: 1.4, color: "white" }}>
					{item.title}
				</h3>
				{item.client && (
					<p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", gap: 5 }}>
						<span style={{ color: "#E63946", fontSize: 14 }}>•</span> {item.client}
					</p>
				)}
			</div>

			{/* White body: description + metric */}
			<div style={{ padding: "18px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
				<p style={{ margin: "0 0 16px", fontSize: 13, color: "#4b5563", lineHeight: 1.65, flex: 1 }}>
					{item.description}
				</p>
				{(item.metric || item.metricLabel) && (
					<div style={{ paddingTop: 14, borderTop: "1px solid #e2e8f0", marginTop: "auto" }}>
						{item.metric && (
							<p className="font-heading" style={{ margin: "0 0 4px", fontSize: 28, fontWeight: 800, color: "#1B2A6B" }}>
								{item.metric}
							</p>
						)}
						{item.metricLabel && (
							<p style={{ margin: 0, fontSize: 11, color: "#6b7280", lineHeight: 1.5 }}>
								{item.metricLabel}
							</p>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

export default function CaseStudiesSection({ data }) {
	const { eyebrow, title, items = [] } = data ?? {};

	return (
		<section className="bg-slate-50 px-4 py-16 sm:px-8">
			<div style={{ maxWidth: "1536px", margin: "0 auto" }}>
				<div style={{ marginBottom: "2.5rem" }}>
					{eyebrow && <p className="mb-3 text-[10px] font-semibold tracking-widest text-brand-red uppercase">{eyebrow}</p>}
					<h2 className="font-heading text-4xl font-bold text-brand-blue lg:text-5xl">{title}</h2>
				</div>

				<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{items.map((item, i) => (
						<CaseStudyCard key={i} item={item} />
					))}
				</div>
			</div>
		</section>
	);
}
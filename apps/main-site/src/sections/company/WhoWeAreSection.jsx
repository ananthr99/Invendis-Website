function CardIcon({ icon }) {
	if (icon === "target") return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
			<circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
		</svg>
	);
	if (icon === "eye") return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
			<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" />
		</svg>
	);
	if (icon === "layers") return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
			<polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
		</svg>
	);
	return null;
}

export default function WhoWeAreSection({ data }) {
	const { eyebrow, title, cards = [] } = data ?? {};

	return (
		<section className="bg-white px-4 py-16 sm:px-8">
			<div style={{ maxWidth: "1536px", margin: "0 auto" }}>
				<div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
					{eyebrow && <p className="mb-3 text-[10px] font-semibold tracking-widest text-brand-red uppercase">{eyebrow}</p>}
					<h2 className="font-heading text-4xl font-bold text-brand-blue lg:text-5xl">{title}</h2>
				</div>
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{cards.map((card) => (
						<div key={card.title} className="rounded-2xl border border-t-4 border-black/5 border-t-transparent bg-brand-light p-8 transition-all hover:border-t-brand-red hover:shadow-md">
							<div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
								<CardIcon icon={card.icon} />
							</div>
							<h3 className="font-heading text-base font-bold text-brand-text">{card.title}</h3>
							<p className="mt-2 text-sm leading-relaxed text-brand-muted">{card.body}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

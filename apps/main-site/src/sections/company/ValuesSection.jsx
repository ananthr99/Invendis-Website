function ValueIcon({ icon }) {
	if (icon === "lightbulb") return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
			<path d="M9 21h6M12 3a6 6 0 0 1 6 6c0 2.22-1.2 4.16-3 5.2V17H9v-2.8A6 6 0 0 1 6 9a6 6 0 0 1 6-6z" />
		</svg>
	);
	if (icon === "shield") return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
			<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
		</svg>
	);
	if (icon === "handshake") return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
			<path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 7.65l.77.77 7.65 7.65 7.65-7.65.77-.77a5.4 5.4 0 0 0 0-7.65z" />
		</svg>
	);
	if (icon === "users") return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
			<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
			<path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
		</svg>
	);
	return null;
}

export default function ValuesSection({ data }) {
	const { eyebrow, title, items = [] } = data ?? {};

	return (
		<section className="bg-brand-light px-4 py-16 sm:px-8">
			<div style={{ maxWidth: "1536px", margin: "0 auto" }}>
				<div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
					{eyebrow && <p className="mb-3 text-[10px] font-semibold tracking-widest text-brand-red uppercase">{eyebrow}</p>}
					<h2 className="font-heading text-4xl font-bold text-brand-blue lg:text-5xl">{title}</h2>
				</div>
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{items.map((item) => (
						<div key={item.title} className="rounded-2xl border border-t-4 border-black/5 border-t-transparent bg-white p-6 transition-all hover:border-t-brand-red hover:shadow-md">
							<div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
								<ValueIcon icon={item.icon} />
							</div>
							<h3 className="font-heading text-base font-bold text-brand-text">{item.title}</h3>
							<p className="mt-2 text-sm leading-relaxed text-brand-muted">{item.description}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

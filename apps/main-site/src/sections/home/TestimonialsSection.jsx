export default function TestimonialsSection({ data }) {
	const { eyebrow, title, titleHighlight, items = [] } = data ?? {};

	return (
		<section className="bg-brand-light px-6 py-20">
			<div className="mx-auto max-w-6xl">
				<div className="mb-12 text-center">
					<p className="mb-3 text-[10px] font-semibold tracking-widest text-brand-red uppercase">{eyebrow}</p>
					<h2 className="font-heading text-3xl font-bold text-brand-text sm:text-4xl">
						{title}
						<span className="text-brand-blue-light">{titleHighlight}</span>
					</h2>
				</div>
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{items.map((item) => (
						<div key={item.name} className="flex flex-col rounded-2xl border border-black/5 bg-white p-6">
							<p className="flex-1 text-sm leading-relaxed text-brand-text">&ldquo;{item.quote}&rdquo;</p>
							<div className="mt-6 flex items-center gap-3">
								<div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-blue text-xs font-bold text-white">
									{item.initials}
								</div>
								<div>
									<p className="text-sm font-semibold text-brand-text">{item.name}</p>
									<p className="text-xs text-brand-muted">{item.role}</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

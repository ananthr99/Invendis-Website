function GlobeIcon({ className }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
		</svg>
	);
}

function getColCount(n) {
	if (n <= 3) return n;
	if (n === 4) return 2;
	return 3;
}

export default function GlobalReachSection({ data }) {
	const { eyebrow, title, titleHighlight, subtitle, regions = [] } = data ?? {};

	const count = regions.length;
	const cols = getColCount(count);
	const lastRowItems = count % cols || cols;
	const isLastAlone = lastRowItems === 1;

	return (
		<section className="bg-brand-blue px-4 py-20 sm:px-8">
			<div style={{ maxWidth: 1536, margin: "0 auto" }}>

				<div className="mb-12 text-center">
					<p className="mb-3 text-[10px] font-semibold tracking-widest text-brand-red uppercase">{eyebrow}</p>
					<h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">
						{title}
						<span className="text-brand-red">{titleHighlight}</span>
					</h2>
					<p className="mx-auto mt-4 max-w-2xl text-white" style={{ fontSize: 15 }}>{subtitle}</p>
				</div>

				<div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "1.25rem" }}>
					{regions.map((region, i) => {
						const isLast = i === count - 1;
						return (
							<div
								key={region.name}
								style={{
									gridColumn: isLast && isLastAlone ? "1 / -1" : undefined,
									borderRadius: 16,
									border: "1px solid rgba(255,255,255,0.15)",
									background: "rgba(255,255,255,0.05)",
									padding: "2rem 1.5rem",
									textAlign: "center",
								}}
							>
								<div style={{
									margin: "0 auto 1rem",
									width: 40,
									height: 40,
									borderRadius: "50%",
									border: "1px solid rgba(255,255,255,0.15)",
									background: "rgba(255,255,255,0.1)",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}>
									<GlobeIcon className="h-5 w-5 text-white/70" />
								</div>
								<h3 className="font-heading text-lg font-bold text-white">{region.name}</h3>
								<p className="mt-3 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
									{region.countries.join(", ")}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}

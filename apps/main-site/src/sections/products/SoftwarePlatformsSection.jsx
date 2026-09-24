const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function siteImg(path) { return path ? BASE + path : path; }

function CameraIcon({ className }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
			<path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
		</svg>
	);
}

function SoftwareIcon({ className }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
		</svg>
	);
}

export default function SoftwarePlatformsSection({ data }) {
	const { eyebrow, title, subtitle, items = [] } = data ?? {};
	const featured = items.find((i) => i.featured);
	const rest = items.filter((i) => !i.featured);
	const featuredImg = featured ? (Array.isArray(featured.image) ? featured.image[0] : featured.image) : null;

	return (
		<section className="bg-white px-4 py-20 sm:px-8">
			<div className="mx-auto max-w-screen-2xl">
				<div className="mb-12 text-center">
					<p className="mb-3 text-[10px] font-semibold tracking-widest text-brand-red uppercase">{eyebrow}</p>
					<h2 className="font-heading text-3xl font-bold text-brand-text sm:text-4xl">{title}</h2>
					<p className="mx-auto mt-4 max-w-2xl text-brand-muted">{subtitle}</p>
				</div>

				{/* Featured item */}
				{featured && (
					<div className="mb-6 rounded-2xl border border-t-4 border-black/5 border-t-transparent bg-brand-light transition-all hover:border-t-brand-red hover:shadow-md" style={{ display: "flex", alignItems: "center", gap: "3rem", padding: "2rem 2.5rem" }}>
						<div style={{ flex: "1 1 0", minWidth: 0 }}>
							<div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(27,42,107,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
								<SoftwareIcon className="h-5 w-5 text-brand-blue" />
							</div>
							<h3 className="font-heading text-xl font-bold text-brand-text">{featured.name}</h3>
							<p className="mt-2 leading-relaxed text-brand-muted">{featured.description}</p>
							{featured.tags?.length > 0 && (
								<div className="mt-4 flex flex-wrap gap-2">
									{featured.tags.map((tag) => (
										<span key={tag} className="rounded-full px-3 py-1 text-xs font-medium text-white" style={{ background: "#1B2A6B" }}>
											{tag}
										</span>
									))}
								</div>
							)}
						</div>
						<div style={{ flex: "0 0 380px", height: 220, borderRadius: 12, overflow: "hidden", border: "1px solid rgba(0,0,0,0.07)", flexShrink: 0, background: "white" }}>
							{featuredImg ? (
								<img src={siteImg(featuredImg)} alt={featured.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
							) : (
								<div className="flex h-full w-full items-center justify-center bg-white">
									<CameraIcon className="h-6 w-6 text-brand-muted/30" />
								</div>
							)}
						</div>
					</div>
				)}

				{/* Remaining items — 3-column grid */}
				<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}>
					{rest.map((item) => (
						<div key={item.key} className="mb-6 rounded-2xl border border-t-4 border-black/5 border-t-transparent bg-brand-light transition-all hover:border-t-brand-red hover:shadow-md" style={{ padding: "1.5rem" }}>
							<div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(27,42,107,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.75rem" }}>
								<SoftwareIcon className="h-4 w-4 text-brand-blue" />
							</div>
							<h3 className="font-heading text-sm font-bold text-brand-text">{item.name}</h3>
							<p className="mt-2 text-sm leading-relaxed text-brand-muted">{item.description}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

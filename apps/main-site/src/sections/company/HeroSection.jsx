const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function siteImg(path) { return path ? BASE + path : path; }

const STAT_ICONS = [
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
		<rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
	</svg>,
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
		<circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
	</svg>,
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
		<circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
	</svg>,
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
		<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
	</svg>,
];

export default function HeroSection({ data }) {
	const { eyebrow, title, titleHighlight, subtitle, stats = [], image } = data ?? {};

	const bgStyle = image
		? {
			backgroundImage: `url('${siteImg(image)}')`,
			backgroundSize: "cover",
			backgroundPosition: "center right",
		}
		: {
			backgroundImage: `
				linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
				linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
			`,
			backgroundSize: "48px 48px",
		};

	return (
		<section
			className="relative bg-brand-blue px-4 py-16 text-white sm:px-8 lg:py-24"
			style={bgStyle}
		>
			{/* Identical inner structure to Gallery/Contact/Sectors/Products hero */}
			<div style={{
				position: "relative",
				zIndex: 1,
				maxWidth: "1536px",
				margin: "0 auto",
				minHeight: 270,
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
			}}>
				<div style={{ maxWidth: "48%" }}>
					{eyebrow && (
						<p className="mb-4 text-[10px] font-semibold tracking-widest text-brand-red uppercase">{eyebrow}</p>
					)}
					<h1 className="font-heading text-5xl font-bold leading-tight lg:text-6xl">
						{title}
						{titleHighlight && <span className="text-brand-red"> {titleHighlight}</span>}
					</h1>
					{subtitle && (
						<p className="mt-6 text-[15px] leading-relaxed text-white/65" style={{ maxWidth: "28rem" }}>{subtitle}</p>
					)}
				</div>
			</div>

			<div className="flex justify-center text-brand-red" style={{ position: "relative", zIndex: 1, maxWidth: "1536px", margin: "2rem auto 0" }}>
				<svg className="h-5 w-5 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
					<path d="M19 9l-7 7-7-7" />
				</svg>
			</div>

			{/* Stats overlaid at bottom — position absolute so they don't affect section height */}
			{stats.length > 0 && (
				<div style={{ position: "absolute", bottom: "2rem", left: 0, right: 0, zIndex: 1 }}>
					<div className="px-4 sm:px-8" style={{ maxWidth: "1536px", margin: "0 auto" }}>
						<div style={{
							maxWidth: "48%",
							display: "flex",
							gap: "2rem",
							paddingTop: "1rem",
							borderTop: "1px solid rgba(255,255,255,0.15)",
						}}>
							{stats.map((stat, i) => (
								<div key={stat.label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
									<span style={{ color: "rgba(255,255,255,0.5)" }}>{STAT_ICONS[i]}</span>
									<p className="font-heading text-2xl font-bold text-white">{stat.value}</p>
									<p style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", margin: 0 }}>{stat.label}</p>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</section>
	);
}

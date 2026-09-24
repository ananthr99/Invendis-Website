const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function siteImg(path) { return path ? BASE + path : path; }

export default function HeroSection({ data }) {
	const d = data ?? {};

	return (
		<section
			className="relative bg-brand-blue px-4 py-16 text-white sm:px-8 lg:py-24"
			style={{
				backgroundImage: d.image ? `url('${siteImg(d.image)}')` : undefined,
				backgroundSize: "cover",
				backgroundPosition: "center right",
			}}
		>
			{/* Gradient overlay so left-side text stays readable */}
			<div style={{
				position: "absolute",
				inset: 0,
				background: "linear-gradient(to right, rgba(10,20,70,0.95) 30%, rgba(10,20,70,0.6) 60%, rgba(10,20,70,0.15) 100%)",
			}} />

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
					{d.eyebrow && (
						<p className="mb-4 text-[10px] font-semibold tracking-widest text-brand-red uppercase">{d.eyebrow}</p>
					)}
					<h1 className="font-heading text-5xl font-bold leading-tight lg:text-6xl">
						{d.title}
						{d.titleHighlight && <span className="text-brand-red"> {d.titleHighlight}</span>}
					</h1>
					{d.subtitle && (
						<p className="mt-6 text-[15px] leading-relaxed text-white/65" style={{ maxWidth: "28rem" }}>{d.subtitle}</p>
					)}
				</div>
			</div>

			<div className="flex justify-center text-brand-red" style={{ position: "relative", zIndex: 1, maxWidth: "1536px", margin: "2rem auto 0" }}>
				<svg className="h-5 w-5 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
					<path d="M19 9l-7 7-7-7" />
				</svg>
			</div>
		</section>
	);
}
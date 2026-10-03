const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function HeroSection() {
	return (
		<section
			className="relative bg-brand-blue px-4 py-16 text-white sm:px-8 lg:py-24"
			style={{
				backgroundImage: `url('${BASE}/images/product-selector/hero/hero-productselector.webp')`,
				backgroundSize: "cover",
				backgroundPosition: "center right",
			}}
		>
			<div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(11,18,60,0.80) 0%, rgba(11,18,60,0.80) 35%, rgba(11,18,60,0.35) 65%, rgba(11,18,60,0.05) 100%)" }} />
			<div style={{
				position: "relative",
				zIndex: 1,
				maxWidth: "1536px",
				margin: "0 auto",
				minHeight: 335,
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
			}}>
				<div className="lg:max-w-[48%]">
					<p className="mb-4 text-[10px] font-semibold tracking-widest text-brand-red uppercase">
						Find Your Device
					</p>
					<h1 className="font-heading text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
						Product Selector
					</h1>
					<p className="mt-6 text-[15px] leading-relaxed text-white/65" style={{ maxWidth: "28rem" }}>
						Filter by connectivity, performance, and form factor to find the right INVENDIS device for your deployment.
					</p>
				</div>
			</div>

			<div className="text-brand-red" style={{ position: "absolute", bottom: "1.5rem", left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 1 }}>
				<svg className="h-5 w-5 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
					<path d="M19 9l-7 7-7-7" />
				</svg>
			</div>
		</section>
	);
}

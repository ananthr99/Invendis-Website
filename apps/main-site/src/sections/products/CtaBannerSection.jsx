import { Link } from "react-router-dom";

export default function CtaBannerSection({ data }) {
	const { title, subtitle, primaryBtn, secondaryBtn } = data ?? {};

	return (
		<section className="bg-white" style={{ padding: "3rem 2rem" }}>
			<div style={{ maxWidth: 1536, margin: "0 auto" }}>
				<div
					className="text-center text-white"
					style={{
						background: "linear-gradient(to right, #1B2A6B, #7e22ce, #E63946)",
						borderRadius: 24,
						padding: "5rem 4rem",
					}}
				>
					<h2 className="font-heading text-3xl font-bold sm:text-4xl">{title}</h2>
					<p className="mx-auto mt-4 max-w-xl" style={{ color: "rgba(255,255,255,0.75)" }}>
						{subtitle}
					</p>
					<div className="mt-10 flex flex-wrap justify-center gap-4">
						{primaryBtn && (
							<Link
								to={primaryBtn.href}
								className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-brand-red transition-opacity hover:opacity-90"
							>
								{primaryBtn.label}
							</Link>
						)}
						{secondaryBtn && (
							<Link
								to={secondaryBtn.href}
								className="rounded-full border border-white/40 bg-white/10 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20"
							>
								{secondaryBtn.label}
							</Link>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}

import { Link } from "react-router-dom";

export default function CtaBannerSection({ data }) {
	const { title, subtitle, primaryBtn, secondaryBtn } = data ?? {};

	return (
		<section className="bg-white px-4 py-12 sm:px-8">
			<div style={{ maxWidth: 1536, margin: "0 auto" }}>
				<div
					className="relative overflow-hidden rounded-3xl px-6 py-12 text-center text-white sm:px-16 sm:py-20"
					style={{
						background: "#A8111C",
						backgroundImage: `
							radial-gradient(ellipse 80% 60% at 50% -10%, rgba(230,57,70,0.5) 0%, transparent 100%),
							linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
							linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
						`,
						backgroundSize: "auto, 48px 48px, 48px 48px",
					}}
				>
					<div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" }} />
					<div style={{ position: "absolute", bottom: -60, left: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" }} />
					<div style={{ position: "relative", zIndex: 1 }}>
						<h2 className="font-heading text-3xl font-bold sm:text-4xl">{title}</h2>
						<p className="mx-auto mt-4 max-w-xl text-white/75">{subtitle}</p>
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
			</div>
		</section>
	);
}

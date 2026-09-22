import { Link } from "react-router-dom";

export default function HeroSection({ data }) {
	const { title, titleHighlight, subtitle, cta, productGroups = [] } = data ?? {};

	return (
		<section className="bg-brand-blue px-4 py-8 text-white sm:px-8 lg:py-12">
			<div className="mx-auto grid max-w-screen-2xl gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
				<div>
					<h1 className="font-heading text-4xl font-bold leading-tight sm:text-5xl lg:text-[3rem]">
						{title}
						<span className="text-brand-red">{titleHighlight}</span>
					</h1>
					<p className="mt-4 text-[15px] leading-relaxed text-white/65 lg:max-w-md">{subtitle}</p>
					{cta && (
						<Link
							to={cta.href}
							className="mt-5 inline-block rounded-full bg-brand-red px-7 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
						>
							{cta.label}
						</Link>
					)}
				</div>

				<div className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-6">
					{productGroups.map((group) => (
						<div key={group.heading}>
							<p className="mb-3 text-[11px] font-semibold tracking-widest text-white/35 uppercase">{group.heading}</p>
							<div className="flex flex-wrap gap-2">
								{group.items.map((item) => (
									<span
										key={item}
										className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-white/75 border border-white/30 hover:border-brand-red transition-colors cursor-default"
									>
										{item}
									</span>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

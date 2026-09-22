import Icon from "../../components/shared/Icon.jsx";

export default function WhatWeDoSection({ data }) {
	const { eyebrow, title, titleHighlight, subtitle, cards = [] } = data ?? {};

	return (
		<section className="bg-white px-4 py-20 sm:px-8">
			<div className="mx-auto max-w-screen-2xl">
				<div className="mb-12 text-center">
					<p className="mb-3 text-[10px] font-semibold tracking-widest text-brand-red uppercase">{eyebrow}</p>
					<h2 className="font-heading text-3xl font-bold text-brand-text sm:text-4xl">
						{title}
						<span className="text-brand-blue-light">{titleHighlight}</span>
					</h2>
					<p className="mx-auto mt-4 max-w-2xl text-brand-muted">{subtitle}</p>
				</div>
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{cards.map((card) => (
						<div
							key={card.title}
							className="rounded-2xl border border-black/5 bg-brand-light p-8 transition-shadow hover:border-t-brand-red hover:shadow-md"
						>
							<div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
								<Icon name={card.icon} className="h-5 w-5" />
							</div>
							<h3 className="font-heading font-semibold text-brand-text">{card.title}</h3>
							<p className="mt-2 text-sm leading-relaxed text-brand-muted">{card.description}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

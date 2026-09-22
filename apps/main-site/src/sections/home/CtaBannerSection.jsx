import { Link } from "react-router-dom";

export default function CtaBannerSection({ data }) {
	const { title, subtitle, primaryBtn, secondaryBtn } = data ?? {};

	return (
		<section className="bg-brand-light px-4 py-12 sm:px-8">
			<div className="mx-auto max-w-screen-2xl">
				<div className="rounded-3xl bg-gradient-to-r from-brand-blue via-purple-700 to-brand-red px-8 py-16 text-center text-white sm:px-16">
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
		</section>
	);
}

export default function TrustedBySection({ data }) {
	const { heading, clients = [] } = data ?? {};

	return (
		<section className="bg-brand-light px-6 py-10">
			<div className="mx-auto max-w-6xl text-center">
				<p className="mb-8 text-[11px] font-semibold tracking-widest text-brand-red uppercase">{heading}</p>
				<div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
					{clients.map((name) => (
						<span
							key={name}
							className="text-sm font-semibold tracking-wider text-brand-muted/50 uppercase transition-colors hover:text-brand-blue cursor-default"
						>
							{name}
						</span>
					))}
				</div>
			</div>
		</section>
	);
}

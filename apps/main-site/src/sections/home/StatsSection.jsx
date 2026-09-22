export default function StatsSection({ data }) {
	const stats = data ?? [];

	return (
		<div className="bg-brand-blue">
			<div className="mx-auto max-w-screen-2xl border-t border-white/10">
				<div className="grid grid-cols-2 divide-x divide-white/10 sm:grid-cols-4">
					{stats.map((stat) => (
						<div key={stat.label} className="px-6 py-4 text-center text-white">
							<div className="font-heading text-2xl font-bold sm:text-3xl">{stat.value}</div>
							<div className="mt-1 text-xs text-white/45">{stat.label}</div>
						</div>
					))}
				</div>
				<div className="flex justify-center pb-5 pt-1 text-brand-red">
					<svg className="h-5 w-5 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
						<path d="M19 9l-7 7-7-7" />
					</svg>
				</div>
			</div>
		</div>
	);
}

import { Link } from "react-router-dom";

const DEPT_COLORS = {
	Engineering: { bg: "#eff6ff", color: "#1d4ed8" },
	Sales: { bg: "#fef3c7", color: "#b45309" },
	Operations: { bg: "#f0fdf4", color: "#15803d" },
	Design: { bg: "#fdf4ff", color: "#7e22ce" },
	Marketing: { bg: "#fff1f2", color: "#be123c" },
};

export default function OpeningsSection({ data }) {
	const d = data ?? {};
	const jobs = d.jobs ?? [];

    if (jobs.length === 0) return (
		<section id="openings" className="bg-white px-4 py-16 sm:px-8">
			<div style={{ maxWidth: "1536px", margin: "0 auto", textAlign: "center", padding: "2rem 0" }}>
				<p style={{ fontSize: 15, color: "#94a3b8" }}>Currently no open positions — check back soon.</p>
			</div>
		</section>
	);

	return (
		<section id="openings" className="bg-white px-4 py-16 sm:px-8">
			<div style={{ maxWidth: "1536px", margin: "0 auto" }}>
				<div style={{ marginBottom: "2.5rem" }}>
					{d.eyebrow && <p className="mb-3 text-[10px] font-semibold tracking-widest text-brand-red uppercase">{d.eyebrow}</p>}
					<h2 className="font-heading text-3xl font-bold text-brand-blue sm:text-4xl">{d.title}</h2>
					{d.subtitle && <p style={{ marginTop: 10, fontSize: 15, color: "#4b5563" }}>{d.subtitle}</p>}
				</div>


				{jobs.length === 0 ? (
					<div style={{ textAlign: "center", padding: "3rem 0", color: "#94a3b8" }}>
						<p style={{ fontSize: 15 }}>No open positions at the moment — check back soon.</p>
					</div>
				) : (
					<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
						{jobs.map((job, i) => {
							const deptStyle = DEPT_COLORS[job.department] ?? { bg: "#f1f5f9", color: "#475569" };
							return (
								<div key={i} className="border border-t-4 border-black/5 border-t-transparent bg-white transition-all hover:border-t-brand-red hover:shadow-md" style={{ borderRadius: 12, padding: "18px 22px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
									<div style={{ flex: 1, minWidth: 0 }}>
										<div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
											<h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#1B2A6B" }}>{job.title}</h3>
											<span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: deptStyle.bg, color: deptStyle.color, letterSpacing: "0.05em", textTransform: "uppercase" }}>
												{job.department}
											</span>
										</div>
										<div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
											{job.location && (
												<span style={{ fontSize: 12, color: "#64748b", display: "flex", alignItems: "center", gap: 4 }}>
													<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ width: 13, height: 13 }}>
														<path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
														<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
													</svg>
													{job.location}
												</span>
											)}
											{job.type && (
												<span style={{ fontSize: 12, color: "#64748b", display: "flex", alignItems: "center", gap: 4 }}>
													<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ width: 13, height: 13 }}>
														<circle cx="12" cy="12" r="10" />
														<polyline points="12 6 12 12 16 14" />
													</svg>
													{job.type}
												</span>
											)}
										</div>
									</div>
									{job.link && (
										<Link
											to={job.link}
											className="inline-block rounded-full bg-brand-red px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
											style={{ textDecoration: "none", flexShrink: 0 }}
										>
											Apply →
										</Link>
									)}
								</div>
							);
						})}
					</div>
				)}
			</div>
		</section>
	);
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function siteImg(path) { return path ? BASE + path : path; }

function LinkedInIcon() {
	return (
		<svg style={{ width: 12, height: 12 }} viewBox="0 0 24 24" fill="currentColor">
			<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
		</svg>
	);
}

export default function LeadershipSection({ data }) {
	const { eyebrow, title, subtitle, members = [] } = data ?? {};

	return (
		<section className="bg-brand-light px-4 py-16 sm:px-8">
			<div style={{ maxWidth: "1536px", margin: "0 auto" }}>
				<div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
					{eyebrow && <p className="mb-3 text-[10px] font-semibold tracking-widest text-brand-red uppercase">{eyebrow}</p>}
					<h2 className="font-heading text-4xl font-bold text-brand-blue lg:text-5xl">{title}</h2>
					{subtitle && <p className="mx-auto mt-4 max-w-2xl text-[14px] leading-relaxed text-brand-muted">{subtitle}</p>}
				</div>

				<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
					{members.map((member) => (
						<div key={member.name} className="rounded-2xl border border-t-4 border-black/5 border-t-transparent bg-white p-6 text-center transition-all hover:border-t-brand-red hover:shadow-md">

							{/* Avatar — photo if available, else initials */}
							<div style={{ width: 72, height: 72, borderRadius: "50%", overflow: "hidden", margin: "0 auto 12px", flexShrink: 0 }}>
								{member.image ? (
									<img
										src={siteImg(member.image)}
										alt={member.name}
										style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
									/>
								) : (
									<div style={{
										width: "100%",
										height: "100%",
										background: member.color ?? "#1B2A6B",
										color: "white",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										fontSize: 20,
										fontWeight: 700,
										fontFamily: "Sora, sans-serif",
										letterSpacing: "0.02em",
									}}>
										{member.initials}
									</div>
								)}
							</div>

							<p style={{ margin: "0 0 2px", fontSize: 14, fontWeight: 700, color: "#1B2A6B" }}>{member.name}</p>
							<p style={{ margin: "0 0 14px", fontSize: 12, color: "#6b7280" }}>{member.role}</p>

							{member.linkedin ? (
								<a
									href={member.linkedin}
									target="_blank"
									rel="noopener noreferrer"
									style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 14px", borderRadius: 6, border: "1px solid #0077b5", color: "#0077b5", fontSize: 12, fontWeight: 600, textDecoration: "none", transition: "all 0.15s" }}
								>
									<LinkedInIcon /> Connect
								</a>
							) : (
								<span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 14px", borderRadius: 6, border: "1px solid #d1d5db", color: "#9ca3af", fontSize: 12, fontWeight: 600 }}>
									<LinkedInIcon /> Connect
								</span>
							)}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

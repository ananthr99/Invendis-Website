export default function OpeningsEditor({ data, onChange }) {
	const d = data ?? { eyebrow: "", title: "", subtitle: "", jobs: [] };

	function set(field, val) { onChange({ ...d, [field]: val }); }

	function updateJob(i, field, val) {
		const jobs = [...(d.jobs ?? [])];
		jobs[i] = { ...jobs[i], [field]: val };
		onChange({ ...d, jobs });
	}
	function addJob() { onChange({ ...d, jobs: [...(d.jobs ?? []), { title: "", department: "", location: "", type: "Full-time", link: "" }] }); }
	function removeJob(i) { onChange({ ...d, jobs: (d.jobs ?? []).filter((_, j) => j !== i) }); }
	function moveJob(i, dir) {
		const j = i + dir;
		const jobs = [...(d.jobs ?? [])];
		if (j < 0 || j >= jobs.length) return;
		[jobs[i], jobs[j]] = [jobs[j], jobs[i]];
		onChange({ ...d, jobs });
	}

	return (
		<div>
			<div className="admin-field">
				<label className="admin-label">Eyebrow</label>
				<input className="admin-input" value={d.eyebrow ?? ""} onChange={e => set("eyebrow", e.target.value)} />
			</div>
			<div className="admin-field">
				<label className="admin-label">Title</label>
				<input className="admin-input" value={d.title ?? ""} onChange={e => set("title", e.target.value)} />
			</div>
			<div className="admin-field">
				<label className="admin-label">Subtitle</label>
				<textarea className="admin-textarea" value={d.subtitle ?? ""} onChange={e => set("subtitle", e.target.value)} />
			</div>

			<label className="admin-label" style={{ display: "block", marginTop: 16, marginBottom: 8 }}>
				Job Openings
				<span style={{ marginLeft: 8, fontSize: 11, fontWeight: 400, color: "var(--admin-muted)" }}>
					(leave empty to show "no openings" message on site)
				</span>
			</label>
			{(d.jobs ?? []).length === 0 && (
				<p style={{ fontSize: 12, color: "var(--admin-muted)", marginBottom: 12 }}>No jobs added — the site will show "Currently no open positions".</p>
			)}
			{(d.jobs ?? []).map((job, i) => (
				<div key={i} style={{ border: "1px solid var(--admin-border)", borderRadius: 8, padding: 12, marginBottom: 12 }}>
					<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
						<span style={{ fontWeight: 600, fontSize: 13 }}>Job {i + 1}{job.title ? ` — ${job.title}` : ""}</span>
						<div style={{ display: "flex", gap: 4 }}>
							<button className="admin-btn admin-btn--ghost" onClick={() => moveJob(i, -1)} disabled={i === 0}>↑</button>
							<button className="admin-btn admin-btn--ghost" onClick={() => moveJob(i, 1)} disabled={i === (d.jobs ?? []).length - 1}>↓</button>
							<button className="admin-btn admin-btn--ghost" onClick={() => removeJob(i)}>✕</button>
						</div>
					</div>
					<div className="admin-field">
						<label className="admin-label">Job Title</label>
						<input className="admin-input" value={job.title ?? ""} onChange={e => updateJob(i, "title", e.target.value)} />
					</div>
					<div style={{ display: "flex", gap: 8 }}>
						<div className="admin-field" style={{ flex: 1 }}>
							<label className="admin-label">Department</label>
							<input className="admin-input" value={job.department ?? ""} onChange={e => updateJob(i, "department", e.target.value)} placeholder="e.g. Engineering" />
						</div>
						<div className="admin-field" style={{ flex: 1 }}>
							<label className="admin-label">Location</label>
							<input className="admin-input" value={job.location ?? ""} onChange={e => updateJob(i, "location", e.target.value)} placeholder="e.g. Bangalore" />
						</div>
						<div className="admin-field" style={{ flex: "0 0 130px" }}>
							<label className="admin-label">Type</label>
							<select className="admin-input" value={job.type ?? "Full-time"} onChange={e => updateJob(i, "type", e.target.value)}>
								<option value="Full-time">Full-time</option>
								<option value="Part-time">Part-time</option>
								<option value="Contract">Contract</option>
								<option value="Internship">Internship</option>
							</select>
						</div>
					</div>
					<div className="admin-field">
						<label className="admin-label">Apply Link</label>
						<input className="admin-input" value={job.link ?? ""} onChange={e => updateJob(i, "link", e.target.value)} placeholder="/contact" />
					</div>
				</div>
			))}
			<button className="admin-btn admin-btn--ghost" onClick={addJob}>+ Add job</button>
		</div>
	);
}

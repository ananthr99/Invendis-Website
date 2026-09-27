export default function TechPartnersEditor({ data, onChange }) {
	const d = data ?? { eyebrow: "", title: "", titleHighlight: "", subtitle: "", partners: [] };

	function set(field, val) { onChange({ ...d, [field]: val }); }

	function updatePartner(i, field, val) {
		const partners = [...(d.partners ?? [])];
		partners[i] = { ...partners[i], [field]: val };
		onChange({ ...d, partners });
	}
	function addPartner() { onChange({ ...d, partners: [...(d.partners ?? []), { name: "", role: "" }] }); }
	function removePartner(i) { onChange({ ...d, partners: (d.partners ?? []).filter((_, j) => j !== i) }); }
	function movePartner(i, dir) {
		const j = i + dir;
		const partners = [...(d.partners ?? [])];
		if (j < 0 || j >= partners.length) return;
		[partners[i], partners[j]] = [partners[j], partners[i]];
		onChange({ ...d, partners });
	}

	return (
		<div>
			<div className="admin-field">
				<label className="admin-label">Eyebrow</label>
				<input className="admin-input" value={d.eyebrow ?? ""} onChange={e => set("eyebrow", e.target.value)} />
			</div>
			<div style={{ display: "flex", gap: 8 }}>
				<div className="admin-field" style={{ flex: 1 }}>
					<label className="admin-label">Title</label>
					<input className="admin-input" value={d.title ?? ""} onChange={e => set("title", e.target.value)} />
				</div>
				<div className="admin-field" style={{ flex: 1 }}>
					<label className="admin-label">Title Highlight (renders in red)</label>
					<input className="admin-input" value={d.titleHighlight ?? ""} onChange={e => set("titleHighlight", e.target.value)} />
				</div>
			</div>
			<div className="admin-field">
				<label className="admin-label">Subtitle</label>
				<textarea className="admin-textarea" value={d.subtitle ?? ""} onChange={e => set("subtitle", e.target.value)} />
			</div>

			<label className="admin-label" style={{ display: "block", marginTop: 16, marginBottom: 8 }}>Partners</label>
			{(d.partners ?? []).map((partner, i) => (
				<div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
					<div className="admin-field" style={{ flex: 1, marginBottom: 0 }}>
						<label className="admin-label">Name</label>
						<input className="admin-input" value={partner.name ?? ""} onChange={e => updatePartner(i, "name", e.target.value)} />
					</div>
					<div className="admin-field" style={{ flex: 2, marginBottom: 0 }}>
						<label className="admin-label">Role</label>
						<input className="admin-input" value={partner.role ?? ""} onChange={e => updatePartner(i, "role", e.target.value)} />
					</div>
					<div style={{ display: "flex", gap: 4, flexShrink: 0, paddingTop: 18 }}>
						<button className="admin-btn admin-btn--ghost" onClick={() => movePartner(i, -1)} disabled={i === 0}>↑</button>
						<button className="admin-btn admin-btn--ghost" onClick={() => movePartner(i, 1)} disabled={i === (d.partners ?? []).length - 1}>↓</button>
						<button className="admin-btn admin-btn--ghost" onClick={() => removePartner(i)}>✕</button>
					</div>
				</div>
			))}
			<button className="admin-btn admin-btn--ghost" style={{ marginTop: 8 }} onClick={addPartner}>+ Add partner</button>
		</div>
	);
}

export default function DesignPartnersEditor({ data, onChange }) {
	const d = data ?? { eyebrow: "", title: "", partners: [] };

	function set(field, val) {
		onChange({ ...d, [field]: val });
	}

	function updatePartner(i, val) {
		const partners = [...d.partners];
		partners[i] = { ...partners[i], name: val };
		onChange({ ...d, partners });
	}

	function addPartner() {
		onChange({ ...d, partners: [...d.partners, { name: "", logo: [] }] });
	}

	function removePartner(i) {
		onChange({ ...d, partners: d.partners.filter((_, j) => j !== i) });
	}

	function movePartner(i, dir) {
		const j = i + dir;
		const partners = [...d.partners];
		if (j < 0 || j >= partners.length) return;
		[partners[i], partners[j]] = [partners[j], partners[i]];
		onChange({ ...d, partners });
	}

	return (
		<div>
			<div className="admin-field">
				<label className="admin-label">Eyebrow</label>
				<input className="admin-input" value={d.eyebrow} onChange={e => set("eyebrow", e.target.value)} />
			</div>
			<div className="admin-field">
				<label className="admin-label">Title</label>
				<input className="admin-input" value={d.title} onChange={e => set("title", e.target.value)} />
			</div>

			<label className="admin-label" style={{ display: "block", marginTop: 16, marginBottom: 8 }}>Partners</label>
			{d.partners.map((partner, i) => (
				<div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
					<input
						className="admin-input"
						value={partner.name}
						onChange={e => updatePartner(i, e.target.value)}
						placeholder="Partner name"
					/>
					<button className="admin-btn admin-btn--ghost" onClick={() => movePartner(i, -1)} disabled={i === 0}>↑</button>
					<button className="admin-btn admin-btn--ghost" onClick={() => movePartner(i, 1)} disabled={i === d.partners.length - 1}>↓</button>
					<button className="admin-btn admin-btn--ghost" onClick={() => removePartner(i)}>✕</button>
				</div>
			))}
			<button className="admin-btn admin-btn--ghost" style={{ marginTop: 4 }} onClick={addPartner}>+ Add partner</button>
		</div>
	);
}

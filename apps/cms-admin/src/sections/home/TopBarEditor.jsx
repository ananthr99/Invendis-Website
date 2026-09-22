export default function TopBarEditor({ data, onChange }) {
	const d = data ?? { tags: [], cta: { label: "", href: "" } };

	function updateTag(i, val) {
		const tags = [...d.tags];
		tags[i] = val;
		onChange({ ...d, tags });
	}

	function addTag() {
		onChange({ ...d, tags: [...d.tags, ""] });
	}

	function removeTag(i) {
		onChange({ ...d, tags: d.tags.filter((_, j) => j !== i) });
	}

	function updateCta(field, val) {
		onChange({ ...d, cta: { ...d.cta, [field]: val } });
	}

	return (
		<div>
			<div className="admin-field">
				<label className="admin-label">Tags</label>
				{d.tags.map((tag, i) => (
					<div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
						<input className="admin-input" value={tag} onChange={(e) => updateTag(i, e.target.value)} />
						<button className="admin-btn admin-btn--ghost" onClick={() => removeTag(i)}>
							✕
						</button>
					</div>
				))}
				<button className="admin-btn admin-btn--ghost" onClick={addTag}>
					+ Add tag
				</button>
			</div>
			<div className="admin-field">
				<label className="admin-label">CTA Label</label>
				<input
					className="admin-input"
					value={d.cta?.label ?? ""}
					onChange={(e) => updateCta("label", e.target.value)}
				/>
			</div>
			<div className="admin-field">
				<label className="admin-label">CTA Link</label>
				<input className="admin-input" value={d.cta?.href ?? ""} onChange={(e) => updateCta("href", e.target.value)} />
			</div>
		</div>
	);
}

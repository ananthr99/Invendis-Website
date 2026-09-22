export default function CtaBannerEditor({ data, onChange }) {
	const d = data ?? {
		title: "",
		subtitle: "",
		primaryBtn: { label: "", href: "" },
		secondaryBtn: { label: "", href: "" },
	};

	function set(field, val) {
		onChange({ ...d, [field]: val });
	}

	function updateBtn(btnKey, field, val) {
		onChange({ ...d, [btnKey]: { ...d[btnKey], [field]: val } });
	}

	return (
		<div>
			<div className="admin-field">
				<label className="admin-label">Title</label>
				<input className="admin-input" value={d.title} onChange={(e) => set("title", e.target.value)} />
			</div>
			<div className="admin-field">
				<label className="admin-label">Subtitle</label>
				<textarea className="admin-textarea" value={d.subtitle} onChange={(e) => set("subtitle", e.target.value)} />
			</div>
			<div className="admin-field">
				<label className="admin-label">Primary Button Label</label>
				<input
					className="admin-input"
					value={d.primaryBtn?.label ?? ""}
					onChange={(e) => updateBtn("primaryBtn", "label", e.target.value)}
				/>
			</div>
			<div className="admin-field">
				<label className="admin-label">Primary Button Link</label>
				<input
					className="admin-input"
					value={d.primaryBtn?.href ?? ""}
					onChange={(e) => updateBtn("primaryBtn", "href", e.target.value)}
				/>
			</div>
			<div className="admin-field">
				<label className="admin-label">Secondary Button Label</label>
				<input
					className="admin-input"
					value={d.secondaryBtn?.label ?? ""}
					onChange={(e) => updateBtn("secondaryBtn", "label", e.target.value)}
				/>
			</div>
			<div className="admin-field">
				<label className="admin-label">Secondary Button Link</label>
				<input
					className="admin-input"
					value={d.secondaryBtn?.href ?? ""}
					onChange={(e) => updateBtn("secondaryBtn", "href", e.target.value)}
				/>
			</div>
		</div>
	);
}

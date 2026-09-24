export default function ContactBodyEditor({ data, onChange }) {
	const d = data ?? { info: {}, quickFacts: [], form: {} };
	const info = d.info ?? {};
	const quickFacts = d.quickFacts ?? [];
	const form = d.form ?? {};
	const additionalFields = form.additionalFields ?? [];

	function setInfo(field, val) {
		onChange({ ...d, info: { ...info, [field]: val } });
	}

	function setFormField(field, val) {
		onChange({ ...d, form: { ...form, [field]: val } });
	}

	function updateQuickFact(i, val) {
		const next = [...quickFacts];
		next[i] = val;
		onChange({ ...d, quickFacts: next });
	}

	function addQuickFact() {
		onChange({ ...d, quickFacts: [...quickFacts, ""] });
	}

	function removeQuickFact(i) {
		onChange({ ...d, quickFacts: quickFacts.filter((_, j) => j !== i) });
	}

	function updateAdditionalField(i, field, val) {
		const next = [...additionalFields];
		next[i] = { ...next[i], [field]: val };
		onChange({ ...d, form: { ...form, additionalFields: next } });
	}

	function addAdditionalField() {
		onChange({ ...d, form: { ...form, additionalFields: [...additionalFields, { label: "", placeholder: "", required: false }] } });
	}

	function removeAdditionalField(i) {
		onChange({ ...d, form: { ...form, additionalFields: additionalFields.filter((_, j) => j !== i) } });
	}

	return (
		<div>
			{/* Contact Info */}
			<h4 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--admin-muted)" }}>Contact Info</h4>
			<div className="admin-field">
				<label className="admin-label">Headquarters Address</label>
				<textarea className="admin-textarea" value={info.headquarters ?? ""} onChange={e => setInfo("headquarters", e.target.value)} />
			</div>
			<div style={{ display: "flex", gap: 8 }}>
				<div className="admin-field" style={{ flex: 1 }}>
					<label className="admin-label">Phone</label>
					<input className="admin-input" value={info.phone ?? ""} onChange={e => setInfo("phone", e.target.value)} />
				</div>
				<div className="admin-field" style={{ flex: 1 }}>
					<label className="admin-label">Email</label>
					<input className="admin-input" type="email" value={info.email ?? ""} onChange={e => setInfo("email", e.target.value)} />
				</div>
			</div>
			<div className="admin-field">
				<label className="admin-label">Foreign Office</label>
				<input className="admin-input" value={info.foreignOffice ?? ""} onChange={e => setInfo("foreignOffice", e.target.value)} />
			</div>

			{/* Quick Facts */}
			<div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--admin-border)" }}>
				<h4 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--admin-muted)" }}>Quick Facts</h4>
				{quickFacts.map((fact, i) => (
					<div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
						<input
							className="admin-input"
							value={fact}
							placeholder="e.g. 32+ Countries"
							onChange={e => updateQuickFact(i, e.target.value)}
						/>
						<button className="admin-btn admin-btn--ghost" onClick={() => removeQuickFact(i)}>✕</button>
					</div>
				))}
				<button className="admin-btn admin-btn--ghost" onClick={addQuickFact}>+ Add fact</button>
			</div>

			{/* Form Labels */}
			<div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--admin-border)" }}>
				<h4 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--admin-muted)" }}>Form</h4>
				<div className="admin-field">
					<label className="admin-label">Form Title</label>
					<input className="admin-input" value={form.title ?? ""} onChange={e => setFormField("title", e.target.value)} />
				</div>
				<div style={{ display: "flex", gap: 8 }}>
					<div className="admin-field" style={{ flex: 1 }}>
						<label className="admin-label">Name Label</label>
						<input className="admin-input" value={form.nameLabel ?? ""} onChange={e => setFormField("nameLabel", e.target.value)} />
					</div>
					<div className="admin-field" style={{ flex: 1 }}>
						<label className="admin-label">Name Placeholder</label>
						<input className="admin-input" value={form.namePlaceholder ?? ""} onChange={e => setFormField("namePlaceholder", e.target.value)} />
					</div>
				</div>
				<div style={{ display: "flex", gap: 8 }}>
					<div className="admin-field" style={{ flex: 1 }}>
						<label className="admin-label">Company Label</label>
						<input className="admin-input" value={form.companyLabel ?? ""} onChange={e => setFormField("companyLabel", e.target.value)} />
					</div>
					<div className="admin-field" style={{ flex: 1 }}>
						<label className="admin-label">Company Placeholder</label>
						<input className="admin-input" value={form.companyPlaceholder ?? ""} onChange={e => setFormField("companyPlaceholder", e.target.value)} />
					</div>
				</div>
				<div style={{ display: "flex", gap: 8 }}>
					<div className="admin-field" style={{ flex: 1 }}>
						<label className="admin-label">Email Label</label>
						<input className="admin-input" value={form.emailLabel ?? ""} onChange={e => setFormField("emailLabel", e.target.value)} />
					</div>
					<div className="admin-field" style={{ flex: 1 }}>
						<label className="admin-label">Email Placeholder</label>
						<input className="admin-input" value={form.emailPlaceholder ?? ""} onChange={e => setFormField("emailPlaceholder", e.target.value)} />
					</div>
				</div>
				<div style={{ display: "flex", gap: 8 }}>
					<div className="admin-field" style={{ flex: 1 }}>
						<label className="admin-label">Message Label</label>
						<input className="admin-input" value={form.messageLabel ?? ""} onChange={e => setFormField("messageLabel", e.target.value)} />
					</div>
					<div className="admin-field" style={{ flex: 1 }}>
						<label className="admin-label">Submit Button Label</label>
						<input className="admin-input" value={form.submitLabel ?? ""} onChange={e => setFormField("submitLabel", e.target.value)} />
					</div>
				</div>
				<div className="admin-field">
					<label className="admin-label">Message Placeholder</label>
					<input className="admin-input" value={form.messagePlaceholder ?? ""} onChange={e => setFormField("messagePlaceholder", e.target.value)} />
				</div>

				{/* Additional Fields */}
				<label className="admin-label" style={{ display: "block", marginTop: 16, marginBottom: 8 }}>Additional Form Fields</label>
				<p style={{ fontSize: 12, color: "var(--admin-muted)", margin: "0 0 10px" }}>Appear between Email and Message on the live form.</p>
				{additionalFields.map((field, i) => (
					<div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
						<input
							className="admin-input"
							placeholder="Label (e.g. Industry)"
							value={field.label ?? ""}
							onChange={e => updateAdditionalField(i, "label", e.target.value)}
						/>
						<input
							className="admin-input"
							placeholder="Placeholder text"
							value={field.placeholder ?? ""}
							onChange={e => updateAdditionalField(i, "placeholder", e.target.value)}
						/>
						<label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, whiteSpace: "nowrap", cursor: "pointer" }}>
							<input
								type="checkbox"
								checked={!!field.required}
								onChange={e => updateAdditionalField(i, "required", e.target.checked)}
							/>
							Required
						</label>
						<button className="admin-btn admin-btn--ghost" onClick={() => removeAdditionalField(i)}>✕</button>
					</div>
				))}
				<button className="admin-btn admin-btn--ghost" onClick={addAdditionalField}>+ Add field</button>
			</div>
		</div>
	);
}

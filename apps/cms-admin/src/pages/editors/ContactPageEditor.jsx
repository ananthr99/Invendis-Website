import { useState, useEffect, useRef } from "react";
import { useAdmin } from "../../context/AdminContext.jsx";
import { loadPageContent, savePageContent } from "../../utils/savePageContent.js";
import SpecialCharsBar from "../../components/SpecialCharsBar.jsx";

const CONTENT_PATH = "pages/contact.json";

export default function ContactPageEditor() {
	const { token, toast, setDirty, userEmail } = useAdmin();
	const [original, setOriginal] = useState(null);
	const [form, setForm] = useState(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const loadedTokenRef = useRef(null);
	const subtitleRef = useRef(null);

	useEffect(() => {
		if (!token || loadedTokenRef.current === token) return;
		loadedTokenRef.current = token;
		setLoading(true);
		loadPageContent(CONTENT_PATH, token)
			.then((data) => {
				setOriginal(data);
				setForm(data);
			})
			.catch((err) => toast(err.message, "err"))
			.finally(() => setLoading(false));
	}, [token]);

	useEffect(() => {
		if (!original || !form) return;
		setDirty(JSON.stringify(original) !== JSON.stringify(form));
	}, [form, original]);

	if (!token) return <p style={{ color: "var(--admin-muted)" }}>Enter a GitHub token in Setup first.</p>;
	if (loading) return <p style={{ color: "var(--admin-muted)" }}>Loading…</p>;
	if (!form) return null;

	function updateHero(field, value) {
		setForm((f) => ({ ...f, hero: { ...f.hero, [field]: value } }));
	}

	function updateForm(field, value) {
		setForm((f) => ({ ...f, form: { ...f.form, [field]: value } }));
	}

	function updateExtraField(index, field, value) {
		setForm((f) => {
			const additionalFields = [...f.form.additionalFields];
			additionalFields[index] = { ...additionalFields[index], [field]: value };
			return { ...f, form: { ...f.form, additionalFields } };
		});
	}

	function addExtraField() {
		setForm((f) => ({
			...f,
			form: {
				...f.form,
				additionalFields: [...(f.form.additionalFields ?? []), { label: "", placeholder: "", required: false }],
			},
		}));
	}

	function removeExtraField(index) {
		setForm((f) => ({
			...f,
			form: { ...f.form, additionalFields: f.form.additionalFields.filter((_, i) => i !== index) },
		}));
	}

	async function handleSave() {
		setSaving(true);
		try {
			await savePageContent({
				token,
				contentPath: CONTENT_PATH,
				before: original,
				after: form,
				page: "Contact",
				userEmail,
			});
			setOriginal(form);
			setDirty(false);
			toast("Contact page saved — live in a few seconds", "ok");
		} catch (err) {
			toast(err.message, "err");
		} finally {
			setSaving(false);
		}
	}

	return (
		<div>
			<h2>Contact</h2>

			<div className="admin-card">
				<h3 style={{ marginTop: 0 }}>Hero</h3>
				<div className="admin-field">
					<label className="admin-label">Title</label>
					<input
						className="admin-input"
						value={form.hero.title}
						onChange={(e) => updateHero("title", e.target.value)}
					/>
				</div>
				<div className="admin-field">
					<label className="admin-label">Subtitle</label>
					<SpecialCharsBar targetRef={subtitleRef} onInsert={(value) => updateHero("subtitle", value)} />
					<textarea
						ref={subtitleRef}
						className="admin-textarea"
						value={form.hero.subtitle}
						onChange={(e) => updateHero("subtitle", e.target.value)}
					/>
				</div>
			</div>

			<div className="admin-card">
				<h3 style={{ marginTop: 0 }}>Contact email</h3>
				<div className="admin-field">
					<label className="admin-label">Emails sent to</label>
					<input
						className="admin-input"
						value={form.contactEmail}
						onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))}
					/>
				</div>
			</div>

			<div className="admin-card">
				<h3 style={{ marginTop: 0 }}>Additional form fields</h3>
				<p style={{ color: "var(--admin-muted)", fontSize: 13, marginTop: -8 }}>
					Appear on the live form between Email and Message. No code change needed — the main site renders whatever's
					listed here.
				</p>
				{(form.form.additionalFields ?? []).map((field, i) => (
					<div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
						<input
							className="admin-input"
							placeholder="Label (e.g. Industry)"
							value={field.label}
							onChange={(e) => updateExtraField(i, "label", e.target.value)}
						/>
						<input
							className="admin-input"
							placeholder="Placeholder text"
							value={field.placeholder}
							onChange={(e) => updateExtraField(i, "placeholder", e.target.value)}
						/>
						<label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, whiteSpace: "nowrap" }}>
							<input
								type="checkbox"
								checked={!!field.required}
								onChange={(e) => updateExtraField(i, "required", e.target.checked)}
							/>
							Required
						</label>
						<button className="admin-btn admin-btn--ghost" onClick={() => removeExtraField(i)}>
							Remove
						</button>
					</div>
				))}
				<button className="admin-btn admin-btn--ghost" onClick={addExtraField}>
					+ Add field
				</button>
			</div>

			<button className="admin-btn admin-btn--primary" onClick={handleSave} disabled={saving}>
				{saving ? "Saving…" : "Save changes"}
			</button>
		</div>
	);
}

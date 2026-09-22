import { useState, useEffect, useRef } from "react";
import { useAdmin } from "../../context/AdminContext.jsx";
import { loadPageContent, savePageContent } from "../../utils/savePageContent.js";
import { HOME_SECTION_EDITORS, SECTION_LABELS, ALL_SECTION_KEYS } from "../../sections/home/registry.js";

const CONTENT_PATH = "pages/home.json";

export default function HomePageEditor() {
	const { token, toast, setDirty, userEmail } = useAdmin();
	const [original, setOriginal] = useState(null);
	const [form, setForm] = useState(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const loadedTokenRef = useRef(null);

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

	function updateSection(key, val) {
		setForm((f) => ({ ...f, [key]: val }));
	}

	function toggleSection(key) {
		setForm((f) => {
			const active = f.sections ?? [];
			const next = active.includes(key) ? active.filter((k) => k !== key) : [...active, key];
			return { ...f, sections: next };
		});
	}

	async function handleSave() {
		setSaving(true);
		try {
			await savePageContent({
				token,
				contentPath: CONTENT_PATH,
				before: original,
				after: form,
				page: "Home",
				userEmail,
			});
			setOriginal(form);
			setDirty(false);
			toast("Home page saved — live in a few seconds", "ok");
		} catch (err) {
			toast(err.message, "err");
		} finally {
			setSaving(false);
		}
	}

	const activeSections = form.sections ?? [];

	return (
		<div>
			<h2>Home</h2>

			<div className="admin-card">
				<h3 style={{ marginTop: 0 }}>Visible Sections</h3>
				<p style={{ fontSize: 13, color: "var(--admin-muted)", margin: "0 0 12px" }}>
					Uncheck a section to hide it from the page without deleting its content.
				</p>
				<div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
					{ALL_SECTION_KEYS.map((key) => (
						<label key={key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
							<input type="checkbox" checked={activeSections.includes(key)} onChange={() => toggleSection(key)} />
							{SECTION_LABELS[key]}
						</label>
					))}
				</div>
			</div>

			{activeSections.map((key) => {
				const Editor = HOME_SECTION_EDITORS[key];
				if (!Editor) return null;
				return (
					<div key={key} className="admin-card">
						<h3 style={{ marginTop: 0 }}>{SECTION_LABELS[key] ?? key}</h3>
						<Editor data={form[key]} onChange={(val) => updateSection(key, val)} />
					</div>
				);
			})}

			<button className="admin-btn admin-btn--primary" onClick={handleSave} disabled={saving}>
				{saving ? "Saving…" : "Save changes"}
			</button>
		</div>
	);
}

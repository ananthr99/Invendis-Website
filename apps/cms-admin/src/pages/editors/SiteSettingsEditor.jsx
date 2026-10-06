import { useState, useEffect, useRef } from "react";
import { useAdmin } from "../../context/AdminContext.jsx";
import { loadPageContent, savePageContent } from "../../utils/savePageContent.js";

const CONTENT_PATH = "siteSettings.json";

export default function SiteSettingsEditor() {
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
			.then((data) => { setOriginal(data); setForm(data); })
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

	function set(path, val) {
		const [top, sub] = path.split(".");
		setForm(f => sub
			? { ...f, [top]: { ...f[top], [sub]: val } }
			: { ...f, [top]: val }
		);
	}

	async function handleSave() {
		setSaving(true);
		try {
			await savePageContent({ token, contentPath: CONTENT_PATH, before: original, after: form, page: "Site Settings", userEmail });
			setOriginal(form);
			setDirty(false);
			toast("Site settings saved — live in a few seconds", "ok");
		} catch (err) {
			toast(err.message, "err");
		} finally {
			setSaving(false);
		}
	}

	return (
		<div>
			<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
				<h2 style={{ margin: 0 }}>Site Settings</h2>
				<button className="admin-btn admin-btn--primary" onClick={handleSave} disabled={saving}>
					{saving ? "Saving…" : "Save changes"}
				</button>
			</div>

			<div className="admin-card" style={{ marginBottom: 20 }}>
				<h3 style={{ marginTop: 0 }}>WhatsApp</h3>
				<div className="admin-field">
					<label className="admin-label">WhatsApp Number</label>
					<input className="admin-input" value={form.whatsapp ?? ""} onChange={e => set("whatsapp", e.target.value)} placeholder="+91XXXXXXXXXX" />
					<p style={{ fontSize: 12, color: "var(--admin-muted)", margin: "4px 0 0" }}>Include country code. Leave empty to hide the button.</p>
				</div>
			</div>

			<div className="admin-card" style={{ marginBottom: 20 }}>
				<h3 style={{ marginTop: 0 }}>Contact Info</h3>
				<div className="admin-field">
					<label className="admin-label">Email</label>
					<input className="admin-input" value={form.contact?.email ?? ""} onChange={e => set("contact.email", e.target.value)} />
				</div>
				<div className="admin-field">
					<label className="admin-label">Phone</label>
					<input className="admin-input" value={form.contact?.phone ?? ""} onChange={e => set("contact.phone", e.target.value)} />
				</div>
				<div className="admin-field">
					<label className="admin-label">Address</label>
					<textarea className="admin-textarea" value={form.contact?.address ?? ""} onChange={e => set("contact.address", e.target.value)} />
				</div>
			</div>

			<div className="admin-card" style={{ marginBottom: 20 }}>
				<h3 style={{ marginTop: 0 }}>Social Links</h3>
				{["linkedin", "instagram", "facebook", "twitter"].map(key => (
					<div key={key} className="admin-field">
						<label className="admin-label" style={{ textTransform: "capitalize" }}>{key}</label>
						<input className="admin-input" value={form.social?.[key] ?? ""} onChange={e => set(`social.${key}`, e.target.value)} />
					</div>
				))}
			</div>

			<div className="admin-card">
				<h3 style={{ marginTop: 0 }}>Footer</h3>
				<div className="admin-field">
					<label className="admin-label">Tagline</label>
					<input className="admin-input" value={form.footerTagline ?? ""} onChange={e => set("footerTagline", e.target.value)} />
				</div>
			</div>
		</div>
	);
}

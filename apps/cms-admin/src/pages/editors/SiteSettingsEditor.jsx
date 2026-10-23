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

	// Footer links helpers
	const footerLinks = form.footerLinks ?? [];

	function updateColTitle(ci, val) {
		const cols = footerLinks.map((c, i) => i === ci ? { ...c, title: val } : c);
		setForm(f => ({ ...f, footerLinks: cols }));
	}

	function addCol() {
		setForm(f => ({ ...f, footerLinks: [...footerLinks, { title: "", links: [] }] }));
	}

	function removeCol(ci) {
		setForm(f => ({ ...f, footerLinks: footerLinks.filter((_, i) => i !== ci) }));
	}

	function moveCol(ci, dir) {
		const j = ci + dir;
		const cols = [...footerLinks];
		if (j < 0 || j >= cols.length) return;
		[cols[ci], cols[j]] = [cols[j], cols[ci]];
		setForm(f => ({ ...f, footerLinks: cols }));
	}

	function addLink(ci) {
		const cols = footerLinks.map((c, i) => i === ci
			? { ...c, links: [...c.links, { label: "", href: "" }] }
			: c
		);
		setForm(f => ({ ...f, footerLinks: cols }));
	}

	function removeLink(ci, li) {
		const cols = footerLinks.map((c, i) => i === ci
			? { ...c, links: c.links.filter((_, j) => j !== li) }
			: c
		);
		setForm(f => ({ ...f, footerLinks: cols }));
	}

	function moveLink(ci, li, dir) {
		const j = li + dir;
		const cols = footerLinks.map((c, i) => {
			if (i !== ci) return c;
			const links = [...c.links];
			if (j < 0 || j >= links.length) return c;
			[links[li], links[j]] = [links[j], links[li]];
			return { ...c, links };
		});
		setForm(f => ({ ...f, footerLinks: cols }));
	}

	function updateLink(ci, li, field, val) {
		const cols = footerLinks.map((c, i) => i === ci
			? { ...c, links: c.links.map((lnk, j) => j === li ? { ...lnk, [field]: val } : lnk) }
			: c
		);
		setForm(f => ({ ...f, footerLinks: cols }));
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
				<div className="admin-field">
					<label className="admin-label">Website</label>
					<input className="admin-input" value={form.contact?.website ?? ""} onChange={e => set("contact.website", e.target.value)} placeholder="www.invendis.com" />
				</div>
				<div className="admin-field">
					<label className="admin-label">Website (Alt)</label>
					<input className="admin-input" value={form.contact?.websiteAlt ?? ""} onChange={e => set("contact.websiteAlt", e.target.value)} placeholder="www.silbonetworks.com" />
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
				<div className="admin-field">
					<label className="admin-label">Made in India label</label>
					<input className="admin-input" value={form.footerMadeInIndia ?? ""} onChange={e => set("footerMadeInIndia", e.target.value)} />
				</div>

				<div style={{ marginTop: 24 }}>
					<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
						<label className="admin-label" style={{ marginBottom: 0 }}>Link Columns</label>
						<button className="admin-btn admin-btn--ghost" style={{ fontSize: 12 }} onClick={addCol}>+ Add column</button>
					</div>

					{footerLinks.map((col, ci) => (
						<div key={ci} style={{ border: "1px solid var(--admin-border)", borderRadius: 8, padding: 14, marginBottom: 14 }}>
							<div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
								<input
									className="admin-input"
									style={{ flex: 1, fontWeight: 600 }}
									value={col.title}
									onChange={e => updateColTitle(ci, e.target.value)}
									placeholder="Column title"
								/>
								<button className="admin-btn admin-btn--ghost" onClick={() => moveCol(ci, -1)} disabled={ci === 0}>↑</button>
								<button className="admin-btn admin-btn--ghost" onClick={() => moveCol(ci, 1)} disabled={ci === footerLinks.length - 1}>↓</button>
								<button className="admin-btn admin-btn--ghost" onClick={() => removeCol(ci)}>✕</button>
							</div>

							{col.links.map((lnk, li) => (
								<div key={li} style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
									<input
										className="admin-input"
										style={{ flex: "0 0 160px" }}
										value={lnk.label}
										onChange={e => updateLink(ci, li, "label", e.target.value)}
										placeholder="Label"
									/>
									<input
										className="admin-input"
										style={{ flex: 1 }}
										value={lnk.href}
										onChange={e => updateLink(ci, li, "href", e.target.value)}
										placeholder="/path"
									/>
									<button className="admin-btn admin-btn--ghost" onClick={() => moveLink(ci, li, -1)} disabled={li === 0}>↑</button>
									<button className="admin-btn admin-btn--ghost" onClick={() => moveLink(ci, li, 1)} disabled={li === col.links.length - 1}>↓</button>
									<button className="admin-btn admin-btn--ghost" onClick={() => removeLink(ci, li)}>✕</button>
								</div>
							))}

							<button className="admin-btn admin-btn--ghost" style={{ fontSize: 12, marginTop: 4 }} onClick={() => addLink(ci)}>
								+ Add link
							</button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useAdmin } from "../../context/AdminContext.jsx";
import { loadPageContent, savePageContent } from "../../utils/savePageContent.js";
import { CONTACT_SECTION_EDITORS, SECTION_LABELS, ALL_SECTION_KEYS } from "../../sections/contact/registry.js";
import { github } from "../../config.js";

const CONTENT_PATH = "pages/contact.json";

export default function ContactPageEditor() {
	const { token, toast, setDirty, userEmail } = useAdmin();
	const [original, setOriginal] = useState(null);
	const [form, setForm] = useState(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [activeTab, setActiveTab] = useState(ALL_SECTION_KEYS[0]);
	const loadedTokenRef = useRef(null);
	const headerRef = useRef(null);
	const [headerH, setHeaderH] = useState(110);

	useEffect(() => {
		if (!token || loadedTokenRef.current === token) return;
		loadedTokenRef.current = token;
		setLoading(true);
		loadPageContent(CONTENT_PATH, token)
			.then((data) => { setOriginal(data); setForm(data); })
			.catch((err) => toast(err.message, "err"))
			.finally(() => setLoading(false));
	}, [token]);

	useLayoutEffect(() => {
		if (headerRef.current) setHeaderH(headerRef.current.offsetHeight);
	});

	useEffect(() => {
		if (!original || !form) return;
		const hasPending = !!form.hero?._pendingUpload;
		const cleanForm = {
			...form,
			hero: form.hero ? { ...form.hero, _pendingUpload: undefined } : form.hero,
		};
		setDirty(hasPending || JSON.stringify(original) !== JSON.stringify(cleanForm));
	}, [form, original]);

	if (!token) return <p style={{ color: "var(--admin-muted)" }}>Enter a GitHub token in Setup first.</p>;
	if (loading) return <p style={{ color: "var(--admin-muted)" }}>Loading…</p>;
	if (!form) return null;

	function updateSection(key, val) {
		setForm((f) => ({ ...f, [key]: val }));
	}

	async function handleSave() {
		setSaving(true);
		try {
			let saveForm = form;

			// Pre-flight conflict check
			const pending = form.hero?._pendingUpload;
			if (pending) {
				const path = `apps/main-site/public/images/contact/hero/${pending.filename}`;
				if (await github.getFileSha(path, { branch: "main", token })) {
					throw new Error(`Hero image "${pending.filename}" already exists at /images/contact/hero/. Rename it before saving.`);
				}
			}

			// Upload hero background image
			if (pending) {
				toast("Uploading hero background…", "ok");
				const imgPath = `apps/main-site/public/images/contact/hero/${pending.filename}`;
				const sha = await github.getFileSha(imgPath, { branch: "main", token });
				await github.writeFileBase64(imgPath, pending.base64, {
					message: `CMS: upload contact hero background [skip ci]`,
					sha,
					branch: "main",
					token,
				});
				saveForm = {
					...saveForm,
					hero: { ...saveForm.hero, image: `/images/contact/hero/${pending.filename}`, _pendingUpload: undefined },
				};
				setForm(saveForm);
			}

			await savePageContent({ token, contentPath: CONTENT_PATH, before: original, after: saveForm, page: "Contact", userEmail });
			setOriginal(saveForm);
			setDirty(false);
			toast("Contact page saved — live in a few seconds", "ok");
		} catch (err) {
			toast(err.message, "err");
		} finally {
			setSaving(false);
		}
	}

	const ActiveEditor = CONTACT_SECTION_EDITORS[activeTab];

	return (
		<div>
			<div
				ref={headerRef}
				style={{
					position: "fixed",
					top: 56,
					left: 220,
					right: 0,
					zIndex: 50,
					background: "var(--admin-bg)",
					padding: "16px 40px 0",
					boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
				}}
			>
				<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
					<h2 style={{ margin: 0 }}>Contact</h2>
					<button className="admin-btn admin-btn--primary" onClick={handleSave} disabled={saving}>
						{saving ? "Saving…" : "Save changes"}
					</button>
				</div>
				<div style={{ display: "flex", flexWrap: "wrap", gap: 2, borderBottom: "2px solid var(--admin-border)" }}>
					{ALL_SECTION_KEYS.map((key) => (
						<button
							key={key}
							onClick={() => setActiveTab(key)}
							style={{
								padding: "8px 16px",
								border: "none",
								background: "none",
								cursor: "pointer",
								fontSize: 13.5,
								fontWeight: activeTab === key ? 700 : 400,
								color: activeTab === key ? "var(--admin-blue)" : "var(--admin-muted)",
								borderBottom: activeTab === key ? "2px solid var(--admin-blue)" : "2px solid transparent",
								marginBottom: -2,
								transition: "color 0.15s",
								fontFamily: "inherit",
							}}
						>
							{SECTION_LABELS[key]}
						</button>
					))}
				</div>
			</div>

			<div style={{ height: headerH }} />

			<div className="admin-card">
				<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid var(--admin-border)" }}>
					<h3 style={{ margin: 0 }}>{SECTION_LABELS[activeTab]}</h3>
				</div>
				{ActiveEditor && (
					<ActiveEditor data={form[activeTab]} onChange={(val) => updateSection(activeTab, val)} />
				)}
			</div>
		</div>
	);
}

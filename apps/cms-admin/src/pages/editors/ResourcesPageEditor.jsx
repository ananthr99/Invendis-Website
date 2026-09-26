import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useAdmin } from "../../context/AdminContext.jsx";
import { loadPageContent, savePageContent } from "../../utils/savePageContent.js";
import { RESOURCES_SECTION_EDITORS, SECTION_LABELS, ALL_SECTION_KEYS } from "../../sections/resources/registry.js";
import { github } from "../../config.js";

const CONTENT_PATH = "pages/resources.json";

function stripPending(form) {
	if (!form) return form;
	return {
		...form,
		hero: form.hero ? (({ _pendingUpload, ...rest }) => rest)(form.hero) : form.hero,
	};
}

export default function ResourcesPageEditor() {
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
		setDirty(!!form.hero?._pendingUpload || JSON.stringify(original) !== JSON.stringify(stripPending(form)));
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
			let saveForm = { ...form };

			const heroPending = saveForm.hero?._pendingUpload;
			if (heroPending) {
				const path = `apps/main-site/public/images/resources/hero/${heroPending.filename}`;
				const sha = await github.getFileSha(path, { branch: "main", token });
				toast("Uploading hero image…", "ok");
				await github.writeFileBase64(path, heroPending.base64, { message: `CMS: upload resources hero image [skip ci]`, sha, branch: "main", token });
				saveForm = { ...saveForm, hero: { ...saveForm.hero, image: `/images/resources/hero/${heroPending.filename}`, _pendingUpload: undefined } };
			}

			await savePageContent({ token, contentPath: CONTENT_PATH, before: original, after: saveForm, page: "Resources", userEmail });
			setOriginal(saveForm);
			setForm(saveForm);
			setDirty(false);
			toast("Resources page saved — live in a few seconds", "ok");
		} catch (err) {
			toast(err.message, "err");
		} finally {
			setSaving(false);
		}
	}

	const ActiveEditor = RESOURCES_SECTION_EDITORS[activeTab];

	return (
		<div>
			<div ref={headerRef} style={{ position: "fixed", top: 56, left: 220, right: 0, zIndex: 50, background: "var(--admin-bg)", padding: "16px 40px 0", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
				<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
					<h2 style={{ margin: 0 }}>Resources</h2>
					<button className="admin-btn admin-btn--primary" onClick={handleSave} disabled={saving}>
						{saving ? "Saving…" : "Save changes"}
					</button>
				</div>
				<div style={{ display: "flex", flexWrap: "wrap", gap: 2, borderBottom: "2px solid var(--admin-border)" }}>
					{ALL_SECTION_KEYS.map((key) => (
						<button
							key={key}
							onClick={() => setActiveTab(key)}
							style={{ padding: "8px 16px", border: "none", background: "none", cursor: "pointer", fontSize: 13.5, fontWeight: activeTab === key ? 700 : 400, color: activeTab === key ? "var(--admin-blue)" : "var(--admin-muted)", borderBottom: activeTab === key ? "2px solid var(--admin-blue)" : "2px solid transparent", marginBottom: -2, transition: "color 0.15s", fontFamily: "inherit" }}
						>
							{SECTION_LABELS[key]}
						</button>
					))}
				</div>
			</div>
			<div style={{ height: headerH }} />
			<div className="admin-card">
				<div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid var(--admin-border)" }}>
					<h3 style={{ margin: 0 }}>{SECTION_LABELS[activeTab]}</h3>
				</div>
				{ActiveEditor && (
					<ActiveEditor data={form[activeTab]} onChange={(val) => updateSection(activeTab, val)} />
				)}
			</div>
		</div>
	);
}

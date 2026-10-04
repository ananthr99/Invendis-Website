import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useAdmin } from "../../context/AdminContext.jsx";
import { loadPageContent, savePageContent, uploadImage } from "../../utils/savePageContent.js";
import { SILBO_SECTION_EDITORS, SECTION_LABELS, ALL_SECTION_KEYS } from "../../sections/silbo/registry.js";
import { validateRequired } from "../../utils/validate.js";

const CONTENT_PATH = "pages/silbo.json";

function stripPending(form) {
	if (!form) return form;
	return {
		...form,
		hero: form.hero ? (({ _pendingUploads, ...rest }) => rest)(form.hero) : form.hero,
		edgeCompute: form.edgeCompute ? {
			...form.edgeCompute,
			products: (form.edgeCompute.products ?? []).map(({ _pendingUpload, ...p }) => p),
		} : form.edgeCompute,
		applications: form.applications ? {
			...form.applications,
			items: (form.applications.items ?? []).map(({ _pendingUpload, ...item }) => item),
		} : form.applications,
	};
}

export default function SilboPageEditor() {
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
		const heroPending = (form.hero?._pendingUploads ?? []).length > 0;
		const edgePending = (form.edgeCompute?.products ?? []).some(p => p._pendingUpload);
		const appsPending = (form.applications?.items ?? []).some(item => item._pendingUpload);
		setDirty(heroPending || edgePending || appsPending || JSON.stringify(original) !== JSON.stringify(stripPending(form)));
	}, [form, original]);

	if (!token) return <p style={{ color: "var(--admin-muted)" }}>Enter a GitHub token in Setup first.</p>;
	if (loading) return <p style={{ color: "var(--admin-muted)" }}>Loading…</p>;
	if (!form) return null;

	function updateSection(key, val) {
		setForm((f) => ({ ...f, [key]: val }));
	}

	async function handleSave() {
		if (!validateRequired([
			{ label: "Title", value: form.title },
		], toast)) return;
		setSaving(true);
		try {
			let saveForm = { ...form };

			// 1. Hero images
			const heroPending = saveForm.hero?._pendingUploads ?? [];
			if (heroPending.length > 0) {
				toast("Uploading hero images…", "ok");
				const heroImgs = [...(saveForm.hero?.image ?? [])];
				for (const upload of heroPending) {
					await uploadImage(`images/silbo/hero/${upload.filename}`, upload.base64, { token, message: "CMS: upload SILBO hero image" });
					heroImgs.push(`/images/silbo/hero/${upload.filename}`);
				}
				saveForm = { ...saveForm, hero: { ...saveForm.hero, image: heroImgs, _pendingUploads: undefined } };
			}

			// 2. Edge compute product images
			if (saveForm.edgeCompute?.products) {
				const products = [];
				for (const product of saveForm.edgeCompute.products) {
					if (product._pendingUpload) {
						const p = product._pendingUpload;
						toast(`Uploading image for ${product.model || "product"}…`, "ok");
						await uploadImage(`images/silbo/edge-compute/${p.filename}`, p.base64, { token, message: "CMS: upload SILBO edge compute image" });
						const { _pendingUpload: _, ...rest } = product;
						products.push({ ...rest, image: `/images/silbo/edge-compute/${p.filename}` });
					} else {
						const { _pendingUpload: _, ...rest } = product;
						products.push(rest);
					}
				}
				saveForm = { ...saveForm, edgeCompute: { ...saveForm.edgeCompute, products } };
			}

			// 3. Application item images
			if (saveForm.applications?.items) {
				const items = [];
				for (const item of saveForm.applications.items) {
					if (item._pendingUpload) {
						const p = item._pendingUpload;
						toast(`Uploading application image "${p.filename}"…`, "ok");
						await uploadImage(`images/silbo/applications/${p.filename}`, p.base64, { token, message: "CMS: upload SILBO application image" });
						const { _pendingUpload: _, ...rest } = item;
						items.push({ ...rest, image: `/images/silbo/applications/${p.filename}` });
					} else {
						const { _pendingUpload: _, ...rest } = item;
						items.push(rest);
					}
				}
				saveForm = { ...saveForm, applications: { ...saveForm.applications, items } };
			}

			await savePageContent({ token, contentPath: CONTENT_PATH, before: original, after: saveForm, page: "SILBO", userEmail });
			setOriginal(saveForm);
			setForm(saveForm);
			setDirty(false);
			toast("SILBO page saved — live in a few seconds", "ok");
		} catch (err) {
			toast(err.message, "err");
		} finally {
			setSaving(false);
		}
	}

	const ActiveEditor = SILBO_SECTION_EDITORS[activeTab];

	return (
		<div>
			<div ref={headerRef} style={{ position: "fixed", top: 56, left: 220, right: 0, zIndex: 50, background: "var(--admin-bg)", padding: "16px 40px 0", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
				<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
					<h2 style={{ margin: 0 }}>SILBO</h2>
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

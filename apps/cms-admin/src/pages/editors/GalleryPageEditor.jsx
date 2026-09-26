import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useAdmin } from "../../context/AdminContext.jsx";
import { loadPageContent, savePageContent, uploadImage } from "../../utils/savePageContent.js";
import { GALLERY_SECTION_EDITORS, SECTION_LABELS, ALL_SECTION_KEYS } from "../../sections/gallery/registry.js";

const CONTENT_PATH = "pages/gallery.json";

export default function GalleryPageEditor() {
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
		const heroPending = !!form.hero?._pendingUpload;
		const itemsPending = (form.photoGallery?.items ?? []).some((i) => i._pendingUpload);
		const cleanForm = {
			...form,
			hero: form.hero ? { ...form.hero, _pendingUpload: undefined } : form.hero,
			photoGallery: form.photoGallery ? {
				...form.photoGallery,
				items: (form.photoGallery.items ?? []).map(({ _pendingUpload, ...item }) => item),
			} : form.photoGallery,
		};
		setDirty(heroPending || itemsPending || JSON.stringify(original) !== JSON.stringify(cleanForm));
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

			// Upload hero background if pending
			const heroPending = form.hero?._pendingUpload;
			if (heroPending) {
				toast("Uploading hero image…", "ok");
				await uploadImage(`images/gallery/hero/${heroPending.filename}`, heroPending.base64, { token, message: "CMS: upload gallery hero background" });
				saveForm = {
					...saveForm,
					hero: { ...saveForm.hero, image: `/images/gallery/hero/${heroPending.filename}`, _pendingUpload: undefined },
				};
			}

			// Upload gallery item images
			const updatedItems = [];
			for (const item of saveForm.photoGallery?.items ?? []) {
				if (item._pendingUpload) {
					toast(`Uploading "${item._pendingUpload.filename}"…`, "ok");
					await uploadImage(`images/gallery/items/${item._pendingUpload.filename}`, item._pendingUpload.base64, { token, message: "CMS: upload gallery image" });
					const { _pendingUpload, ...rest } = item;
					updatedItems.push({ ...rest, image: `/images/gallery/items/${item._pendingUpload.filename}` });
				} else {
					updatedItems.push(item);
				}
			}
			saveForm = {
				...saveForm,
				photoGallery: { ...saveForm.photoGallery, items: updatedItems },
			};

			await savePageContent({ token, contentPath: CONTENT_PATH, before: original, after: saveForm, page: "Gallery", userEmail });
			setOriginal(saveForm);
			setForm(saveForm);
			setDirty(false);
			toast("Gallery page saved — live in a few seconds", "ok");
		} catch (err) {
			toast(err.message, "err");
		} finally {
			setSaving(false);
		}
	}

	const ActiveEditor = GALLERY_SECTION_EDITORS[activeTab];

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
					<h2 style={{ margin: 0 }}>Gallery</h2>
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

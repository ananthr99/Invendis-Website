import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useAdmin } from "../../context/AdminContext.jsx";
import { loadPageContent, savePageContent, uploadImage } from "../../utils/savePageContent.js";
import { COMPANY_SECTION_EDITORS, SECTION_LABELS, ALL_SECTION_KEYS } from "../../sections/company/registry.js";

const CONTENT_PATH = "pages/company.json";

function stripPending(form) {
	if (!form) return form;
	return {
		...form,
		hero: form.hero ? (({ _pendingUpload, ...rest }) => rest)(form.hero) : form.hero,
		leadership: form.leadership ? {
			...form.leadership,
			members: (form.leadership.members ?? []).map(({ _pendingUpload, ...m }) => m),
		} : form.leadership,
		journey: form.journey ? {
			...form.journey,
			locations: form.journey.locations ? {
				...form.journey.locations,
				items: (form.journey.locations.items ?? []).map(({ _pendingImages, ...loc }) => loc),
			} : form.journey.locations,
		} : form.journey,
	};
}

export default function CompanyPageEditor() {
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
		const membersPending = (form.leadership?.members ?? []).some(m => m._pendingUpload);
		const locationsPending = (form.journey?.locations?.items ?? []).some(loc => loc._pendingImages?.length);
		setDirty(heroPending || membersPending || locationsPending || JSON.stringify(original) !== JSON.stringify(stripPending(form)));
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

			// 1. Upload hero background image
			const heroPending = saveForm.hero?._pendingUpload;
			if (heroPending) {
				toast("Uploading hero image…", "ok");
				await uploadImage(`images/company/hero/${heroPending.filename}`, heroPending.base64, { token, message: "CMS: upload company hero image" });
				saveForm = { ...saveForm, hero: { ...saveForm.hero, image: `/images/company/hero/${heroPending.filename}`, _pendingUpload: undefined } };
			}

			// 2. Upload leadership member photos
			if (saveForm.leadership?.members) {
				const members = [];
				for (const member of saveForm.leadership.members) {
					if (member._pendingUpload) {
						const p = member._pendingUpload;
						toast(`Uploading photo for ${member.name || "member"}…`, "ok");
						await uploadImage(`images/company/leadership/${p.filename}`, p.base64, { token, message: "CMS: upload leadership photo" });
						const { _pendingUpload: _, ...rest } = member;
						members.push({ ...rest, image: `/images/company/leadership/${p.filename}` });
					} else {
						members.push(member);
					}
				}
				saveForm = { ...saveForm, leadership: { ...saveForm.leadership, members } };
			}

			// 3. Upload location images
			if (saveForm.journey?.locations?.items) {
				const items = [];
				for (const loc of saveForm.journey.locations.items) {
					if (loc._pendingImages?.length) {
						const newPaths = [];
						for (const p of loc._pendingImages) {
							toast(`Uploading location image "${p.filename}"…`, "ok");
							await uploadImage(`images/company/locations/${p.filename}`, p.base64, { token, message: "CMS: upload location image" });
							newPaths.push(`/images/company/locations/${p.filename}`);
						}
						const { _pendingImages: _, ...rest } = loc;
						items.push({ ...rest, images: [...(rest.images ?? []), ...newPaths] });
					} else {
						const { _pendingImages: _, ...rest } = loc;
						items.push(rest);
					}
				}
				saveForm = { ...saveForm, journey: { ...saveForm.journey, locations: { ...saveForm.journey.locations, items } } };
			}

			await savePageContent({ token, contentPath: CONTENT_PATH, before: original, after: saveForm, page: "Company", userEmail });
			setOriginal(saveForm);
			setForm(saveForm);
			setDirty(false);
			toast("Company page saved — live in a few seconds", "ok");
		} catch (err) {
			toast(err.message, "err");
		} finally {
			setSaving(false);
		}
	}

	const ActiveEditor = COMPANY_SECTION_EDITORS[activeTab];

	return (
		<div>
			<div ref={headerRef} style={{ position: "fixed", top: 56, left: 220, right: 0, zIndex: 50, background: "var(--admin-bg)", padding: "16px 40px 0", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
				<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
					<h2 style={{ margin: 0 }}>Company</h2>
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

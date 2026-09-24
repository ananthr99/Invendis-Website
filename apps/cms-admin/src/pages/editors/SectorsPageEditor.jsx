import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useAdmin } from "../../context/AdminContext.jsx";
import { loadPageContent, savePageContent } from "../../utils/savePageContent.js";
import { SECTOR_SECTION_EDITORS, SECTION_LABELS, ALL_SECTION_KEYS } from "../../sections/sectors/registry.js";
import { github, LIVE_BRANCH } from "../../config.js";

const CONTENT_PATH = "pages/sectors.json";

export default function SectorsPageEditor() {
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
		const hasPending =
			(form.hero?._pendingUploads ?? []).length > 0 ||
			(form.verticals?._pendingUploads ?? []).length > 0;
		const cleanForm = {
			...form,
			hero: form.hero ? { ...form.hero, _pendingUploads: undefined } : form.hero,
			verticals: form.verticals ? { ...form.verticals, _pendingUploads: undefined } : form.verticals,
		};
		setDirty(hasPending || JSON.stringify(original) !== JSON.stringify(cleanForm));
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
			let saveForm = form;

			// Pre-flight: block save if any pending filename already exists in the repo
			for (const upload of form.hero?._pendingUploads ?? []) {
				const sKey = form.hero?.sectors?.[upload.sectorIndex]?.key || "_";
				const path = `apps/main-site/public/images/sectors/${sKey}/hero/${upload.filename}`;
				if (await github.getFileSha(path, { branch: "main", token })) {
					throw new Error(`Hero image "${upload.filename}" already exists at /images/sectors/${sKey}/hero/. Rename it before saving.`);
				}
			}
			for (const upload of form.verticals?._pendingUploads ?? []) {
				const iKey = form.verticals?.items?.[upload.itemIndex]?.key || "_";
				const path = `apps/main-site/public/images/sectors/${iKey}/card/${upload.filename}`;
				if (await github.getFileSha(path, { branch: "main", token })) {
					throw new Error(`Card image "${upload.filename}" already exists at /images/sectors/${iKey}/card/. Rename it before saving.`);
				}
			}
			const pendingUploads = form.hero?._pendingUploads ?? [];

			if (pendingUploads.length > 0) {
				toast("Uploading images…", "ok");
				let sectors = [...(form.hero?.sectors ?? [])];

				for (const upload of pendingUploads) {
					const { sectorIndex, base64, filename } = upload;
					const sectorKey = sectors[sectorIndex]?.key;
					if (!sectorKey) throw new Error(`Sector ${sectorIndex + 1} has no key set — add a key before uploading.`);

					const mainImgPath = `apps/main-site/public/images/sectors/${sectorKey}/hero/${filename}`;

					const mainSha = await github.getFileSha(mainImgPath, { branch: "main", token });
					await github.writeFileBase64(mainImgPath, base64, {
						message: `CMS: upload hero image for ${sectorKey} [skip ci]`,
						sha: mainSha,
						branch: "main",
						token,
					});

					sectors[sectorIndex] = {
						...sectors[sectorIndex],
						image: [`/images/sectors/${sectorKey}/hero/${filename}`],
					};
				}

				saveForm = {
					...form,
					hero: { ...form.hero, sectors, _pendingUploads: undefined },
				};
				setForm(saveForm);
			}
			const verticalsPending = saveForm.verticals?._pendingUploads ?? [];
			if (verticalsPending.length > 0) {
				const items = [...(saveForm.verticals?.items ?? [])];
				for (const upload of verticalsPending) {
					const { itemIndex, base64, filename } = upload;
					const itemKey = items[itemIndex]?.key;
					if (!itemKey) throw new Error(`Vertical ${itemIndex + 1} has no key set — add a key before uploading.`);
					const imgPath = `apps/main-site/public/images/sectors/${itemKey}/card/${filename}`;
					const sha = await github.getFileSha(imgPath, { branch: "main", token });
					await github.writeFileBase64(imgPath, base64, {
						message: `CMS: upload card image for ${itemKey} [skip ci]`,
						sha,
						branch: "main",
						token,
					});
					const existing = Array.isArray(items[itemIndex].image) ? items[itemIndex].image : items[itemIndex].image ? [items[itemIndex].image] : [];
					items[itemIndex] = {
						...items[itemIndex],
						image: [...existing, `/images/sectors/${itemKey}/card/${filename}`],
					};
				}
				saveForm = {
					...saveForm,
					verticals: { ...saveForm.verticals, items, _pendingUploads: undefined },
				};
				setForm(saveForm);
			}

			await savePageContent({ token, contentPath: CONTENT_PATH, before: original, after: saveForm, page: "Sectors", userEmail });
			setOriginal(saveForm);
			setDirty(false);
			toast("Sectors page saved — live in a few seconds", "ok");
		} catch (err) {
			toast(err.message, "err");
		} finally {
			setSaving(false);
		}
	}

	const activeSections = form.sections ?? [];
	const ActiveEditor = SECTOR_SECTION_EDITORS[activeTab];

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
					<h2 style={{ margin: 0 }}>Sectors</h2>
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
							{!activeSections.includes(key) && (
								<span style={{ marginLeft: 5, fontSize: 9, opacity: 0.5 }}>●</span>
							)}
						</button>
					))}
				</div>
			</div>

			<div style={{ height: headerH }} />

			<div className="admin-card">
				<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid var(--admin-border)" }}>
					<h3 style={{ margin: 0 }}>{SECTION_LABELS[activeTab]}</h3>
					<label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
						<input
							type="checkbox"
							checked={activeSections.includes(activeTab)}
							onChange={() => toggleSection(activeTab)}
						/>
						Visible on page
					</label>
				</div>
				{ActiveEditor && (
					<ActiveEditor data={form[activeTab]} onChange={(val) => updateSection(activeTab, val)} />
				)}
			</div>
		</div>
	);
}

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useAdmin } from "../../context/AdminContext.jsx";
import { loadPageContent, savePageContent } from "../../utils/savePageContent.js";
import { PRODUCT_SECTION_EDITORS, SECTION_LABELS, ALL_SECTION_KEYS } from "../../sections/products/registry.js";
import { github } from "../../config.js";

const CONTENT_PATH = "pages/products.json";

export default function ProductsPageEditor() {
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
			(form.hardwarePortfolio?._pendingUploads ?? []).length > 0 ||
			(form.silboProducts?._pendingUploads ?? []).length > 0 ||
			(form.softwarePlatforms?._pendingUploads ?? []).length > 0;
		const cleanForm = {
			...form,
			hero: form.hero ? { ...form.hero, _pendingUploads: undefined } : form.hero,
			hardwarePortfolio: form.hardwarePortfolio ? { ...form.hardwarePortfolio, _pendingUploads: undefined } : form.hardwarePortfolio,
			silboProducts: form.silboProducts ? { ...form.silboProducts, _pendingUploads: undefined } : form.silboProducts,
			softwarePlatforms: form.softwarePlatforms ? { ...form.softwarePlatforms, _pendingUploads: undefined } : form.softwarePlatforms,
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
			const conflictChecks = [
				...(form.hero?._pendingUploads ?? []).map(u => ({
					path: `apps/main-site/public/images/products/hero/${u.filename}`,
					label: `Hero image "${u.filename}"`,
				})),
				...(form.hardwarePortfolio?._pendingUploads ?? []).map(u => {
					const k = form.hardwarePortfolio.items[u.itemIndex]?.key || "_";
					return { path: `apps/main-site/public/images/products/hardware/${k}/${u.filename}`, label: `Hardware image "${u.filename}"` };
				}),
				...(form.silboProducts?._pendingUploads ?? []).map(u => ({
					path: `apps/main-site/public/images/products/silbo/${u.filename}`,
					label: `SILBO image "${u.filename}"`,
				})),
				...(form.softwarePlatforms?._pendingUploads ?? []).map(u => ({
					path: `apps/main-site/public/images/products/software/${u.filename}`,
					label: `Software image "${u.filename}"`,
				})),
			];
			for (const { path, label } of conflictChecks) {
				if (await github.getFileSha(path, { branch: "main", token })) {
					throw new Error(`${label} already exists at ${path.replace("apps/main-site/public", "")}. Rename it before saving.`);
				}
			}

			// Hero image uploads — append to hero.image array
			const heroPending = form.hero?._pendingUploads ?? [];
			if (heroPending.length > 0) {
				toast("Uploading hero images…", "ok");
				const heroImgs = [...(form.hero?.image ?? [])];
				for (const upload of heroPending) {
					const imgPath = `apps/main-site/public/images/products/hero/${upload.filename}`;
					const sha = await github.getFileSha(imgPath, { branch: "main", token });
					await github.writeFileBase64(imgPath, upload.base64, {
						message: `CMS: upload products hero image [skip ci]`,
						sha,
						branch: "main",
						token,
					});
					heroImgs.push(`/images/products/hero/${upload.filename}`);
				}
				saveForm = { ...saveForm, hero: { ...saveForm.hero, image: heroImgs, _pendingUploads: undefined } };
				setForm(saveForm);
			}

			// Hardware portfolio image uploads — replace per item
			const hwPending = saveForm.hardwarePortfolio?._pendingUploads ?? [];
			if (hwPending.length > 0) {
				toast("Uploading hardware images…", "ok");
				const items = [...(saveForm.hardwarePortfolio?.items ?? [])];
				for (const upload of hwPending) {
					const { itemIndex, base64, filename } = upload;
					const itemKey = items[itemIndex]?.key;
					if (!itemKey) throw new Error(`Hardware item ${itemIndex + 1} has no key set — add a key before uploading.`);
					const imgPath = `apps/main-site/public/images/products/hardware/${itemKey}/${filename}`;
					const sha = await github.getFileSha(imgPath, { branch: "main", token });
					await github.writeFileBase64(imgPath, base64, {
						message: `CMS: upload hardware image for ${itemKey} [skip ci]`,
						sha,
						branch: "main",
						token,
					});
					items[itemIndex] = { ...items[itemIndex], image: [`/images/products/hardware/${itemKey}/${filename}`] };
				}
				saveForm = { ...saveForm, hardwarePortfolio: { ...saveForm.hardwarePortfolio, items, _pendingUploads: undefined } };
				setForm(saveForm);
			}

			// SILBO intro image uploads — append to introImage array
			const silboPending = saveForm.silboProducts?._pendingUploads ?? [];
			if (silboPending.length > 0) {
				toast("Uploading SILBO images…", "ok");
				const silboImgs = [...(saveForm.silboProducts?.introImage ?? [])];
				for (const upload of silboPending) {
					const imgPath = `apps/main-site/public/images/products/silbo/${upload.filename}`;
					const sha = await github.getFileSha(imgPath, { branch: "main", token });
					await github.writeFileBase64(imgPath, upload.base64, {
						message: `CMS: upload SILBO intro image [skip ci]`,
						sha,
						branch: "main",
						token,
					});
					silboImgs.push(`/images/products/silbo/${upload.filename}`);
				}
				saveForm = { ...saveForm, silboProducts: { ...saveForm.silboProducts, introImage: silboImgs, _pendingUploads: undefined } };
				setForm(saveForm);
			}

			// Software platforms image uploads — replace per item
			const swPending = saveForm.softwarePlatforms?._pendingUploads ?? [];
			if (swPending.length > 0) {
				toast("Uploading software platform images…", "ok");
				const items = [...(saveForm.softwarePlatforms?.items ?? [])];
				for (const upload of swPending) {
					const { itemIndex, base64, filename } = upload;
					const imgPath = `apps/main-site/public/images/products/software/${filename}`;
					const sha = await github.getFileSha(imgPath, { branch: "main", token });
					await github.writeFileBase64(imgPath, base64, {
						message: `CMS: upload software platform image [skip ci]`,
						sha,
						branch: "main",
						token,
					});
					items[itemIndex] = { ...items[itemIndex], image: [`/images/products/software/${filename}`] };
				}
				saveForm = { ...saveForm, softwarePlatforms: { ...saveForm.softwarePlatforms, items, _pendingUploads: undefined } };
				setForm(saveForm);
			}

			await savePageContent({ token, contentPath: CONTENT_PATH, before: original, after: saveForm, page: "Products", userEmail });
			setOriginal(saveForm);
			setDirty(false);
			toast("Products page saved — live in a few seconds", "ok");
		} catch (err) {
			toast(err.message, "err");
		} finally {
			setSaving(false);
		}
	}

	const activeSections = form.sections ?? [];
	const ActiveEditor = PRODUCT_SECTION_EDITORS[activeTab];

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
					<h2 style={{ margin: 0 }}>Products</h2>
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


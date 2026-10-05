import { useState, useEffect, useRef } from "react";
import { checkFileSize } from "../../utils/fileUtils.js";
import { fileToBase64 } from "@invendis/github-client";
import { compressImage, COMPRESS_PRESETS } from "../../utils/compressImage.js";
import { github, OWNER, REPO } from "../../config.js";
import { useAdmin } from "../../context/AdminContext.jsx";

function rawUrl(imgPath) {
	return `https://raw.githubusercontent.com/${OWNER}/${REPO}/main/apps/main-site/public${imgPath}`;
}

export default function EdgeComputeEditor({ data, onChange }) {
	const d = data ?? { eyebrow: "", title: "", subtitle: "", products: [] };
	const [previews, setPreviews] = useState({});
	const [expanded, setExpanded] = useState(null);
	const [fileChecks, setFileChecks] = useState({});
	const { token, toast } = useAdmin();
	const checkTimers = useRef({});

	function checkFileExists(key, repoPath) {
		if (!token) return;
		setFileChecks(f => ({ ...f, [key]: "checking" }));
		clearTimeout(checkTimers.current[key]);
		checkTimers.current[key] = setTimeout(async () => {
			try {
				const sha = await github.getFileSha(repoPath, { branch: "main", token });
				setFileChecks(f => ({ ...f, [key]: sha ? "exists" : "free" }));
			} catch {
				setFileChecks(f => ({ ...f, [key]: "free" }));
			}
		}, 500);
	}

	useEffect(() => {
		if (!expanded) return;
		const handler = (e) => { if (e.key === "Escape") setExpanded(null); };
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [expanded]);

	function set(field, val) { onChange({ ...d, [field]: val }); }

	function updateProduct(i, field, val) {
		const products = [...(d.products ?? [])];
		products[i] = { ...products[i], [field]: val };
		onChange({ ...d, products });
	}

	function updateBadges(i, val) {
		const products = [...(d.products ?? [])];
		products[i] = { ...products[i], badges: val.split(",").map(s => s.trim()).filter(Boolean) };
		onChange({ ...d, products });
	}

	function removeProductImage(i) {
		const products = [...(d.products ?? [])];
		products[i] = { ...products[i], image: "" };
		onChange({ ...d, products });
	}

	async function handleFileSelect(i, file) {
		if (!checkFileSize(file, toast)) return;
		const compressed = await compressImage(file, COMPRESS_PRESETS.card);
		const base64 = await fileToBase64(compressed);
		const previewUrl = URL.createObjectURL(compressed);
		setPreviews(p => ({ ...p, [i]: previewUrl }));
		const products = [...(d.products ?? [])];
		products[i] = { ...products[i], _pendingUpload: { base64, filename: compressed.name } };
		onChange({ ...d, products });
		checkFileExists(i, `apps/main-site/public/images/silbo/edge-compute/${compressed.name}`);
	}

	function clearPendingUpload(i) {
		if (previews[i]) URL.revokeObjectURL(previews[i]);
		setPreviews(p => { const n = { ...p }; delete n[i]; return n; });
		const products = [...(d.products ?? [])];
		const { _pendingUpload: _, ...rest } = products[i];
		products[i] = rest;
		onChange({ ...d, products });
		setFileChecks(f => { const n = { ...f }; delete n[i]; return n; });
	}

	function renamePendingUpload(i, val) {
		const products = [...(d.products ?? [])];
		products[i] = { ...products[i], _pendingUpload: { ...products[i]._pendingUpload, filename: val } };
		onChange({ ...d, products });
		checkFileExists(i, `apps/main-site/public/images/silbo/edge-compute/${val}`);
	}

	function addProduct() { onChange({ ...d, products: [...(d.products ?? []), { model: "", badges: [], description: "", image: "" }] }); }
	function removeProduct(i) {
		if (previews[i]) URL.revokeObjectURL(previews[i]);
		setPreviews(p => { const n = { ...p }; delete n[i]; return n; });
		onChange({ ...d, products: (d.products ?? []).filter((_, j) => j !== i) });
	}
	function moveProduct(i, dir) {
		const j = i + dir;
		const products = [...(d.products ?? [])];
		if (j < 0 || j >= products.length) return;
		[products[i], products[j]] = [products[j], products[i]];
		setPreviews(p => { const n = { ...p }; [n[i], n[j]] = [n[j], n[i]]; return n; });
		onChange({ ...d, products });
	}

	return (
		<div>
			<div className="admin-field">
				<label className="admin-label">Eyebrow</label>
				<input className="admin-input" value={d.eyebrow ?? ""} onChange={e => set("eyebrow", e.target.value)} />
			</div>
			<div className="admin-field">
				<label className="admin-label">Title</label>
				<input className="admin-input" value={d.title ?? ""} onChange={e => set("title", e.target.value)} />
			</div>
			<div className="admin-field">
				<label className="admin-label">Subtitle</label>
				<textarea className="admin-textarea" value={d.subtitle ?? ""} onChange={e => set("subtitle", e.target.value)} />
			</div>

			<label className="admin-label" style={{ display: "block", marginTop: 16, marginBottom: 8 }}>Products</label>
			{(d.products ?? []).map((product, i) => {
				const pending = product._pendingUpload;
				return (
					<div key={i} style={{ border: "1px solid var(--admin-border)", borderRadius: 8, padding: 12, marginBottom: 12 }}>
						<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
							<span style={{ fontWeight: 600, fontSize: 13 }}>Product {i + 1}{product.model ? ` — ${product.model}` : ""}</span>
							<div style={{ display: "flex", gap: 4 }}>
								<button className="admin-btn admin-btn--ghost" onClick={() => moveProduct(i, -1)} disabled={i === 0}>↑</button>
								<button className="admin-btn admin-btn--ghost" onClick={() => moveProduct(i, 1)} disabled={i === (d.products ?? []).length - 1}>↓</button>
								<button className="admin-btn admin-btn--ghost" onClick={() => removeProduct(i)}>✕</button>
							</div>
						</div>
						<div style={{ display: "flex", gap: 8 }}>
							<div className="admin-field" style={{ flex: 1 }}>
								<label className="admin-label">Model</label>
								<input className="admin-input" value={product.model ?? ""} onChange={e => updateProduct(i, "model", e.target.value)} />
							</div>
							<div className="admin-field" style={{ flex: 1 }}>
								<label className="admin-label">Badges (comma-separated)</label>
								<input className="admin-input" value={(product.badges ?? []).join(", ")} onChange={e => updateBadges(i, e.target.value)} />
							</div>
						</div>
						<div className="admin-field">
							<label className="admin-label">Description</label>
							<textarea className="admin-textarea" value={product.description ?? ""} onChange={e => updateProduct(i, "description", e.target.value)} />
						</div>
						<div className="admin-field">
							<label className="admin-label">Image</label>
							{product.image && !pending && (
								<div style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "center" }}>
									<div onClick={() => setExpanded(rawUrl(product.image))} style={{ width: 120, height: 80, borderRadius: 6, overflow: "hidden", border: "1px solid var(--admin-border)", cursor: "zoom-in", flexShrink: 0 }}>
										<img src={rawUrl(product.image)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
									</div>
									<button className="admin-btn admin-btn--ghost" onClick={() => removeProductImage(i)}>Remove</button>
								</div>
							)}
							{pending && (
								<div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, padding: 8, background: "var(--admin-bg)", border: "1px solid var(--admin-border)", borderRadius: 6 }}>
									{previews[i] && <img src={previews[i]} alt="" style={{ height: 52, width: 80, objectFit: "cover", borderRadius: 4, flexShrink: 0 }} />}
									<div style={{ flex: 1, minWidth: 0 }}>
										<label style={{ fontSize: 11, color: "var(--admin-muted)", display: "block", marginBottom: 3 }}>Save as</label>
										<input className="admin-input" style={{ fontSize: 13, marginBottom: 4 }} value={pending.filename} onChange={e => renamePendingUpload(i, e.target.value)} />
										<p style={{ margin: 0, fontSize: 11, color: "var(--admin-muted)" }}>→ /images/silbo/edge-compute/{pending.filename}</p>
										{fileChecks[i] === "checking" && <p style={{ margin: "4px 0 0", fontSize: 11, color: "var(--admin-muted)" }}>Checking…</p>}
										{fileChecks[i] === "exists" && <p style={{ margin: "4px 0 0", fontSize: 11, color: "var(--admin-red)" }}>⚠ File already exists — saving will overwrite it</p>}
										{fileChecks[i] === "free" && <p style={{ margin: "4px 0 0", fontSize: 11, color: "#16a34a" }}>✓ Name is available</p>}
									</div>
									<button className="admin-btn admin-btn--ghost" onClick={() => clearPendingUpload(i)}>✕</button>
								</div>
							)}
							<label style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", border: "1px solid var(--admin-border)", borderRadius: 8, cursor: "pointer", fontSize: 13, background: "white", fontFamily: "inherit" }}>
								<input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) handleFileSelect(i, e.target.files[0]); e.target.value = ""; }} />
								{pending ? "Replace image" : "Upload image"}
							</label>
						</div>
					</div>
				);
			})}
			<button className="admin-btn admin-btn--ghost" onClick={addProduct}>+ Add product</button>

			{expanded && (
				<div onClick={() => setExpanded(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
					<img src={expanded} alt="" onClick={e => e.stopPropagation()} style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", borderRadius: 8 }} />
					<button onClick={() => setExpanded(null)} style={{ position: "absolute", top: 16, right: 16, width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.15)", color: "white", border: "none", cursor: "pointer", fontSize: 18 }}>✕</button>
				</div>
			)}
		</div>
	);
}

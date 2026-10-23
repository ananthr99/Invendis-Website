import { useState } from "react";
import { useAdmin } from "../../context/AdminContext.jsx";
import { checkFileSize } from "../../utils/fileUtils.js";
import { fileToBase64 } from "@invendis/github-client";
import { compressImage, COMPRESS_PRESETS } from "../../utils/compressImage.js";
import { OWNER, REPO } from "../../config.js";

function rawUrl(imgPath) {
	return `https://raw.githubusercontent.com/${OWNER}/${REPO}/main/apps/main-site/public${imgPath}`;
}

export default function DesignPartnersEditor({ data, onChange }) {
	const d = data ?? { eyebrow: "", title: "", partners: [] };
	const [previews, setPreviews] = useState({});
	const { toast } = useAdmin();

	function set(field, val) {
		onChange({ ...d, [field]: val });
	}

	function updatePartner(i, field, val) {
		const partners = [...d.partners];
		partners[i] = { ...partners[i], [field]: val };
		onChange({ ...d, partners });
	}

	function addPartner() {
		onChange({ ...d, partners: [...d.partners, { name: "", logo: [] }] });
	}

	function removePartner(i) {
		(d._pendingUploads ?? []).forEach((u, ui) => {
			if (u.partnerIndex === i && previews[ui]) URL.revokeObjectURL(previews[ui]);
		});
		setPreviews(p => {
			const n = { ...p };
			(d._pendingUploads ?? []).forEach((u, ui) => { if (u.partnerIndex === i) delete n[ui]; });
			return n;
		});
		const uploads = (d._pendingUploads ?? []).filter(u => u.partnerIndex !== i);
		onChange({
			...d,
			partners: d.partners.filter((_, j) => j !== i),
			_pendingUploads: uploads.length ? uploads : undefined,
		});
	}

	function movePartner(i, dir) {
		const j = i + dir;
		const partners = [...d.partners];
		if (j < 0 || j >= partners.length) return;
		[partners[i], partners[j]] = [partners[j], partners[i]];
		const uploads = (d._pendingUploads ?? []).map(u => {
			if (u.partnerIndex === i) return { ...u, partnerIndex: j };
			if (u.partnerIndex === j) return { ...u, partnerIndex: i };
			return u;
		});
		onChange({ ...d, partners, _pendingUploads: uploads.length ? uploads : undefined });
	}

	async function handleFileSelect(i, file) {
		if (!checkFileSize(file, toast)) return;
		const compressed = await compressImage(file, COMPRESS_PRESETS.thumbnail);
		const base64 = await fileToBase64(compressed);
		const url = URL.createObjectURL(compressed);
		// Replace any existing pending upload for this partner
		const existing = (d._pendingUploads ?? []).filter(u => u.partnerIndex !== i);
		const ui = existing.length;
		setPreviews(p => {
			// Revoke old preview for this partner if any
			const old = (d._pendingUploads ?? []).find(u => u.partnerIndex === i);
			const oldUi = (d._pendingUploads ?? []).indexOf(old);
			if (old && p[oldUi]) URL.revokeObjectURL(p[oldUi]);
			return { ...p, [ui]: url };
		});
		onChange({
			...d,
			_pendingUploads: [...existing, { partnerIndex: i, base64, filename: compressed.name }],
		});
	}

	function clearPendingUpload(ui) {
		if (previews[ui]) URL.revokeObjectURL(previews[ui]);
		setPreviews(p => { const n = { ...p }; delete n[ui]; return n; });
		const uploads = (d._pendingUploads ?? []).filter((_, j) => j !== ui);
		onChange({ ...d, _pendingUploads: uploads.length ? uploads : undefined });
	}

	function renamePendingUpload(ui, val) {
		const uploads = (d._pendingUploads ?? []).map((u, j) => j === ui ? { ...u, filename: val } : u);
		onChange({ ...d, _pendingUploads: uploads });
	}

	function removeLogo(i) {
		const partners = [...d.partners];
		partners[i] = { ...partners[i], logo: [] };
		onChange({ ...d, partners });
	}

	return (
		<div>
			<div className="admin-field">
				<label className="admin-label">Eyebrow</label>
				<input className="admin-input" value={d.eyebrow} onChange={e => set("eyebrow", e.target.value)} />
			</div>
			<div className="admin-field">
				<label className="admin-label">Title</label>
				<input className="admin-input" value={d.title} onChange={e => set("title", e.target.value)} />
			</div>

			<label className="admin-label" style={{ display: "block", marginTop: 16, marginBottom: 8 }}>Partners</label>
			{d.partners.map((partner, i) => {
				const logos = Array.isArray(partner.logo) ? partner.logo : partner.logo ? [partner.logo] : [];
				const pendingEntry = (d._pendingUploads ?? []).map((u, ui) => ({ ...u, ui })).find(u => u.partnerIndex === i);
				const previewSrc = pendingEntry ? previews[pendingEntry.ui] : logos[0] ? rawUrl(logos[0]) : null;

				return (
					<div key={i} style={{ border: "1px solid var(--admin-border)", borderRadius: 8, padding: 12, marginBottom: 10 }}>
						<div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
							<input
								className="admin-input"
								style={{ flex: 1 }}
								value={partner.name}
								onChange={e => updatePartner(i, "name", e.target.value)}
								placeholder="Partner name"
							/>
							<button className="admin-btn admin-btn--ghost" onClick={() => movePartner(i, -1)} disabled={i === 0}>↑</button>
							<button className="admin-btn admin-btn--ghost" onClick={() => movePartner(i, 1)} disabled={i === d.partners.length - 1}>↓</button>
							<button className="admin-btn admin-btn--ghost" onClick={() => removePartner(i)}>✕</button>
						</div>

						<div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
							{previewSrc && (
								<div style={{ position: "relative", flexShrink: 0 }}>
									<img
										src={previewSrc}
										alt={partner.name}
										style={{ height: 40, maxWidth: 140, objectFit: "contain", borderRadius: 4, border: "1px solid var(--admin-border)", background: "#f8f8f8", padding: "4px 8px" }}
									/>
									<button
										onClick={() => pendingEntry ? clearPendingUpload(pendingEntry.ui) : removeLogo(i)}
										title="Remove"
										style={{ position: "absolute", top: -7, right: -7, width: 18, height: 18, borderRadius: "50%", background: "var(--admin-red)", color: "white", border: "none", cursor: "pointer", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center" }}
									>✕</button>
								</div>
							)}
							<div style={{ flex: 1, minWidth: 0 }}>
								{pendingEntry && (
									<div style={{ marginBottom: 6 }}>
										<input
											className="admin-input"
											style={{ fontSize: 12 }}
											value={pendingEntry.filename}
											onChange={e => renamePendingUpload(pendingEntry.ui, e.target.value)}
											placeholder="logo.webp"
										/>
										<p style={{ margin: "3px 0 0", fontSize: 11, color: "var(--admin-muted)" }}>
											→ /images/products/design-partners/{pendingEntry.filename}
										</p>
									</div>
								)}
								<label style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", border: "1px solid var(--admin-border)", borderRadius: 6, cursor: "pointer", fontSize: 12, background: "white", fontFamily: "inherit" }}>
									<input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) handleFileSelect(i, e.target.files[0]); e.target.value = ""; }} />
									{previewSrc ? "Replace logo" : "Upload logo"}
								</label>
								{!previewSrc && <span style={{ marginLeft: 8, fontSize: 11, color: "var(--admin-muted)" }}>Falls back to partner name if no logo</span>}
							</div>
						</div>
					</div>
				);
			})}
			<button className="admin-btn admin-btn--ghost" style={{ marginTop: 4 }} onClick={addPartner}>+ Add partner</button>
		</div>
	);
}

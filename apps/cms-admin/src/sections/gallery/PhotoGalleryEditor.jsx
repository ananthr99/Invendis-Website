import { useState } from "react";
import { fileToBase64 } from "@invendis/github-client";
import { OWNER, REPO } from "../../config.js";

function rawUrl(imgPath) {
	return `https://raw.githubusercontent.com/${OWNER}/${REPO}/main/apps/main-site/public${imgPath}`;
}

function ItemEditor({ item, index, categories, onChange, onRemove }) {
	const [blobUrl, setBlobUrl] = useState(null);
	const datalistId = `gallery-cats-${index}`;

	function set(field, val) {
		onChange({ ...item, [field]: val });
	}

	async function handleFileSelect(file) {
		const base64 = await fileToBase64(file);
		if (blobUrl) URL.revokeObjectURL(blobUrl);
		const url = URL.createObjectURL(file);
		setBlobUrl(url);
		onChange({ ...item, _pendingUpload: { base64, filename: file.name } });
	}

	function renamePending(val) {
		onChange({ ...item, _pendingUpload: { ...item._pendingUpload, filename: val } });
	}

	function clearPending() {
		if (blobUrl) URL.revokeObjectURL(blobUrl);
		setBlobUrl(null);
		onChange({ ...item, _pendingUpload: undefined });
	}

	const pending = item._pendingUpload;
	const previewSrc = pending ? blobUrl : item.image ? rawUrl(item.image) : null;

	return (
		<div style={{ border: "1px solid var(--admin-border)", borderRadius: 8, padding: 16, marginBottom: 12, background: "var(--admin-bg)" }}>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
				<span style={{ fontSize: 13, fontWeight: 600, color: "var(--admin-text)" }}>{item.title || "Untitled"}</span>
				<button onClick={onRemove} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--admin-red)", fontSize: 18, lineHeight: 1, padding: "0 2px" }}>✕</button>
			</div>

			<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
				<div className="admin-field">
					<label className="admin-label">Title</label>
					<input className="admin-input" value={item.title ?? ""} onChange={e => set("title", e.target.value)} />
				</div>
				<div className="admin-field">
					<label className="admin-label">Category</label>
					<input
						className="admin-input"
						list={datalistId}
						value={item.category ?? ""}
						onChange={e => set("category", e.target.value)}
						placeholder="Type or pick a category…"
					/>
					<datalist id={datalistId}>
						{categories.map(c => <option key={c} value={c} />)}
					</datalist>
				</div>
			</div>

			<div className="admin-field">
				<label className="admin-label">Description</label>
				<textarea className="admin-textarea" rows={3} value={item.description ?? ""} onChange={e => set("description", e.target.value)} />
			</div>

			<div className="admin-field">
                <label className="admin-label">Photo</label>
                <div style={{ display: "inline-flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
                    {previewSrc && (
                        <div style={{ position: "relative", display: "inline-block" }}>
                            <img
                                src={previewSrc}
                                alt=""
                                style={{ height: 80, width: 140, objectFit: "cover", borderRadius: 6, border: "1px solid var(--admin-border)", display: "block" }}
                            />
                            <button
                                onClick={pending ? clearPending : () => set("image", "")}
                                title="Remove"
                                style={{ position: "absolute", top: -7, right: -7, width: 20, height: 20, borderRadius: "50%", background: "var(--admin-red)", color: "white", border: "none", cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}
                            >✕</button>
                        </div>
                    )}
                    {pending && (
                        <div>
                            <input
                                className="admin-input"
                                style={{ fontSize: 12 }}
                                value={pending.filename}
                                onChange={e => renamePending(e.target.value)}
                                placeholder="filename.jpg"
                            />
                            <p style={{ margin: "3px 0 0", fontSize: 11, color: "var(--admin-muted)" }}>→ /images/gallery/items/{pending.filename}</p>
                        </div>
                    )}
                    <label style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", border: "1px solid var(--admin-border)", borderRadius: 6, cursor: "pointer", fontSize: 12, background: "white", fontFamily: "inherit" }}>
                        <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) handleFileSelect(e.target.files[0]); e.target.value = ""; }} />
                        {previewSrc ? "Replace photo" : "Upload photo"}
                    </label>
                </div>
            </div>
		</div>
	);
}

export default function PhotoGalleryEditor({ data, onChange }) {
	const d = data ?? { eyebrow: "", title: "", titleHighlight: "", categories: [], items: [] };

	function set(field, val) {
		onChange({ ...d, [field]: val });
	}

	function addCategory() {
		onChange({ ...d, categories: [...(d.categories ?? []), ""] });
	}

	function updateCategory(i, val) {
		const cats = [...(d.categories ?? [])];
		cats[i] = val;
		onChange({ ...d, categories: cats });
	}

	function removeCategory(i) {
		onChange({ ...d, categories: (d.categories ?? []).filter((_, idx) => idx !== i) });
	}

	function addItem() {
		const newItem = { id: `item-${Date.now()}`, category: "", title: "", description: "", image: "" };
		onChange({ ...d, items: [...(d.items ?? []), newItem] });
	}

	function updateItem(i, val) {
		const items = [...(d.items ?? [])];
		items[i] = val;
		let cats = d.categories ?? [];
		if (val.category && !cats.includes(val.category)) {
			cats = [...cats, val.category];
		}
		onChange({ ...d, items, categories: cats });
	}

	function removeItem(i) {
		onChange({ ...d, items: (d.items ?? []).filter((_, idx) => idx !== i) });
	}

	return (
		<div>
			<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
				<div className="admin-field">
					<label className="admin-label">Eyebrow</label>
					<input className="admin-input" value={d.eyebrow ?? ""} onChange={e => set("eyebrow", e.target.value)} />
				</div>
				<div className="admin-field">
					<label className="admin-label">Title</label>
					<input className="admin-input" value={d.title ?? ""} onChange={e => set("title", e.target.value)} />
				</div>
			</div>
			<div className="admin-field" style={{ marginBottom: 24 }}>
				<label className="admin-label">Title Highlight (renders in red)</label>
				<input className="admin-input" value={d.titleHighlight ?? ""} onChange={e => set("titleHighlight", e.target.value)} />
			</div>

			<div style={{ paddingBottom: 24, marginBottom: 24, borderBottom: "1px solid var(--admin-border)" }}>
				<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
					<label className="admin-label" style={{ marginBottom: 0 }}>Filter Categories</label>
					<button className="admin-btn admin-btn--ghost" onClick={addCategory} style={{ fontSize: 12 }}>+ Add</button>
				</div>
				{(d.categories ?? []).map((cat, i) => (
					<div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
						<input className="admin-input" value={cat} onChange={e => updateCategory(i, e.target.value)} placeholder="Category name" style={{ flex: 1 }} />
						<button onClick={() => removeCategory(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--admin-red)", fontSize: 18, padding: "0 4px" }}>✕</button>
					</div>
				))}
				{(d.categories ?? []).length === 0 && (
					<p style={{ margin: 0, fontSize: 12, color: "var(--admin-muted)" }}>No categories yet — type a new one in any item below to auto-create it.</p>
				)}
			</div>

			<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
				<h4 style={{ margin: 0, fontSize: 14 }}>Gallery Items ({(d.items ?? []).length})</h4>
				<button className="admin-btn admin-btn--ghost" onClick={addItem}>+ Add Item</button>
			</div>
			{(d.items ?? []).map((item, i) => (
				<ItemEditor
					key={item.id ?? i}
					index={i}
					item={item}
					categories={d.categories ?? []}
					onChange={(val) => updateItem(i, val)}
					onRemove={() => removeItem(i)}
				/>
			))}
		</div>
	);
}

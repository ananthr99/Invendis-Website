import { useState } from "react";
import { fileToBase64 } from "@invendis/github-client";
import { github, OWNER, REPO } from "../../config.js";


function rawUrl(imgPath) {
	return `https://raw.githubusercontent.com/${OWNER}/${REPO}/main/apps/main-site/public${imgPath}`;
}

function TimelineItemEditor({ item, onChange, onRemove }) {
	function set(field, val) { onChange({ ...item, [field]: val }); }

	return (
		<div style={{ border: "1px solid var(--admin-border)", borderRadius: 8, padding: 16, marginBottom: 12, background: "var(--admin-bg)" }}>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
				<span style={{ fontSize: 13, fontWeight: 600, color: "var(--admin-text)" }}>
					{item.year ? `${item.year} — ${item.title || "Untitled"}` : "New Event"}
				</span>
				<button onClick={onRemove} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--admin-red)", fontSize: 18, lineHeight: 1, padding: "0 2px" }}>✕</button>
			</div>
			<div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12, marginBottom: 12 }}>
				<div className="admin-field">
					<label className="admin-label">Year</label>
					<input className="admin-input" value={item.year ?? ""} placeholder="e.g. 2007 or 2021–2022" onChange={e => set("year", e.target.value)} />
				</div>
				<div className="admin-field">
					<label className="admin-label">Title</label>
					<input className="admin-input" value={item.title ?? ""} onChange={e => set("title", e.target.value)} />
				</div>
			</div>
			<div className="admin-field">
				<label className="admin-label">Description</label>
				<textarea className="admin-textarea" rows={2} value={item.description ?? ""} onChange={e => set("description", e.target.value)} />
			</div>
		</div>
	);
}

function LocationItemEditor({ item, onChange, onRemove }) {
	async function handleFileSelect(file) {
		const base64 = await fileToBase64(file);
		const blobUrl = URL.createObjectURL(file);
		const pending = [...(item._pendingImages ?? []), { base64, filename: file.name, blobUrl }];
		onChange({ ...item, _pendingImages: pending });
	}

	function renamePending(pi, val) {
		const pending = [...(item._pendingImages ?? [])];
		pending[pi] = { ...pending[pi], filename: val };
		onChange({ ...item, _pendingImages: pending });
	}

	function removePending(pi) {
		const pending = [...(item._pendingImages ?? [])];
		URL.revokeObjectURL(pending[pi].blobUrl);
		pending.splice(pi, 1);
		onChange({ ...item, _pendingImages: pending });
	}

	function removeExisting(ii) {
		onChange({ ...item, images: (item.images ?? []).filter((_, idx) => idx !== ii) });
	}

	return (
		<div style={{ border: "1px solid var(--admin-border)", borderRadius: 8, padding: 16, marginBottom: 12, background: "var(--admin-bg)" }}>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
				<span style={{ fontSize: 13, fontWeight: 600, color: "var(--admin-text)" }}>{item.caption || "Untitled Location"}</span>
				<button onClick={onRemove} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--admin-red)", fontSize: 18, lineHeight: 1, padding: "0 2px" }}>✕</button>
			</div>
			<div className="admin-field">
				<label className="admin-label">Caption</label>
				<input className="admin-input" value={item.caption ?? ""} onChange={e => onChange({ ...item, caption: e.target.value })} />
			</div>
			<div className="admin-field">
				<label className="admin-label">Images</label>
				<div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 8 }}>
					{(item.images ?? []).map((src, ii) => (
						<div key={ii} style={{ position: "relative" }}>
							<img src={rawUrl(src)} alt="" style={{ height: 70, width: 110, objectFit: "cover", borderRadius: 6, border: "1px solid var(--admin-border)", display: "block" }} />
							<button onClick={() => removeExisting(ii)} title="Remove" style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: "50%", background: "var(--admin-red)", color: "white", border: "none", cursor: "pointer", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
						</div>
					))}
					{(item._pendingImages ?? []).map((p, pi) => (
						<div key={`p-${pi}`} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
							<div style={{ position: "relative" }}>
								<img src={p.blobUrl} alt="" style={{ height: 70, width: 110, objectFit: "cover", borderRadius: 6, border: "2px dashed var(--admin-blue)", display: "block" }} />
								<button onClick={() => removePending(pi)} title="Remove" style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: "50%", background: "var(--admin-red)", color: "white", border: "none", cursor: "pointer", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
							</div>
							<input className="admin-input" style={{ fontSize: 11, width: 110 }} value={p.filename} onChange={e => renamePending(pi, e.target.value)} />
							<p style={{ margin: 0, fontSize: 10, color: "var(--admin-muted)" }}>→ /images/company/locations/{p.filename}</p>
						</div>
					))}
				</div>
				<label style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 10px", border: "1px solid var(--admin-border)", borderRadius: 6, cursor: "pointer", fontSize: 12, background: "white", fontFamily: "inherit" }}>
					<input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) handleFileSelect(e.target.files[0]); e.target.value = ""; }} />
					+ Add image
				</label>
			</div>
		</div>
	);
}

export default function JourneyEditor({ data, onChange }) {
	const d = data ?? { eyebrow: "", title: "", timeline: [], facilities: {}, locations: {} };
	function set(field, val) { onChange({ ...d, [field]: val }); }

	const fac = d.facilities ?? {};
	function setFac(field, val) { onChange({ ...d, facilities: { ...fac, [field]: val } }); }
	function addFacItem() { setFac("items", [...(fac.items ?? []), { label: "" }]); }
	function updateFacItem(i, val) { const items = [...(fac.items ?? [])]; items[i] = { label: val }; setFac("items", items); }
	function removeFacItem(i) { setFac("items", (fac.items ?? []).filter((_, idx) => idx !== i)); }
	function addCert() { setFac("certifications", [...(fac.certifications ?? []), ""]); }
	function updateCert(i, val) { const c = [...(fac.certifications ?? [])]; c[i] = val; setFac("certifications", c); }
	function removeCert(i) { setFac("certifications", (fac.certifications ?? []).filter((_, idx) => idx !== i)); }

	const locs = d.locations ?? {};
	function setLocs(field, val) { onChange({ ...d, locations: { ...locs, [field]: val } }); }
	function addLocItem() { setLocs("items", [...(locs.items ?? []), { caption: "", images: [] }]); }
	function updateLocItem(i, val) { const items = [...(locs.items ?? [])]; items[i] = val; setLocs("items", items); }
	function removeLocItem(i) { setLocs("items", (locs.items ?? []).filter((_, idx) => idx !== i)); }

	function addTimelineItem() { onChange({ ...d, timeline: [...(d.timeline ?? []), { year: "", title: "", description: "" }] }); }
	function updateTimelineItem(i, val) { const t = [...(d.timeline ?? [])]; t[i] = val; onChange({ ...d, timeline: t }); }
	function removeTimelineItem(i) { onChange({ ...d, timeline: (d.timeline ?? []).filter((_, idx) => idx !== i) }); }

	return (
		<div>
			<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
				<div className="admin-field">
					<label className="admin-label">Eyebrow</label>
					<input className="admin-input" value={d.eyebrow ?? ""} onChange={e => set("eyebrow", e.target.value)} />
				</div>
				<div className="admin-field">
					<label className="admin-label">Title</label>
					<input className="admin-input" value={d.title ?? ""} onChange={e => set("title", e.target.value)} />
				</div>
			</div>

			{/* Timeline */}
			<div style={{ paddingBottom: 24, marginBottom: 24, borderBottom: "1px solid var(--admin-border)" }}>
				<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
					<h4 style={{ margin: 0, fontSize: 14 }}>Timeline ({(d.timeline ?? []).length})</h4>
					<button className="admin-btn admin-btn--ghost" onClick={addTimelineItem}>+ Add Event</button>
				</div>
				{(d.timeline ?? []).map((item, i) => (
					<TimelineItemEditor key={i} item={item} onChange={val => updateTimelineItem(i, val)} onRemove={() => removeTimelineItem(i)} />
				))}
			</div>

			{/* Facilities */}
			<div style={{ paddingBottom: 24, marginBottom: 24, borderBottom: "1px solid var(--admin-border)" }}>
				<h4 style={{ margin: "0 0 14px", fontSize: 14 }}>Facilities</h4>
				<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
					<div className="admin-field">
						<label className="admin-label">Eyebrow</label>
						<input className="admin-input" value={fac.eyebrow ?? ""} onChange={e => setFac("eyebrow", e.target.value)} />
					</div>
					<div className="admin-field">
						<label className="admin-label">Title</label>
						<input className="admin-input" value={fac.title ?? ""} onChange={e => setFac("title", e.target.value)} />
					</div>
				</div>
				<div className="admin-field" style={{ marginBottom: 16 }}>
					<label className="admin-label">Subtitle</label>
					<textarea className="admin-textarea" rows={2} value={fac.subtitle ?? ""} onChange={e => setFac("subtitle", e.target.value)} />
				</div>
				<div style={{ marginBottom: 14 }}>
					<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
						<label className="admin-label" style={{ marginBottom: 0 }}>Facility Locations</label>
						<button className="admin-btn admin-btn--ghost" onClick={addFacItem} style={{ fontSize: 12 }}>+ Add</button>
					</div>
					{(fac.items ?? []).map((item, i) => (
						<div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
							<input className="admin-input" value={item.label ?? ""} onChange={e => updateFacItem(i, e.target.value)} placeholder="e.g. HQ — 10,000+ sq. ft. · Bangalore, India" style={{ flex: 1 }} />
							<button onClick={() => removeFacItem(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--admin-red)", fontSize: 18, padding: "0 4px" }}>✕</button>
						</div>
					))}
				</div>
				<div>
					<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
						<label className="admin-label" style={{ marginBottom: 0 }}>Certifications</label>
						<button className="admin-btn admin-btn--ghost" onClick={addCert} style={{ fontSize: 12 }}>+ Add</button>
					</div>
					{(fac.certifications ?? []).map((cert, i) => (
						<div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
							<input className="admin-input" value={cert} onChange={e => updateCert(i, e.target.value)} placeholder="e.g. ISO 9001:2015" style={{ flex: 1 }} />
							<button onClick={() => removeCert(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--admin-red)", fontSize: 18, padding: "0 4px" }}>✕</button>
						</div>
					))}
				</div>
			</div>

			{/* Locations */}
			<div>
				<h4 style={{ margin: "0 0 14px", fontSize: 14 }}>Locations</h4>
				<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
					<div className="admin-field">
						<label className="admin-label">Eyebrow</label>
						<input className="admin-input" value={locs.eyebrow ?? ""} onChange={e => setLocs("eyebrow", e.target.value)} />
					</div>
					<div className="admin-field">
						<label className="admin-label">Title</label>
						<input className="admin-input" value={locs.title ?? ""} onChange={e => setLocs("title", e.target.value)} />
					</div>
				</div>
				<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
					<h4 style={{ margin: 0, fontSize: 13, color: "var(--admin-muted)", fontWeight: 400 }}>Location Items ({(locs.items ?? []).length})</h4>
					<button className="admin-btn admin-btn--ghost" onClick={addLocItem}>+ Add Location</button>
				</div>
				{(locs.items ?? []).map((item, i) => (
					<LocationItemEditor key={i} item={item} onChange={val => updateLocItem(i, val)} onRemove={() => removeLocItem(i)} />
				))}
			</div>
		</div>
	);
}

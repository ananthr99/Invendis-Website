import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fileToBase64 } from "@invendis/github-client";
import { useAdmin } from "../../context/AdminContext.jsx";
import { loadPageContent, savePageContent } from "../../utils/savePageContent.js";
import { github, OWNER, REPO } from "../../config.js";

function rawUrl(imgPath) {
	return `https://raw.githubusercontent.com/${OWNER}/${REPO}/main/apps/main-site/public${imgPath}`;
}

const BLOCK_TYPE_LABELS = {
	paragraph: "Paragraph",
	heading: "Heading",
	bulletList: "Bullet List",
	numberedList: "Numbered List",
	image: "Image",
	callout: "Callout",
};

function ParagraphEditor({ block, onChange }) {
	return (
		<div className="admin-field">
			<label className="admin-label">Text</label>
			<textarea className="admin-textarea" rows={4} value={block.text ?? ""} onChange={e => onChange({ ...block, text: e.target.value })} />
		</div>
	);
}

function HeadingEditor({ block, onChange }) {
	return (
		<div style={{ display: "flex", gap: 12 }}>
			<div className="admin-field" style={{ flex: "0 0 100px" }}>
				<label className="admin-label">Level</label>
				<select className="admin-input" value={block.level ?? 2} onChange={e => onChange({ ...block, level: Number(e.target.value) })}>
					<option value={2}>H2</option>
					<option value={3}>H3</option>
				</select>
			</div>
			<div className="admin-field" style={{ flex: 1 }}>
				<label className="admin-label">Text</label>
				<input className="admin-input" value={block.text ?? ""} onChange={e => onChange({ ...block, text: e.target.value })} />
			</div>
		</div>
	);
}

function ListEditor({ block, onChange }) {
	const items = block.items ?? [];
	function setItem(i, val) { const next = [...items]; next[i] = val; onChange({ ...block, items: next }); }
	function addItem() { onChange({ ...block, items: [...items, ""] }); }
	function removeItem(i) { onChange({ ...block, items: items.filter((_, idx) => idx !== i) }); }

	return (
		<div className="admin-field">
			<label className="admin-label">Items</label>
			{items.map((item, i) => (
				<div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
					<input className="admin-input" style={{ flex: 1 }} value={item} onChange={e => setItem(i, e.target.value)} />
					<button className="admin-btn admin-btn--ghost" onClick={() => removeItem(i)} style={{ flexShrink: 0 }}>✕</button>
				</div>
			))}
			<button className="admin-btn admin-btn--ghost" onClick={addItem} style={{ marginTop: 4 }}>+ Add item</button>
		</div>
	);
}

function ImageBlockEditor({ block, onChange, token }) {
	const [preview, setPreview] = useState(null);
	const [fileCheck, setFileCheck] = useState(null);
	const checkTimer = useRef(null);

	function checkFileExists(repoPath) {
		if (!token) return;
		setFileCheck("checking");
		clearTimeout(checkTimer.current);
		checkTimer.current = setTimeout(async () => {
			try {
				const sha = await github.getFileSha(repoPath, { branch: "main", token });
				setFileCheck(sha ? "exists" : "free");
			} catch { setFileCheck("free"); }
		}, 500);
	}

	async function handleFileSelect(file) {
		const base64 = await fileToBase64(file);
		const previewUrl = URL.createObjectURL(file);
		setPreview({ previewUrl, filename: file.name });
		onChange({ ...block, _pendingUpload: { base64, filename: file.name } });
		checkFileExists(`apps/main-site/public/images/articles/${file.name}`);
	}

	function renamePending(val) {
		onChange({ ...block, _pendingUpload: { ...block._pendingUpload, filename: val } });
		checkFileExists(`apps/main-site/public/images/articles/${val}`);
	}

	function clearPending() {
		if (preview?.previewUrl) URL.revokeObjectURL(preview.previewUrl);
		setPreview(null);
		setFileCheck(null);
		onChange({ ...block, _pendingUpload: undefined });
	}

	const pending = block._pendingUpload;

	return (
		<div>
			<div className="admin-field">
				<label className="admin-label">Caption</label>
				<input className="admin-input" value={block.caption ?? ""} onChange={e => onChange({ ...block, caption: e.target.value })} />
			</div>
			<div className="admin-field" style={{ marginTop: 12 }}>
				<label className="admin-label">Image</label>
				{block.src && !pending && (
					<div style={{ marginBottom: 12 }}>
						<div style={{ position: "relative", display: "inline-block" }}>
							<img src={rawUrl(block.src)} alt="" style={{ height: 80, width: 160, objectFit: "cover", borderRadius: 6, border: "1px solid var(--admin-border)", display: "block" }} />
							<button onClick={() => onChange({ ...block, src: "" })} title="Remove" style={{ position: "absolute", top: -7, right: -7, width: 20, height: 20, borderRadius: "50%", background: "var(--admin-red)", color: "white", border: "none", cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
						</div>
						<p style={{ margin: "6px 0 0", fontSize: 11, color: "var(--admin-muted)" }}>{block.src}</p>
					</div>
				)}
				{pending && (
					<div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, padding: 8, background: "var(--admin-bg)", border: "1px solid var(--admin-border)", borderRadius: 6 }}>
						{preview?.previewUrl && <img src={preview.previewUrl} alt="" style={{ height: 52, width: 80, objectFit: "cover", borderRadius: 4, flexShrink: 0 }} />}
						<div style={{ flex: 1, minWidth: 0 }}>
							<label style={{ fontSize: 11, color: "var(--admin-muted)", display: "block", marginBottom: 3 }}>Save as</label>
							<input className="admin-input" style={{ fontSize: 13, marginBottom: 4 }} value={pending.filename} onChange={e => renamePending(e.target.value)} />
							<p style={{ margin: 0, fontSize: 11, color: "var(--admin-muted)" }}>→ /images/articles/{pending.filename}</p>
							{fileCheck === "checking" && <p style={{ margin: "4px 0 0", fontSize: 11, color: "var(--admin-muted)" }}>Checking…</p>}
							{fileCheck === "exists" && <p style={{ margin: "4px 0 0", fontSize: 11, color: "var(--admin-red)" }}>⚠ File already exists — saving will overwrite it</p>}
							{fileCheck === "free" && <p style={{ margin: "4px 0 0", fontSize: 11, color: "#16a34a" }}>✓ Name is available</p>}
						</div>
						<button className="admin-btn admin-btn--ghost" onClick={clearPending}>✕</button>
					</div>
				)}
				<label style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", border: "1px solid var(--admin-border)", borderRadius: 8, cursor: "pointer", fontSize: 13, background: "white", fontFamily: "inherit" }}>
					<input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) handleFileSelect(e.target.files[0]); e.target.value = ""; }} />
					{pending || block.src ? "Replace image" : "Upload image"}
				</label>
			</div>
		</div>
	);
}

function CalloutEditor({ block, onChange }) {
	return (
		<div>
			<div className="admin-field">
				<label className="admin-label">Title (optional)</label>
				<input className="admin-input" value={block.title ?? ""} onChange={e => onChange({ ...block, title: e.target.value })} />
			</div>
			<div className="admin-field">
				<label className="admin-label">Text</label>
				<textarea className="admin-textarea" rows={3} value={block.text ?? ""} onChange={e => onChange({ ...block, text: e.target.value })} />
			</div>
		</div>
	);
}

function BlockEditor({ block, onChange, onDelete, onMoveUp, onMoveDown, isFirst, isLast, token }) {
	function renderInner() {
		switch (block.type) {
			case "paragraph": return <ParagraphEditor block={block} onChange={onChange} />;
			case "heading": return <HeadingEditor block={block} onChange={onChange} />;
			case "bulletList":
			case "numberedList": return <ListEditor block={block} onChange={onChange} />;
			case "image": return <ImageBlockEditor block={block} onChange={onChange} token={token} />;
			case "callout": return <CalloutEditor block={block} onChange={onChange} />;
			default: return <p style={{ color: "var(--admin-muted)", fontSize: 13 }}>Unknown block type: {block.type}</p>;
		}
	}

	return (
		<div style={{ border: "1px solid var(--admin-border)", borderRadius: 8, padding: "14px 16px", marginBottom: 12, background: "white" }}>
			<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
				<span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--admin-blue)", background: "#eff6ff", padding: "2px 8px", borderRadius: 4 }}>
					{BLOCK_TYPE_LABELS[block.type] ?? block.type}
				</span>
				<div style={{ display: "flex", gap: 4 }}>
					<button className="admin-btn admin-btn--ghost" onClick={onMoveUp} disabled={isFirst} style={{ padding: "4px 8px", fontSize: 13 }}>↑</button>
					<button className="admin-btn admin-btn--ghost" onClick={onMoveDown} disabled={isLast} style={{ padding: "4px 8px", fontSize: 13 }}>↓</button>
					<button className="admin-btn admin-btn--ghost" onClick={onDelete} style={{ padding: "4px 8px", fontSize: 13, color: "var(--admin-red)" }}>✕</button>
				</div>
			</div>
			{renderInner()}
		</div>
	);
}

function stripPending(article) {
	if (!article) return article;
	return {
		...article,
		content: (article.content ?? []).map(block => {
			if (block.type === "image") { const { _pendingUpload, ...rest } = block; return rest; }
			return block;
		}),
	};
}

export default function ArticleDetailEditor() {
	const { slug } = useParams();
	const navigate = useNavigate();
	const { token, toast, setDirty, userEmail } = useAdmin();
	const [original, setOriginal] = useState(null);
	const [form, setForm] = useState(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [activeTab, setActiveTab] = useState("metadata");
	const loadedRef = useRef(null);
	const headerRef = useRef(null);
	const [headerH, setHeaderH] = useState(110);

	const CONTENT_PATH = `articles/${slug}.json`;

	useEffect(() => {
		const key = `${token}:${slug}`;
		if (!token || loadedRef.current === key) return;
		loadedRef.current = key;
		setLoading(true);
		loadPageContent(CONTENT_PATH, token)
			.then((data) => { setOriginal(data); setForm(data); })
			.catch((err) => toast(err.message, "err"))
			.finally(() => setLoading(false));
	}, [token, slug]);

	useLayoutEffect(() => {
		if (headerRef.current) setHeaderH(headerRef.current.offsetHeight);
	});

	useEffect(() => {
		if (!original || !form) return;
		const blocksPending = (form.content ?? []).some(b => b._pendingUpload);
		setDirty(blocksPending || JSON.stringify(original) !== JSON.stringify(stripPending(form)));
	}, [form, original]);

	if (!token) return <p style={{ color: "var(--admin-muted)" }}>Enter a GitHub token in Setup first.</p>;
	if (loading) return <p style={{ color: "var(--admin-muted)" }}>Loading…</p>;
	if (!form) return null;

	function setMeta(field, val) { setForm(f => ({ ...f, [field]: val })); }

	function updateBlock(i, val) {
		setForm(f => { const content = [...(f.content ?? [])]; content[i] = val; return { ...f, content }; });
	}

	function deleteBlock(i) {
		setForm(f => ({ ...f, content: (f.content ?? []).filter((_, idx) => idx !== i) }));
	}

	function moveBlock(i, dir) {
		setForm(f => {
			const content = [...(f.content ?? [])];
			const j = i + dir;
			if (j < 0 || j >= content.length) return f;
			[content[i], content[j]] = [content[j], content[i]];
			return { ...f, content };
		});
	}

	function addBlock(type) {
		const defaults = {
			paragraph: { type: "paragraph", text: "" },
			heading: { type: "heading", level: 2, text: "" },
			bulletList: { type: "bulletList", items: [""] },
			numberedList: { type: "numberedList", items: [""] },
			image: { type: "image", src: "", caption: "" },
			callout: { type: "callout", title: "", text: "" },
		};
		setForm(f => ({ ...f, content: [...(f.content ?? []), defaults[type]] }));
	}

	async function handleSave() {
		setSaving(true);
		try {
			let saveForm = { ...form };
			const content = [];
			for (const block of saveForm.content ?? []) {
				if (block.type === "image" && block._pendingUpload) {
					const p = block._pendingUpload;
					const path = `apps/main-site/public/images/articles/${p.filename}`;
					const sha = await github.getFileSha(path, { branch: "main", token });
					toast(`Uploading "${p.filename}"…`, "ok");
					await github.writeFileBase64(path, p.base64, { message: `CMS: upload article image [skip ci]`, sha, branch: "main", token });
					const { _pendingUpload, ...rest } = block;
					content.push({ ...rest, src: `/images/articles/${p.filename}` });
				} else {
					content.push(block);
				}
			}
			saveForm = { ...saveForm, content };

			await savePageContent({ token, contentPath: CONTENT_PATH, before: original, after: saveForm, page: `Article: ${form.title || slug}`, userEmail });
			setOriginal(saveForm);
			setForm(saveForm);
			setDirty(false);
			toast("Article saved — live in a few seconds", "ok");
		} catch (err) {
			toast(err.message, "err");
		} finally {
			setSaving(false);
		}
	}

	const TABS = [{ key: "metadata", label: "Metadata" }, { key: "content", label: "Content Blocks" }];

	return (
		<div>
			<div ref={headerRef} style={{ position: "fixed", top: 56, left: 220, right: 0, zIndex: 50, background: "var(--admin-bg)", padding: "16px 40px 0", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
				<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
					<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
						<button className="admin-btn admin-btn--ghost" onClick={() => navigate("/content/resources")} style={{ fontSize: 13 }}>← Resources</button>
						<h2 style={{ margin: 0, fontSize: 18 }}>{form.title || slug}</h2>
					</div>
					<button className="admin-btn admin-btn--primary" onClick={handleSave} disabled={saving}>
						{saving ? "Saving…" : "Save changes"}
					</button>
				</div>
				<div style={{ display: "flex", flexWrap: "wrap", gap: 2, borderBottom: "2px solid var(--admin-border)" }}>
					{TABS.map(tab => (
						<button
							key={tab.key}
							onClick={() => setActiveTab(tab.key)}
							style={{ padding: "8px 16px", border: "none", background: "none", cursor: "pointer", fontSize: 13.5, fontWeight: activeTab === tab.key ? 700 : 400, color: activeTab === tab.key ? "var(--admin-blue)" : "var(--admin-muted)", borderBottom: activeTab === tab.key ? "2px solid var(--admin-blue)" : "2px solid transparent", marginBottom: -2, transition: "color 0.15s", fontFamily: "inherit" }}
						>
							{tab.label}
						</button>
					))}
				</div>
			</div>

			<div style={{ height: headerH }} />

			<div className="admin-card">
				{activeTab === "metadata" && (
					<div>
						<div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid var(--admin-border)" }}>
							<h3 style={{ margin: 0 }}>Article Metadata</h3>
						</div>
						<div className="admin-field">
							<label className="admin-label">Title</label>
							<input className="admin-input" value={form.title ?? ""} onChange={e => setMeta("title", e.target.value)} />
						</div>
						<div className="admin-field">
							<label className="admin-label">Description</label>
							<textarea className="admin-textarea" value={form.description ?? ""} onChange={e => setMeta("description", e.target.value)} />
						</div>
						<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
							<div className="admin-field">
								<label className="admin-label">Category</label>
								<input className="admin-input" value={form.category ?? ""} onChange={e => setMeta("category", e.target.value)} />
							</div>
							<div className="admin-field">
								<label className="admin-label">Slug</label>
								<input className="admin-input" value={form.slug ?? ""} onChange={e => setMeta("slug", e.target.value)} />
							</div>
						</div>
						<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
							<div className="admin-field">
								<label className="admin-label">Date</label>
								<input className="admin-input" value={form.date ?? ""} onChange={e => setMeta("date", e.target.value)} placeholder="e.g. 7 Sept 2026" />
							</div>
							<div className="admin-field">
								<label className="admin-label">Read Time</label>
								<input className="admin-input" value={form.readTime ?? ""} onChange={e => setMeta("readTime", e.target.value)} placeholder="e.g. 3 min read" />
							</div>
						</div>
					</div>
				)}

				{activeTab === "content" && (
					<div>
						<div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid var(--admin-border)" }}>
							<h3 style={{ margin: 0 }}>Content Blocks</h3>
						</div>
						{(form.content ?? []).map((block, i) => (
							<BlockEditor
								key={i}
								block={block}
								onChange={val => updateBlock(i, val)}
								onDelete={() => deleteBlock(i)}
								onMoveUp={() => moveBlock(i, -1)}
								onMoveDown={() => moveBlock(i, 1)}
								isFirst={i === 0}
								isLast={i === (form.content ?? []).length - 1}
								token={token}
							/>
						))}
						{(form.content ?? []).length === 0 && (
							<p style={{ color: "var(--admin-muted)", textAlign: "center", padding: "2rem 0", fontSize: 14 }}>No content blocks yet. Add one below.</p>
						)}
						<div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--admin-border)" }}>
							<p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 600, color: "var(--admin-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Add Block</p>
							<div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
								{Object.entries(BLOCK_TYPE_LABELS).map(([type, label]) => (
									<button key={type} className="admin-btn admin-btn--ghost" onClick={() => addBlock(type)} style={{ fontSize: 13 }}>+ {label}</button>
								))}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

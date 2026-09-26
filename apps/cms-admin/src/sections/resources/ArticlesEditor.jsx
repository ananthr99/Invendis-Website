import { useNavigate } from "react-router-dom";

function slugify(str) {
	return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function ArticleItem({ item, onChange, onDelete, navigate }) {
	return (
		<div style={{ border: "1px solid var(--admin-border)", borderRadius: 8, padding: "14px 16px", marginBottom: 12, background: "white" }}>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
				<span style={{ fontSize: 11, fontWeight: 700, color: "var(--admin-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Article</span>
				<div style={{ display: "flex", gap: 8 }}>
					{item.slug && (
						<button className="admin-btn admin-btn--ghost" onClick={() => navigate(`/content/resources/${item.slug}`)} style={{ fontSize: 12 }}>
							Edit Content →
						</button>
					)}
					<button className="admin-btn admin-btn--ghost" onClick={onDelete} style={{ fontSize: 13, color: "var(--admin-red)" }}>✕</button>
				</div>
			</div>

			<div className="admin-field">
				<label className="admin-label">Title</label>
				<input
					className="admin-input"
					value={item.title ?? ""}
					onChange={e => {
						const title = e.target.value;
						const autoSlug = slugify(title);
						onChange({ ...item, title, id: item.id || autoSlug, slug: item.slug || autoSlug });
					}}
				/>
			</div>
			<div className="admin-field">
				<label className="admin-label">Description</label>
				<textarea className="admin-textarea" rows={2} value={item.description ?? ""} onChange={e => onChange({ ...item, description: e.target.value })} />
			</div>
			<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
				<div className="admin-field">
					<label className="admin-label">Category</label>
					<input className="admin-input" value={item.category ?? ""} onChange={e => onChange({ ...item, category: e.target.value })} />
				</div>
				<div className="admin-field">
					<label className="admin-label">Slug</label>
					<input className="admin-input" value={item.slug ?? ""} onChange={e => onChange({ ...item, slug: e.target.value, id: e.target.value })} />
				</div>
			</div>
			<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
				<div className="admin-field">
					<label className="admin-label">Date</label>
					<input className="admin-input" value={item.date ?? ""} onChange={e => onChange({ ...item, date: e.target.value })} placeholder="e.g. 7 Sept 2026" />
				</div>
				<div className="admin-field">
					<label className="admin-label">Read Time</label>
					<input className="admin-input" value={item.readTime ?? ""} onChange={e => onChange({ ...item, readTime: e.target.value })} placeholder="e.g. 3 min read" />
				</div>
			</div>
		</div>
	);
}

export default function ArticlesEditor({ data, onChange }) {
	const navigate = useNavigate();
	const d = data ?? { categories: [], items: [] };
	const categories = d.categories ?? [];
	const items = d.items ?? [];

	function setCategories(val) { onChange({ ...d, categories: val }); }
	function setItems(val) { onChange({ ...d, items: val }); }

	function addCategory() { setCategories([...categories, ""]); }
	function updateCategory(i, val) { const c = [...categories]; c[i] = val; setCategories(c); }
	function removeCategory(i) { setCategories(categories.filter((_, idx) => idx !== i)); }

	function addItem() {
		const id = `new-article-${Date.now()}`;
		setItems([...items, { id, slug: id, category: categories[0] ?? "", title: "", description: "", date: "", readTime: "" }]);
	}

	function updateItem(i, val) { const next = [...items]; next[i] = val; setItems(next); }
	function deleteItem(i) { setItems(items.filter((_, idx) => idx !== i)); }

	return (
		<div>
			<div style={{ marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid var(--admin-border)" }}>
				<p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700, color: "#374151" }}>Categories</p>
				{categories.map((cat, i) => (
					<div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
						<input className="admin-input" style={{ flex: 1 }} value={cat} onChange={e => updateCategory(i, e.target.value)} />
						<button className="admin-btn admin-btn--ghost" onClick={() => removeCategory(i)} style={{ flexShrink: 0 }}>✕</button>
					</div>
				))}
				<button className="admin-btn admin-btn--ghost" onClick={addCategory} style={{ marginTop: 4, fontSize: 13 }}>+ Add category</button>
			</div>

			<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
				<p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#374151" }}>Articles ({items.length})</p>
				<button className="admin-btn admin-btn--primary" onClick={addItem} style={{ fontSize: 13 }}>+ Add article</button>
			</div>

			{items.map((item, i) => (
				<ArticleItem key={item.id ?? i} item={item} onChange={val => updateItem(i, val)} onDelete={() => deleteItem(i)} navigate={navigate} />
			))}

			{items.length === 0 && (
				<p style={{ color: "var(--admin-muted)", textAlign: "center", padding: "2rem 0", fontSize: 14 }}>No articles yet.</p>
			)}
		</div>
	);
}

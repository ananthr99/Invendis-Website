import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useAdmin } from "../../context/AdminContext.jsx";
import { loadPageContent, savePageContent, uploadImage } from "../../utils/savePageContent.js";
import { github, LIVE_BRANCH } from "../../config.js";
import ProductList from "../../sections/product-selector/ProductList.jsx";
import ProductForm from "../../sections/product-selector/ProductForm.jsx";

const INDEX_PATH = "productSelector/_index.json";

function productPath(id) { return `productSelector/products/${id}.json`; }

const EMPTY_PRODUCT = {
	id: "", name: "", cat: "", order: 0, hidden: false, desc: "",
	cpu: "-", ram: "-", storage: "-", cell: "-",
	cellular_gen: "-", wifi: "-", rs485: "-", rs232: "-",
	ip: "", power: "-", ports: "-", os: "-",
	housing: "-", dims: "-", weight: "-", op_temp: "-",
	images: [], use_cases: [],
	datasheet: null, part_datasheets: {},
	hidden_fields: [], additional_specs: [], variants: null,
};

export default function ProductSelectorEditor() {
	const { token, toast, setDirty, isDirty, showConfirm, userEmail } = useAdmin();
	const [index, setIndex] = useState(null);
	const [loading, setLoading] = useState(true);
	const [view, setView] = useState("list");
	const [product, setProduct] = useState(null);
	const [originalProduct, setOriginalProduct] = useState(null);
	const [productLoading, setProductLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [confirmDelete, setConfirmDelete] = useState(null);
	const loadedRef = useRef(null);
	const headerRef = useRef(null);
	const [headerH, setHeaderH] = useState(60);

	useLayoutEffect(() => {
		if (headerRef.current) setHeaderH(headerRef.current.offsetHeight);
	});

	useEffect(() => {
		if (!token || loadedRef.current === token) return;
		loadedRef.current = token;
		setLoading(true);
		loadPageContent(INDEX_PATH, token)
			.then(data => setIndex(data))
			.catch(err => toast(err.message, "err"))
			.finally(() => setLoading(false));
	}, [token]);

	useEffect(() => {
		if (!product || !originalProduct) return;
		const { _pendingImages, _pendingDatasheets, ...clean } = product;
		const hasPending = (product._pendingImages?.length > 0) || (product._pendingDatasheets?.length > 0);
		setDirty(hasPending || JSON.stringify(originalProduct) !== JSON.stringify(clean));
	}, [product, originalProduct]);

	async function openEdit(id) {
		setProductLoading(true);
		setView("edit");
		try {
			const data = await loadPageContent(productPath(id), token);
			setProduct(data);
			setOriginalProduct(data);
		} catch (err) {
			toast(err.message, "err");
			setView("list");
		} finally {
			setProductLoading(false);
		}
	}

	function openNew() {
		const nextOrder = Math.max(0, ...((index?.products ?? []).map(p => p.order || 0))) + 1;
		const blank = { ...EMPTY_PRODUCT, order: nextOrder, cat: index?.cats?.[0] ?? "" };
		setProduct(blank);
		setOriginalProduct(blank);
		setView("new");
	}

	function goBack() {
		const doGoBack = () => {
			setView("list");
			setProduct(null);
			setOriginalProduct(null);
			setDirty(false);
		};
		if (isDirty()) {
			showConfirm("You have unsaved changes. Discard them and go back to the list?", doGoBack);
		} else {
			doGoBack();
		}
	}

	async function handleSave() {
		if (!product) return;
		if (!product.id.trim()) { toast("Product ID is required", "err"); return; }
		if (!product.name.trim()) { toast("Product name is required", "err"); return; }
		setSaving(true);
		try {
			let p = { ...product };
			const imgs = [...(p.images ?? [])];

			for (const u of p._pendingImages ?? []) {
				toast(`Uploading ${u.filename}…`, "ok");
				const imgPath = `images/product-selector/${p.id}/${u.filename}`;
				await uploadImage(imgPath, u.base64, { token, message: `CMS: upload image for ${p.id}` });
				if (u.replaceIndex !== null) imgs[u.replaceIndex] = `/${imgPath}`;
				else imgs.push(`/${imgPath}`);
			}
			p = { ...p, images: imgs };

			let ds = p.datasheet;
			const partDs = { ...(p.part_datasheets ?? {}) };
			for (const u of p._pendingDatasheets ?? []) {
				toast(`Uploading ${u.filename}…`, "ok");
				const dsPath = `assets/datasheets/products/${p.id}/${u.filename}`;
				await uploadImage(dsPath, u.base64, { token, message: `CMS: upload datasheet for ${p.id}` });
				if (u.isTopLevel) ds = `/${dsPath}`;
				else partDs[u.partName] = `/${dsPath}`;
			}
			p = { ...p, datasheet: ds, part_datasheets: partDs };

			const { _pendingImages, _pendingDatasheets, ...cleanProduct } = p;

			await savePageContent({
				token,
				contentPath: productPath(cleanProduct.id),
				before: view === "new" ? {} : (originalProduct ?? {}),
				after: cleanProduct,
				page: "Product Selector",
				section: cleanProduct.name,
				userEmail,
			});

			const newIndex = { ...index };
			const cardEntry = {
				id: cleanProduct.id,
				name: cleanProduct.name,
				cat: cleanProduct.cat,
				order: cleanProduct.order,
				hidden: cleanProduct.hidden,
				desc: cleanProduct.desc,
				cellular_gen: cleanProduct.cellular_gen,
				wifi: cleanProduct.wifi,
				ports: cleanProduct.ports,
				rs485: cleanProduct.rs485,
				rs232: cleanProduct.rs232,
				image: cleanProduct.images?.[0] ?? "",
				use_cases: cleanProduct.use_cases ?? [],
			};
			const idx = newIndex.products.findIndex(pr => pr.id === cleanProduct.id);
			if (idx >= 0) newIndex.products[idx] = cardEntry;
			else newIndex.products.push(cardEntry);
			newIndex.products.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

			await savePageContent({
				token, contentPath: INDEX_PATH,
				before: index, after: newIndex,
				page: "Product Selector", section: "_index", userEmail,
			});

			setIndex(newIndex);
			setProduct(cleanProduct);
			setOriginalProduct(cleanProduct);
			setDirty(false);
			if (view === "new") setView("edit");
			toast(`${cleanProduct.name} saved — live in a few seconds`, "ok");
		} catch (err) {
			toast(err.message, "err");
		} finally {
			setSaving(false);
		}
	}

	async function handleDelete(id) {
		setSaving(true);
		try {
			const newIndex = { ...index, products: index.products.filter(p => p.id !== id) };
			await savePageContent({ token, contentPath: INDEX_PATH, before: index, after: newIndex, page: "Product Selector", section: "_index", userEmail });

			const mainSrc = `apps/main-site/public/content/productSelector/products/${id}.json`;
			const liveSrc = `content/productSelector/products/${id}.json`;
			const mSha = await github.getFileSha(mainSrc, { branch: "main", token });
			if (mSha) await github.deleteFile(mainSrc, mSha, { message: `CMS: delete product ${id}`, branch: "main", token });
			const lSha = await github.getFileSha(liveSrc, { branch: LIVE_BRANCH, token });
			if (lSha) await github.deleteFile(liveSrc, lSha, { message: `CMS: delete product ${id}`, branch: LIVE_BRANCH, token });

			setIndex(newIndex);
			setConfirmDelete(null);
			if (view !== "list") goBack();
			toast(`Product "${id}" deleted`, "ok");
		} catch (err) {
			toast(err.message, "err");
		} finally {
			setSaving(false);
		}
	}

	async function handleSaveCats(cats, catColors) {
		setSaving(true);
		try {
			const newIndex = { ...index, cats, catColors };
			await savePageContent({ token, contentPath: INDEX_PATH, before: index, after: newIndex, page: "Product Selector", section: "categories", userEmail });
			setIndex(newIndex);
			toast("Categories saved", "ok");
		} catch (err) {
			toast(err.message, "err");
		} finally {
			setSaving(false);
		}
	}

	if (!token) return <p style={{ color: "var(--admin-muted)" }}>Enter a GitHub token in Setup first.</p>;
	if (loading) return <p style={{ color: "var(--admin-muted)" }}>Loading product index…</p>;
	if (!index) return null;

	const isEdit = view === "edit" || view === "new";

	return (
		<div>
			<div ref={headerRef} style={{ position: "fixed", top: 56, left: 220, right: 0, zIndex: 50, background: "var(--admin-bg)", padding: "16px 40px 12px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
				<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
					{isEdit && <button className="admin-btn admin-btn--ghost" onClick={goBack}>← Back</button>}
					<h2 style={{ margin: 0, flex: 1 }}>
						Product Selector
						{isEdit && product && (
							<span style={{ fontWeight: 400, color: "var(--admin-muted)", fontSize: 15, marginLeft: 8 }}>
								/ {view === "new" ? "New Product" : product.name}
							</span>
						)}
					</h2>
					{isEdit
						? <button className="admin-btn admin-btn--primary" onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save product"}</button>
						: <button className="admin-btn admin-btn--primary" onClick={openNew}>+ New product</button>
					}
				</div>
			</div>

			<div style={{ height: headerH }} />

			{confirmDelete && (
				<div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
					<div style={{ background: "white", borderRadius: 12, padding: 28, maxWidth: 380, width: "90%", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
						<h3 style={{ margin: "0 0 8px" }}>Delete product?</h3>
						<p style={{ margin: "0 0 20px", color: "var(--admin-muted)", fontSize: 13 }}>
							<strong>{confirmDelete.name}</strong> ({confirmDelete.id}) will be permanently removed from the index and its JSON deleted from the repository. Images and datasheets are not deleted.
						</p>
						<div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
							<button className="admin-btn admin-btn--ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
							<button className="admin-btn admin-btn--primary" style={{ background: "var(--admin-red)" }} onClick={() => handleDelete(confirmDelete.id)} disabled={saving}>
								{saving ? "Deleting…" : "Delete"}
							</button>
						</div>
					</div>
				</div>
			)}

			{!isEdit ? (
				<ProductList
					index={index}
					onEdit={openEdit}
					onDelete={id => setConfirmDelete(index.products.find(p => p.id === id))}
					onSaveCats={handleSaveCats}
					saving={saving}
				/>
			) : productLoading ? (
				<p style={{ color: "var(--admin-muted)", padding: 40 }}>Loading product…</p>
			) : product ? (
				<ProductForm product={product} cats={index.cats ?? []} isNew={view === "new"} onChange={setProduct} headerH={headerH}/>
			) : null}
		</div>
	);
}

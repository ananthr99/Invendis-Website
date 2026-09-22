import { useState, useEffect } from "react";

// Every CMS-managed page's copy lives in /public/content/**.json. The CMS
// admin writes straight to those files on GitHub Pages (main + gh-pages
// branches); this hook just fetches the live file at runtime, so an edit
// made in the admin panel shows up here within seconds — no rebuild.
//
//   const home = useContent("pages/home.json")
//   const { data, loading, error } = useContent("pages/home.json", { withLoading: true })

const BASE = import.meta.env.BASE_URL;
const memCache = {};

export function useContent(path, { withLoading = false } = {}) {
	const [data, setData] = useState(() => memCache[path] ?? null);
	const [loading, setLoading] = useState(!memCache[path]);
	const [error, setError] = useState(null);

	useEffect(() => {
		// cache-bust with a timestamp so we never see a stale CDN/browser copy
		// right after an editor saves a change
		fetch(`${BASE}content/${path}?t=${Date.now()}`, { cache: "no-store" })
			.then((r) => {
				if (!r.ok) throw new Error(`Failed to load ${path} (${r.status})`);
				return r.json();
			})
			.then((json) => {
				memCache[path] = json;
				setData(json);
				setLoading(false);
			})
			.catch((err) => {
				setError(err);
				setLoading(false);
			});
	}, [path]);

	return withLoading ? { data, loading, error } : data;
}

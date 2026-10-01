import { useState, useEffect } from "react";

export function matchesCat(p, v) { return !v || p.cat === v; }
export function matchesCellular(p, v) { return !v || p.cellular_gen === v; }
export function matchesWifi(p, v) { return !v || p.wifi === v; }

export function matchesPorts(p, v) {
	if (!v) return true;
	const n = parseInt(p.ports, 10);
	if (isNaN(n)) return false;
	if (v === "1-2") return n >= 1 && n <= 2;
	if (v === "3-4") return n >= 3 && n <= 4;
	if (v === "5+") return n >= 5;
	return true;
}

export function matchesSerial(p, selected) {
	if (!selected.length) return true;
	if (selected.includes("rs485") && !(p.rs485 === "Yes" || p.rs485 === "Optional")) return false;
	if (selected.includes("rs232") && !(p.rs232 === "Yes" || p.rs232 === "Optional")) return false;
	return true;
}

export function matchesSearch(p, q) {
	if (!q) return true;
	const lq = q.toLowerCase();
	return p.name.toLowerCase().includes(lq) || p.desc.toLowerCase().includes(lq) || p.cat.toLowerCase().includes(lq);
}

export function pageNums(total, current) {
	if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
	const pages = [1];
	if (current > 3) pages.push("…");
	for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) pages.push(p);
	if (current < total - 2) pages.push("…");
	if (total > 1) pages.push(total);
	return pages;
}

export function useItemsPerPage() {
	function calc() {
		const w = window.innerWidth;
		if (w < 640) return 10;
		if (w < 1024) return 9;
		if (w < 1280) return 12;
		if (w < 1536) return 15;
		return 24;
	}
	const [ipp, setIpp] = useState(calc);
	useEffect(() => {
		const handler = () => setIpp(calc());
		window.addEventListener("resize", handler);
		return () => window.removeEventListener("resize", handler);
	}, []);
	return ipp;
}

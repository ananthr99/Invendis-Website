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
		if (window.matchMedia("(min-width: 96rem)").matches) return 18;  // 2xl: 6 cols × 3 rows
		if (window.matchMedia("(min-width: 80rem)").matches) return 15;  // xl:  5 cols × 3 rows
		if (window.matchMedia("(min-width: 64rem)").matches) return 12;  // lg:  4 cols × 3 rows
		if (window.matchMedia("(min-width: 40rem)").matches) return 9;   // sm:  3 cols × 3 rows
		return 10;                                                         // base: 2 cols × 5 rows
	}
	const [ipp, setIpp] = useState(calc);
	useEffect(() => {
		const mqs = [
			window.matchMedia("(min-width: 96rem)"),
			window.matchMedia("(min-width: 80rem)"),
			window.matchMedia("(min-width: 64rem)"),
			window.matchMedia("(min-width: 40rem)"),
		];
		const handler = () => setIpp(calc());
		mqs.forEach(mq => mq.addEventListener("change", handler));
		return () => mqs.forEach(mq => mq.removeEventListener("change", handler));
	}, []);
	return ipp;
}

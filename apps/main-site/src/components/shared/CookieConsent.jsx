import { useState, useEffect } from "react";

const STORAGE_KEY = "cookie_consent";

function loadGA(id) {
	if (!id || window.__ga_loaded__) return;
	window.__ga_loaded__ = true;
	const s = document.createElement("script");
	s.async = true;
	s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
	document.head.appendChild(s);
	window.dataLayer = window.dataLayer || [];
	window.gtag = function () { window.dataLayer.push(arguments); };
	window.gtag("js", new Date());
	window.gtag("config", id);
}

export default function CookieConsent() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const consent = localStorage.getItem(STORAGE_KEY);
		if (!consent) {
			setVisible(true);
		} else if (consent === "accepted") {
			loadGA(import.meta.env.VITE_GA_ID);
		}
	}, []);

	function accept() {
		localStorage.setItem(STORAGE_KEY, "accepted");
		loadGA(import.meta.env.VITE_GA_ID);
		setVisible(false);
	}

	function decline() {
		localStorage.setItem(STORAGE_KEY, "declined");
		setVisible(false);
	}

	if (!visible) return null;

	return (
		<div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 999, padding: "1rem", display: "flex", justifyContent: "center" }}>
			<div style={{ background: "white", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.18)", padding: "1rem 1.5rem", maxWidth: 640, width: "100%", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.75rem 1.5rem" }}>
				<p style={{ flex: 1, minWidth: 220, fontSize: 13, color: "#4b5563", margin: 0, lineHeight: 1.6 }}>
					We use cookies to understand how visitors use our site and to improve your experience.
					See our{" "}
					<a href={`${import.meta.env.BASE_URL}privacy`} style={{ color: "#1B2A6B", fontWeight: 500 }}>Privacy Policy</a>.
				</p>
				<div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
					<button
						onClick={decline}
						style={{ padding: "8px 18px", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", fontSize: 13, fontWeight: 500, color: "#6b7280", cursor: "pointer", fontFamily: "inherit" }}
					>
						Decline
					</button>
					<button
						onClick={accept}
						style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#1B2A6B", fontSize: 13, fontWeight: 600, color: "white", cursor: "pointer", fontFamily: "inherit" }}
					>
						Accept
					</button>
				</div>
			</div>
		</div>
	);
}

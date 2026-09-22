const icons = {
	tower: (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.5}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M12 2 3 7v2l9 5 9-5V7L12 2z" />
			<path d="M3 14l9 5 9-5" />
			<line x1="12" y1="12" x2="12" y2="21" />
		</svg>
	),
	solar: (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.5}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="12" cy="12" r="4" />
			<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
		</svg>
	),
	meter: (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.5}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<rect x="3" y="3" width="18" height="18" rx="2" />
			<path d="M8 12h2l2-4 2 8 2-4h2" />
		</svg>
	),
	network: (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.5}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<rect x="2" y="2" width="6" height="6" rx="1" />
			<rect x="16" y="2" width="6" height="6" rx="1" />
			<rect x="9" y="16" width="6" height="6" rx="1" />
			<path d="M5 8v3a2 2 0 002 2h10a2 2 0 002-2V8" />
			<line x1="12" y1="14" x2="12" y2="16" />
		</svg>
	),
	platform: (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.5}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<rect x="2" y="3" width="20" height="14" rx="2" />
			<path d="M8 21h8M12 17v4" />
			<rect x="6" y="7" width="4" height="3" rx="0.5" />
			<rect x="14" y="7" width="4" height="3" rx="0.5" />
			<line x1="6" y1="13" x2="10" y2="13" />
		</svg>
	),
	design: (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.5}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<rect x="4" y="4" width="16" height="16" rx="2" />
			<rect x="8" y="8" width="3" height="3" />
			<rect x="13" y="8" width="3" height="3" />
			<rect x="8" y="13" width="3" height="3" />
			<rect x="13" y="13" width="3" height="3" />
		</svg>
	),
};

export default function Icon({ name, className = "h-5 w-5" }) {
	const svg = icons[name];
	if (!svg) return null;
	return <span className={`inline-flex ${className}`}>{svg}</span>;
}

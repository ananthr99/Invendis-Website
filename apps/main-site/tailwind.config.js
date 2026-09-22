/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,jsx}"],
	theme: {
		extend: {
			colors: {
				// Same brand tokens as the original Invendis site — kept identical
				// so this is a drop-in visual match, just cleaner underneath.
				"brand-blue": "#1B2A6B",
				"brand-red": "#E63946",
				"brand-dark": "#0d1534",
				"brand-light": "#f7f8fc",
				"brand-text": "#1a1a2e",
				"brand-muted": "#6b7280",
				"brand-blue-light": "#2B3F8C",
			},
			fontFamily: {
				heading: ["Sora", "sans-serif"],
				body: ["DM Sans", "sans-serif"],
			},
		},
	},
	plugins: [require("@tailwindcss/typography")],
};

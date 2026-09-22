import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Built separately from the main site, then copied into
// dist/cms-admin/ by the deploy workflow — so it's served at
// /cms-admin/ on the same domain as the public site.
export default defineConfig({
	plugins: [react()],
	base: process.env.VITE_BASE || "/cms-admin/",
	server: {
		port: 5174,
	},
});

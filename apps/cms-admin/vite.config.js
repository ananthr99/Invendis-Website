import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	base: process.env.VITE_BASE || "/cms-admin/",
	resolve: {
		dedupe: ["react", "react-dom"],
	},
	server: {
		port: 5174,
	},
});

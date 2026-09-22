import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// VITE_BASE is set to "/invendis-website/" in the GitHub Pages deploy
// workflow. Locally it defaults to "/" so `npm run dev` just works.
export default defineConfig({
	plugins: [react()],
	base: process.env.VITE_BASE || "/",
});

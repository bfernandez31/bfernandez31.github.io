// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://bfernandez31.github.io",
	// No base path needed for user/org GitHub Pages (username.github.io)
	output: "static",
	compressHTML: true,
});

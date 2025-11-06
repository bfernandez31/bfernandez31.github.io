// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://b-fernandez.github.io",
	base: "/portfolio",
	output: "static",
	compressHTML: true,
});

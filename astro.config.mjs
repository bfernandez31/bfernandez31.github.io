// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://bfernandez31.github.io",
	// No base path needed for user/org GitHub Pages (username.github.io)
	output: "static",
	compressHTML: true,
	redirects: {
		"/about": "/#about",
		"/projects": "/#projects",
		"/expertise": "/#expertise",
		"/contact": "/#contact",
	},
	vite: {
		build: {
			// CSS code splitting for better caching and non-blocking
			cssCodeSplit: true,
			// Inline CSS smaller than 4KB to reduce requests
			assetsInlineLimit: 4096,
			// Minify CSS for production
			cssMinify: true,
			// Rollup options for optimization
			rollupOptions: {
				output: {
					// Manual chunks for better caching
					manualChunks: (id) => {
						// Vendor chunks for libraries
						if (id.includes('node_modules')) {
							if (id.includes('gsap')) {
								return 'vendor-gsap';
							}
							if (id.includes('lenis')) {
								return 'vendor-lenis';
							}
							return 'vendor';
						}
					},
				},
			},
		},
	},
});

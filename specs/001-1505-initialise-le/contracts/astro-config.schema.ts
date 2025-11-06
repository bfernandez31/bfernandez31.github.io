/**
 * TypeScript Contract for astro.config.mjs
 *
 * This file defines the expected shape of the Astro configuration
 * for the portfolio static site project.
 *
 * Constitutional Requirements:
 * - MUST use static output mode (Principle III)
 * - MUST configure for GitHub Pages deployment (Principle III)
 * - MUST enable HTML compression for production (Principle I)
 */

import type { AstroUserConfig } from 'astro/config';

/**
 * Portfolio Astro Configuration Contract
 *
 * @property site - Production URL (MUST be HTTPS)
 * @property base - Base path for deployment (e.g., "/portfolio" for GitHub Pages)
 * @property output - MUST be "static" for static site generation
 * @property integrations - Framework integrations (React, Vue, Tailwind, etc.)
 * @property build - Build output configuration
 * @property compressHTML - MUST be true for production builds
 */
export interface PortfolioAstroConfig extends AstroUserConfig {
  /**
   * Production site URL
   *
   * REQUIRED for:
   * - Absolute URL generation in sitemaps
   * - Open Graph/Twitter Card meta tags
   * - Canonical URLs
   *
   * @example "https://username.github.io"
   */
  site: `https://${string}`;

  /**
   * Base path for deployment
   *
   * REQUIRED when deploying to GitHub Pages repository subdirectory
   * OPTIONAL for root domain deployments
   *
   * @example "/portfolio" for https://username.github.io/portfolio
   * @example undefined for https://username.github.io
   */
  base?: `/${string}`;

  /**
   * Output mode
   *
   * MUST be "static" for constitutional compliance
   * Ensures 0KB JavaScript initial load via pre-rendering
   *
   * @required
   */
  output: 'static';

  /**
   * Framework integrations
   *
   * OPTIONAL for minimal initialization (pure Astro components)
   * Can include:
   * - @astrojs/react (for React Islands)
   * - @astrojs/vue (for Vue Islands)
   * - @astrojs/tailwind (for Tailwind CSS)
   * - @astrojs/sitemap (for automatic sitemap generation)
   *
   * @default []
   */
  integrations?: Array<any>;

  /**
   * Build configuration
   *
   * Controls output directory structure and asset naming
   */
  build?: {
    /**
     * Asset directory name
     *
     * @default "_astro"
     */
    assets?: string;

    /**
     * Output format for HTML files
     *
     * - "directory": /about → /about/index.html
     * - "file": /about → /about.html
     *
     * @default "directory"
     */
    format?: 'directory' | 'file';
  };

  /**
   * Vite configuration overrides
   *
   * Used for advanced build customization
   */
  vite?: {
    build?: {
      /**
       * Rollup output options
       *
       * Controls JavaScript and CSS chunk naming for cache optimization
       */
      rollupOptions?: {
        output?: {
          /**
           * Entry file naming pattern
           *
           * @example "entry.[hash].js"
           */
          entryFileNames?: string;

          /**
           * Chunk file naming pattern
           *
           * @example "chunks/[name].[hash].js"
           */
          chunkFileNames?: string;

          /**
           * Asset file naming pattern
           *
           * @example "assets/[name].[hash].[ext]"
           */
          assetFileNames?: string;
        };
      };

      /**
       * CSS code splitting
       *
       * SHOULD be true for performance optimization
       *
       * @default true
       */
      cssCodeSplit?: boolean;
    };
  };

  /**
   * HTML compression
   *
   * MUST be true for production builds (constitutional requirement)
   * Reduces HTML file size by removing whitespace and comments
   *
   * @required (for production)
   * @default true in production mode
   */
  compressHTML?: boolean;

  /**
   * Markdown configuration
   *
   * OPTIONAL for minimal initialization
   * Used when adding content collections (blog, projects)
   */
  markdown?: {
    /**
     * Syntax highlighting theme
     *
     * @example "github-dark"
     */
    shikiTheme?: string;

    /**
     * Code wrapping behavior
     *
     * @default true
     */
    wrap?: boolean;
  };

  /**
   * Server configuration
   *
   * Used for development server settings
   */
  server?: {
    /**
     * Development server port
     *
     * @default 4321
     */
    port?: number;

    /**
     * Development server host
     *
     * @default "localhost"
     */
    host?: string | boolean;
  };
}

/**
 * Validation Rules
 *
 * The following rules MUST be enforced:
 *
 * 1. `output` MUST be "static" (constitutional requirement)
 * 2. `site` MUST be a valid HTTPS URL
 * 3. `base` MUST start with "/" if provided
 * 4. `compressHTML` MUST be true for production builds
 * 5. `site` MUST NOT have trailing slash
 *
 * Example Valid Configuration:
 * ```typescript
 * export default {
 *   site: "https://username.github.io",
 *   base: "/portfolio",
 *   output: "static",
 *   integrations: [],
 *   compressHTML: true,
 * } satisfies PortfolioAstroConfig;
 * ```
 *
 * Example Invalid Configuration:
 * ```typescript
 * export default {
 *   site: "http://localhost:3000", // ❌ Must be HTTPS
 *   output: "server",               // ❌ Must be "static"
 *   compressHTML: false,            // ❌ Must be true for production
 * };
 * ```
 */

/**
 * Type guard to validate Astro config
 *
 * @param config - Configuration object to validate
 * @returns true if config is valid, false otherwise
 */
export function isValidPortfolioConfig(config: any): config is PortfolioAstroConfig {
  return (
    typeof config === 'object' &&
    config !== null &&
    typeof config.site === 'string' &&
    config.site.startsWith('https://') &&
    config.output === 'static' &&
    (config.base === undefined || (typeof config.base === 'string' && config.base.startsWith('/')))
  );
}

/**
 * Default configuration factory
 *
 * Generates a minimal valid configuration for portfolio static site
 *
 * @param site - Production site URL
 * @param base - Optional base path
 * @returns Valid Astro configuration
 */
export function createDefaultConfig(
  site: `https://${string}`,
  base?: `/${string}`
): PortfolioAstroConfig {
  return {
    site,
    base,
    output: 'static',
    integrations: [],
    compressHTML: true,
    build: {
      assets: '_astro',
      format: 'directory',
    },
    server: {
      port: 4321,
      host: 'localhost',
    },
  };
}

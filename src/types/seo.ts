/**
 * SEO Metadata Type Definitions
 *
 * Based on contracts/seo-metadata.contract.ts
 * @feature 005-1510-convert-multi
 */

export interface PageMetadata {
  /**
   * Page title (50-60 characters recommended)
   */
  title: string;

  /**
   * Meta description (150-160 characters recommended)
   */
  description: string;

  /**
   * Open Graph image URL (1200x630px recommended)
   */
  ogImage: string;

  /**
   * Canonical URL
   */
  canonical: string;

  /**
   * Keywords (optional)
   */
  keywords?: string;

  /**
   * Author name (optional)
   */
  author?: string;

  /**
   * Twitter card type (optional)
   */
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
}

export interface JSONLDStructuredData {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
  description: string;
  mainEntity: PersonEntity;
  potentialAction?: ActionEntity;
}

export interface PersonEntity {
  '@type': 'Person';
  name: string;
  url: string;
  description: string;
  image: string;
  jobTitle: string;
  email: string;
  sameAs: string[];
  knowsAbout?: string[];
  hasPart?: CreativeWorkEntity[];
}

export interface CreativeWorkEntity {
  '@type': 'CreativeWork';
  name: string;
  description: string;
  url: string;
  image?: string;
  creator?: {
    '@type': 'Person';
    name: string;
  };
  datePublished?: string;
  keywords?: string[];
}

export interface ActionEntity {
  '@type': 'Action';
  target: string;
  name?: string;
}

/**
 * Validation function for PageMetadata
 */
export function validatePageMetadata(metadata: PageMetadata): void {
  if (!metadata.title || metadata.title.trim().length === 0) {
    throw new Error('PageMetadata title is required and must be non-empty');
  }

  if (metadata.title.length > 60) {
    console.warn(`PageMetadata title exceeds recommended length (60 chars). Got: ${metadata.title.length}`);
  }

  if (!metadata.description || metadata.description.trim().length === 0) {
    throw new Error('PageMetadata description is required and must be non-empty');
  }

  if (metadata.description.length > 160) {
    console.warn(`PageMetadata description exceeds recommended length (160 chars). Got: ${metadata.description.length}`);
  }

  if (!metadata.ogImage || metadata.ogImage.trim().length === 0) {
    throw new Error('PageMetadata ogImage is required and must be non-empty');
  }

  if (!metadata.canonical || metadata.canonical.trim().length === 0) {
    throw new Error('PageMetadata canonical is required and must be non-empty');
  }
}

// Core type definitions for MetaForge SEO Studio

export interface BrandProfile {
  brandName: string;
  domain: string;
  logoUrl: string;
  defaultOgImage: string;
  twitterHandle: string;
  defaultLanguage: string;
}

export interface PageSetup {
  id: string;
  url: string;
  title: string;
  description: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  twitterCard: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  twitterSite: string;
  twitterCreator: string;
  noindex: boolean;
  nofollow: boolean;
  keywords: string;
  language: string;
  schemaType: SchemaType;
  schemaData: Record<string, unknown>;
  robotsRules: RobotsRules;
  createdAt: number;
  updatedAt: number;
}

export interface RobotsRules {
  userAgent: string;
  allow: string;
  disallow: string;
  sitemapUrl: string;
  crawlDelay: string;
}

export type SchemaType =
  | 'none'
  | 'Article'
  | 'BlogPosting'
  | 'Product'
  | 'FAQPage'
  | 'Organization'
  | 'BreadcrumbList'
  | 'WebSite'
  | 'LocalBusiness';

export interface SchemaField {
  key: string;
  label: string;
  type: 'text' | 'url' | 'image' | 'textarea' | 'number';
  required?: boolean;
  placeholder?: string;
  hint?: string;
  defaultValue?: string;
}

export interface SchemaDefinition {
  type: SchemaType;
  label: string;
  description: string;
  fields: SchemaField[];
}

export const defaultBrandProfile: BrandProfile = {
  brandName: '',
  domain: '',
  logoUrl: '',
  defaultOgImage: '',
  twitterHandle: '',
  defaultLanguage: 'en',
};

export const defaultRobotsRules: RobotsRules = {
  userAgent: '*',
  allow: '',
  disallow: '',
  sitemapUrl: '',
  crawlDelay: '',
};

export function createBlankPageSetup(brand?: BrandProfile): PageSetup {
  const now = Date.now();
  return {
    id: `setup-${now}-${Math.random().toString(36).slice(2, 8)}`,
    url: '',
    title: '',
    description: '',
    canonicalUrl: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: brand?.defaultOgImage || '',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: brand?.defaultOgImage || '',
    twitterSite: brand?.twitterHandle ? `@${brand.twitterHandle.replace('@', '')}` : '',
    twitterCreator: brand?.twitterHandle ? `@${brand.twitterHandle.replace('@', '')}` : '',
    noindex: false,
    nofollow: false,
    keywords: '',
    language: brand?.defaultLanguage || 'en',
    schemaType: 'none',
    schemaData: {},
    robotsRules: { ...defaultRobotsRules },
    createdAt: now,
    updatedAt: now,
  };
}

export function applyBrandToSetup(setup: PageSetup, brand: BrandProfile): PageSetup {
  return {
    ...setup,
    ogImage: setup.ogImage || brand.defaultOgImage,
    twitterImage: setup.twitterImage || brand.defaultOgImage,
    twitterSite: setup.twitterSite || (brand.twitterHandle ? `@${brand.twitterHandle.replace('@', '')}` : ''),
    twitterCreator: setup.twitterCreator || (brand.twitterHandle ? `@${brand.twitterHandle.replace('@', '')}` : ''),
    language: setup.language || brand.defaultLanguage || 'en',
  };
}

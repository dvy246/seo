import { PageSetup, BrandProfile, SchemaType, RobotsRules } from '@/types';
import { schemaDefinitions } from '@/data/schemaDefinitions';

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getDomain(url: string): string {
  try {
    if (!url) return '';
    const u = new URL(url.startsWith('http') ? url : `https://${url}`);
    return u.hostname.replace(/^www\./, '');
  } catch {
    return url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0] || '';
  }
}

function getPathDisplay(url: string): string {
  try {
    if (!url) return '';
    const u = new URL(url.startsWith('http') ? url : `https://${url}`);
    const parts = u.pathname.split('/').filter(Boolean);
    return parts.length > 0 ? ` › ${parts.join(' › ')}` : '';
  } catch {
    return '';
  }
}

export function buildGooglePreviewData(setup: PageSetup) {
  const title = setup.title || 'Your Page Title';
  const description = setup.description || 'Your meta description will appear here.';
  const url = setup.canonicalUrl || setup.url || 'https://example.com';
  return {
    title,
    description,
    url,
    domain: getDomain(url),
    pathDisplay: getPathDisplay(url),
  };
}

export function generateMetaTags(setup: PageSetup): string {
  const lines: string[] = [];

  // Primary meta tags
  if (setup.title) lines.push(`<title>${esc(setup.title)}</title>`);
  if (setup.description) lines.push(`<meta name="description" content="${esc(setup.description)}" />`);
  if (setup.keywords) lines.push(`<meta name="keywords" content="${esc(setup.keywords)}" />`);
  if (setup.canonicalUrl) lines.push(`<link rel="canonical" href="${esc(setup.canonicalUrl)}" />`);

  // Robots
  const robotsParts: string[] = [];
  if (setup.noindex) robotsParts.push('noindex');
  else robotsParts.push('index');
  if (setup.nofollow) robotsParts.push('nofollow');
  else robotsParts.push('follow');
  lines.push(`<meta name="robots" content="${robotsParts.join(', ')}" />`);

  if (setup.language) {
    lines.push(`<meta http-equiv="content-language" content="${esc(setup.language)}" />`);
  }

  // Open Graph
  lines.push('');
  lines.push('<!-- Open Graph / Facebook -->');
  if (setup.ogType) lines.push(`<meta property="og:type" content="${esc(setup.ogType)}" />`);
  if (setup.canonicalUrl || setup.url) {
    lines.push(`<meta property="og:url" content="${esc(setup.canonicalUrl || setup.url)}" />`);
  }
  if (setup.ogTitle || setup.title) {
    lines.push(`<meta property="og:title" content="${esc(setup.ogTitle || setup.title)}" />`);
  }
  if (setup.ogDescription || setup.description) {
    lines.push(`<meta property="og:description" content="${esc(setup.ogDescription || setup.description)}" />`);
  }
  if (setup.ogImage) {
    lines.push(`<meta property="og:image" content="${esc(setup.ogImage)}" />`);
    lines.push(`<meta property="og:image:alt" content="${esc(setup.ogTitle || setup.title)}" />`);
  }
  if (setup.language) lines.push(`<meta property="og:locale" content="${esc(setup.language.replace('-', '_'))}" />`);

  // Twitter Card
  lines.push('');
  lines.push('<!-- Twitter / X Card -->');
  if (setup.twitterCard) lines.push(`<meta name="twitter:card" content="${esc(setup.twitterCard)}" />`);
  if (setup.twitterSite) lines.push(`<meta name="twitter:site" content="${esc(setup.twitterSite)}" />`);
  if (setup.twitterCreator) lines.push(`<meta name="twitter:creator" content="${esc(setup.twitterCreator)}" />`);
  if (setup.twitterTitle || setup.ogTitle || setup.title) {
    lines.push(`<meta name="twitter:title" content="${esc(setup.twitterTitle || setup.ogTitle || setup.title)}" />`);
  }
  if (setup.twitterDescription || setup.ogDescription || setup.description) {
    lines.push(`<meta name="twitter:description" content="${esc(setup.twitterDescription || setup.ogDescription || setup.description)}" />`);
  }
  if (setup.twitterImage || setup.ogImage) {
    lines.push(`<meta name="twitter:image" content="${esc(setup.twitterImage || setup.ogImage)}" />`);
  }

  return lines.join('\n');
}

export function generateJsonLd(setup: PageSetup): string {
  if (setup.schemaType === 'none' || !setup.schemaData) return '';

  const data = buildSchemaObject(setup.schemaType, setup.schemaData);
  if (!data) return '';

  return `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n</script>`;
}

function buildSchemaObject(type: SchemaType, raw: Record<string, unknown>): Record<string, unknown> | null {
  const def = schemaDefinitions[type as Exclude<SchemaType, 'none'>];
  if (!def) return null;

  const clean: Record<string, unknown> = {};

  if (type === 'FAQPage') {
    try {
      const faqs = typeof raw.faqJson === 'string' ? JSON.parse(raw.faqJson as string) : raw.faqJson;
      if (!Array.isArray(faqs)) return null;
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f: { q: string; a: string }) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      };
    } catch {
      return null;
    }
  }

  if (type === 'BreadcrumbList') {
    try {
      const crumbs = typeof raw.breadcrumbJson === 'string' ? JSON.parse(raw.breadcrumbJson as string) : raw.breadcrumbJson;
      if (!Array.isArray(crumbs)) return null;
      return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: crumbs.map((c: { name: string; url: string }, i: number) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: c.name,
          item: c.url,
        })),
      };
    } catch {
      return null;
    }
  }

  // Collect standard fields
  for (const field of def.fields) {
    const val = raw[field.key];
    if (!val) continue;
    clean[field.key] = val;
  }

  switch (type) {
    case 'Article':
    case 'BlogPosting': {
      const obj: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': type,
        headline: clean.headline,
        description: clean.description,
        image: clean.image ? [clean.image] : undefined,
        author: { '@type': 'Person', name: clean.author },
        publisher: {
          '@type': 'Organization',
          name: clean.publisherName,
          logo: clean.publisherLogo ? { '@type': 'ImageObject', url: clean.publisherLogo } : undefined,
        },
        datePublished: clean.datePublished,
        dateModified: clean.dateModified || clean.datePublished,
        mainEntityOfPage: { '@type': 'WebPage', '@id': clean.url },
      };
      return stripUndefined(obj);
    }
    case 'Product': {
      const offers: Record<string, unknown>[] = [];
      if (clean.price) {
        offers.push({
          '@type': 'Offer',
          price: clean.price,
          priceCurrency: clean.currency || 'USD',
          availability: clean.availability ? `https://schema.org/${clean.availability}` : undefined,
          url: clean.url,
          sku: clean.sku,
        });
      }
      const obj: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: clean.name,
        description: clean.description,
        image: clean.image ? [clean.image] : undefined,
        brand: { '@type': 'Brand', name: clean.brand },
        sku: clean.sku,
        offers: offers.length ? offers : undefined,
      };
      if (clean.ratingValue && clean.reviewCount) {
        obj.aggregateRating = {
          '@type': 'AggregateRating',
          ratingValue: clean.ratingValue,
          reviewCount: clean.reviewCount,
        };
      }
      return stripUndefined(obj);
    }
    case 'Organization': {
      let sameAs: string[] | undefined;
      if (clean.sameAs) {
        sameAs = (clean.sameAs as string).split(',').map((s) => s.trim()).filter(Boolean);
      }
      const obj: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: clean.name,
        url: clean.url,
        logo: clean.logo ? { '@type': 'ImageObject', url: clean.logo } : undefined,
        description: clean.description,
        email: clean.email,
        telephone: clean.phone,
        address: clean.address ? { '@type': 'PostalAddress', streetAddress: clean.address } : undefined,
        sameAs,
      };
      return stripUndefined(obj);
    }
    case 'WebSite': {
      const obj: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: clean.name,
        url: clean.url,
        description: clean.description,
      };
      if (clean.searchUrl) {
        obj.potentialAction = {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: clean.searchUrl },
          'query-input': 'required name=query',
        };
      }
      return stripUndefined(obj);
    }
    case 'LocalBusiness': {
      const obj: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: clean.name,
        image: clean.image ? [clean.image] : undefined,
        url: clean.url,
        telephone: clean.phone,
        address: {
          '@type': 'PostalAddress',
          streetAddress: clean.address,
          addressLocality: clean.addressLocality,
          addressRegion: clean.addressRegion,
          postalCode: clean.postalCode,
          addressCountry: clean.addressCountry,
        },
        openingHours: clean.openingHours,
        priceRange: clean.priceRange,
      };
      return stripUndefined(obj);
    }
    default:
      return null;
  }
}

function stripUndefined(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null || v === '') continue;
    if (typeof v === 'object' && !Array.isArray(v)) {
      const stripped = stripUndefined(v as Record<string, unknown>);
      if (Object.keys(stripped).length > 0) result[k] = stripped;
    } else {
      result[k] = v;
    }
  }
  return result;
}

export function generateRobotsTxt(rules: RobotsRules): string {
  const lines: string[] = [];
  lines.push(`User-agent: ${rules.userAgent || '*'}`);
  if (rules.allow) lines.push(`Allow: ${rules.allow}`);
  if (rules.disallow) {
    rules.disallow
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .forEach((l) => lines.push(`Disallow: ${l}`));
  }
  if (rules.crawlDelay) lines.push(`Crawl-delay: ${rules.crawlDelay}`);
  if (rules.sitemapUrl) lines.push(`\nSitemap: ${rules.sitemapUrl}`);
  return lines.join('\n');
}

export function generateFullHtml(setup: PageSetup, brand?: BrandProfile): string {
  const metaTags = generateMetaTags(setup);
  const jsonLd = generateJsonLd(setup);
  const allTags = [metaTags, jsonLd].filter(Boolean).join('\n\n');
  return allTags;
}

// Parse existing HTML head tags from a string — for import
export interface ParsedMeta {
  title?: string;
  description?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  ogUrl?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterSite?: string;
  twitterCreator?: string;
  keywords?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export function parseMetaFromHtml(html: string): ParsedMeta {
  const result: ParsedMeta = {};
  const getAttr = (tag: string, attr: string): string | undefined => {
    const m = tag.match(new RegExp(`${attr}=["']([^"']*)["']`, 'i'));
    return m ? m[1] : undefined;
  };

  // Title
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  if (titleMatch) result.title = titleMatch[1].trim();

  // Meta tags
  const metaRegex = /<meta\s[^>]*>/gi;
  let match: RegExpExecArray | null;
  while ((match = metaRegex.exec(html)) !== null) {
    const tag = match[0];
    const name = getAttr(tag, 'name')?.toLowerCase();
    const property = getAttr(tag, 'property')?.toLowerCase();
    const content = getAttr(tag, 'content');

    if (!content) continue;
    if (name === 'description') result.description = content;
    else if (name === 'keywords') result.keywords = content;
    else if (name === 'robots') {
      if (content.includes('noindex')) result.noindex = true;
      if (content.includes('nofollow')) result.nofollow = true;
    } else if (name === 'twitter:card') result.twitterCard = content;
    else if (name === 'twitter:title') result.twitterTitle = content;
    else if (name === 'twitter:description') result.twitterDescription = content;
    else if (name === 'twitter:image') result.twitterImage = content;
    else if (name === 'twitter:site') result.twitterSite = content;
    else if (name === 'twitter:creator') result.twitterCreator = content;
    else if (property === 'og:title') result.ogTitle = content;
    else if (property === 'og:description') result.ogDescription = content;
    else if (property === 'og:image') result.ogImage = content;
    else if (property === 'og:type') result.ogType = content;
    else if (property === 'og:url') result.ogUrl = content;
  }

  // Canonical
  const canonicalMatch = html.match(/<link\s[^>]*rel=["']canonical["'][^>]*>/i);
  if (canonicalMatch) {
    result.canonical = getAttr(canonicalMatch[0], 'href');
  }

  return result;
}

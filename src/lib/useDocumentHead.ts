import { useEffect } from 'react';
import { pageMeta } from '@/data/pages';

// Manages document head (title, meta description, canonical, OG tags, JSON-LD)
// for SEO on each client-side route.

const SITE_NAME = 'SerpCraft';
const SITE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://metaforge.app';

function setOrCreateMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setOrCreateLink(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function setOrCreateJsonLd(id: string, json: string) {
  let el = document.head.querySelector(`script[data-serpcraft-jsonld="${id}"]`) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.setAttribute('data-serpcraft-jsonld', id);
    document.head.appendChild(el);
  }
  el.textContent = json;
}

export function useDocumentHead(path: string) {
  const meta = pageMeta[path] || pageMeta['/'];
  const fullUrl = `${SITE_URL}${path}`;

  useEffect(() => {
    // Title
    document.title = meta.title;

    // Meta description
    setOrCreateMeta('name', 'description', meta.description);

    // Keywords
    setOrCreateMeta('name', 'keywords', meta.keywords);

    // Canonical
    setOrCreateLink('canonical', fullUrl);

    // Open Graph
    setOrCreateMeta('property', 'og:title', meta.title);
    setOrCreateMeta('property', 'og:description', meta.description);
    setOrCreateMeta('property', 'og:url', fullUrl);
    setOrCreateMeta('property', 'og:type', meta.ogType);
    setOrCreateMeta('property', 'og:site_name', SITE_NAME);

    // Twitter
    setOrCreateMeta('name', 'twitter:card', 'summary_large_image');
    setOrCreateMeta('name', 'twitter:title', meta.title);
    setOrCreateMeta('name', 'twitter:description', meta.description);

    // JSON-LD: WebApplication schema
    const webAppSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: SITE_NAME,
      url: SITE_URL,
      description: meta.description,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      mainEntityOfPage: { '@type': 'WebPage', '@id': fullUrl },
    };
    setOrCreateJsonLd('webapp', JSON.stringify(webAppSchema));

    // JSON-LD: BreadcrumbList
    if (path !== '/') {
      const parts = path.split('/').filter(Boolean);
      const crumbs = [{ name: 'Home', url: SITE_URL }];
      let accum = '';
      for (const part of parts) {
        accum += `/${part}`;
        const label = part
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        crumbs.push({ name: label, url: `${SITE_URL}${accum}` });
      }
      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: crumbs.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: c.name,
          item: c.url,
        })),
      };
      setOrCreateJsonLd('breadcrumb', JSON.stringify(breadcrumbSchema));
    }

    // FAQ schema if companion content has FAQs
    // (handled per-page in the content component)
  }, [meta, path, fullUrl]);
}

// SEO metadata for each tool surface / landing page.
// Used for client-side document head updates and internal navigation.

export interface PageMeta {
  path: string;
  title: string;
  description: string;
  h1: string;
  ogType: string;
  keywords: string;
}

export const pageMeta: Record<string, PageMeta> = {
  '/studio': {
    path: '/studio',
    title: 'SEO Studio — Meta Tag, Social Preview & JSON-LD Editor | MetaForge',
    description:
      'The MetaForge SEO studio: generate meta tags, Open Graph, Twitter Cards, JSON-LD structured data, and robots.txt with live multi-platform previews and pixel-accurate SERP. Free, no signup.',
    h1: 'The all-in-one SEO meta tag studio',
    ogType: 'website',
    keywords: 'meta tag generator, SEO tags, open graph, twitter cards, json-ld, structured data, serp preview',
  },
  '/': {
    path: '/',
    title: 'MetaForge — Free Meta Tag Generator, Social Preview & JSON-LD Studio',
    description:
      'Set up all your page SEO in one place: meta tags, Open Graph, Twitter Cards, JSON-LD structured data, robots.txt, and pixel-accurate Google SERP previews. Free, no signup.',
    h1: 'The all-in-one SEO meta tag studio',
    ogType: 'website',
    keywords: 'meta tag generator, SEO tags, open graph, twitter cards, json-ld, structured data, serp preview',
  },
  '/meta-tag-generator': {
    path: '/meta-tag-generator',
    title: 'Meta Tag Generator — Free Title, Description & SEO Meta Tags | MetaForge',
    description:
      'Generate SEO meta tags, title tags, meta descriptions, canonical URLs, and robots directives. Live preview, pixel-accurate limits, one-click copy. Free online meta tag generator.',
    h1: 'Meta Tag Generator',
    ogType: 'website',
    keywords: 'meta tag generator, title tag generator, meta description generator, SEO meta tags, html meta tags',
  },
  '/open-graph-generator': {
    path: '/open-graph-generator',
    title: 'Open Graph Generator — Free OG Tag Builder & Preview | MetaForge',
    description:
      'Generate Open Graph tags (og:title, og:description, og:image, og:url) and preview how your link looks on Facebook, LinkedIn, Slack, and Discord. Free OG tag generator.',
    h1: 'Open Graph Generator',
    ogType: 'website',
    keywords: 'open graph generator, og tags, og:title, og:image, facebook preview, open graph preview',
  },
  '/twitter-card-generator': {
    path: '/twitter-card-generator',
    title: 'Twitter Card Generator — Free X/Twitter Card Tag Builder | MetaForge',
    description:
      'Generate Twitter Card tags (twitter:card, twitter:title, twitter:image) and preview how your link appears on X. Free Twitter Card generator with live preview.',
    h1: 'Twitter Card Generator',
    ogType: 'website',
    keywords: 'twitter card generator, twitter card tags, x card, twitter:image, twitter:card, summary large image',
  },
  '/json-ld-generator': {
    path: '/json-ld-generator',
    title: 'JSON-LD Generator — Free Structured Data Schema Builder | MetaForge',
    description:
      'Generate JSON-LD structured data for Article, BlogPosting, Product, FAQ, Organization, LocalBusiness, and more. Free JSON-LD schema generator with one-click copy.',
    h1: 'JSON-LD Generator',
    ogType: 'website',
    keywords: 'json-ld generator, structured data, schema markup, schema.org, rich results, json-ld schema generator',
  },
  '/schema-markup-generator': {
    path: '/schema-markup-generator',
    title: 'Schema Markup Generator — Free Schema.org Structured Data | MetaForge',
    description:
      'Build schema.org structured data markup for your pages. Generate JSON-LD for products, articles, FAQs, local businesses, and more. Free schema markup generator.',
    h1: 'Schema Markup Generator',
    ogType: 'website',
    keywords: 'schema markup generator, schema.org, structured data markup, json-ld, rich snippets, schema generator',
  },
  '/social-preview-tool': {
    path: '/social-preview-tool',
    title: 'Social Preview Tool — Facebook, X, LinkedIn, Slack & Discord | MetaForge',
    description:
      'Preview how your link looks on Facebook, X/Twitter, LinkedIn, Slack, and Discord before you publish. Free social media preview tool with live editing.',
    h1: 'Social Preview Tool',
    ogType: 'website',
    keywords: 'social preview tool, link preview, facebook preview, twitter preview, linkedin preview, slack preview, discord preview',
  },
  '/serp-preview-tool': {
    path: '/serp-preview-tool',
    title: 'SERP Preview Tool — Pixel-Accurate Google Search Preview | MetaForge',
    description:
      'Preview how your page title and meta description appear in Google search results with pixel-accurate truncation. Free Google SERP snippet preview tool.',
    h1: 'SERP Preview Tool',
    ogType: 'website',
    keywords: 'serp preview tool, google preview, serp snippet, title truncation, pixel width, meta description preview',
  },
  '/robots-txt-generator': {
    path: '/robots-txt-generator',
    title: 'Robots.txt Generator — Free Crawl Directive Builder | MetaForge',
    description:
      'Generate a robots.txt file with allow, disallow, sitemap, and crawl-delay directives. Free robots.txt generator with one-click copy.',
    h1: 'Robots.txt Generator',
    ogType: 'website',
    keywords: 'robots.txt generator, robots.txt, crawl directives, sitemap, robots file generator',
  },
  '/about': {
    path: '/about',
    title: 'About MetaForge — Free SEO Meta Tag & Structured Data Studio',
    description:
      'MetaForge is a free, all-in-one SEO studio for generating meta tags, social previews, JSON-LD structured data, and robots.txt — built by marketers who got tired of bouncing between five tools.',
    h1: 'About MetaForge',
    ogType: 'website',
    keywords: 'about metaforge, seo tools, meta tag tools',
  },
  '/privacy': {
    path: '/privacy',
    title: 'Privacy Policy — MetaForge',
    description: 'MetaForge privacy policy. We do not collect personal data. All tool data is stored locally in your browser.',
    h1: 'Privacy Policy',
    ogType: 'website',
    keywords: 'privacy policy, metaforge privacy',
  },
  '/terms': {
    path: '/terms',
    title: 'Terms of Service — MetaForge',
    description: 'MetaForge terms of service. Free SEO meta tag generator and structured data tools.',
    h1: 'Terms of Service',
    ogType: 'website',
    keywords: 'terms of service, metaforge terms',
  },
};

export interface NavTool {
  path: string;
  label: string;
  shortLabel: string;
  icon: string;
  description: string;
}

export const navTools: NavTool[] = [
  { path: '/meta-tag-generator', label: 'Meta Tag Generator', shortLabel: 'Meta Tags', icon: 'Tags', description: 'Title, description, canonical, robots' },
  { path: '/open-graph-generator', label: 'Open Graph Generator', shortLabel: 'Open Graph', icon: 'Share2', description: 'OG tags for Facebook, Slack, Discord' },
  { path: '/twitter-card-generator', label: 'Twitter Card Generator', shortLabel: 'Twitter Cards', icon: 'Twitter', description: 'X/Twitter Card tags and preview' },
  { path: '/json-ld-generator', label: 'JSON-LD Generator', shortLabel: 'JSON-LD', icon: 'Braces', description: 'Structured data schema builder' },
  { path: '/schema-markup-generator', label: 'Schema Markup Generator', shortLabel: 'Schema Markup', icon: 'Code', description: 'Schema.org structured data' },
  { path: '/social-preview-tool', label: 'Social Preview Tool', shortLabel: 'Social Preview', icon: 'Eye', description: 'Multi-platform link previews' },
  { path: '/serp-preview-tool', label: 'SERP Preview Tool', shortLabel: 'SERP Preview', icon: 'Search', description: 'Pixel-accurate Google preview' },
  { path: '/robots-txt-generator', label: 'Robots.txt Generator', shortLabel: 'Robots.txt', icon: 'Bot', description: 'Crawl directives builder' },
];

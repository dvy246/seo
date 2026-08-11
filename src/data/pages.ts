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
    title: 'SEO Studio: Meta Tags, JSON-LD & SERP Preview | SerpCraft',
    description:
      'Build every SEO element in one editor: meta tags, Open Graph, Twitter Cards, JSON-LD, robots.txt, with live previews. Free, no signup.',
    h1: 'The all-in-one SEO meta tag studio',
    ogType: 'website',
    keywords: 'meta tag generator, SEO tags, open graph, twitter cards, json-ld, structured data, serp preview',
  },
  '/': {
    path: '/',
    title: 'SerpCraft: Free SEO Tools for Meta Tags & Previews',
    description:
      'Free SEO toolkit in your browser: meta tags, Open Graph, Twitter Cards, JSON-LD, robots.txt, and pixel-accurate Google SERP previews. No signup.',
    h1: 'Free SEO tools in one place',
    ogType: 'website',
    keywords: 'meta tag generator, SEO tags, open graph, twitter cards, json-ld, structured data, serp preview',
  },
  '/meta-tag-generator': {
    path: '/meta-tag-generator',
    title: 'Free Meta Tag Generator: Title & Description Tags | SerpCraft',
    description:
      'Generate SEO meta tags, title tags, meta descriptions, canonical URLs, and robots directives. Live preview, one-click copy. Free meta tag generator.',
    h1: 'Meta Tag Generator',
    ogType: 'website',
    keywords: 'meta tag generator, title tag generator, meta description generator, SEO meta tags, html meta tags',
  },
  '/open-graph-generator': {
    path: '/open-graph-generator',
    title: 'Open Graph Generator: Free OG Tags & Preview | SerpCraft',
    description:
      'Generate Open Graph tags (og:title, og:description, og:image, og:url) and preview your link on Facebook, LinkedIn, Slack, and Discord. Free.',
    h1: 'Open Graph Generator',
    ogType: 'website',
    keywords: 'open graph generator, og tags, og:title, og:image, facebook preview, open graph preview',
  },
  '/twitter-card-generator': {
    path: '/twitter-card-generator',
    title: 'Twitter Card Generator: Free X Card Tags | SerpCraft',
    description:
      'Generate Twitter Card tags (twitter:card, twitter:title, twitter:image) and preview how your link appears on X. Free, with live preview.',
    h1: 'Twitter Card Generator',
    ogType: 'website',
    keywords: 'twitter card generator, twitter card tags, x card, twitter:image, twitter:card, summary large image',
  },
  '/json-ld-generator': {
    path: '/json-ld-generator',
    title: 'JSON-LD Generator: Free Visual Schema Builder | SerpCraft',
    description:
      'Build JSON-LD structured data with a visual editor for Article, BlogPosting, Product, Organization, LocalBusiness, and more. Free JSON-LD schema generator.',
    h1: 'JSON-LD Generator',
    ogType: 'website',
    keywords: 'json-ld generator, structured data, schema markup, schema.org, rich results, json-ld schema generator',
  },
  '/schema-markup-generator': {
    path: '/schema-markup-generator',
    title: 'Schema Markup Generator: Free Schema.org Snippets | SerpCraft',
    description:
      'Generate schema.org JSON-LD markup for products, articles, local businesses, and more with a type selector and guided fields. Free schema markup generator.',
    h1: 'Schema Markup Generator',
    ogType: 'website',
    keywords: 'schema markup generator, schema.org, structured data markup, json-ld, rich snippets, schema generator',
  },
  '/social-preview-tool': {
    path: '/social-preview-tool',
    title: 'Social Preview Tool: Facebook, X & LinkedIn | SerpCraft',
    description:
      'Preview how your link looks on Facebook, X/Twitter, LinkedIn, Slack, and Discord before you publish. Free social media preview tool with live editing.',
    h1: 'Social Preview Tool',
    ogType: 'website',
    keywords: 'social preview tool, link preview, facebook preview, twitter preview, linkedin preview, slack preview, discord preview',
  },
  '/serp-preview-tool': {
    path: '/serp-preview-tool',
    title: 'SERP Preview Tool: Pixel-Accurate Google Test | SerpCraft',
    description:
      'Preview how your page title and meta description appear in Google search results with pixel-accurate truncation. Free Google SERP snippet preview tool.',
    h1: 'SERP Preview Tool',
    ogType: 'website',
    keywords: 'serp preview tool, google preview, serp snippet, title truncation, pixel width, meta description preview',
  },
  '/robots-txt-generator': {
    path: '/robots-txt-generator',
    title: 'Robots.txt Generator: Free Crawl Rules & Sitemap | SerpCraft',
    description:
      'Generate a robots.txt file with allow, disallow, sitemap, and crawl-delay directives. Free robots.txt generator with one-click copy.',
    h1: 'Robots.txt Generator',
    ogType: 'website',
    keywords: 'robots.txt generator, robots.txt, crawl directives, sitemap, robots file generator',
  },
  '/url-debugger': {
    path: '/url-debugger',
    title: 'URL Debugger: See What Google & Bots Read | SerpCraft',
    description:
      'Paste any URL and see what Google, Facebook, and other crawlers read: status, redirects, headers, meta tags, and conflicts. Free report.',
    h1: 'URL Debugger',
    ogType: 'website',
    keywords: 'url debugger, meta tag checker, open graph checker, why is google showing wrong description, page interpretation report, seo debugger, og image not showing',
  },
  '/seo-check': {
    path: '/seo-check',
    title: 'Free SEO Check: Instant Website Audit & Score | SerpCraft',
    description:
      'Free SEO check on any website: instant score plus a prioritized list of on-page, technical, social, and AI-readiness issues across 21 checks. No signup.',
    h1: 'Free SEO Check',
    ogType: 'website',
    keywords: 'seo check, seo check tool, free seo check, seo check online, website seo check, seo check website, on page seo check, seo audit, seo checker',
  },
  '/llms-txt-generator': {
    path: '/llms-txt-generator',
    title: 'llms.txt Generator: Free AI Crawler File Builder | SerpCraft',
    description:
      'Generate an llms.txt file so ChatGPT, Perplexity, Gemini, and Claude can discover and understand your content. Free llms.txt generator with one-click copy.',
    h1: 'llms.txt Generator',
    ogType: 'website',
    keywords: 'llms.txt generator, llms.txt, ai crawler file, ai seo, llms txt, chatgpt discoverability',
  },
  '/hreflang-generator': {
    path: '/hreflang-generator',
    title: 'Hreflang Generator: Free Tags with Validation | SerpCraft',
    description:
      'Generate hreflang alternate tags for multilingual sites with BCP-47 validation, x-default support, and duplicate detection. Free generator.',
    h1: 'Hreflang Generator',
    ogType: 'website',
    keywords: 'hreflang generator, hreflang tags, hreflang validator, multilingual seo, hreflang x-default, international seo',
  },
  '/og-image-checker': {
    path: '/og-image-checker',
    title: 'OG Image Checker: 1200x630 Open Graph Validator | SerpCraft',
    description:
      'Verify your Open Graph image server-side: format, 1200x630 dimensions, 1.91:1 aspect ratio, and file size. Free OG image checker.',
    h1: 'OG Image Checker',
    ogType: 'website',
    keywords: 'og image checker, open graph image validator, og image size, og image dimensions, 1200x630, facebook image checker',
  },
  '/json-ld-validator': {
    path: '/json-ld-validator',
    title: 'JSON-LD Validator: Free Structured Data Check | SerpCraft',
    description:
      'Validate your JSON-LD structured data: syntax, required schema.org fields, and rich-result eligibility. Free JSON-LD validator, no signup.',
    h1: 'JSON-LD Validator',
    ogType: 'website',
    keywords: 'json-ld validator, structured data validator, schema validator, rich results checker, json-ld checker',
  },
  '/about': {
    path: '/about',
    title: 'About SerpCraft: Free SEO Tools, Built for Marketers',
    description:
      'SerpCraft is a free, all-in-one SEO studio for meta tags, social previews, JSON-LD, and robots.txt, built by marketers tired of bouncing between tools.',
    h1: 'About SerpCraft',
    ogType: 'website',
    keywords: 'about serpcraft, seo tools, meta tag tools',
  },
  '/privacy': {
    path: '/privacy',
    title: 'Privacy Policy | SerpCraft: Free SEO Tools',
    description: 'SerpCraft privacy policy: no personal data collection, no accounts, and all tool data stays in your browser via localStorage.',
    h1: 'Privacy Policy',
    ogType: 'website',
    keywords: 'privacy policy, serpcraft privacy',
  },
  '/terms': {
    path: '/terms',
    title: 'Terms of Service | SerpCraft: Free SEO Tools',
    description: 'SerpCraft terms of service for the free SEO meta tag generator, structured data tools, and server-side page checks.',
    h1: 'Terms of Service',
    ogType: 'website',
    keywords: 'terms of service, serpcraft terms',
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
  { path: '/seo-check', label: 'SEO Check', shortLabel: 'SEO Check', icon: 'Gauge', description: 'Free instant website SEO audit' },
  { path: '/url-debugger', label: 'URL Debugger', shortLabel: 'URL Debugger', icon: 'Radar', description: 'See what crawlers actually read' },
  { path: '/llms-txt-generator', label: 'llms.txt Generator', shortLabel: 'llms.txt', icon: 'FileText', description: 'Optional AI crawler file builder' },
  { path: '/hreflang-generator', label: 'Hreflang Generator', shortLabel: 'Hreflang', icon: 'Languages', description: 'Multilingual tag builder with validation' },
  { path: '/og-image-checker', label: 'OG Image Checker', shortLabel: 'OG Image', icon: 'Image', description: 'Server-side OG image validation' },
  { path: '/json-ld-validator', label: 'JSON-LD Validator', shortLabel: 'JSON-LD Check', icon: 'Braces', description: 'Structured data verification' },
  { path: '/meta-tag-generator', label: 'Meta Tag Generator', shortLabel: 'Meta Tags', icon: 'Tags', description: 'Title, description, canonical, robots' },
  { path: '/open-graph-generator', label: 'Open Graph Generator', shortLabel: 'Open Graph', icon: 'Share2', description: 'OG tags for Facebook, Slack, Discord' },
  { path: '/twitter-card-generator', label: 'Twitter Card Generator', shortLabel: 'Twitter Cards', icon: 'Twitter', description: 'X/Twitter Card tags and preview' },
  { path: '/json-ld-generator', label: 'JSON-LD Generator', shortLabel: 'JSON-LD', icon: 'Braces', description: 'Structured data schema builder' },
  { path: '/schema-markup-generator', label: 'Schema Markup Generator', shortLabel: 'Schema Markup', icon: 'Code', description: 'Schema.org structured data' },
  { path: '/social-preview-tool', label: 'Social Preview Tool', shortLabel: 'Social Preview', icon: 'Eye', description: 'Multi-platform link previews' },
  { path: '/serp-preview-tool', label: 'SERP Preview Tool', shortLabel: 'SERP Preview', icon: 'Search', description: 'Pixel-accurate Google preview' },
  { path: '/robots-txt-generator', label: 'Robots.txt Generator', shortLabel: 'Robots.txt', icon: 'Bot', description: 'Crawl directives builder' },
];

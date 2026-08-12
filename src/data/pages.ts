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
  '/social-meta': {
    path: '/social-meta',
    title: 'Social Meta Generator: OG, Twitter & Meta Tags | SerpCraft',
    description:
      'Generate social meta tags: Open Graph, Twitter/X Cards, plus SEO meta tags. Live preview, one-click copy. Free.',
    h1: 'Social Meta Generator',
    ogType: 'website',
    keywords: 'open graph generator, twitter card generator, meta tag generator, og tags, twitter cards, social meta tags',
  },
  '/json-ld': {
    path: '/json-ld',
    title: 'JSON-LD Toolkit: Generator & Validator | SerpCraft',
    description:
      'Build and validate JSON-LD structured data. Visual schema builder + syntax validator with rich-result check. Free.',
    h1: 'JSON-LD Toolkit',
    ogType: 'website',
    keywords: 'json-ld generator, json-ld validator, structured data, schema markup, schema.org, rich results, json-ld schema',
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
  '/seo-checker': {
    path: '/seo-checker',
    title: 'Live SEO Evidence Report — Technical Audit & Analysis',
    description: 'Free instant website SEO evidence extraction. Check technical SEO, redirects, canonicals, robots, JSON-LD, and AI readiness signals.',
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
  '/release-diff': {
    path: '/release-diff',
    title: 'SEO Release Diff — Compare URLs & Catch Regressions',
    description: 'Compare staging vs production, old vs new, or baseline vs current. 12 critical SEO checks. Evidence-first reports.',
    h1: 'SEO Release Diff',
    ogType: 'website',
    keywords: 'release diff, seo regression, staging vs production, url comparison, pre-launch seo check, deploy seo audit',
  },
  '/seo-regression-checker': {
    path: '/seo-regression-checker',
    title: 'SEO Regression Checker — Compare URLs & Catch Drops',
    description: 'Compare staging vs production, old vs new, or baseline vs current. 12 critical SEO checks. Evidence-first reports.',
    h1: 'SEO Regression Checker',
    ogType: 'website',
    keywords: 'seo regression checker, seo regression, catch seo drops, compare seo',
  },
  '/staging-seo-checker': {
    path: '/staging-seo-checker',
    title: 'Staging SEO Checker — Compare Staging vs Production',
    description: 'Compare staging vs production, old vs new, or baseline vs current. 12 critical SEO checks. Evidence-first reports.',
    h1: 'Staging SEO Checker',
    ogType: 'website',
    keywords: 'staging seo checker, staging seo, compare staging vs production',
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
  '/visual-seo-studio': {
    path: '/visual-seo-studio',
    title: 'Visual SEO Remediation Studio: Interactive Editor | SerpCraft',
    description:
      'Extract, visualize, and edit your metadata and schema graph. An all-in-one SEO workspace with pixel-accurate SERP previews and live code generation. Free.',
    h1: 'Visual SEO Remediation Studio',
    ogType: 'website',
    keywords: 'visual seo editor, visual schema builder, interactive serp simulator, seo remediation, schema graph editor, seo diagnostic tool',
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
  { path: '/visual-seo-studio', label: 'Visual SEO Studio', shortLabel: 'Visual Studio', icon: 'LayoutDashboard', description: 'Interactive visual SEO workspace' },
  { path: '/release-diff', label: 'Release Diff', shortLabel: 'Release Diff', icon: 'GitCompare', description: 'Compare staging vs production URLs' },
  { path: '/seo-regression-checker', label: 'SEO Regression Checker', shortLabel: 'Regression Check', icon: 'GitCompare', description: 'Catch SEO drops between releases' },
  { path: '/staging-seo-checker', label: 'Staging SEO Checker', shortLabel: 'Staging Check', icon: 'GitCompare', description: 'Compare staging vs production' },
  { path: '/seo-checker', label: 'SEO Checker', shortLabel: 'SEO Checker', icon: 'Gauge', description: 'Live website SEO evidence extraction' },
  { path: '/url-debugger', label: 'URL Debugger', shortLabel: 'URL Debugger', icon: 'Radar', description: 'See what crawlers actually read' },
  { path: '/llms-txt-generator', label: 'llms.txt Generator', shortLabel: 'llms.txt', icon: 'FileText', description: 'Optional AI crawler file builder' },
  { path: '/hreflang-generator', label: 'Hreflang Generator', shortLabel: 'Hreflang', icon: 'Languages', description: 'Multilingual tag builder with validation' },
  { path: '/og-image-checker', label: 'OG Image Checker', shortLabel: 'OG Image', icon: 'Image', description: 'Server-side OG image validation' },
  { path: '/social-meta', label: 'Social Meta Generator', shortLabel: 'Social Meta', icon: 'Share2', description: 'Open Graph, Twitter/X Cards, meta tags' },
  { path: '/json-ld', label: 'JSON-LD Toolkit', shortLabel: 'JSON-LD', icon: 'Braces', description: 'Build and validate structured data' },
  { path: '/schema-markup-generator', label: 'Schema Markup Generator', shortLabel: 'Schema Markup', icon: 'Code', description: 'Schema.org structured data' },
  { path: '/social-preview-tool', label: 'Social Preview Tool', shortLabel: 'Social Preview', icon: 'Eye', description: 'Multi-platform link previews' },
  { path: '/serp-preview-tool', label: 'SERP Preview Tool', shortLabel: 'SERP Preview', icon: 'Search', description: 'Pixel-accurate Google preview' },
  { path: '/robots-txt-generator', label: 'Robots.txt Generator', shortLabel: 'Robots.txt', icon: 'Bot', description: 'Crawl directives builder' },
];

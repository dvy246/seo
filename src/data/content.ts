// Original companion content for each tool surface.
// Targets informational long-tail queries and satisfies E-E-A-T signals.

export interface ContentSection {
  heading: string;
  body: string;
}

export interface CompanionContent {
  intro: string;
  sections: ContentSection[];
  faq: { question: string; answer: string }[];
}

export const companionContent: Record<string, CompanionContent> = {
  '/': {
    intro:
      'SerpCraft is a free, all-in-one SEO studio. Instead of bouncing between a meta tag generator, a social preview checker, a JSON-LD builder, a SERP preview tool, and a robots.txt generator — you set up everything a page needs for SEO in one place. Every field updates the Google, Facebook, X, LinkedIn, Slack, and Discord previews in real time. No signup required. Everything runs in your browser.',
    sections: [
      {
        heading: 'Why a unified SEO studio matters',
        body: 'To properly SEO a single page, you typically need five tools: one to generate meta tags, one to preview social cards, one to build structured data, one to check the Google snippet, and one for robots.txt. Each is a separate site, a separate tab, and a separate copy-paste round. SerpCraft replaces all of them with a single studio where every change updates every preview instantly. You enter your title once and see it in Google, Facebook, X, LinkedIn, Slack, and Discord at the same time.',
      },
      {
        heading: 'Pixel-accurate Google SERP preview',
        body: 'Google truncates page titles by pixel width — not character count. A title with wide letters (W, M) gets cut sooner than one with narrow letters (i, l). Most meta tag generators show a character counter, which is wrong. SerpCraft measures the actual pixel width of your title and description using the same approach Google\'s rendering pipeline uses, so the preview shows exactly where Google will cut your text. No more guessing whether your title will be truncated.',
      },
      {
        heading: 'Structured data without a separate site',
        body: 'JSON-LD structured data helps Google understand what your page is about — an article, a product, a FAQ, a local business — and can earn rich results in search. Normally you generate this on a completely separate site from your meta tags. SerpCraft includes a built-in JSON-LD generator for the most common schema types (Article, BlogPosting, Product, FAQPage, Organization, BreadcrumbList, WebSite, LocalBusiness) right next to your meta tags and social previews.',
      },
      {
        heading: 'Save your brand profile and page library',
        body: 'Every other tool treats each visit as a blank slate. A founder with 30 blog posts re-enters their brand name, logo, domain, and Twitter handle 30 times. SerpCraft lets you save a brand profile once — every new page setup inherits it automatically. You can also save individual page setups and return to them later. Everything is stored locally in your browser by default, so the tool works fully with no account.',
      },
    ],
    faq: [
      {
        question: 'Is SerpCraft really free?',
        answer: 'Yes. The core studio — meta tags, social previews, JSON-LD, robots.txt, SERP preview — is completely free with no signup required. All data is stored locally in your browser. The site is supported by unobtrusive ads.',
      },
      {
        question: 'Does my data leave my browser?',
        answer: 'No. Everything runs client-side. Your page setups, brand profile, and generated tags never leave your device. There is no server-side processing of your content.',
      },
      {
        question: 'How accurate is the Google SERP preview?',
        answer: 'The preview measures the actual pixel width of your title and description text, following Google\'s documented truncation behavior. Google uses a max-width of approximately 580px for titles and 920px for descriptions on desktop. Our preview truncates at the same pixel limits, so you see exactly where Google will cut your text.',
      },
      {
        question: 'What schema types does the JSON-LD generator support?',
        answer: 'Article, BlogPosting, Product, FAQPage, Organization, BreadcrumbList, WebSite, and LocalBusiness. These cover the majority of structured data needs for content sites, e-commerce, and local businesses.',
      },
    ],
  },
  '/seo-check': {
    intro:
      'A free SEO check that runs 21 on-page, technical, social, and AI-readiness checks against any URL or pasted HTML, then gives you an instant score and a prioritized fix list. No signup, no install — paste a URL and get an actionable audit in seconds.',
    sections: [
      {
        heading: 'What the SEO check tests',
        body: 'The check covers the signals that matter most to Google and AI answer engines: title tag length and pixel width, meta description length, single H1, heading hierarchy, meta viewport, indexability (robots meta and canonical), favicon, Open Graph and Twitter Card completeness, missing or malformed JSON-LD structured data, duplicate titles and descriptions, image alt text, link crawlability, and AI-readiness signals such as machine-readable content and presence of an llms.txt file. Each failed check comes with a concrete fix, not just a warning.',
      },
      {
        heading: 'How the SEO score is calculated',
        body: 'Each check is weighted by its impact on crawling, indexing, and click-through. Failing a critical check like a missing title tag or an indexability conflict drags the score down far more than a missing Open Graph image. Checks are grouped into scores for content, machine readability, social sharing, and AI readiness, so you can see which area is hurting you most — then fix those first.',
      },
      {
        heading: 'Paste HTML vs URL mode',
        body: 'URL mode fetches the page server-side and also checks for the presence and validity of an llms.txt file on the domain. Paste-HTML mode runs entirely in your browser against the exact snapshot you provide — useful when a page is behind a login, staging, or a paywall. Both modes return the same checks and score.',
      },
      {
        heading: 'How to fix the issues you find',
        body: 'Open the studio to regenerate the meta tags, JSON-LD, and robots directives that failed, then use the URL Debugger to confirm what Googlebot actually receives. For persistent problems such as a rewritten meta description or an OG image that does not render, the SEO problem guides walk through root causes and step-by-step fixes.',
      },
    ],
    faq: [
      {
        question: 'Is a free online SEO check accurate?',
        answer: 'For the checks it runs, yes. The tool reads the actual HTML the URL returns and measures title and description pixel width the same way Google truncates. It cannot see inside Google\'s index or measure rankings — no tool can. It tells you whether your page sends the right signals; Search Console and the Rich Results Test cover the rest.',
      },
      {
        question: 'Why is my SEO score lower than expected?',
        answer: 'The most common culprits are an over-long title or description (measured by pixel width, not characters), a missing canonical or meta viewport, duplicate titles across pages, and missing Open Graph or structured data. Open the full check list to see every failed check and its impact, then fix the high-impact items first.',
      },
      {
        question: 'Can I check a page that requires a login?',
        answer: 'Yes — use paste-HTML mode. Copy the page source and paste it into the tool. Everything runs locally in your browser, so the check works for staging, logged-in, and paywalled pages that the server-side URL fetch cannot reach.',
      },
    ],
  },
  '/social-meta': {
    intro:
      'A social meta generator that builds your SEO meta tags (title tag, meta description, canonical, robots) plus Open Graph tags (og:title, og:description, og:image, og:url) and Twitter/X Cards (twitter:card, twitter:title, twitter:image) — with a live Google SERP preview and social card previews that show exactly how your snippet and cards will appear. Unlike character-count tools, SerpCraft measures pixel width, so you see where Google will actually truncate your title and description.',
    sections: [
      {
        heading: 'What are meta tags?',
        body: 'Meta tags are HTML elements in the <head> of your page that tell search engines and social platforms what your page is about. The two most important are the <title> tag (shown as the blue clickable link in Google) and the meta description (shown as the gray snippet text below it). Together, these determine what your search result looks like and how likely people are to click.',
      },
      {
        heading: 'Title tag best practices',
        body: 'Your title tag should be 50-60 characters, but Google actually truncates by pixel width (approximately 580px on desktop). Use your primary keyword near the beginning. Include your brand name at the end, separated by a pipe (|) or dash (—). Write something that reads naturally — keyword stuffing hurts click-through rate. The live preview on this page shows you exactly where Google will cut your title.',
      },
      {
        heading: 'Meta description best practices',
        body: 'Your meta description should be 150-160 characters (Google truncates at approximately 920px). Write it as ad copy — it does not directly affect rankings, but it affects whether people click. Include your keyword, a benefit, and a call to action. If you skip it, Google will generate one from your page content, which is usually worse.',
      },
      {
        heading: 'The essential Open Graph tags',
        body: 'Every page should have at minimum: og:title (the title shown on the card), og:description (the summary text), og:image (the preview image), og:url (the canonical URL), and og:type (website, article, product, etc.). The og:image is the most impactful — a good image dramatically increases click-through rate on social shares. Recommended size is 1200×630px.',
      },
      {
        heading: 'og:title vs twitter:title',
        body: 'og:title is read by Facebook, LinkedIn, Slack, and Discord. twitter:title is read by X/Twitter. You can set them separately if you want different titles on different platforms, but most sites use the same title and let Twitter fall back to og:title. SerpCraft lets you set both independently or leave the Twitter fields empty to fall back automatically.',
      },
      {
        heading: 'How to fix a broken social preview',
        body: 'If your social card looks wrong or shows no image: (1) Make sure your og:image URL is an absolute URL (https://example.com/image.png, not /image.png). (2) Make sure the image is publicly accessible and at least 1200×630px. (3) Use the platform\'s debugger — Facebook Sharing Debugger, Twitter Card Validator, or LinkedIn Post Inspector — to force a re-scrape. Platforms cache OG tags, so changes may not appear immediately without a re-scrape.',
      },
    ],
    faq: [
      {
        question: 'Does Google use the keywords meta tag?',
        answer: 'No. Google has officially stated they do not use the keywords meta tag for ranking. Bing and some other tools may still read it. It is optional and low-priority.',
      },
      {
        question: 'What is the difference between noindex and nofollow?',
        answer: 'noindex tells search engines not to show this page in search results. nofollow tells crawlers not to follow links on this page. You can use them independently — for example, a thank-you page might be index,follow (people can find it but links pass value) or noindex,follow (not in search but links still pass value).',
      },
      {
        question: 'What size should my OG image be?',
        answer: '1200×630 pixels is the standard recommendation. This works well across Facebook, LinkedIn, X, Slack, and Discord. Use a 1.91:1 aspect ratio. Keep the file under 8MB. PNG or JPG both work.',
      },
      {
        question: 'Can I use a relative URL for og:image?',
        answer: 'No. Open Graph image URLs must be absolute (https://example.com/image.png). Relative URLs (/image.png) will not work on most platforms because the scraper does not know your domain.',
      },
      {
        question: 'Why was the Twitter Card Validator deprecated?',
        answer: 'After the X acquisition, Twitter\'s official Card Validator was taken offline. Third-party tools like this one fill the gap by rendering a preview from your Twitter Card meta tags. After publishing, you can verify by posting a test tweet or using X\'s built-in preview when composing a post.',
      },
      {
        question: 'Do I need both Open Graph and Twitter Card tags?',
        answer: 'Twitter falls back to Open Graph tags, so technically you can use only OG tags. However, setting explicit Twitter Card tags gives you more control — especially the twitter:card tag, which determines whether you get a summary or large image card, and the twitter:site/creator tags, which are Twitter-specific.',
      },
    ],
  },
  '/json-ld': {
    intro:
      'A JSON-LD toolkit that combines a visual generator and a validator in one place: build structured data for Article, BlogPosting, Product, FAQPage, Organization, BreadcrumbList, WebSite, and LocalBusiness schema types — then paste it in to check syntax, required schema.org fields, and rich-result eligibility in real time, using the same validation engine as the SerpCraft studio and URL Debugger.',
    sections: [
      {
        heading: 'What is JSON-LD?',
        body: 'JSON-LD (JavaScript Object Notation for Linked Data) is Google\'s recommended format for structured data. It is a JavaScript block placed in your page\'s <head> that tells search engines what your page is about — an article, a product, a FAQ, a local business — in a machine-readable format. This can earn rich results in search, like star ratings, FAQ accordions, breadcrumb trails, and event details.',
      },
      {
        heading: 'JSON-LD vs Microdata vs RDFa',
        body: 'Google supports three formats for structured data: JSON-LD, Microdata, and RDFa. JSON-LD is strongly recommended — it is a separate script block that does not clutter your HTML, is easy to generate and validate, and is what Google\'s own tools default to. Microdata and RDFa require adding attributes throughout your HTML, which is harder to maintain.',
      },
      {
        heading: 'Which schema type should I use?',
        body: 'Article or BlogPosting for articles and blog posts. Product for things you sell. FAQPage for FAQ sections. Organization for your company (usually on the homepage or about page). BreadcrumbList for navigation breadcrumbs. WebSite for your site as a whole (usually on the homepage). LocalBusiness for physical business locations. Use the dropdown to switch between types.',
      },
      {
        heading: 'Syntax is the easy part — required fields are the hard part',
        body: 'Most validators stop at JSON.parse: if the JSON parses, they say valid. But Google ignores a FAQPage without mainEntity, a Product without image, an Article without datePublished. The validator enforces the required fields for the most common schema types, so a passing result means deployable, not just parseable.',
      },
      {
        heading: 'One engine, consistent verdicts',
        body: 'The validator runs the same code as the studio\'s live schema feedback and the URL Debugger\'s structured-data checks. That matters: a schema that passes here will pass the audit, and a schema flagged here will never surprise you in the debugger. There is one source of truth, not three tools with three opinions.',
      },
    ],
    faq: [
      {
        question: 'Does JSON-LD guarantee rich results?',
        answer: 'No. Valid structured data makes you eligible for rich results, but Google decides whether to show them based on quality, relevance, and other factors. Structured data is a necessary but not sufficient condition for rich results.',
      },
      {
        question: 'Can I have multiple JSON-LD blocks on one page?',
        answer: 'Yes. You can have multiple <script type="application/ld+json"> blocks on a page — for example, one for Article and one for BreadcrumbList. Google reads them all. You can also use @graph to combine multiple entities in one block.',
      },
      {
        question: 'What does "valid" mean in the validator?',
        answer: 'Three things: the JSON parses, the @context and @type are present, and all required fields for that schema type are filled. It does not guarantee a rich result — Google still applies its own policies — but invalid or incomplete markup never earns one.',
      },
      {
        question: 'Is this the same as Google\'s Rich Results Test?',
        answer: 'Similar purpose, different scope. Google\'s test also checks rendering and page-level eligibility. This validator runs instantly in your browser without sending your markup anywhere, and it shares its engine with the SerpCraft audit tools.',
      },
      {
        question: 'Does the validator store my JSON-LD?',
        answer: 'No. Everything runs in your browser. Nothing you paste is sent to any server.',
      },
    ],
  },
  '/schema-markup-generator': {
    intro:
      'A schema markup generator that builds schema.org structured data in JSON-LD format. Create valid structured data for products, articles, FAQs, local businesses, organizations, breadcrumbs, and more — with a live form and one-click copy.',
    sections: [
      {
        heading: 'What is schema markup?',
        body: 'Schema markup is structured data you add to your page that tells search engines exactly what your content is — a product, an article, a FAQ, a local business — using the vocabulary at schema.org. It enables rich results in Google search, like star ratings, prices, FAQ accordions, event dates, and breadcrumb trails. Without schema markup, Google has to guess what your content represents.',
      },
      {
        heading: 'Schema.org vs JSON-LD',
        body: 'Schema.org is the vocabulary — the set of types and properties (Product, Article, FAQPage, name, price, etc.). JSON-LD is the format — how you write that vocabulary in your HTML. Schema.org defines what to say; JSON-LD is how you say it. Google recommends JSON-LD as the format and schema.org as the vocabulary.',
      },
      {
        heading: 'When you need FAQ schema',
        body: 'Use FAQPage schema when your page has a list of questions and answers. This can earn an expandable FAQ accordion directly in Google search results, which increases your result\'s visual footprint and click-through rate. Each question needs a corresponding answer. Do not use FAQPage for pages where questions and answers are not the primary content.',
      },
      {
        heading: 'When you need Product schema',
        body: 'Use Product schema when a page is primarily about a specific product you sell. Include name, description, image, brand, and an Offer with price and availability. If you have reviews, add aggregateRating with ratingValue and reviewCount. This can earn star ratings and price snippets in Google search.',
      },
    ],
    faq: [
      {
        question: 'Is schema markup a ranking factor?',
        answer: 'Structured data is not a direct ranking factor — it does not boost your position by itself. However, it enables rich results that increase your click-through rate, which can indirectly improve rankings. Google has stated that structured data helps them understand your content better.',
      },
      {
        question: 'What is the difference between schema markup and meta tags?',
        answer: 'Meta tags (title, description) control how your page appears in search results. Schema markup tells search engines what your page IS (a product, an article, a FAQ). They serve different purposes and you need both. Meta tags affect the snippet; schema markup can earn rich result features beyond the standard snippet.',
      },
      {
        question: 'Can schema markup hurt my rankings?',
        answer: 'Incorrect or misleading structured data can trigger a manual action from Google, removing rich results from your site. Always ensure your structured data accurately describes the page content. Do not add review schema to pages without reviews, or product schema to pages without products.',
      },
    ],
  },
  '/social-preview-tool': {
    intro:
      'A social preview tool that shows how your link will appear on Facebook, X/Twitter, LinkedIn, Slack, and Discord — all at once, updating live as you edit your tags. See every platform\'s card before you publish, so you never share a broken or ugly preview again.',
    sections: [
      {
        heading: 'Why preview social cards before publishing',
        body: 'When you share a link on social media, the platform fetches your page and renders a preview card. If your Open Graph or Twitter Card tags are missing or wrong, the card will look bad — no image, wrong title, truncated description. Social platforms cache these previews aggressively, so fixing a broken card after publishing can take hours or days. Previewing first lets you catch problems before they are public.',
      },
      {
        heading: 'Each platform is slightly different',
        body: 'Facebook uses og:title, og:description, and og:image. X/Twitter uses twitter:card, twitter:title, twitter:description, and twitter:image (falling back to OG tags). LinkedIn uses OG tags but renders the card slightly differently. Slack uses OG tags and shows a colored left border. Discord uses OG tags and renders in dark mode. SerpCraft shows all of these side by side so you can verify each one looks right.',
      },
      {
        heading: 'How to force a re-scrape',
        body: 'If you have already shared a link and the preview is wrong, you need to force the platform to re-fetch your tags. Facebook: use the Sharing Debugger at developers.facebook.com/tools/debug/. LinkedIn: use the Post Inspector at linkedin.com/post-inspector/. X/Twitter: compose a new post and delete the old URL, then re-paste. Slack: use "Refresh preview" in the message menu. Discord: there is no official tool — the cache expires after a while.',
      },
      {
        heading: 'Common preview problems and fixes',
        body: 'No image: use an absolute URL for og:image (https://example.com/image.png, not /image.png). Wrong title: check og:title and twitter:title — they override your <title> tag on social. Truncated description: keep og:description under 200 characters. Cached old preview: use the platform\'s debugger to force a re-scrape. Image loads on some platforms but not others: check CORS and ensure the image is publicly accessible without authentication.',
      },
    ],
    faq: [
      {
        question: 'Does this tool fetch my live page?',
        answer: 'No. SerpCraft simulates the preview from the values you enter in the editor. It does not crawl your URL. This lets you iterate before publishing. For a live URL check, use the platform-specific debuggers after your page is live.',
      },
      {
        question: 'Why does my card look different on mobile vs desktop?',
        answer: 'Each platform renders cards slightly differently on mobile and desktop — image aspect ratios, text truncation, and layout vary. SerpCraft shows the desktop rendering, which is the most common case. The tags are the same regardless of device; only the rendering differs.',
      },
      {
        question: 'How long do social platforms cache OG tags?',
        answer: 'Facebook caches for up to 30 days (use the Sharing Debugger to force a refresh). LinkedIn caches for about 24 hours (use the Post Inspector). X/Twitter caches for about 7 days. Slack caches for about 15 minutes to 1 hour. Discord caches for several hours.',
      },
    ],
  },
  '/serp-preview-tool': {
    intro:
      'A SERP preview tool that shows how your page title and meta description will appear in Google search results — with pixel-accurate truncation. Google cuts titles at approximately 580px and descriptions at approximately 920px. This tool measures the actual pixel width of your text, so you see exactly where Google will truncate.',
    sections: [
      {
        heading: 'Google truncates by pixel width, not characters',
        body: 'Most SERP preview tools count characters. This is wrong. Google truncates titles at approximately 580px and descriptions at approximately 920px on desktop. A title with wide letters (W, M, O) gets cut sooner than one with narrow letters (i, l, t). Two titles with the same character count can have very different pixel widths. SerpCraft measures the actual pixel width, so the preview matches what Google will actually show.',
      },
      {
        heading: 'Title tag length: the pixel-width rule',
        body: 'Google\'s desktop title truncation is approximately 580px. In practice, this translates to roughly 50-60 characters for most titles — but your mileage varies based on letter widths. A title like "WOW: Wide Letters Matter" will truncate sooner than "ill: thin letters fit more". Use the live preview to see exactly where your title gets cut, and adjust accordingly. If you see a truncation warning, shorten your title.',
      },
      {
        heading: 'Meta description length: the pixel-width rule',
        body: 'Google\'s desktop description truncation is approximately 920px, which translates to roughly 150-160 characters. Again, this varies by letter width. On mobile, descriptions can be longer (up to 120 characters on some devices, but Google has been experimenting). The best approach: write a compelling description that makes sense even if truncated, and use the preview to verify it fits.',
      },
      {
        heading: 'Why your snippet matters for SEO',
        body: 'Your title and description do not directly affect rankings, but they dramatically affect click-through rate (CTR). A higher CTR can indirectly improve rankings. Write your title as a headline and your description as ad copy. Include your keyword (Google bolds it in results). Include a benefit. Include a call to action. Test different variations and monitor CTR in Google Search Console.',
      },
    ],
    faq: [
      {
        question: 'Does Google always use my title tag?',
        answer: 'No. Google may rewrite your title tag if it thinks it can improve it. In 2021, Google updated its title generation system to use page content, headings, and other on-page text more heavily. Studies show Google uses your exact title tag about 60-80% of the time. Writing a good title tag is still important — it is your best bet for controlling what appears.',
      },
      {
        question: 'Does Google always use my meta description?',
        answer: 'No. Google generates its own description from your page content more often than it uses your meta description — roughly 60-70% of the time, depending on the query. However, for the queries where your meta description matches the search intent, Google is more likely to use it. Write a description that closely matches what your page is about.',
      },
      {
        question: 'Are mobile snippets different from desktop?',
        answer: 'Yes. Mobile snippets have slightly different pixel-width limits and font sizes. SerpCraft simulates the desktop SERP, which is the most common case. The difference is small — if your title fits on desktop, it will almost certainly fit on mobile.',
      },
    ],
  },
  '/robots-txt-generator': {
    intro:
      'A robots.txt generator that builds your crawl directives — user-agent, allow, disallow, crawl-delay, and sitemap URL — with one-click copy. Place the generated file at the root of your domain (e.g. example.com/robots.txt) to control how search engine crawlers access your site.',
    sections: [
      {
        heading: 'What is robots.txt?',
        body: 'robots.txt is a plain text file placed at the root of your domain that tells search engine crawlers which parts of your site they can and cannot access. It is the first file a crawler requests when it visits your site. It is a directive, not a rule — well-behaved crawlers like Googlebot respect it, but malicious crawlers ignore it. Do not use robots.txt to hide sensitive content.',
      },
      {
        heading: 'robots.txt syntax',
        body: 'A robots.txt file consists of one or more groups. Each group starts with a User-agent line (which crawler the rules apply to) followed by Allow and Disallow lines (which paths). A special Sitemap line at the end points crawlers to your XML sitemap. The wildcard * matches all crawlers. Paths can use wildcards (* matches any sequence, $ matches end of path).',
      },
      {
        heading: 'Common robots.txt patterns',
        body: 'Allow everything (default): User-agent: * with no Disallow. Block a private section: Disallow: /admin/. Block search results pages: Disallow: /search/. Block parameter URLs: Disallow: /*?. Block everything: Disallow: /. Always include your sitemap URL so crawlers can discover all your pages efficiently.',
      },
      {
        heading: 'When NOT to use robots.txt',
        body: 'Do not use robots.txt to block pages you want kept out of search results — use the noindex meta tag or HTTP headers instead. robots.txt prevents crawling, not indexing. Google can still index a URL it cannot crawl (e.g. if it is linked from other sites). If you Disallow a page in robots.txt, Google will not see your noindex tag because it cannot crawl the page. Use noindex for indexing control, robots.txt for crawl budget control.',
      },
    ],
    faq: [
      {
        question: 'Where do I put my robots.txt file?',
        answer: 'At the root of your domain: example.com/robots.txt. It must be accessible at exactly that URL. If your site is in a subdirectory (example.com/blog/), you cannot have a separate robots.txt for the subdirectory — robots.txt only works at the domain root.',
      },
      {
        question: 'How long does it take for robots.txt changes to take effect?',
        answer: 'Google caches robots.txt for up to 24 hours. Changes typically take effect within a day. You can check Google\'s cached version in Search Console under Settings > robots.txt.',
      },
      {
        question: 'Does crawl-delay work with Google?',
        answer: 'No. Google ignores the Crawl-delay directive. To control Google\'s crawl rate, use the crawl rate setting in Google Search Console. Crawl-delay is respected by Bing and some other crawlers.',
      },
    ],
  },
  '/url-debugger': {
    intro:
      'A page interpretation debugger: paste any URL — or raw HTML — and see exactly what search engines and social platforms can read. The report shows the response (status, redirects, headers), what the page declares (title, meta, Open Graph, structured data, hreflang), where those signals conflict, and the exact fix — with the raw evidence behind every finding.',
    sections: [
      {
        heading: 'What the URL actually returns',
        body: 'Before any tag matters, the transport must be healthy. The report shows the HTTP status, every redirect hop (a 301 is fine; five hops are not), the final URL, content type, and response headers such as X-Robots-Tag and Cache-Control. A 404 page or a slow redirect chain explains a lot of "why does Google show the wrong thing" problems before you ever look at a meta tag.',
      },
      {
        heading: 'What the page declares',
        body: 'The debugger extracts everything a crawler would read: title, meta description, canonical, robots directives, Open Graph and Twitter tags, JSON-LD structured data types, hreflang, images, and headings. Each value is shown as raw evidence — the exact tag and content that was found, so you can compare it against what you think you published.',
      },
      {
        heading: 'Where the signals disagree',
        body: 'Most ranking and preview problems are conflicts, not missing tags: a canonical pointing at a different page than the one served, a canonical paired with noindex, an og:title that contradicts the <title>, a relative og:image URL (Facebook rejects them), or duplicate title and description tags where crawlers silently use the first. The report surfaces these conflicts explicitly instead of scoring them away.',
      },
      {
        heading: 'The fix, in plain language',
        body: 'Every finding includes a plain-English explanation and the copy-ready repair: generate the corrected tags in the studio, verify an Open Graph image with the OG image checker, or validate a JSON-LD block before redeploying. Then re-run the debugger after deployment — that is the workflow it is built for.',
      },
    ],
    faq: [
      {
        question: 'Is the URL debugger free?',
        answer: 'Yes. Both modes are free: the URL audit (fetched server-side, bypassing browser CORS limits) and the paste-HTML audit (runs entirely in your browser). No signup required.',
      },
      {
        question: 'What does the score mean?',
        answer: 'The 100-point score is a weighted average of four categories: SEO (35%), Machine Readability (30%), Social (20%), and Accessibility (15%). It is a summary, not a promise: the evidence behind every check is what matters — read the findings, not just the number.',
      },
      {
        question: 'Does the URL audit store the page content?',
        answer: 'No. The audit fetches the page, extracts metadata, and discards the HTML. Results are cached for 24 hours to keep the tool fast and cheap — the cache stores the report, not your content.',
      },
      {
        question: 'What is a good score?',
        answer: '80+ means the page is clean on the fundamentals: indexable, with a title, description, canonical, and structured data that agree. The most common blockers are missing or conflicting Open Graph tags, duplicate titles, canonical/noindex conflicts, and no structured data — all fixable directly in the SerpCraft studio.',
      },
      {
        question: 'What is the 10-audits-per-hour limit?',
        answer: 'To keep the free service reliable, the URL audit allows 10 checks per hour per IP address. The paste-HTML mode has no limit because it runs entirely in your browser.',
      },
    ],
  },
  '/llms-txt-generator': {
    intro:
      'An llms.txt generator that produces the markdown file some AI engines read to understand your site. llms.txt — the file format proposed for AI crawlers at llmstxt.org — lives at the root of your domain (llms.txt) and lists what your site is about and which pages matter most. It is optional: Google states it is not required for Search or AI Overviews, but crawlers from OpenAI, Anthropic, Perplexity, and Google are documented to fetch it.',
    sections: [
      {
        heading: 'What is llms.txt and when does it help',
        body: 'llms.txt is a markdown file at your domain root that tells AI engines what your site is, in plain text — a title, a one-line description, and a prioritized list of pages with one-line summaries. It exists because AI crawlers need a reliable, unambiguous map of your content, and most sites do not have one. Treat it as optional polish: Google explicitly says websites do not need it to appear in Search, AI Overviews, or AI Mode. Its value is improving how AI crawlers discover and understand your content — not ranking.',
      },
      {
        heading: 'The format an AI engine expects',
        body: 'The llms.txt spec follows Markdown conventions. The file starts with an H1 title, an optional blockquote description, and an ordered list of pages: each entry is a Markdown link with an optional colon-separated summary. Everything after the H1 is a suggestion, not a requirement — the generator produces this exact format, so the file is valid the moment you copy it.',
      },
      {
        heading: 'Which pages belong in llms.txt',
        body: 'List your most important pages first: the homepage, key product or service pages, and your best content — the pages you would want an AI to cite when someone asks about your industry. Keep summaries to one line and descriptive, not salesy. AI engines use them to decide whether a page answers a question.',
      },
      {
        heading: 'Pair it with the URL Debugger',
        body: 'The generator and the URL Debugger are designed to work together: the debugger audits a URL and tells you whether an llms.txt file exists at its origin, then the generator creates one in the exact format the debugger detects. Deploy the file to your domain root and re-run the debugger to confirm.',
      },
    ],
    faq: [
      {
        question: 'Is llms.txt a standard?',
        answer: 'It is a proposed standard (llmstxt.org) adopted early by major AI players. GPTBot, PerplexityBot, ClaudeBot, and Google\'s AI crawlers are documented to fetch llms.txt — the format itself is Markdown, so even a plain-text parser understands it.',
      },
      {
        question: 'Where do I upload the file?',
        answer: 'To the root of your domain, alongside robots.txt and sitemap.xml — e.g. https://yourdomain.com/llms.txt. No server configuration is needed on most hosts; it is a static file.',
      },
      {
        question: 'Can llms.txt hurt my SEO?',
        answer: 'No. It does not control crawling like robots.txt — it only informs AI engines about your content. There is no known penalty for having one, and Google has stated it does not affect ranking or AI Overviews. It is an optional courtesy for AI crawlers, not a requirement.',
      },
      {
        question: 'What if I have hundreds of pages?',
        answer: 'Do not list every page. llms.txt works best as a curated map: 5-50 of your most important URLs with strong summaries. AI engines use it to discover your key content, not to crawl everything.',
      },
      {
        question: 'How is this different from a sitemap?',
        answer: 'A sitemap lists URLs for crawlers; llms.txt explains them. It carries titles and one-line summaries that let an AI decide relevance before fetching, and it is written in plain Markdown — the same format models are trained on.',
      },
    ],
  },
  '/hreflang-generator': {
    intro:
      'A hreflang generator that builds the alternate-link tags multilingual sites need — with BCP-47 locale validation, x-default support, and duplicate detection that most free generators skip. hreflang tells Google and AI engines which language version of a page to serve to which market, preventing duplicate-content confusion across your locales.',
    sections: [
      {
        heading: 'Why hreflang matters for international SEO',
        body: 'If you serve the same page in English, Spanish, French, and German, search engines see four URLs with similar content. Without hreflang, Google guesses which one matches a searcher — and guesses wrong often enough to hurt both rankings and UX. hreflang tells every engine which URL is the English version, which is the Spanish version, and which is the catch-all. AI engines also read hreflang to understand your site\'s structure across languages.',
      },
      {
        heading: 'The x-default rule most tools get wrong',
        body: 'x-default tells search engines which URL to show to visitors whose language you do not explicitly serve — it can point to a specific locale page or to your main URL. Google\'s documentation recommends including it, and its absence is one of the most common hreflang mistakes found in audits. This generator adds it automatically when you enable the option.',
      },
      {
        heading: 'Reciprocity: the rule that makes or breaks hreflang',
        body: 'Google requires hreflang sets to be mutually reciprocal: if page A declares page B as an alternate, page B must declare page A too. A one-way link is treated as an error and the whole set can be ignored. The generator emits a complete block per URL — copy it onto each page in the set, and reciprocity holds by construction.',
      },
      {
        heading: 'Validating your locales before you publish',
        body: 'Google rejects malformed language codes. Locales must follow BCP-47 (language plus optional region, like es-ES or pt-BR), and each URL can declare any given locale only once. The generator validates every code as you type, flags duplicates, and warns when the same URL appears in multiple rows — so the tags you copy are deployable on the first try.',
      },
    ],
    faq: [
      {
        question: 'What is hreflang?',
        answer: 'An HTML attribute on link tags — hreflang="es" — that tells search engines which language or regional version of a page to show for a given market. It lives in the head of each page, alongside your other meta tags.',
      },
      {
        question: 'Do I need x-default?',
        answer: 'Google recommends it. x-default designates the fallback URL for visitors whose language you do not serve. It is optional for single-language sites and near-mandatory for multi-language ones.',
      },
      {
        question: 'Can I put hreflang in an XML sitemap instead?',
        answer: 'Yes — the sitemap method declares the same alternates with xhtml:link elements, and Google supports both. In-page link tags are the simpler, more common approach and are what this tool generates.',
      },
      {
        question: 'Does hreflang affect AI search visibility?',
        answer: 'Yes, indirectly. AI engines fetch your pages per locale and use language signals — including hreflang — to map your site\'s structure. Clean international signals are part of what the SerpCraft URL Debugger checks.',
      },
      {
        question: 'What happens if hreflang tags are wrong?',
        answer: 'The most common outcome is Google ignoring the tags entirely and choosing locales by guesswork — no penalty, but your Spanish page might serve German visitors and vice versa. Invalid codes can make the whole set invalid.',
      },
    ],
  },
  '/og-image-checker': {
    intro:
      'An Open Graph image checker that verifies your og:image server-side: whether it loads, its real format, its exact pixel dimensions, its aspect ratio, and its file size. Facebook, X, LinkedIn, and Slack all fetch your image independently — if it fails any of these checks, your link renders as a bare URL. This is the one check browsers cannot do on their own.',
    sections: [
      {
        heading: 'What breaks a social preview (and what does not)',
        body: 'Social platforms fetch the og:image URL, download the bytes, and validate them: correct format, minimum dimensions, and reasonable file size. Common failure modes are a 404 or redirect loop, a WebP image old scrapers refuse, a 600x300 image that gets upscaled into blur, and a 12 MB image that times out the fetch. The checker tests exactly these conditions, the same way the platforms do.',
      },
      {
        heading: 'Why this cannot be a browser-only tool',
        body: 'A browser checking an image on another domain hits CORS: it can load the image to display it, but it cannot read its bytes, dimensions, or file size. Every image checker that claims to do this client-side is guessing from the DOM, which fails for most real-world images. SerpCraft fetches the image server-side and parses the actual header bytes — the same method Facebook\'s scraper uses.',
      },
      {
        heading: 'The 1200x630 rule, explained',
        body: 'Facebook and LinkedIn recommend 1200x630 pixels (a 1.91:1 ratio) — large enough to look sharp on retina screens, with a ratio that fits their crop. Twitter prefers 1200x675 for its own card. Any image at least 600x315 will render, but platforms upscale it, and upscaling is where images get blurry. The checker reports your dimensions, your ratio, and the recommended thresholds.',
      },
      {
        heading: 'Formats and sizes that actually work',
        body: 'JPG, PNG, and WebP are the safe choices for og:image. GIF and BMP render inconsistently across platforms, and SVG is not supported by most scrapers at all. File size matters too: Facebook\'s crawler has historically struggled with very large images, and every platform gives up after a few seconds. Under 2 MB is the safe zone; the checker flags anything above.',
      },
    ],
    faq: [
      {
        question: 'What image size should I use for og:image?',
        answer: '1200x630 pixels is the universal recommendation — it is the exact size Facebook and LinkedIn use, and it satisfies every other platform. The minimum usable size is 600x315, below which platforms refuse or badly upscale.',
      },
      {
        question: 'Does the checker work for any image URL?',
        answer: 'Yes — any public URL. The server fetches it, follows redirects, and parses PNG, JPEG, WebP, GIF, BMP, and SVG headers. Private or local-network URLs are blocked for security.',
      },
      {
        question: 'Why does my preview work on some platforms but not others?',
        answer: 'Each platform has its own scraper with its own tolerance. A common case: your image is a GIF or WebP, which newer platforms accept but older scrapers reject. The checker flags exactly those edge cases.',
      },
      {
        question: 'How often should I re-check an image?',
        answer: 'After any change to the image file or its URL. Results are cached for 24 hours per URL to keep the service fast, so a fresh check after you replace an image is always available.',
      },
      {
        question: 'What is the difference between this and a general audit?',
        answer: 'The URL Debugger verifies that an og:image URL exists; this tool verifies the image itself — its bytes, dimensions, format, and size. They are complementary: use the debugger to find gaps, use this to debug a specific broken preview.',
      },
    ],
  },
  '/visual-seo-studio': {
    intro:
      'The Visual SEO Remediation Studio is an all-in-one workspace for fixing SEO issues. Paste any HTML to instantly extract the title, meta tags, Open Graph tags, and structured data. Visually edit your schema graph and social cards in real-time, then export the corrected <head> code directly to your project.',
    sections: [
      {
        heading: 'Why visual SEO remediation matters',
        body: 'Most SEO audits just give you a list of errors: "Title too long", "Missing JSON-LD property", "Open Graph image missing". Fixing them usually requires bouncing between a CMS, a schema generator, a code editor, and a SERP preview tool. The Visual SEO Remediation Studio combines extraction, visual editing, and live previewing in a single workspace. You see the problem, you fix it visually, and you copy the exact code needed.',
      },
      {
        heading: 'Real-time schema graph editing',
        body: 'Writing JSON-LD by hand is error-prone. The studio extracts any existing structured data from your pasted HTML and visualizes it as an interactive, hierarchical entity graph. You can click on any value—like an article\'s datePublished or a product\'s price—and edit it directly. The studio automatically manages the JSON syntax, brackets, and types in the background.',
      },
      {
        heading: 'Pixel-accurate preview fidelity',
        body: 'The live preview engine uses exact pixel-width measurements for Google Desktop snippets and exact aspect ratios for Facebook Open Graph cards. As you type, the preview reflects the exact truncation point and visual layout that searchers and social media users will see. There are no character-count guesses, only rendering reality.',
      },
      {
        heading: 'Private and browser-first',
        body: 'Your code never leaves your computer. The extraction logic, the DOM parser, and the code generator all run entirely client-side in your browser. You can safely paste HTML from staging environments, intranet sites, or behind-the-login apps without exposing sensitive data.',
      }
    ],
    faq: [
      {
        question: 'Does this tool fix my live website automatically?',
        answer: 'No. The studio extracts your code and lets you fix it visually. Once you are happy with the preview, you must copy the generated <head> code and paste it back into your CMS, Astro project, or website builder.',
      },
      {
        question: 'Can it handle multiple schema objects on one page?',
        answer: 'Yes. The extraction engine supports multiple <script type="application/ld+json"> blocks, as well as complex @graph arrays containing multiple entities. They will all appear in the Schema Graph tab.',
      },
      {
        question: 'Why do I have to paste HTML instead of a URL?',
        answer: 'Pasting HTML allows you to debug pages that are not publicly accessible (like staging environments or localhost). It also ensures the studio works on the exact rendered DOM you provide, avoiding issues with JavaScript rendering timeouts.',
      }
    ]
  }
};

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
      'MetaForge is a free, all-in-one SEO studio. Instead of bouncing between a meta tag generator, a social preview checker, a JSON-LD builder, a SERP preview tool, and a robots.txt generator — you set up everything a page needs for SEO in one place. Every field updates the Google, Facebook, X, LinkedIn, Slack, and Discord previews in real time. No signup required. Everything runs in your browser.',
    sections: [
      {
        heading: 'Why a unified SEO studio matters',
        body: 'To properly SEO a single page, you typically need five tools: one to generate meta tags, one to preview social cards, one to build structured data, one to check the Google snippet, and one for robots.txt. Each is a separate site, a separate tab, and a separate copy-paste round. MetaForge replaces all of them with a single studio where every change updates every preview instantly. You enter your title once and see it in Google, Facebook, X, LinkedIn, Slack, and Discord at the same time.',
      },
      {
        heading: 'Pixel-accurate Google SERP preview',
        body: 'Google truncates page titles by pixel width — not character count. A title with wide letters (W, M) gets cut sooner than one with narrow letters (i, l). Most meta tag generators show a character counter, which is wrong. MetaForge measures the actual pixel width of your title and description using the same approach Google\'s rendering pipeline uses, so the preview shows exactly where Google will cut your text. No more guessing whether your title will be truncated.',
      },
      {
        heading: 'Structured data without a separate site',
        body: 'JSON-LD structured data helps Google understand what your page is about — an article, a product, a FAQ, a local business — and can earn rich results in search. Normally you generate this on a completely separate site from your meta tags. MetaForge includes a built-in JSON-LD generator for the most common schema types (Article, BlogPosting, Product, FAQPage, Organization, BreadcrumbList, WebSite, LocalBusiness) right next to your meta tags and social previews.',
      },
      {
        heading: 'Save your brand profile and page library',
        body: 'Every other tool treats each visit as a blank slate. A founder with 30 blog posts re-enters their brand name, logo, domain, and Twitter handle 30 times. MetaForge lets you save a brand profile once — every new page setup inherits it automatically. You can also save individual page setups and return to them later. Everything is stored locally in your browser by default, so the tool works fully with no account.',
      },
    ],
    faq: [
      {
        question: 'Is MetaForge really free?',
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
  '/meta-tag-generator': {
    intro:
      'A meta tag generator that creates your title tag, meta description, canonical URL, robots directives, and keywords — with a live Google SERP preview that shows exactly how your snippet will appear. Unlike character-count-based tools, MetaForge measures pixel width, so you see where Google will actually truncate your title and description.',
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
        heading: 'Canonical URLs explained',
        body: 'A canonical URL tells Google "this is the master version of this page." Use it when the same content is accessible from multiple URLs (e.g. with and without trailing slashes, with query parameters, or syndicated content). Without a canonical tag, Google may pick one for you — and it might not be the one you want.',
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
        question: 'Should my title tag and H1 be the same?',
        answer: 'They can be similar but do not need to be identical. Your title tag is optimized for search results and click-through; your H1 is what visitors see on the page. Many sites use a slightly shorter, punchier title tag and a more descriptive H1.',
      },
    ],
  },
  '/open-graph-generator': {
    intro:
      'An Open Graph tag generator that builds your og:title, og:description, og:image, og:url, and og:type tags — with live previews of how your link will appear on Facebook, LinkedIn, Slack, and Discord. See exactly how your social card looks before you publish.',
    sections: [
      {
        heading: 'What are Open Graph tags?',
        body: 'Open Graph (OG) tags are meta tags that control how your page appears when shared on social media. They were originally created by Facebook but are now used by LinkedIn, Slack, Discord, iMessage, and many other platforms. Without OG tags, platforms guess what image and text to show — often badly. With OG tags, you control exactly what appears.',
      },
      {
        heading: 'The essential OG tags',
        body: 'Every page should have at minimum: og:title (the title shown on the card), og:description (the summary text), og:image (the preview image), og:url (the canonical URL), and og:type (website, article, product, etc.). The og:image is the most impactful — a good image dramatically increases click-through rate on social shares. Recommended size is 1200×630px.',
      },
      {
        heading: 'og:title vs twitter:title',
        body: 'og:title is read by Facebook, LinkedIn, Slack, and Discord. twitter:title is read by X/Twitter. You can set them separately if you want different titles on different platforms, but most sites use the same title and let Twitter fall back to og:title. MetaForge lets you set both independently or leave the Twitter fields empty to fall back automatically.',
      },
      {
        heading: 'How to fix a broken social preview',
        body: 'If your social card looks wrong or shows no image: (1) Make sure your og:image URL is an absolute URL (https://example.com/image.png, not /image.png). (2) Make sure the image is publicly accessible and at least 1200×630px. (3) Use the platform\'s debugger — Facebook Sharing Debugger, Twitter Card Validator, or LinkedIn Post Inspector — to force a re-scrape. Platforms cache OG tags, so changes may not appear immediately without a re-scrape.',
      },
    ],
    faq: [
      {
        question: 'What size should my OG image be?',
        answer: '1200×630 pixels is the standard recommendation. This works well across Facebook, LinkedIn, X, Slack, and Discord. Use a 1.91:1 aspect ratio. Keep the file under 8MB. PNG or JPG both work.',
      },
      {
        question: 'Can I use a relative URL for og:image?',
        answer: 'No. Open Graph image URLs must be absolute (https://example.com/image.png). Relative URLs (/image.png) will not work on most platforms because the scraper does not know your domain.',
      },
      {
        question: 'Why is my OG image not showing on Facebook?',
        answer: 'Facebook caches OG tags aggressively. Use the Facebook Sharing Debugger (developers.facebook.com/tools/debug/) to force a re-scrape after you update your tags. Also verify the image URL is absolute, publicly accessible, and at least 200×200px.',
      },
    ],
  },
  '/twitter-card-generator': {
    intro:
      'A Twitter Card tag generator that builds your twitter:card, twitter:title, twitter:description, twitter:image, twitter:site, and twitter:creator tags — with a live preview of how your link will appear on X. Twitter\'s official Card Validator was deprecated, so this tool fills the gap.',
    sections: [
      {
        heading: 'What are Twitter Cards?',
        body: 'Twitter Cards are meta tags that control how your link appears when shared on X (formerly Twitter). Without them, X shows just a plain URL. With them, X shows a rich card with an image, title, and description. There are four card types: summary (small square image), summary_large_image (large image — recommended for most content), app (for mobile apps), and player (for video/audio).',
      },
      {
        heading: 'summary vs summary_large_image',
        body: 'summary shows a small square image on the left with title and description on the right. summary_large_image shows a large image on top with title and description below — much more visually impactful. For most articles, blog posts, and landing pages, use summary_large_image. Use summary for pages where the image is less important.',
      },
      {
        heading: 'twitter:site and twitter:creator',
        body: 'twitter:site is the X handle of the website or publication (e.g. @yoursite). twitter:creator is the X handle of the individual author (e.g. @authorname). Both are optional but recommended — they help X attribute the content and can enable analytics. Include the @ symbol in the tag value.',
      },
      {
        heading: 'Twitter Card image requirements',
        body: 'For summary_large_image: 1200×628px (2:1 ratio), max 5MB. For summary: 240×240px minimum (1:1 ratio). JPG, PNG, GIF, and WebP are supported. Use an absolute URL. The image must be publicly accessible. If your twitter:image is empty, X falls back to your og:image.',
      },
    ],
    faq: [
      {
        question: 'Why was the Twitter Card Validator deprecated?',
        answer: 'After the X acquisition, Twitter\'s official Card Validator was taken offline. Third-party tools like this one fill the gap by rendering a preview from your Twitter Card meta tags. After publishing, you can verify by posting a test tweet or using X\'s built-in preview when composing a post.',
      },
      {
        question: 'Do I need both Open Graph and Twitter Card tags?',
        answer: 'Twitter falls back to Open Graph tags, so technically you can use only OG tags. However, setting explicit Twitter Card tags gives you more control — especially the twitter:card tag, which determines whether you get a summary or large image card, and the twitter:site/creator tags, which are Twitter-specific.',
      },
      {
        question: 'How do I test my Twitter Card after publishing?',
        answer: 'Compose a new post on X and paste your URL — X will render a preview card. Alternatively, use a third-party Twitter Card preview tool like this one before publishing to iterate without posting.',
      },
    ],
  },
  '/json-ld-generator': {
    intro:
      'A JSON-LD generator that builds structured data for Article, BlogPosting, Product, FAQPage, Organization, BreadcrumbList, WebSite, and LocalBusiness schema types. Fill in the form, get valid JSON-LD with a single click. No more hand-writing schema.org JSON.',
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
        body: 'Article or BlogPosting for articles and blog posts. Product for things you sell. FAQPage for FAQ sections. Organization for your company (usually on the homepage or about page). BreadcrumbList for navigation breadcrumbs. WebSite for your site as a whole (usually on the homepage). LocalBusiness for physical business locations. Use the dropdown above to switch between types.',
      },
      {
        heading: 'How to test your structured data',
        body: 'After adding JSON-LD to your page, test it with Google\'s Rich Results Test (search.google.com/test/rich-results). This tool tells you if your structured data is valid and which rich result types it qualifies for. Also check Google Search Console for structured data errors and warnings over time.',
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
        question: 'Do I need a developer to add JSON-LD?',
        answer: 'If you can edit your page\'s HTML or use a CMS that allows custom head tags, you can add JSON-LD yourself by pasting the generated script block into the <head>. Many CMS platforms (WordPress, Webflow, etc.) have plugins or settings for adding structured data. For complex dynamic sites, a developer may be needed.',
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
        body: 'Facebook uses og:title, og:description, and og:image. X/Twitter uses twitter:card, twitter:title, twitter:description, and twitter:image (falling back to OG tags). LinkedIn uses OG tags but renders the card slightly differently. Slack uses OG tags and shows a colored left border. Discord uses OG tags and renders in dark mode. MetaForge shows all of these side by side so you can verify each one looks right.',
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
        answer: 'No. MetaForge simulates the preview from the values you enter in the editor. It does not crawl your URL. This lets you iterate before publishing. For a live URL check, use the platform-specific debuggers after your page is live.',
      },
      {
        question: 'Why does my card look different on mobile vs desktop?',
        answer: 'Each platform renders cards slightly differently on mobile and desktop — image aspect ratios, text truncation, and layout vary. MetaForge shows the desktop rendering, which is the most common case. The tags are the same regardless of device; only the rendering differs.',
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
        body: 'Most SERP preview tools count characters. This is wrong. Google truncates titles at approximately 580px and descriptions at approximately 920px on desktop. A title with wide letters (W, M, O) gets cut sooner than one with narrow letters (i, l, t). Two titles with the same character count can have very different pixel widths. MetaForge measures the actual pixel width, so the preview matches what Google will actually show.',
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
        answer: 'Yes. Mobile snippets have slightly different pixel-width limits and font sizes. MetaForge simulates the desktop SERP, which is the most common case. The difference is small — if your title fits on desktop, it will almost certainly fit on mobile.',
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
};

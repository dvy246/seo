export interface ProblemGuide {
  slug: string;
  path: string;
  title: string;
  description: string;
  h1: string;
  keywords: string;
  symptom: string;
  whyItHappens: string[];
  diagnose: { step: string; detail: string }[];
  fixes: { step: string; detail: string }[];
  relatedTools: { path: string; label: string }[];
}

export const problemGuides: ProblemGuide[] = [
  {
    slug: 'wrong-meta-description',
    path: '/problems/wrong-meta-description',
    title: 'Google Shows the Wrong Meta Description — Why & How to Fix It | SerpCraft',
    description:
      'Google is showing a snippet that is not your meta description. Learn why search engines rewrite descriptions, how to confirm what Google actually reads with the URL Debugger, and how to fix it.',
    h1: 'Why Does Google Show the Wrong Meta Description?',
    keywords: 'google wrong meta description, meta description not showing, google rewrites description, wrong search snippet',
    symptom:
      'You wrote a meta description, but the Google result shows something else — an old snippet, a paragraph from your page, or a random line. Your description tag is correct, so why is Google ignoring it?',
    whyItHappens: [
      'Google rewrites meta descriptions regularly — it is not a bug. When it decides your description does not match the searcher query well, it assembles a snippet from page content instead.',
      'The description contains text that differs from what the crawler actually reads. If your page serves different HTML to Googlebot than to you, the tag you see is not the tag Google saw.',
      'The page is not indexed with your latest tags. Google must re-crawl and re-render before snippet changes appear — this can take days or weeks.',
      'Duplicate descriptions across pages can cause Google to pick whichever URL it decides to show.',
    ],
    diagnose: [
      {
        step: 'Run the URL in the SerpCraft URL Debugger',
        detail: 'Paste your URL and check the "Title / Description" block. This shows the raw description tag from the HTML the server returns — evidence of what was sent, separate from what Google displays.',
      },
      {
        step: 'Check for robots directives',
        detail: 'If the debugger flags noindex, Google cannot use the page at all. A meta robots "noindex" or a blocked X-Robots-Tag overrides every description you write.',
      },
      {
        step: 'Confirm what Googlebot sees',
        detail: 'Enable "Compare Googlebot & Facebook views" in the URL Debugger. If Googlebot sees a different description than your browser, you have cloaking or server-side UA sniffing — a serious indexing risk.',
      },
      {
        step: 'Use Google Search Console',
        detail: 'Open the URL Inspection tool, request indexing, and wait. If the page shows an older description in the preview, Google simply has not re-crawled yet.',
      },
    ],
    fixes: [
      {
        step: 'Write for the query, not the page',
        detail: 'Descriptions that restate the query wording ("best CRM for small teams") get rewritten less often than generic brand sentences. 50–160 characters, one clear value proposition, a call to action.',
      },
      {
        step: 'Make the page content match the description',
        detail: 'If your description promises a price or a date, the first 200 characters of visible page text should agree. Google pulls snippets from the body when the tag disagrees with it.',
      },
      {
        step: 'Keep descriptions unique per page',
        detail: 'Same description on many URLs invites Google to pick any of them. Each page should have its own description that summarizes that specific page.',
      },
      {
        step: 'Remove conflicting directives',
        detail: 'Re-run the URL Debugger after changes. Fix any noindex, canonical conflicts, or duplicate-tag warnings it reports, then re-request indexing in Search Console.',
      },
    ],
    relatedTools: [
      { path: '/url-debugger', label: 'URL Debugger' },
      { path: '/meta-tag-generator', label: 'Meta Tag Generator' },
      { path: '/serp-preview-tool', label: 'SERP Preview Tool' },
    ],
  },
  {
    slug: 'open-graph-image-not-showing',
    path: '/problems/open-graph-image-not-showing',
    title: 'Facebook / LinkedIn OG Image Not Showing — Fix It Fast | SerpCraft',
    description:
      'Your og:image is not showing when you share a link on Facebook, LinkedIn, or X. Learn the 4 real causes (caching, relative URLs, size, format) and how to verify your image bytes with the OG Image Checker.',
    h1: 'Your OG Image Is Not Showing When You Share a Link',
    keywords: 'og image not showing, facebook image not showing, linkedin preview no image, open graph image fix, og image 1200x630',
    symptom:
      'When you paste your link into Facebook, LinkedIn, X, or Slack, the card appears without an image — or with a wrong image. The tag exists in your HTML. Why?',
    whyItHappens: [
      'A relative og:image URL like "/image.png" instead of "https://yourdomain.com/image.png". Social platforms cannot resolve it against your domain.',
      'The image bytes do not meet platform requirements: Facebook wants at least 1200x630 and recommends under 8MB; small or compressed images get rejected or cropped.',
      'Platform caching. Facebook caches up to 30 days, X around 7 days, LinkedIn ~24 hours. Even a perfect tag change will not show until the cache refreshes.',
      'The URL blocks crawlers (robots.txt disallow on the image path, or a 403/404), or the image requires an authenticated session.',
    ],
    diagnose: [
      {
        step: 'Check the tag value itself',
        detail: 'Run the URL in the URL Debugger and look at the OG image row. It flags relative og:image URLs as errors — the single most common cause.',
      },
      {
        step: 'Verify the actual image bytes',
        detail: 'Paste the og:image URL into the OG Image Checker. It fetches the file server-side and reports real dimensions, format, and size — the same data Facebook crawler uses.',
      },
      {
        step: 'Test with a platform debugger',
        detail: 'Facebook Sharing Debugger and LinkedIn Post Inspector fetch fresh and show you the exact image their crawler received. This separates "my HTML is wrong" from "the platform cached it".',
      },
      {
        step: 'Check with the crawler view',
        detail: 'In the URL Debugger, enable the Facebook crawler comparison. If Facebook sees no og:image while your browser does, the crawler is being blocked or served different HTML.',
      },
    ],
    fixes: [
      {
        step: 'Use absolute URLs everywhere',
        detail: 'og:image (and og:url, canonical) must be full URLs. The debugger reports this as an error — fix it in your template and re-generate your tags.',
      },
      {
        step: 'Export a 1200x630 image',
        detail: 'Create or export a 1.91:1 image at 1200x630. Verify it with the OG Image Checker after upload — format, size, and aspect ratio are checked against the real file, not the extension.',
      },
      {
        step: 'Force a re-scrape',
        detail: 'Facebook: Sharing Debugger > "Scrape Again". LinkedIn: Post Inspector. X: delete the old post and compose fresh. Slack: "Refresh preview". These are instant, unlike natural cache expiry.',
      },
      {
        step: 'Unblock the image URL',
        detail: 'Make sure robots.txt does not disallow the image path and the file returns 200 to a plain GET with no cookies. Re-run the debugger to confirm.',
      },
    ],
    relatedTools: [
      { path: '/url-debugger', label: 'URL Debugger' },
      { path: '/og-image-checker', label: 'OG Image Checker' },
      { path: '/open-graph-generator', label: 'Open Graph Generator' },
    ],
  },
  {
    slug: 'canonical-noindex-conflict',
    path: '/problems/canonical-noindex-conflict',
    title: 'Canonical + noindex Conflict — Stop Wasting Crawl Budget | SerpCraft',
    description:
      'A page with both a canonical tag and a noindex robots directive sends Google contradictory instructions. Learn how the conflict happens, how the URL Debugger detects it, and the right fix.',
    h1: 'Canonical and noindex on the Same Page: a Signal Conflict',
    keywords: 'canonical noindex conflict, noindex canonical, conflicting signals, crawl budget, indexing issues',
    symptom:
      'Your page has a canonical tag pointing at itself (or another URL) AND a meta robots noindex. You are telling Google both "index this URL" and "do not index this URL" at once.',
    whyItHappens: [
      'Templates that inject robots noindex for duplicate content but keep the canonical self-reference from the main template.',
      'A developer added noindex while a page was a draft and it stayed on after launch.',
      'Plugins that set noindex automatically (for thin content, pagination) while the canonical logic remains enabled.',
      'A redirect target page carries over both tags from the source page.',
    ],
    diagnose: [
      {
        step: 'Look at the Signals category',
        detail: 'The URL Debugger explicitly checks "Canonical vs noindex" and reports the conflict as an error with both values shown as evidence — no guessing.',
      },
      {
        step: 'Check the final URL after redirects',
        detail: 'If the page redirects, the canonical/noindex that matters is on the final URL. The debugger shows the redirect chain and the tags on the final response.',
      },
      {
        step: 'Decide which signal you intend',
        detail: 'Do you want the page indexed, or not? The fix depends on intent — you cannot keep both.',
      },
    ],
    fixes: [
      {
        step: 'If you want the page indexed: remove noindex',
        detail: 'Delete the meta robots noindex (and any X-Robots-Tag: noindex header — the debugger surfaces headers too). Keep the canonical self-reference.',
      },
      {
        step: 'If the page should not be indexed: remove the canonical',
        detail: 'For truly non-indexable pages, prefer noindex plus a working internal link to the canonical alternative. A canonical on a noindex page is contradictory and ignored in conflicting-signal cases.',
      },
      {
        step: 'Redirect instead of noindex when possible',
        detail: 'If a page is a duplicate of another, a 301 redirect is usually cleaner than noindex. The debugger redirect chain report confirms the redirect reaches the right final URL.',
      },
      {
        step: 'Re-audit and re-request indexing',
        detail: 'Re-run the URL Debugger until the conflict check passes, then request indexing for the canonical URL in Search Console.',
      },
    ],
    relatedTools: [
      { path: '/url-debugger', label: 'URL Debugger' },
      { path: '/meta-tag-generator', label: 'Meta Tag Generator' },
      { path: '/robots-txt-generator', label: 'Robots.txt Generator' },
    ],
  },
  {
    slug: 'schema-valid-but-not-showing',
    path: '/problems/schema-valid-but-not-showing',
    title: 'Valid Schema but No Rich Results — Why & How to Check | SerpCraft',
    description:
      'Your JSON-LD passes validation but Google shows no rich result. Learn the real reasons (eligibility, location, testing tools, caching) and how to check your structured data with the JSON-LD Validator.',
    h1: 'Schema Passes Validation but Google Shows No Rich Results',
    keywords: 'json-ld valid but no rich results, structured data not showing, schema not showing in google, rich results test',
    symptom:
      'Your JSON-LD is valid — the URL Debugger confirms the structured data parses — yet Google shows no stars, no product box, no FAQ. What is missing?',
    whyItHappens: [
      'Valid does not mean eligible. Most schema types (WebPage, Article) are not rich-result types — only specific types like Product, Recipe, FAQ, Review, Event can trigger rich results.',
      'Eligibility is regional and per-type. Some rich-result features are only available in certain countries or for certain content types.',
      'Google must crawl, render, and test the markup before any rich result appears. New markup can sit for days or weeks before Google re-processes the page.',
      'The markup is on the page but requires fields Google will not use, or the required properties are missing for the specific rich-result type.',
    ],
    diagnose: [
      {
        step: 'Confirm the type is a rich-result type',
        detail: 'Run the JSON-LD Validator on your markup. It checks required schema.org fields and calls out whether the type is eligible for rich results at all.',
      },
      {
        step: 'Check the page-level context',
        detail: 'Use the URL Debugger: it reports whether the page is indexable, whether Googlebot can render it, and whether the structured data is present in the HTML the server sends.',
      },
      {
        step: 'Run Google Rich Results Test',
        detail: 'Google Rich Results Test shows eligibility instantly for any rich-result type. It will name the missing field or feature directly.',
      },
      {
        step: 'Give it time after fixing',
        detail: 'After a fix, request indexing in Search Console. Rich results are not guaranteed even when everything passes — Google decides per page.',
      },
    ],
    fixes: [
      {
        step: 'Use a type that can produce rich results',
        detail: 'Product, Recipe, FAQ, Review, Event, BreadcrumbList, Article (with headline + image). If your schema is WebPage-only, nothing will ever render as a rich result.',
      },
      {
        step: 'Fill required properties, not just valid ones',
        detail: 'For example, FAQ needs the exact question/answer structure; Product needs offers and price. The JSON-LD Validator reports the specific missing fields.',
      },
      {
        step: 'Keep markup in the server HTML',
        detail: 'If the page is client-rendered, Googlebot can still render it — but slow or JS-heavy pages delay it. Server-rendered JSON-LD in the head is the most reliable.',
      },
      {
        step: 'Re-check with the debugger',
        detail: 'After editing, re-run the URL Debugger to confirm the updated structured data is in the served HTML, then request indexing.',
      },
    ],
    relatedTools: [
      { path: '/url-debugger', label: 'URL Debugger' },
      { path: '/json-ld-validator', label: 'JSON-LD Validator' },
      { path: '/json-ld-generator', label: 'JSON-LD Generator' },
    ],
  },
  {
    slug: 'google-sees-different-html',
    path: '/problems/google-sees-different-html',
    title: 'Google Sees Different HTML Than You — Find the Mismatch | SerpCraft',
    description:
      'Your page looks perfect in a browser but Googlebot or Facebook sees a different version: no meta tags, missing content, wrong canonical. Learn how to compare what each crawler actually receives.',
    h1: 'Google Sees Different HTML Than Your Browser Does',
    keywords: 'google sees different html, googlebot different content, crawler different html, cloaking, user agent sniffing, server side rendering google',
    symptom:
      'You inspect your page and everything is correct. Yet the URL Debugger, Google, or Facebook reports missing titles, different text, or tags you removed months ago. The server is serving different HTML to different clients.',
    whyItHappens: [
      'Server-side user-agent sniffing: your hosting or a plugin serves a stripped-down version to bots (often to "optimize for crawlers"). Google treats heavy divergence as cloaking.',
      'JS-rendered content: if meta tags or body content are injected by JavaScript, crawlers that do not execute JS see none of it.',
      'A/B testing or geo/device targeting that returns different markup depending on request headers.',
      'A CDN or caching layer serving stale HTML to bot requests.',
    ],
    diagnose: [
      {
        step: 'Compare crawler views',
        detail: 'In the URL Debugger, enable "Compare Googlebot & Facebook views". The table shows title, description, OG image, robots, and schema for your default view and each crawler. Amber cells are the mismatches.',
      },
      {
        step: 'Inspect the raw server response',
        detail: 'The debugger shows the actual headers (content-type, x-robots-tag, cache-control) and the redirect chain — evidence of what the server really returned.',
      },
      {
        step: 'Test with curl',
        detail: 'Run the page with a Googlebot user agent and again with a browser agent. Diff the two HTML outputs — that diff is exactly what crawlers see.',
      },
      {
        step: 'Disable JS rendering checks',
        detail: 'If markup only exists after JS runs, the served HTML will not contain it. Check whether your tags are in the raw HTML or injected at runtime.',
      },
    ],
    fixes: [
      {
        step: 'Remove user-agent divergence',
        detail: 'Serve the same HTML to every client. If you optimize for bots, the content must match what real users see, or Google treats it as cloaking and may drop the page.',
      },
      {
        step: 'Move critical tags into server HTML',
        detail: 'Title, description, canonical, OG tags, and JSON-LD should be in the initial HTML response, not added by client-side JavaScript.',
      },
      {
        step: 'Review CDN and cache config',
        detail: 'Ensure the CDN is not serving a stale or cached variant to crawlers. Purge caches after changes and re-audit.',
      },
      {
        step: 'Re-audit until views match',
        detail: 'Re-run the URL Debugger with the crawler comparison until all rows show identical values. That is the closest you can get to "what Google sees equals what I see".',
      },
    ],
    relatedTools: [
      { path: '/url-debugger', label: 'URL Debugger' },
      { path: '/meta-tag-generator', label: 'Meta Tag Generator' },
      { path: '/robots-txt-generator', label: 'Robots.txt Generator' },
    ],
  },
];

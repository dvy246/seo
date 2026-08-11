// Shared Release Diff Engine for SerpCraft Release Guard
// Pure, environment-agnostic (no DOM, no Node APIs) — runs in browser and Cloudflare Function
// Compares two AuditSnapshots and produces evidence-first diff findings

import type { AuditSnapshot, AuditStatus, AuditImpact, AuditCategory } from './validator';

export type DiffSeverity = 'blocker' | 'warning' | 'info';

export interface DiffFinding {
  id: string;
  category: AuditCategory;
  label: string;
  severity: DiffSeverity;
  message: string;
  consequence: string;
  fix: string;
  evidenceA?: string;
  evidenceB?: string;
}

export interface ReleaseDiffReport {
  urlA: string;
  urlB: string;
  timestamp: string;
  findings: DiffFinding[];
  summary: {
    blockers: number;
    warnings: number;
    info: number;
  };
}

const CATEGORY_ORDER: AuditCategory[] = ['SEO', 'Social', 'Machine Readability', 'Accessibility'];

function compareStrings(label: string, a: string | null | undefined, b: string | null | undefined): { changed: boolean; evidenceA: string; evidenceB: string } {
  const va = a?.trim() ?? '';
  const vb = b?.trim() ?? '';
  return { changed: va !== vb, evidenceA: va || '(missing)', evidenceB: vb || '(missing)' };
}

function compareNumbers(label: string, a: number | null | undefined, b: number | null | undefined): { changed: boolean; evidenceA: string; evidenceB: string } {
  const va = a ?? 0;
  const vb = b ?? 0;
  return { changed: va !== vb, evidenceA: String(va), evidenceB: String(vb) };
}

function compareBoolean(label: string, a: boolean | null | undefined, b: boolean | null | undefined): { changed: boolean; evidenceA: string; evidenceB: string } {
  const va = a ?? false;
  const vb = b ?? false;
  return { changed: va !== vb, evidenceA: va ? 'true' : 'false', evidenceB: vb ? 'true' : 'false' };
}

function compareRedirectChains(chainA: { status: number; url: string }[] | undefined, chainB: { status: number; url: string }[] | undefined): { changed: boolean; evidenceA: string; evidenceB: string } {
  const a = chainA ?? [];
  const b = chainB ?? [];
  if (a.length !== b.length) return { changed: true, evidenceA: a.map(h => `${h.status} ${h.url}`).join(' → ') || '(none)', evidenceB: b.map(h => `${h.status} ${h.url}`).join(' → ') || '(none)' };
  for (let i = 0; i < a.length; i++) {
    if (a[i].status !== b[i].status || a[i].url !== b[i].url) {
      return { changed: true, evidenceA: a.map(h => `${h.status} ${h.url}`).join(' → '), evidenceB: b.map(h => `${h.status} ${h.url}`).join(' → ') };
    }
  }
  return { changed: false, evidenceA: a.map(h => `${h.status} ${h.url}`).join(' → ') || '(none)', evidenceB: b.map(h => `${h.status} ${h.url}`).join(' → ') || '(none)' };
}

function getSeverity(category: AuditCategory, label: string, impact: AuditImpact): DiffSeverity {
  // Release Blockers: high-impact SEO/Machine Readability issues that prevent indexing or change URL identity
  if (impact === 'high') {
    if (category === 'SEO' && ['HTTP Status', 'Canonical URL', 'Indexability', 'Redirect Chain', 'URL Parity'].includes(label)) return 'blocker';
    if (category === 'Machine Readability' && ['Robots Directive', 'Canonical + noindex Conflict'].includes(label)) return 'blocker';
    if (category === 'Social' && ['OG Image Accessibility'].includes(label)) return 'blocker';
  }
  if (impact === 'medium' || impact === 'high') return 'warning';
  return 'info';
}

function getConsequence(category: AuditCategory, label: string, changed: boolean, evidenceA: string, evidenceB: string): string {
  if (!changed) return 'No change — this signal is identical in both versions.';

  const consequences: Record<string, string> = {
    'HTTP Status': 'Search engines may drop the page from index (4xx/5xx) or treat it differently (3xx vs 200).',
    'Redirect Chain': 'Multi-hop redirects slow crawlers, dilute authority, and can break canonicalization.',
    'Indexability': 'Page becomes invisible to search engines. Traffic will drop to zero from organic search.',
    'Canonical URL': 'Canonical change can consolidate signals to wrong URL or create duplicate content confusion.',
    'URL Parity': 'Old URL has no direct replacement — users and crawlers hit 404. All authority lost.',
    'Sitemap Consistency': 'Sitemap points to wrong/old URLs — crawlers waste budget on dead/redirected pages.',
    'Initial HTML': 'Critical content only appears after JavaScript — many crawlers (including some AI bots) will not see it.',
    'Title Tag': 'Title change alters click-through rate in SERPs and social previews. May signal content change to Google.',
    'Meta Description': 'Description change affects SERP snippet and CTR. No direct ranking impact but affects traffic.',
    'Open Graph': 'OG tag changes alter how the page appears when shared on Facebook, LinkedIn, Slack, Discord.',
    'Twitter Cards': 'Twitter Card changes alter X (Twitter) preview appearance and click-through.',
    'OG Image Accessibility': 'Image becomes inaccessible, redirected, or invalid — social shares show broken/blank previews.',
    'Structured Data': 'JSON-LD loss or change removes rich result eligibility and reduces AI citation potential.',
    'Hreflang': 'Hreflang loss breaks international targeting — users may see wrong language version.',
    'Robots.txt': 'Robots.txt changes can accidentally block crawlers from new/important URLs.',
    'H1 Tag': 'H1 change alters primary heading signal for both accessibility and SEO.',
    'Content Signals': 'Visible text/heading changes may alter topical relevance and user intent match.',
  };

  return consequences[label] || `Changed from "${evidenceA}" to "${evidenceB}". Review impact on ${category.toLowerCase()}.`;
}

function getFix(category: AuditCategory, label: string, evidenceA: string, evidenceB: string): string {
  const fixes: Record<string, string> = {
    'HTTP Status': 'Ensure production returns HTTP 200. Fix server errors or restore the page.',
    'Redirect Chain': 'Reduce to single 301 redirect. Point old URL directly to final destination.',
    'Indexability': 'Remove noindex/nofollow. Check X-Robots-Tag header and robots.txt for conflicts.',
    'Canonical URL': 'Set canonical to the preferred, indexable, 200-status version of the page.',
    'URL Parity': 'Create a 301 redirect from old URL to new URL. Ensure new URL returns 200.',
    'Sitemap Consistency': 'Update sitemap.xml to include only canonical, indexable, 200-status URLs.',
    'Initial HTML': 'Move critical content (title, H1, primary text, JSON-LD) to server-rendered HTML.',
    'Title Tag': 'Review title change. Keep primary keyword near start. Stay under 60 characters.',
    'Meta Description': 'Review description change. Include primary keyword. Stay under 160 characters.',
    'Open Graph': 'Ensure OG tags match the intended social preview. Use absolute URLs for og:image.',
    'Twitter Cards': 'Add twitter:card, twitter:title, twitter:description, twitter:image with absolute URLs.',
    'OG Image Accessibility': 'Host OG image on same domain. Ensure 200 status, valid format (PNG/JPEG/WebP), <5MB, 1200x630px.',
    'Structured Data': 'Restore missing JSON-LD. Validate at validator.schema.org. Match page content exactly.',
    'Hreflang': 'Add reciprocal hreflang tags for all language versions. Include self-referencing and x-default.',
    'Robots.txt': 'Review robots.txt — ensure new URLs are not Disallowed. Test in Search Console.',
    'H1 Tag': 'Ensure exactly one H1 per page. Include primary topic/keyword.',
    'Content Signals': 'Verify content changes are intentional. Maintain topical depth and user intent coverage.',
  };

  return fixes[label] || `Compare "${evidenceA}" vs "${evidenceB}". Decide which version is correct and deploy that.`;
}

function getImpact(category: AuditCategory, label: string): AuditImpact {
  const highImpact: Record<string, string[]> = {
    'SEO': ['HTTP Status', 'Redirect Chain', 'Indexability', 'Canonical URL', 'URL Parity', 'Sitemap Consistency', 'Title Tag', 'Meta Description'],
    'Social': ['Open Graph', 'OG Image Accessibility'],
    'Machine Readability': ['Structured Data', 'Hreflang', 'Robots Directive', 'Canonical + noindex Conflict'],
  };

  const mediumImpact: Record<string, string[]> = {
    'SEO': ['H1 Tag', 'Initial HTML', 'Content Signals'],
    'Social': ['Twitter Cards', 'OG Title vs Page Title'],
    'Machine Readability': ['Content Depth', 'llms.txt'],
    'Accessibility': ['Viewport Meta', 'Language Attribute'],
  };

  if (highImpact[category]?.includes(label)) return 'high';
  if (mediumImpact[category]?.includes(label)) return 'medium';
  return 'low';
}

export function buildReleaseDiff(snapshotA: AuditSnapshot, snapshotB: AuditSnapshot): ReleaseDiffReport {
  const findings: DiffFinding[] = [];

  // 1. HTTP Status & Redirect Chain
  {
    const statusA = snapshotA.httpStatus ?? 0;
    const statusB = snapshotB.httpStatus ?? 0;
    if (statusA !== statusB) {
      const severity = getSeverity('SEO', 'HTTP Status', 'high');
      findings.push({
        id: 'http-status',
        category: 'SEO',
        label: 'HTTP Status',
        severity,
        message: `HTTP status changed from ${statusA} to ${statusB}.`,
        consequence: getConsequence('SEO', 'HTTP Status', true, String(statusA), String(statusB)),
        fix: getFix('SEO', 'HTTP Status', String(statusA), String(statusB)),
        evidenceA: `HTTP ${statusA}`,
        evidenceB: `HTTP ${statusB}`,
      });
    }

    const redirectDiff = compareRedirectChains(snapshotA.redirectChain, snapshotB.redirectChain);
    if (redirectDiff.changed) {
      const severity = getSeverity('SEO', 'Redirect Chain', redirectDiff.evidenceB.split(' → ').length > 2 ? 'high' : 'medium');
      findings.push({
        id: 'redirect-chain',
        category: 'SEO',
        label: 'Redirect Chain',
        severity,
        message: 'Redirect chain changed between versions.',
        consequence: getConsequence('SEO', 'Redirect Chain', true, redirectDiff.evidenceA, redirectDiff.evidenceB),
        fix: getFix('SEO', 'Redirect Chain', redirectDiff.evidenceA, redirectDiff.evidenceB),
        evidenceA: redirectDiff.evidenceA,
        evidenceB: redirectDiff.evidenceB,
      });
    }
  }

  // 2. Indexability (robots meta + X-Robots-Tag)
  {
    const robotsA = snapshotA.robots?.toLowerCase() ?? '';
    const robotsB = snapshotB.robots?.toLowerCase() ?? '';
    const noindexA = robotsA.includes('noindex');
    const noindexB = robotsB.includes('noindex');
    if (noindexA !== noindexB) {
      findings.push({
        id: 'indexability',
        category: 'Machine Readability',
        label: 'Indexability',
        severity: 'blocker',
        message: noindexB ? 'Page became noindexed (was indexable).' : 'Page became indexable (was noindexed).',
        consequence: getConsequence('Machine Readability', 'Indexability', true, noindexA ? 'noindex' : 'indexable', noindexB ? 'noindex' : 'indexable'),
        fix: getFix('Machine Readability', 'Indexability', noindexA ? 'noindex' : 'indexable', noindexB ? 'noindex' : 'indexable'),
        evidenceA: noindexA ? 'noindex' : 'indexable',
        evidenceB: noindexB ? 'noindex' : 'indexable',
      });
    }
  }

  // 3. Canonical URL
  {
    const canonicalDiff = compareStrings('Canonical URL', snapshotA.canonical, snapshotB.canonical);
    if (canonicalDiff.changed) {
      findings.push({
        id: 'canonical',
        category: 'SEO',
        label: 'Canonical URL',
        severity: 'blocker',
        message: 'Canonical URL changed between versions.',
        consequence: getConsequence('SEO', 'Canonical URL', true, canonicalDiff.evidenceA, canonicalDiff.evidenceB),
        fix: getFix('SEO', 'Canonical URL', canonicalDiff.evidenceA, canonicalDiff.evidenceB),
        evidenceA: canonicalDiff.evidenceA,
        evidenceB: canonicalDiff.evidenceB,
      });
    }
  }

  // 4. URL Parity (final URL)
  {
    const finalUrlDiff = compareStrings('Final URL', snapshotA.finalUrl, snapshotB.finalUrl);
    if (finalUrlDiff.changed) {
      findings.push({
        id: 'url-parity',
        category: 'SEO',
        label: 'URL Parity',
        severity: 'blocker',
        message: 'Final resolved URL changed — the page is now served at a different address.',
        consequence: getConsequence('SEO', 'URL Parity', true, finalUrlDiff.evidenceA, finalUrlDiff.evidenceB),
        fix: getFix('SEO', 'URL Parity', finalUrlDiff.evidenceA, finalUrlDiff.evidenceB),
        evidenceA: finalUrlDiff.evidenceA,
        evidenceB: finalUrlDiff.evidenceB,
      });
    }
  }

  // 5. Sitemap Consistency (simplified - would need sitemap fetch in real impl)
  // Skipped in v1 — requires separate sitemap fetch

  // 6. Initial HTML vs Rendered DOM (simplified - we only have initial HTML in v1)
  // In v1, we compare what we have. Full rendered DOM diff needs headless browser (Phase 2).

  // 7. Metadata: Title
  {
    const titleDiff = compareStrings('Title Tag', snapshotA.title, snapshotB.title);
    if (titleDiff.changed) {
      findings.push({
        id: 'title',
        category: 'SEO',
        label: 'Title Tag',
        severity: 'warning',
        message: 'Page title changed between versions.',
        consequence: getConsequence('SEO', 'Title Tag', true, titleDiff.evidenceA, titleDiff.evidenceB),
        fix: getFix('SEO', 'Title Tag', titleDiff.evidenceA, titleDiff.evidenceB),
        evidenceA: titleDiff.evidenceA,
        evidenceB: titleDiff.evidenceB,
      });
    }
  }

  // 8. Metadata: Description
  {
    const descDiff = compareStrings('Meta Description', snapshotA.description, snapshotB.description);
    if (descDiff.changed) {
      findings.push({
        id: 'description',
        category: 'SEO',
        label: 'Meta Description',
        severity: 'warning',
        message: 'Meta description changed between versions.',
        consequence: getConsequence('SEO', 'Meta Description', true, descDiff.evidenceA, descDiff.evidenceB),
        fix: getFix('SEO', 'Meta Description', descDiff.evidenceA, descDiff.evidenceB),
        evidenceA: descDiff.evidenceA,
        evidenceB: descDiff.evidenceB,
      });
    }
  }

  // 9. Social: Open Graph
  {
    const ogFields = ['ogTitle', 'ogDescription', 'ogImage', 'ogType'] as const;
    let ogChanged = false;
    const ogEvidences: Record<string, { changed: boolean; evidenceA: string; evidenceB: string }> = {};
    for (const field of ogFields) {
      const diff = compareStrings(field, snapshotA[field], snapshotB[field]);
      ogEvidences[field] = diff;
      if (diff.changed) ogChanged = true;
    }
    if (ogChanged) {
      const hasImageChange = ogEvidences.ogImage.changed;
      findings.push({
        id: 'open-graph',
        category: 'Social',
        label: 'Open Graph',
        severity: hasImageChange ? 'blocker' : 'warning',
        message: 'Open Graph tags changed — social previews will show different content.',
        consequence: getConsequence('Social', 'Open Graph', true, JSON.stringify(ogEvidences), ''),
        fix: getFix('Social', 'Open Graph', '', ''),
        evidenceA: JSON.stringify({ title: ogEvidences.ogTitle.evidenceA, desc: ogEvidences.ogDescription.evidenceA, image: ogEvidences.ogImage.evidenceA, type: ogEvidences.ogType.evidenceA }),
        evidenceB: JSON.stringify({ title: ogEvidences.ogTitle.evidenceB, desc: ogEvidences.ogDescription.evidenceB, image: ogEvidences.ogImage.evidenceB, type: ogEvidences.ogType.evidenceB }),
      });
    }
  }

  // 10. Social: Twitter Cards
  {
    const twitterFields = ['twitterCard', 'twitterTitle', 'twitterDescription', 'twitterImage'] as const;
    let twitterChanged = false;
    for (const field of twitterFields) {
      if (compareStrings(field, snapshotA[field], snapshotB[field]).changed) twitterChanged = true;
    }
    if (twitterChanged) {
      findings.push({
        id: 'twitter-cards',
        category: 'Social',
        label: 'Twitter Cards',
        severity: 'warning',
        message: 'Twitter Card tags changed — X (Twitter) previews will differ.',
        consequence: getConsequence('Social', 'Twitter Cards', true, '', ''),
        fix: getFix('Social', 'Twitter Cards', '', ''),
      });
    }
  }

  // 11. Social: OG Image Accessibility (dimensions, format, size)
  {
    const ogImageDiff = compareStrings('OG Image', snapshotA.ogImage, snapshotB.ogImage);
    if (ogImageDiff.changed) {
      findings.push({
        id: 'og-image-accessibility',
        category: 'Social',
        label: 'OG Image Accessibility',
        severity: 'blocker',
        message: 'OG image URL changed — new image may be inaccessible, wrong format, or wrong dimensions.',
        consequence: getConsequence('Social', 'OG Image Accessibility', true, ogImageDiff.evidenceA, ogImageDiff.evidenceB),
        fix: getFix('Social', 'OG Image Accessibility', ogImageDiff.evidenceA, ogImageDiff.evidenceB),
        evidenceA: ogImageDiff.evidenceA,
        evidenceB: ogImageDiff.evidenceB,
      });
    }
  }

  // 12. Structured Data (JSON-LD)
  {
    const sdDiff = compareBoolean('Structured Data', snapshotA.hasStructuredData, snapshotB.hasStructuredData);
    const typeDiff = compareStrings('JSON-LD Types', snapshotA.structuredDataTypes?.join(','), snapshotB.structuredDataTypes?.join(','));
    if (sdDiff.changed || typeDiff.changed) {
      findings.push({
        id: 'structured-data',
        category: 'Machine Readability',
        label: 'Structured Data',
        severity: 'blocker',
        message: sdDiff.changed
          ? (snapshotB.hasStructuredData ? 'JSON-LD added' : 'JSON-LD removed')
          : 'JSON-LD types changed',
        consequence: getConsequence('Machine Readability', 'Structured Data', true, typeDiff.evidenceA, typeDiff.evidenceB),
        fix: getFix('Machine Readability', 'Structured Data', typeDiff.evidenceA, typeDiff.evidenceB),
        evidenceA: typeDiff.evidenceA,
        evidenceB: typeDiff.evidenceB,
      });
    }
  }

  // 13. Hreflang
  {
    const hreflangDiff = compareBoolean('Hreflang', snapshotA.hasHreflang, snapshotB.hasHreflang);
    if (hreflangDiff.changed) {
      findings.push({
        id: 'hreflang',
        category: 'Machine Readability',
        label: 'Hreflang',
        severity: 'blocker',
        message: snapshotB.hasHreflang ? 'Hreflang annotations added' : 'Hreflang annotations removed',
        consequence: getConsequence('Machine Readability', 'Hreflang', true, hreflangDiff.evidenceA, hreflangDiff.evidenceB),
        fix: getFix('Machine Readability', 'Hreflang', hreflangDiff.evidenceA, hreflangDiff.evidenceB),
        evidenceA: hreflangDiff.evidenceA,
        evidenceB: hreflangDiff.evidenceB,
      });
    }
  }

  // 14. Robots.txt (would need separate fetch - skipped in v1)

  // 15. Content Signals: H1, headings, word count
  {
    const h1Diff = compareNumbers('H1 Count', snapshotA.h1Count, snapshotB.h1Count);
    const h2Diff = compareNumbers('H2 Count', snapshotA.h2Count, snapshotB.h2Count);
    const wordDiff = compareNumbers('Word Count', snapshotA.wordCount, snapshotB.wordCount);
    if (h1Diff.changed || h2Diff.changed || wordDiff.changed) {
      findings.push({
        id: 'content-signals',
        category: 'SEO',
        label: 'Content Signals',
        severity: h1Diff.changed ? 'warning' : 'info',
        message: 'Page content structure changed (headings, word count).',
        consequence: getConsequence('SEO', 'Content Signals', true, `H1: ${h1Diff.evidenceA}, H2: ${h2Diff.evidenceA}, Words: ${wordDiff.evidenceA}`, `H1: ${h1Diff.evidenceB}, H2: ${h2Diff.evidenceB}, Words: ${wordDiff.evidenceB}`),
        fix: getFix('SEO', 'Content Signals', '', ''),
        evidenceA: `H1: ${h1Diff.evidenceA}, H2: ${h2Diff.evidenceA}, Words: ${wordDiff.evidenceA}`,
        evidenceB: `H1: ${h1Diff.evidenceB}, H2: ${h2Diff.evidenceB}, Words: ${wordDiff.evidenceB}`,
      });
    }
  }

  // Sort findings: blockers first, then by category order
  findings.sort((a, b) => {
    const severityOrder = { blocker: 0, warning: 1, info: 2 };
    const sevDiff = severityOrder[a.severity] - severityOrder[b.severity];
    if (sevDiff !== 0) return sevDiff;
    return CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category);
  });

  const summary = {
    blockers: findings.filter(f => f.severity === 'blocker').length,
    warnings: findings.filter(f => f.severity === 'warning').length,
    info: findings.filter(f => f.severity === 'info').length,
  };

  return {
    urlA: snapshotA.url,
    urlB: snapshotB.url,
    timestamp: new Date().toISOString(),
    findings,
    summary,
  };
}

export function reportToMarkdown(report: ReleaseDiffReport): string {
  const lines: string[] = [
    `# SerpCraft Release Guard — Diff Report`,
    ``,
    `**URL A (Baseline):** ${report.urlA}`,
    `**URL B (New):** ${report.urlB}`,
    `**Generated:** ${new Date(report.timestamp).toLocaleString()}`,
    ``,
    `## Summary`,
    ``,
    `- 🔴 **Release Blockers:** ${report.summary.blockers}`,
    `- 🟡 **Warnings:** ${report.summary.warnings}`,
    `- 🟢 **Informational:** ${report.summary.info}`,
    ``,
    `---`,
    ``,
  ];

  const grouped = report.findings.reduce((acc, f) => {
    if (!acc[f.severity]) acc[f.severity] = [];
    acc[f.severity].push(f);
    return acc;
  }, {} as Record<DiffSeverity, DiffFinding[]>);

  for (const severity of ['blocker', 'warning', 'info'] as DiffSeverity[]) {
    const items = grouped[severity] || [];
    if (items.length === 0) continue;

    const icons = { blocker: '🔴', warning: '🟡', info: '🟢' };
    const titles = { blocker: 'Release Blockers', warning: 'Warnings', info: 'Informational' };

    lines.push(`## ${icons[severity]} ${titles[severity]}`);
    lines.push('');

    for (const finding of items) {
      lines.push(`### ${finding.label} [${finding.category}]`);
      lines.push('');
      lines.push(`**Finding:** ${finding.message}`);
      lines.push('');
      lines.push(`**Consequence:** ${finding.consequence}`);
      lines.push('');
      lines.push(`**Fix:** ${finding.fix}`);
      lines.push('');
      if (finding.evidenceA || finding.evidenceB) {
        lines.push(`**Evidence:**`);
        lines.push('');
        lines.push(`| | Version A (Baseline) | Version B (New) |`);
        lines.push(`|---|---|---|`);
        lines.push(`| Value | \`${finding.evidenceA?.replace(/`/g, '\\`') || '(missing)'}\` | \`${finding.evidenceB?.replace(/`/g, '\\`') || '(missing)'}\` |`);
        lines.push('');
      }
      lines.push(`---`);
      lines.push('');
    }
  }

  lines.push(`*Report generated by [SerpCraft Release Guard](https://serpcraft.app) — Compare URLs, catch regressions, ship with confidence.*`);

  return lines.join('\n');
}
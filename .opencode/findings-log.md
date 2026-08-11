# SerpCraft Manus Strategy Execution — Findings Log

**Started:** 2025-08-11  
**Strategy:** Manus AI Single-Opportunity Strategy → SerpCraft Release Guard  
**Core Pivot:** SEO Meta Tag Studio → SEO Release & Migration Guard

---

## Phase 0: Opportunity Validation (Current)

### Objective
Validate the core hypothesis before building: **Do real users with real staging/prod pairs find value in a two-URL SEO diff tool?**

### Success Criteria (Manus Gates)
- [ ] Recruit 5 testers with real staging/production URL pairs
- [ ] At least 3 complete a comparison and say "caught something I'd have missed"
- [ ] At least 2 agree to run it on their next release

### Validation Steps
1. Add `/pricing.md` (AI SEO hygiene)
2. Update `robots.txt` to allow AI bots (GPTBot, PerplexityBot, ClaudeBot, Google-Extended, Bingbot)
3. Build `/beta` recruitment page
4. Recruit via: r/TechSEO, Indie Hackers, Twitter, direct DMs to agency founders
5. Collect staging/prod URL pairs from 5 committed testers

### Current Status
- [x] `/pricing.md` created
- [x] `robots.txt` updated
- [x] `/beta` page built (`src/pages/beta.astro` + `src/components/BetaPage.tsx`)
- [x] `/api/beta-signup` function created (`functions/api/beta-signup.ts`)
- [ ] 5 testers recruited with URL pairs
- [ ] Validation complete → proceed to Phase 1

---

## Phase 1: Core Diff Engine (Release Guard MVP)

### Objective
Ship minimum credible two-URL comparison tool at `/release-diff`

### Components
- [ ] `/release-diff` page (Astro + React island): two URL inputs → 3-section report
- [ ] `functions/api/release-diff.ts`: Cloudflare Function fetching both URLs, diffing 12 checks
- [ ] `src/lib/releaseDiff.ts`: Shared diff engine (reuses `validator.ts`, `htmlExtract.ts`)
- [ ] Report UI: Blockers / Warnings / Info with evidence, consequence, fix
- [ ] Export: Download Markdown report

### 12 Critical Checks
1. HTTP status & redirect chain
2. Indexability (noindex, robots directives, X-Robots-Tag)
3. Canonical changes
4. URL parity (1:1 mapping)
5. Sitemap consistency
6. Initial HTML vs rendered DOM (v1: initial HTML only)
7. Metadata (title, description, pixel-width)
8. Social assets (OG/X images - dimensions, format, accessibility)
9. Structured data (JSON-LD presence & material changes)
10. Hreflang annotations
11. Robots.txt rules
12. Content signals (H1, headings, visible text)

### Success Criteria
- [ ] All 5 testers complete a comparison
- [ ] ≥3 say "caught something I'd have missed"
- [ ] False positive rate <10% on known-bad fixtures

---

## Phase 2: Generator Consolidation (Scaled Content Risk Mitigation)

### Objective
Reduce 15 tool pages → ~10 while keeping all utilities

### Actions
- [ ] Merge 3 social generators → `/tools/social-meta` (tabbed: meta tags, OG, Twitter)
- [ ] Merge JSON-LD generator + validator → `/tools/json-ld`
- [ ] Keep distinct: robots.txt, hreflang, schema markup, AI readiness, OG checker, llms.txt
- [ ] Add "differentiator content" to each: real example, when to use, common mistakes

### Success Criteria
- [ ] Page count: 106 → ≤70
- [ ] Each tool page has distinct workflow + evidence of utility
- [ ] No thin/near-duplicate pages per Google's scaled content abuse policy

---

## Phase 3: Repeat-Use Loop

### Objective
Create recurring usage habit

### Features
- [ ] Saved baselines (IndexedDB, 10 free)
- [ ] Regression mode (compare against saved baseline)
- [ ] Email/webhook notifications on blockers
- [ ] GitHub Action: `serpcraft/release-diff-action`

### Success Criteria (Manus Gates)
- [ ] ≥3 testers use baselines
- [ ] ≥2 request CI integration
- [ ] ≥3 agree to run on next release

---

## Phase 4: Monetization

### Objective
Validate willingness to pay

### Actions
- [ ] Pro tier: $29/mo (100 URLs, unlimited baselines, scheduling, API)
- [ ] Team tier: $79/mo (3 seats, shared workspaces)
- [ ] Stripe Payment Links (no subscription code until 10 paid)

### Success Criteria (Manus Gate)
- [ ] ≥3 accept paid pilot at $29/mo

---

## SEO Excellence Tracker (Continuous)

### Technical SEO
- [ ] All pages: unique titles ≤580px, descriptions ≤155 chars (validated by `check-meta.mjs`)
- [ ] Localized metadata: 80 pairs (16 paths × 5 locales) validated ≤580px/170 chars
- [ ] Sitemap: `@astrojs/sitemap` with i18n config → sitemap-index.xml + sitemap-0.xml with hreflang
- [ ] 404 page: noindex
- [ ] Staging: noindex via `_headers`
- [ ] llms.txt: updated with Release Guard
- [ ] pricing.md: exists for AI agents
- [ ] robots.txt: allows all AI bots

### Content Quality (Google Helpful Content)
- [ ] Each page: clear workflow, not keyword-targeted
- [ ] Problem guides: 5 real guides cross-linked from tools
- [ ] Companion content: FAQs, methodology, limitations per page
- [ ] Author bylines + last-updated dates
- [ ] No mass-generated near-duplicate pages

### AI SEO (GEO)
- [ ] FAQPage schema on problem guides
- [ ] Answer-first structure
- [ ] Statistics with sources
- [ ] Comparison tables for "X vs Y" queries
- [ ] llms.txt + pricing.md + okf/ (optional)

---

## Technical Architecture Decisions

### Stack (Existing → Target)
| Layer | Current | Target |
|-------|---------|--------|
| Frontend | Astro 5 + React Islands | Same + `/release-diff` island |
| Hosting | Cloudflare Pages | Same |
| Functions | `/api/audit`, `/api/og-image` | Add `/api/release-diff` |
| Diff Engine | None | `src/lib/releaseDiff.ts` (shared browser/server) |
| Storage | localStorage | localStorage + IndexedDB (baselines) |
| Rate Limit | `AUDIT_KV` guard (10/hr/IP) | Reuse for release-diff |
| SSRF Protection | `isPrivateHost`, `looksSuspiciousUrl` | Reuse from `guard.ts` |

### Code Reuse Strategy
- `validator.ts` → refactor to `releaseDiff.ts` + `checks.ts` (diff logic, not scoring)
- `htmlExtract.ts` → reuse for paste-HTML mode in Release Diff
- `guard.ts` → import in new Function (CORS, rate limit, SSRF, KV cache)
- `pixelWidth.ts` → reuse for metadata truncation preview

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Can't recruit 5 testers | Medium | Blocks Phase 1 | Extend recruitment; use personal network; offer free lifetime Pro |
| False positives destroy trust | Medium | Critical | Test against 50 broken fixtures; target <5% FP rate |
| Staging URLs behind auth/firewall | High | Medium | Document limitation; support paste-HTML mode; add guide |
| Google helpful-content demotes tool pages | High | High | Consolidate 15→10; hero = Release Diff; add differentiator content |
| Competitor copies feature | High | Medium | Moat = workflow + explanation quality + report format + historical baselines |
| AdSense rejection / low revenue | Medium | Low | Don't depend on AdSense; paid tiers = primary revenue |

---

## Iteration Log

### Iteration 0 (2025-08-11)
- Initialized Ralph Loop
- Created findings log
- Current phase: Phase 0 (Opportunity Validation)
- Next action: Create `/pricing.md` and update `robots.txt`

### Iteration 1 (2025-08-11)
- Created `/pricing.md` with Free/Pro/Team/Enterprise tiers
- Updated `robots.txt` to explicitly allow AI crawlers (GPTBot, PerplexityBot, ClaudeBot, Google-Extended, Bingbot)
- Built `/beta` recruitment page (`src/pages/beta.astro`)
- Created `BetaPage.tsx` component with 3-step form (profile → URLs → submit)
- Created `functions/api/beta-signup.ts` Cloudflare Pages Function with KV deduplication and rate limiting
- **Build passes (107 pages), meta validation passes (ALL PASS)**
- **Pushed to GitHub (fc5308d)**
- Next: User needs to recruit 5 testers via outreach

### Iteration 2 (2025-08-11) - Pre-building Phase 1 Components
- Created `src/lib/releaseDiff.ts` — shared diff engine comparing two AuditSnapshots
- Implements 12+ critical checks: HTTP status, redirect chain, indexability, canonical, URL parity, metadata, Open Graph, Twitter Cards, OG image, JSON-LD, hreflang, content signals
- Evidence-first findings with severity (blocker/warning/info), consequence, fix, and before/after evidence
- Markdown export function for shareable reports
- **Build passes, TypeScript passes, meta validation passes**
- Still blocked on 5 testers for Phase 0 validation gate

### Iteration 3-4 (2025-08-11) - Phase 1 Complete (Function + UI)
- Created `functions/api/release-diff.ts` — Cloudflare Pages Function with parallel fetch, SSRF guard, KV rate limiting (10/hr/IP), 24h caching
- Created `src/pages/release-diff.astro` + `src/components/ReleaseDiffPage.tsx` — two URL inputs, 3-section report UI (Blockers/Warnings/Info), expandable evidence tables, Markdown download
- **Build: 108 pages (new /release-diff route), TypeScript passes, meta validation ALL PASS**
- **Pushed to GitHub**

---

## Phase 1: Core Diff Engine (Release Guard MVP) - COMPLETE

---

## Questions for User (Blockers)

1. **Recruitment help needed?** Draft `/beta` page copy + outreach templates for r/TechSEO, Indie Hackers, Twitter?
2. **Phase 1 scope confirmed?** Initial HTML only (no headless browser), 12 checks, 3-section report, Markdown export
3. **Generator consolidation?** Merge only 3 social generators (meta/OG/Twitter) → keep other 12 as-is with added depth
4. **Design changes?** Use existing Tailwind components for report UI, or design pass first?

---

*Update this file at each iteration. Never re-read codebase for context — use this log.*
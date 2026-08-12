# SerpCraft — Agent Guide

## Project Overview

SerpCraft is a free, browser-based SEO meta tag studio. It combines meta tag generation, Open Graph/Twitter Card preview, JSON-LD structured data building, pixel-accurate SERP preview, robots.txt generation, and an AI-search readiness suite (AI Readiness Checker, llms.txt generator, hreflang generator, OG image checker, JSON-LD validator) into a single tool. No signup — user data stays in the browser via `localStorage`; the only server-side code is a small Cloudflare Pages Function layer for server-side URL/image checks.

---

## Tech Stack

- **Framework:** Astro 5 + React 18 (`@astrojs/react`) + TypeScript 5
- **Build tool:** Astro (`astro build`) with Vite & Rolldown
- **Styling:** Tailwind CSS 3 via `@astrojs/tailwind` (with `darkMode: 'class'`)
- **Icons:** `lucide-react`
- **Backend:** Cloudflare Pages (project `seo`) + Pages Functions (`functions/`) with a KV namespace (`AUDIT_KV`) for rate limiting & caching. Supabase was provisioned earlier but is unused.
- **Architecture:** Static Site Generation (SSG) with React Islands (`client:load` / `client:idle`)
- **Routing:** Astro file-based multi-page routing (`src/pages/`) with locale prefix support (`/es/...`, `/fr/...`, etc.)

---

## Project Structure

```
src/
├── layouts/
│   └── Layout.astro           # Base Astro layout (SEO head with localized meta + JSON-LD, noindex prop, FOUC-free dark mode script, Header & Footer)
├── pages/
│   ├── index.astro            # Marketing landing page (/)
│   ├── studio.astro           # Main studio tool page (/studio)
│   ├── [tool].astro           # Dynamic static route for tools (/meta-tag-generator, /open-graph-generator, etc.)
│   ├── problems/              # SEO problem guides (/problems/wrong-meta-description, etc.) — crawlable, linked from tool pages
│   ├── about.astro            # About page (/about) — EN-only (no locale variants)
│   ├── privacy.astro          # Privacy Policy (/privacy) — EN-only
│   ├── terms.astro            # Terms of Service (/terms) — EN-only
│   ├── 404.astro              # 404 Error page (noindex)
│   └── [locale]/              # i18n locale-prefixed routes (/es/studio, /fr/meta-tag-generator, etc.) — home + 15 tools only
│       ├── index.astro
│       ├── studio.astro
│       └── [tool].astro
├── components/
│   ├── Header.tsx             # Sticky nav with tools dropdown, theme toggle, language switcher
│   ├── Footer.tsx             # Link footer with tool links and legal pages (trust links always EN)
│   ├── LandingPage.tsx        # Marketing homepage with hero, features, tools, FAQ, CTA
│   ├── StudioPage.tsx         # Main studio — orchestrates editor, previews, output, companion content, problems chips
│   ├── SmartLink.tsx          # Real <a href> anchor helper for crawlable internal links (replaces navigateTo)
│   ├── StudioEditor.tsx       # Form inputs for meta tags (title, description, OG, Twitter, etc.)
│   ├── JsonLdForm.tsx         # Schema type selector + dynamic fields for JSON-LD
│   ├── RobotsTxtGenerator.tsx # Robots.txt rule editor
│   ├── AuditTool.tsx          # AI Readiness Checker UI (URL mode + paste-HTML mode) — lazy-loaded
│   ├── SeoCheckPage.tsx       # SEO Check tool page (21-point audit UI) — lazy-loaded
│   ├── LlmsTxtGenerator.tsx   # llms.txt file generator (AI crawler discovery) — lazy-loaded
│   ├── HreflangGenerator.tsx  # hreflang alternate-link generator with locale validation — lazy-loaded
│   ├── OgImageChecker.tsx     # OG image checker (server-side dimension/format verification) — lazy-loaded
│   ├── JsonLdValidator.tsx    # JSON-LD paste-and-validate tool — lazy-loaded
│   ├── ProblemGuide.tsx       # Individual problem guide page component
│   ├── Previews.tsx           # Social + SERP preview panels (Google, Facebook, X, LinkedIn, Slack, Discord)
│   ├── CodeOutput.tsx         # Generated HTML/JSON output with copy-to-clipboard
│   ├── SaveLoadPanel.tsx      # Save/load page setups + brand profile (localStorage)
│   ├── CompanionContent.tsx   # SEO content sections per tool page (FAQs, guides, trust signals)
│   ├── TrustPages.tsx         # About, Privacy, Terms pages
│   ├── ErrorPages.tsx         # 404 and 500 error pages
│   ├── ThemeToggle.tsx        # Dark/light mode toggle button
│   ├── LanguageSwitcher.tsx   # i18n locale dropdown (uses navigateToLocale)
│   └── NavigationBot.tsx      # Global deterministic chatbot guide (AEO/GEO/SEO)
├── data/
│   ├── pages.ts               # EN page metadata (title, description, keywords, h1) + nav tool definitions
│   ├── pageMetaLocalized.ts   # Localized title/description pairs (16 paths × es/fr/de/pt/ja = 80 pairs; EN falls back to pages.ts)
│   ├── content.ts             # Companion content (FAQs, guides) per tool page
│   ├── problems.ts            # Problem guide definitions (slug, path, relatedTools)
│   └── schemaDefinitions.ts   # JSON-LD schema type field definitions
├── lib/
│   ├── router.ts              # Locale-aware navigation helpers (navigateToLocale; navigateTo largely removed — use SmartLink/<a href>)
│   ├── i18n.ts                # Locale types, locale list, path extraction/translation helpers
│   ├── translations.ts        # UI string translations for 6 locales (en, es, fr, de, pt, ja)
│   ├── useTheme.ts            # Dark/light theme hook with localStorage persistence
│   ├── useCopyToClipboard.ts  # Copy-to-clipboard hook
│   ├── generators.ts          # Output generators (meta tags HTML, JSON-LD, robots.txt)
│   ├── pixelWidth.ts          # Pixel-width measurement with SSR safety for SERP truncation
│   ├── storage.ts             # localStorage helpers for brand profile and page setups
│   ├── validator.ts           # Shared audit engine: checks, scoring, field validators (browser + server)
│   └── htmlExtract.ts         # Client-side HTML snapshot extraction (paste-HTML mode)
├── index.css                  # Tailwind layers + component classes & color tokens (light/dark)
└── ...
scripts/
└── check-meta.mjs             # Validates EN + localized title/desc length limits (node scripts/check-meta.mjs)
functions/                     # Cloudflare Pages Functions (server-side checks)
├── _shared/
│   └── guard.ts               # CORS, JSON helpers, SSRF guard, KV rate limit + cache helpers
└── api/
    ├── audit.ts               # POST /api/audit — URL AI-readiness audit (fetch + extract + score)
    ├── ai-consultant.ts       # POST /api/ai-consultant — Semantic SEO advice via Nvidia NIM
    └── og-image.ts            # POST /api/og-image — OG image header parsing (dims, format, size)
```

---

## Key Architectural Decisions

### Multi-Page Astro Architecture & Routing
- Astro file-based static site generation (`SSG`).
- 106 static HTML pages pre-rendered at build time.
- Internal navigation uses real `<a href>` anchors (`SmartLink.tsx` helper) so links are crawlable — do NOT introduce SPA-style `navigateTo` navigation for internal links.
- `navigateToLocale(locale)` in `src/lib/router.ts` handles locale-switch navigation (used by `LanguageSwitcher.tsx`).

### Internationalization (i18n)
- URL path-based: `/es/studio`, `/fr/studio`, etc. English (`en`) is the default and has no prefix (backward compatible).
- Supported locales: English, Spanish, French, German, Portuguese, Japanese.
- **Scope:** only home + 15 tools have locale variants (`[locale]/index.astro`, `[locale]/studio.astro`, `[locale]/[tool].astro`). Trust pages (`/about`, `/privacy`, `/terms`) and `/problems/*` guides are EN-only — do not localize their links (Footer/Header use `trustHref` to keep them EN).
- UI strings in `src/lib/translations.ts`; localized metadata (title/description) in `src/data/pageMetaLocalized.ts`.
- `extractLocale(path)` strips the locale prefix and returns the clean path; `withLocale(locale, path)` prepends a locale prefix (omits it for `en`).

### Dark Mode
- Tailwind `darkMode: 'class'` strategy. The `dark` class is toggled on `<html>`.
- Inline script in `Layout.astro` reads `localStorage` before render to eliminate FOUC (Flash of Unstyled Content).
- `useTheme()` hook manages React component state with `localStorage` persistence.

### SEO & Pre-rendering
- Server-rendered HTML `<head>` tags in `Layout.astro` populated per route from `src/data/pages.ts` (EN) with localized title/description overrides from `src/data/pageMetaLocalized.ts` when a locale path exists.
- Pre-rendered Open Graph meta tags, Twitter Cards, canonical links, and JSON-LD structured data.
- JSON-LD: `WebApplication` schema on all pages; `Organization` + `WebSite` (with `@id` anchors) on the homepage only. FAQPage schema intentionally skipped (Google deprecated FAQ rich results May 2026).
- Companion content (`CompanionContent.tsx`) provides FAQs, guides, and trust signals per tool page. `/problems/*` guides are cross-linked from tool pages (crawlable inbound links).
- Google SERP preview utilizes canvas pixel-width truncation with SSR fallback (`src/lib/pixelWidth.ts`).
- `404.astro` is `noindex`; `public/_headers` noindexes the staging project; `public/llms.txt` lists tools for AI crawler discovery.
- Sitemap: `@astrojs/sitemap` with `i18n` config (defaultLocale `en` + 5 alternates) emits `sitemap-index.xml` → `sitemap-0.xml` with hreflang alternates for the 16 localized paths. There is intentionally NO `/sitemap.xml` or `/robots.txt` page route — they are static files in `public/` (sitemap only, generated at build).
- Meta length validation: `node scripts/check-meta.mjs` (EN titles ≤580px, descriptions ≤155ch; localized ≤580px/170ch).
- **Code splitting:** heavy tool UIs (`AuditTool`, `SeoCheckPage`, `LlmsTxtGenerator`, `HreflangGenerator`, `OgImageChecker`, `JsonLdValidator`) are `React.lazy()`-loaded inside `<Suspense fallback={<ToolFallback />}>` in `StudioPage.tsx` — keep them lazy when editing.

### Data Persistence
- Client-side interactive states (page setups, brand profiles) persist in browser `localStorage` via `src/lib/storage.ts`.
- No server-side storage required.

### Cloudflare Pages Functions (server-side checks)
- Endpoints, all `POST`, all CORS-enabled with JSON responses:
  - `POST /api/audit` — Live SEO Evidence Report: fetches the page, extracts a normalized snapshot, runs `buildChecks`/`calculateScores` (from `src/lib/validator.ts`).
  - `POST /api/release-diff` — SEO Release Diff Checker: compares two URLs and returns a semantic difference report.
  - `POST /api/ai-consultant` — AI Semantic SEO Consultant via Nvidia NIM.
  - `POST /api/og-image` — OG Image Checker: fetches an image and parses its header bytes (PNG/JPEG/WebP/GIF/BMP/SVG) for dimensions/format/size.
- All shared security/helpers live in `functions/_shared/guard.ts` (CORS, `json`, `isPrivateHost` SSRF guard, `looksSuspiciousUrl` scheme guard, `checkRateLimit`, KV cache helpers, `sha1`). Do not duplicate these in a new function — import from `../_shared/guard`.
- SSRF guard blocks private/link-local/CGNAT/metadata hostnames and non-http(s) schemes. Never remove it from a function that fetches URLs.
- Rate limits via KV; cache results 24h in KV (`AUDIT_KV` binding, placeholder id in `wrangler.toml`).
- Pages Functions bundle relative imports with esbuild; importing `src/lib/validator.ts` from `functions/` works and is intentional (single source of truth for scoring).

### Deploy (Cloudflare Pages)
- `npm run build` then `npx wrangler pages deploy dist --project-name=seo` (staging: `seo-84e.pages.dev`, noindexed via `public/_headers`; custom domain `metaforge.app`).
- `wrangler.toml` sets `pages_build_output_dir = "dist"` and the `AUDIT_KV` KV binding. Before deploying a function that uses KV, create the namespace: `npx wrangler pages kv namespace create AUDIT_KV` and paste the returned id into `wrangler.toml`.
- Local function testing: `npx wrangler pages dev dist`.

---

## Build & Development Commands

```bash
npm run dev        # Start Astro development server (astro dev)
npm run build      # Build static HTML production site to dist/ (astro build)
npm run preview    # Preview built static production site (astro preview)
npm run typecheck  # TypeScript type checking (tsc --noEmit)
npm run lint       # ESLint
node scripts/check-meta.mjs  # Validate EN + localized title/desc lengths
```

### Deploy

```bash
npm run build && npx wrangler pages deploy dist --project-name=seo
```

## Path Alias

`@/` maps to `src/`. Use `@/components/Foo` instead of `../../components/Foo`.

---

## Coding Conventions

- **Components:** PascalCase named exports. Use `import type` when importing types in TS/TSX files.
- **Hooks:** `use` prefix, camelCase (`useTheme`).
- **Types:** Interfaces for object shapes, type aliases for unions.
- **CSS:** Tailwind utility classes in JSX/Astro. Custom component classes (`btn-primary`, `card`, `field-input`) defined in `src/index.css` under `@layer components`. Always include `dark:` variants.
- **Icons:** Import from `lucide-react`. Note: `Code2` is the export name for code icon.
- **Color system:** `sand` (neutral base), `choco` (primary/brown), `pastel` (secondary/blue), plus semantic colors (`success`, `warning`, `error`) and `ink` (text). All have `dark:` variants.

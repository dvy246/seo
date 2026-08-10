# MetaForge — Agent Guide

## Project Overview

MetaForge is a free, browser-based SEO meta tag studio. It combines meta tag generation, Open Graph/Twitter Card preview, JSON-LD structured data building, pixel-accurate SERP preview, robots.txt generation, and an AI-search readiness suite (AI Readiness Checker, llms.txt generator, hreflang generator, OG image checker, JSON-LD validator) into a single tool. No signup — user data stays in the browser via `localStorage`; the only server-side code is a small Cloudflare Pages Function layer for server-side URL/image checks.

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
│   └── Layout.astro           # Base Astro layout (injects pre-rendered SEO head, FOUC-free dark mode script, Header & Footer)
├── pages/
│   ├── index.astro            # Marketing landing page (/)
│   ├── studio.astro           # Main studio tool page (/studio)
│   ├── [tool].astro           # Dynamic static route for tools (/meta-tag-generator, /open-graph-generator, etc.)
│   ├── about.astro            # About page (/about)
│   ├── privacy.astro          # Privacy Policy (/privacy)
│   ├── terms.astro            # Terms of Service (/terms)
│   ├── 404.astro              # 404 Error page
│   └── [locale]/              # i18n locale-prefixed routes (/es/studio, /fr/meta-tag-generator, etc.)
│       ├── index.astro
│       ├── studio.astro
│       └── [tool].astro
├── components/
│   ├── Header.tsx             # Sticky nav with tools dropdown, theme toggle, language switcher
│   ├── Footer.tsx             # Link footer with tool links and legal pages
│   ├── LandingPage.tsx        # Marketing homepage with hero, features, tools, FAQ, CTA
│   ├── StudioPage.tsx         # Main studio — orchestrates editor, previews, output, companion content
│   ├── StudioEditor.tsx       # Form inputs for meta tags (title, description, OG, Twitter, etc.)
│   ├── JsonLdForm.tsx         # Schema type selector + dynamic fields for JSON-LD
│   ├── RobotsTxtGenerator.tsx # Robots.txt rule editor
│   ├── AuditTool.tsx          # AI Readiness Checker UI (URL mode + paste-HTML mode)
│   ├── LlmsTxtGenerator.tsx   # llms.txt file generator (AI crawler discovery)
│   ├── HreflangGenerator.tsx  # hreflang alternate-link generator with locale validation
│   ├── OgImageChecker.tsx     # OG image checker (server-side dimension/format verification)
│   ├── JsonLdValidator.tsx    # JSON-LD paste-and-validate tool
│   ├── Previews.tsx           # Social + SERP preview panels (Google, Facebook, X, LinkedIn, Slack, Discord)
│   ├── CodeOutput.tsx         # Generated HTML/JSON output with copy-to-clipboard
│   ├── SaveLoadPanel.tsx      # Save/load page setups + brand profile (localStorage)
│   ├── CompanionContent.tsx   # SEO content sections per tool page (FAQs, guides, trust signals)
│   ├── TrustPages.tsx         # About, Privacy, Terms pages
│   ├── ErrorPages.tsx         # 404 and 500 error pages
│   ├── ThemeToggle.tsx        # Dark/light mode toggle button
│   └── LanguageSwitcher.tsx   # i18n locale dropdown
├── data/
│   ├── pages.ts               # Page metadata (title, description, keywords) + nav tool definitions
│   ├── content.ts             # Companion content (FAQs, guides) per tool page
│   └── schemaDefinitions.ts   # JSON-LD schema type field definitions
├── lib/
│   ├── router.ts              # Locale-aware navigation helpers (navigateTo, navigateToLocale)
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
functions/                     # Cloudflare Pages Functions (server-side checks)
├── _shared/
│   └── guard.ts               # CORS, JSON helpers, SSRF guard, KV rate limit + cache helpers
└── api/
    ├── audit.ts               # POST /api/audit — URL AI-readiness audit (fetch + extract + score)
    └── og-image.ts            # POST /api/og-image — OG image header parsing (dims, format, size)
```

---

## Key Architectural Decisions

### Multi-Page Astro Architecture & Routing
- Astro file-based static site generation (`SSG`).
- 64 static HTML pages pre-rendered at build time.
- `navigateTo(path)` and `navigateToLocale(locale)` in `src/lib/router.ts` handle clean multi-page navigation across locale prefixes.

### Internationalization (i18n)
- URL path-based: `/en/studio`, `/es/studio`, `/fr/studio`, etc.
- English (`en`) is the default and has no prefix (backward compatible).
- Supported locales: English, Spanish, French, German, Portuguese, Japanese.
- UI strings in `src/lib/translations.ts`.
- `extractLocale(path)` strips the locale prefix and returns the clean path.
- `withLocale(locale, path)` prepends a locale prefix (omits it for `en`).

### Dark Mode
- Tailwind `darkMode: 'class'` strategy. The `dark` class is toggled on `<html>`.
- Inline script in `Layout.astro` reads `localStorage` before render to eliminate FOUC (Flash of Unstyled Content).
- `useTheme()` hook manages React component state with `localStorage` persistence.

### SEO & Pre-rendering
- Server-rendered HTML `<head>` tags in `Layout.astro` populated per route from `src/data/pages.ts`.
- Pre-rendered Open Graph meta tags, Twitter Cards, canonical links, and JSON-LD structured data.
- Companion content (`CompanionContent.tsx`) provides FAQs, guides, and trust signals per tool page.
- Google SERP preview utilizes canvas pixel-width truncation with SSR fallback (`src/lib/pixelWidth.ts`).

### Data Persistence
- Client-side interactive states (page setups, brand profiles) persist in browser `localStorage` via `src/lib/storage.ts`.
- No server-side storage required.

### Cloudflare Pages Functions (server-side checks)
- Only two endpoints, both `POST`, both CORS-enabled with JSON responses:
  - `POST /api/audit` — AI Readiness Checker URL mode: fetches the page + `/llms.txt`, extracts a normalized snapshot, runs `buildChecks`/`calculateScores` (from `src/lib/validator.ts`).
  - `POST /api/og-image` — OG Image Checker: fetches an image and parses its header bytes (PNG/JPEG/WebP/GIF/BMP/SVG) for dimensions/format/size.
- All shared security/helpers live in `functions/_shared/guard.ts` (CORS, `json`, `isPrivateHost` SSRF guard, `looksSuspiciousUrl` scheme guard, `checkRateLimit`, KV cache helpers, `sha1`). Do not duplicate these in a new function — import from `../_shared/guard`.
- SSRF guard blocks private/link-local/CGNAT/metadata hostnames and non-http(s) schemes. Never remove it from a function that fetches URLs.
- Rate limits via KV (`audit`: 10/hr/IP, `og-image`: 30/hr/IP); both cache results 24h in KV (`AUDIT_KV` binding, placeholder id in `wrangler.toml`).
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

# MetaForge — Agent Guide

## Project Overview

MetaForge is a free, browser-based SEO meta tag studio. It combines meta tag generation, Open Graph/Twitter Card preview, JSON-LD structured data building, pixel-accurate SERP preview, and robots.txt generation into a single tool. No signup, no server-side data storage — all user data stays in the browser via localStorage.

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build tool:** Vite 5
- **Styling:** Tailwind CSS 3 (with `darkMode: 'class'`)
- **Icons:** lucide-react
- **Backend:** Supabase (provisioned but currently unused — app is fully client-side)
- **No router library** — custom hash-free pushState router in `src/lib/router.ts`

## Project Structure

```
src/
├── App.tsx                    # Root: routing, error boundary, layout shell
├── main.tsx                   # Vite entry point
├── index.css                  # Tailwind layers + component classes (light/dark)
├── types.ts                   # Core domain types (PageSetup, BrandProfile, etc.)
├── components/
│   ├── Header.tsx             # Sticky nav with tools dropdown, theme toggle, language switcher
│   ├── Footer.tsx             # Link footer with tool links and legal pages
│   ├── LandingPage.tsx        # Marketing homepage with hero, features, tools, FAQ, CTA
│   ├── StudioPage.tsx         # Main studio — orchestrates editor, previews, output, companion content
│   ├── StudioEditor.tsx       # Form inputs for meta tags (title, description, OG, Twitter, etc.)
│   ├── JsonLdForm.tsx         # Schema type selector + dynamic fields for JSON-LD
│   ├── RobotsTxtGenerator.tsx # Robots.txt rule editor
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
│   ├── router.ts              # Custom pushState router with locale-aware navigation
│   ├── i18n.ts                # Locale types, locale list, path extraction/translation helpers
│   ├── translations.ts        # UI string translations for 6 locales (en, es, fr, de, pt, ja)
│   ├── useTheme.ts            # Dark/light theme hook with localStorage persistence
│   ├── useDocumentHead.ts     # Dynamic document head management (title, meta, OG, JSON-LD, canonical)
│   ├── useCopyToClipboard.ts  # Copy-to-clipboard hook
│   ├── generators.ts          # Output generators (meta tags HTML, JSON-LD, robots.txt)
│   ├── pixelWidth.ts          # Pixel-width measurement for SERP title/description truncation
│   └── storage.ts             # localStorage helpers for brand profile and page setups
```

## Key Architectural Decisions

### Routing
- Custom pushState-based router (`src/lib/router.ts`). No React Router dependency.
- `useRouter()` hook returns `{ path, locale, navigate }` where `path` is always locale-stripped.
- `navigateTo(path)` and `navigateToLocale(locale)` are standalone functions for programmatic navigation.
- Locale prefixes are transparent to components — they receive paths without locale prefixes.

### Internationalization (i18n)
- URL path-based: `/en/studio`, `/es/studio`, `/fr/studio`, etc.
- English (`en`) is the default and has no prefix (backward compatible).
- Supported locales: English, Spanish, French, German, Portuguese, Japanese.
- UI strings in `src/lib/translations.ts`. SEO page metadata in `src/data/pages.ts` is currently English-only.
- `extractLocale(path)` strips the locale prefix and returns the clean path.
- `withLocale(locale, path)` prepends a locale prefix (omits it for `en`).

### Dark Mode
- Tailwind `darkMode: 'class'` strategy. The `dark` class is toggled on `<html>`.
- `useTheme()` hook manages state with localStorage persistence and `prefers-color-scheme` fallback.
- All component classes have `dark:` variants defined in `src/index.css`.

### SEO Architecture
- `useDocumentHead(path)` dynamically updates `<title>`, meta description, canonical, OG tags, Twitter Card tags, and JSON-LD schema on every route change.
- Each tool page has dedicated metadata in `src/data/pages.ts` for targeted SEO.
- Companion content (`CompanionContent.tsx`) provides FAQs, guides, and trust signals per page.
- JSON-LD includes `WebApplication` schema, `BreadcrumbList`, and `FAQPage` where applicable.
- SERP preview uses pixel-width truncation (not character count) for Google-accurate results.

### Data Persistence
- All user data (page setups, brand profiles) is stored in browser localStorage via `src/lib/storage.ts`.
- No server-side storage is used. Supabase is provisioned but not currently integrated.
- Theme preference and locale are also persisted in localStorage.

## Build & Development Commands

```bash
npm run dev        # Start dev server (Vite)
npm run build      # Production build
npm run preview    # Preview production build
npm run typecheck  # TypeScript type checking (no emit)
npm run lint       # ESLint
```

## Path Alias

`@/` maps to `src/`. Use `@/components/Foo` instead of `../../components/Foo`.

## Coding Conventions

- **Components:** PascalCase named exports (no default exports for components).
- **Hooks:** `use` prefix, camelCase (`useTheme`, `useDocumentHead`).
- **Types:** Interfaces for object shapes, type aliases for unions.
- **CSS:** Tailwind utility classes in JSX. Custom component classes (`btn-primary`, `card`, `field-input`, etc.) defined in `src/index.css` under `@layer components`. Always include `dark:` variants.
- **Icons:** Import from `lucide-react`. Note: `Code2` is the correct export name (not `Code`).
- **No comments** unless explaining a non-obvious constraint or workaround.
- **Color system:** `sand` (neutral base), `choco` (primary/brown), `pastel` (secondary/blue), plus semantic colors (`success`, `warning`, `error`) and `ink` (text). All have `dark:` variants.

## Error Handling

- `ErrorBoundary` class component in `App.tsx` catches render errors and shows the 500 page.
- Unknown routes render the `NotFoundPage` (404) component.
- Both error pages are styled to match the site and offer navigation back to functional pages.

## YMYL (Your Money Your Life) Considerations

- Content is informational/developer-tooling, not financial or health advice.
- Trust signals: About page, Privacy Policy, Terms of Service, no-data-collection messaging.
- All processing is client-side — no user data leaves the browser.
- FAQ sections provide authoritative, accurate SEO information per page.

## Known Limitations / Future Work

- Page metadata (`src/data/pages.ts`) and companion content (`src/data/content.ts`) are English-only. Translating these per locale would boost international SEO further.
- `hreflang` link tags are not yet injected by `useDocumentHead` for alternate locale versions.
- Supabase is provisioned but unused — could be added for saved accounts or cloud sync.
- No sitemap.xml generation yet (robots.txt generator exists but not a sitemap builder).

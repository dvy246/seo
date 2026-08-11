import { navTools } from '@/data/pages';
import { SmartLink } from '@/components/SmartLink';
import { useRouter } from '@/lib/router';
import { getTranslations } from '@/lib/translations';
import {
  ArrowRight, Check, Search, Share2, Code2, Eye, Braces, Tags, Twitter,
  Sparkles, Zap, Globe, Monitor, Smartphone, FileText, Radar, Languages, Image,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ size?: number | string; className?: string }>> = {
  Tags, Share2, Twitter, Braces, Eye, Search, Radar, FileText, Languages, Image,
  Code: Code2,
};

export function LandingPage() {
  const { locale } = useRouter();
  const t = getTranslations(locale);
  return (
    <div className="overflow-hidden">
      <Hero t={t} />
      <SocialProof />
      <FeatureGrid t={t} />
      <ToolShowcase t={t} />
      <HowItWorks t={t} />
      <SerpHighlight t={t} />
      <ComparisonSection t={t} />
      <FaqTeaser />
      <FinalCta t={t} />
    </div>
  );
}

// =================== HERO ===================
function Hero({ t }: { t: ReturnType<typeof getTranslations> }) {
  return (
    <section className="relative bg-gradient-to-b from-sand-100 via-sand-50 to-sand-50 dark:from-sand-900 dark:via-sand-950 dark:to-sand-950">
      {/* Decorative grid */}
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
      {/* Blue pastel blob */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-pastel-200/40 rounded-full blur-3xl pointer-events-none animate-float" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-choco-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: copy */}
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 chip bg-terra-50 text-terra-700 dark:bg-terra-900/30 dark:text-terra-300 mb-6">
              <Sparkles size={14} />
              {t.heroBadge}
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-ink dark:text-sand-50 leading-[1.1] tracking-tight text-balance">
              {t.heroTitlePrefix}{' '}
              <span className="text-terra-600 dark:text-terra-400">{t.heroTitleHighlight}</span>{t.heroTitleSuffix}
            </h1>
            <p className="mt-6 text-lg text-ink-soft dark:text-sand-300 leading-relaxed max-w-xl text-balance">
              {t.heroSubtitle}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <SmartLink
                to="/studio"
                className="btn-primary text-base px-6 py-3.5 group"
              >
                {t.openStudio}
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </SmartLink>
              <SmartLink
                to="/meta-tag-generator"
                className="btn-secondary text-base px-6 py-3.5"
              >
                {t.browseTools}
              </SmartLink>
            </div>

            <div className="mt-8 flex items-center gap-6 text-sm text-ink-muted">
              <span className="flex items-center gap-1.5"><Check size={16} className="text-pastel-500" /> {t.noSignup}</span>
              <span className="flex items-center gap-1.5"><Check size={16} className="text-pastel-500" /> {t.freeForever}</span>
              <span className="flex items-center gap-1.5"><Check size={16} className="text-pastel-500" /> {t.runsInBrowser}</span>
            </div>
          </div>

          {/* Right: visual mockup */}
          <div className="relative animate-fade-in">
            <HeroMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroMockup() {
  return (
    <div className="relative">
      {/* Main card — studio preview */}
      <div className="card p-5 shadow-lift rotate-[-1deg]">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-error/30" />
          <div className="w-3 h-3 rounded-full bg-warning/30" />
          <div className="w-3 h-3 rounded-full bg-success/30" />
          <span className="ml-2 text-xs text-ink-muted font-mono">serpcraft.app/studio</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Editor side */}
          <div className="space-y-2.5">
            <div>
              <div className="text-[10px] font-medium text-ink-muted mb-1">Title Tag</div>
              <div className="rounded-md border border-sand-200 bg-sand-50 px-2.5 py-1.5 text-xs text-ink truncate">
                Best Coffee Beans — Buy Online | Acme
              </div>
            </div>
            <div>
              <div className="text-[10px] font-medium text-ink-muted mb-1">Description</div>
              <div className="rounded-md border border-sand-200 bg-sand-50 px-2.5 py-1.5 text-xs text-ink-soft leading-relaxed">
                Premium single-origin coffee beans roasted to order. Free shipping over $35.
              </div>
            </div>
            <div>
              <div className="text-[10px] font-medium text-ink-muted mb-1">og:image</div>
              <div className="rounded-md border border-sand-200 bg-sand-50 px-2.5 py-1.5 text-xs text-ink-muted truncate">
                https://acme.com/og-coffee.png
              </div>
            </div>
          </div>

          {/* Preview side */}
          <div className="space-y-3">
            {/* Google snippet */}
            <div className="rounded-lg border border-sand-200 p-2.5 bg-white">
              <div className="text-[9px] text-ink-muted mb-1">Google</div>
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-4 h-4 rounded-full bg-sand-200 text-[8px] flex items-center justify-center text-ink-soft font-semibold">A</div>
                <span className="text-[10px] text-ink-soft">acme.com</span>
              </div>
              <div className="text-[11px] text-[#1a0dab] font-medium leading-snug">Best Coffee Beans — Buy Online | Acme</div>
              <div className="text-[10px] text-ink-muted leading-snug mt-0.5">Premium single-origin coffee beans roasted to order...</div>
            </div>
            {/* Social card */}
            <div className="rounded-lg border border-sand-200 overflow-hidden bg-white">
              <div className="text-[9px] text-ink-muted p-1.5 pb-0">Facebook</div>
              <div className="h-16 bg-gradient-to-br from-choco-200 to-choco-400 mx-1.5 rounded" />
              <div className="p-2">
                <div className="text-[9px] text-ink-muted">acme.com</div>
                <div className="text-[10px] font-semibold text-ink leading-snug">Best Coffee Beans — Buy Online</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating badge — pixel accurate */}
      <div className="absolute -bottom-4 -left-4 card p-3 shadow-lift rotate-[2deg] animate-float">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-pastel-100 flex items-center justify-center">
            <Zap size={15} className="text-pastel-600" />
          </div>
          <div>
            <div className="text-xs font-semibold text-ink">Pixel-accurate</div>
            <div className="text-[10px] text-ink-muted">SERP truncation</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =================== SOCIAL PROOF ===================
function SocialProof() {
  const stats = [
    { value: '5→1', label: 'Tools replaced' },
    { value: '6', label: 'Live previews' },
    { value: '8', label: 'Schema types' },
    { value: '0', label: 'Signups needed' },
  ];
  return (
    <section className="border-y border-sand-200 dark:border-sand-800 bg-white/60 dark:bg-sand-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="font-display text-3xl font-semibold text-choco-600 dark:text-choco-400">{s.value}</div>
              <div className="text-sm text-ink-muted dark:text-sand-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =================== FEATURE GRID ===================
function FeatureGrid({ t }: { t: ReturnType<typeof getTranslations> }) {
  const features = [
    {
      icon: Radar,
      title: 'URL Debugger',
      desc: 'Paste any URL and see exactly what Google, Facebook, and other crawlers read: status, redirects, headers, conflicting meta and Open Graph tags — with the raw evidence behind every finding.',
    },
    {
      icon: Search,
      title: 'Pixel-accurate SERP preview',
      desc: 'Google truncates titles by pixel width, not characters. Our preview measures actual pixel width, so you see exactly where Google will cut your title and description.',
    },
    {
      icon: FileText,
      title: 'llms.txt generator',
      desc: 'Generate the optional file some AI crawlers read to map your site — with page lists and one-line summaries. Google states it is not required for Search, so it is presented honestly.',
    },
    {
      icon: Share2,
      title: 'Live social previews',
      desc: 'See how your link looks on Facebook, X, LinkedIn, Slack, and Discord — all updating instantly as you type. No more publishing a broken social card.',
    },
    {
      icon: Braces,
      title: 'Built-in JSON-LD generator & validator',
      desc: 'Generate and validate structured data for Article, Product, FAQ, LocalBusiness, and more — right next to your meta tags. No separate trip to another site.',
    },
    {
      icon: Image,
      title: 'Server-side OG image checker',
      desc: 'Verify your og:image bytes like Facebook does: real format, 1200×630 dimensions, aspect ratio, and size. Browsers can\'t do this — CORS blocks them.',
    },
  ];

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="chip bg-choco-50 dark:bg-choco-900/30 text-choco-600 dark:text-choco-400 mb-4 mx-auto">{t.featuresBadge}</div>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink dark:text-sand-50 tracking-tight text-balance">
            {t.featuresTitle}
          </h2>
          <p className="mt-4 text-lg text-ink-soft dark:text-sand-300 leading-relaxed text-balance">
            {t.featuresSubtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className="card p-6 hover:shadow-lift transition-all duration-300 hover:border-choco-200 group"
            >
              <div className="w-11 h-11 rounded-xl bg-choco-50 dark:bg-choco-900/30 flex items-center justify-center mb-4 group-hover:bg-choco-100 dark:group-hover:bg-choco-900/50 transition-colors">
                <f.icon size={20} className="text-choco-600 dark:text-choco-400" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-ink dark:text-sand-50 mb-2">{f.title}</h3>
              <p className="text-sm text-ink-soft dark:text-sand-300 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =================== TOOL SHOWCASE ===================
function ToolShowcase({ t }: { t: ReturnType<typeof getTranslations> }) {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-sand-50 to-sand-100/60 dark:from-sand-950 dark:to-sand-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="chip bg-pastel-100 dark:bg-pastel-900/30 text-pastel-700 dark:text-pastel-300 mb-4 mx-auto">{t.toolsBadge}</div>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink dark:text-sand-50 tracking-tight text-balance">
            {t.toolsTitle}
          </h2>
          <p className="mt-4 text-lg text-ink-soft dark:text-sand-300 leading-relaxed text-balance">
            {t.toolsSubtitle}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {navTools.map((tool) => {
            const Icon = iconMap[tool.icon] || FileText;
            return (
              <SmartLink
                key={tool.path}
                to={tool.path}
                className="card p-5 text-left hover:shadow-lift transition-all duration-300 hover:border-choco-200 group block"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-pastel-50 flex items-center justify-center group-hover:bg-pastel-100 transition-colors">
                    <Icon size={18} className="text-pastel-600" />
                  </div>
                  <ArrowRight size={16} className="text-ink-muted/40 group-hover:text-choco-500 group-hover:translate-x-0.5 transition-all" />
                </div>
                <h3 className="text-sm font-semibold text-ink dark:text-sand-100 mb-1">{tool.label}</h3>
                <p className="text-xs text-ink-muted dark:text-sand-400 leading-relaxed">{tool.description}</p>
              </SmartLink>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// =================== HOW IT WORKS ===================
function HowItWorks({ t }: { t: ReturnType<typeof getTranslations> }) {
  const steps = [
    { num: '01', title: 'Set up your brand profile', desc: 'Enter your brand name, domain, default OG image, and Twitter handle once. Every new page inherits these automatically.' },
    { num: '02', title: 'Fill in your page details', desc: 'Type your title, description, URL, and image. Watch the Google, Facebook, X, LinkedIn, Slack, and Discord previews update live.' },
    { num: '03', title: 'Add structured data', desc: 'Pick a schema type — Article, Product, FAQ, LocalBusiness — and fill in the form. Valid JSON-LD is generated automatically.' },
    { num: '04', title: 'Copy and paste', desc: 'One click to copy your meta tags, JSON-LD, and robots.txt. Paste into your HTML head. Save the page setup to return later.' },
  ];

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="chip bg-choco-50 dark:bg-choco-900/30 text-choco-600 dark:text-choco-400 mb-4 mx-auto">{t.howBadge}</div>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink dark:text-sand-50 tracking-tight text-balance">
            {t.howTitle}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <div key={i} className="relative">
              <div className="font-display text-5xl font-semibold text-choco-200 mb-3">{s.num}</div>
              <h3 className="font-semibold text-ink dark:text-sand-100 mb-2">{s.title}</h3>
              <p className="text-sm text-ink-soft dark:text-sand-300 leading-relaxed">{s.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 -right-3 text-sand-300">
                  <ArrowRight size={18} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =================== SERP HIGHLIGHT ===================
function SerpHighlight({ t }: { t: ReturnType<typeof getTranslations> }) {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-pastel-50 via-sand-50 to-choco-50/40 dark:from-pastel-900/20 dark:via-sand-950 dark:to-choco-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className="chip bg-pastel-100 dark:bg-pastel-900/30 text-pastel-700 dark:text-pastel-300 mb-4">{t.serpBadge}</div>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-ink dark:text-sand-50 tracking-tight text-balance mb-6">
              {t.serpTitle}
            </h2>
            <p className="text-lg text-ink-soft dark:text-sand-300 leading-relaxed mb-6">
              {t.serpSubtitle}
            </p>
            <ul className="space-y-3">
              {[
                'Measures actual text width, not character count',
                'Shows exactly where Google will cut your title',
                'Warns you when text will be truncated',
                'Try to break at word boundaries for clean cuts',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-ink-soft">
                  <span className="flex-none w-5 h-5 rounded-full bg-pastel-100 flex items-center justify-center mt-0.5">
                    <Check size={12} className="text-pastel-600" />
                  </span>
                  <span className="text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* SERP mockup */}
          <div className="card p-6 shadow-lift">
            <div className="flex items-center gap-2 mb-1 text-xs text-ink-muted">
              <Globe size={14} />
              google.com
            </div>
            <div className="space-y-4 mt-4">
              <SerpRow
                domain="acme-coffee.com"
                title="Best Organic Coffee Beans — Single Origin, Roasted to Order | Acme Coffee Co"
                desc="Premium single-origin organic coffee beans, roasted to order and shipped fresh. Free shipping on orders over $35. Subscribe and save 15%."
                truncated
              />
              <div className="border-t border-sand-100" />
              <SerpRow
                domain="example.com"
                title="A perfectly sized title that fits"
                desc="A description that fits within the pixel limit and displays fully in Google search results without any truncation at all."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SerpRow({ domain, title, desc, truncated }: { domain: string; title: string; desc: string; truncated?: boolean }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sand-200 text-[11px] font-semibold text-ink-soft">
          {domain.charAt(0).toUpperCase()}
        </span>
        <span className="text-sm text-ink">{domain}</span>
      </div>
      <h3 className="text-[18px] leading-snug text-[#1a0dab] font-medium">
        {title}
        {truncated && <span className="text-[#1a0dab]">…</span>}
      </h3>
      <p className="text-sm text-ink-muted leading-relaxed mt-1">
        {desc}
        {truncated && <span>…</span>}
      </p>
      {truncated && (
        <div className="mt-2 chip bg-warning/10 text-warning text-[11px]">Truncated by Google — shorten your title</div>
      )}
    </div>
  );
}

// =================== COMPARISON ===================
function ComparisonSection({ t }: { t: ReturnType<typeof getTranslations> }) {
  const features = [
    'Meta tag generation',
    'Live social previews',
    'Pixel-accurate SERP',
    'JSON-LD structured data',
    'Robots.txt generator',
    'Saved brand profile',
    'Saved page library',
    'No signup required',
  ];
  const tools = ['SerpCraft', 'metatags.io', 'opengraph.xyz', 'Merkle'];

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="chip bg-choco-50 dark:bg-choco-900/30 text-choco-600 dark:text-choco-400 mb-4 mx-auto">{t.comparisonBadge}</div>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink dark:text-sand-50 tracking-tight text-balance">
            {t.comparisonTitle}
          </h2>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full">
              <thead>
                <tr className="border-b border-sand-200 dark:border-sand-800 bg-sand-50 dark:bg-sand-900/50">
                  <th className="text-left text-sm font-medium text-ink-soft dark:text-sand-300 px-5 py-4">Feature</th>
                  {tools.map((toolName, i) => (
                    <th key={toolName} className={`text-center text-sm font-semibold px-5 py-4 ${i === 0 ? 'text-choco-600 dark:text-choco-400 bg-choco-50/50 dark:bg-choco-900/20' : 'text-ink-soft dark:text-sand-300'}`}>
                      {toolName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((f, i) => (
                  <tr key={f} className={i % 2 === 0 ? 'bg-white dark:bg-sand-900' : 'bg-sand-50/40 dark:bg-sand-900/40'}>
                    <td className="text-left text-sm text-ink dark:text-sand-100 px-5 py-3.5 font-medium">{f}</td>
                    {tools.map((toolName, j) => (
                      <td key={toolName} className={`text-center px-5 py-3.5 ${j === 0 ? 'bg-choco-50/30 dark:bg-choco-900/15' : ''}`}>
                        {j === 0 ? (
                          <Check size={18} className="text-pastel-500 mx-auto" />
                        ) : (
                          <span className="text-ink-muted/40 dark:text-sand-600 text-sm">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

// =================== FAQ TEASER ===================
function FaqTeaser() {
  const faqs = [
    { q: 'Is SerpCraft really free?', a: 'Yes. The core studio is completely free with no signup required. All data is stored locally in your browser. The site is supported by unobtrusive ads.' },
    { q: 'Does my data leave my browser?', a: 'No. Everything runs client-side. Your page setups, brand profile, and generated tags never leave your device.' },
    { q: 'How accurate is the Google SERP preview?', a: 'The preview measures actual pixel width of your text, following Google\'s documented truncation behavior. Titles truncate at ~580px, descriptions at ~920px.' },
  ];
  return (
    <section className="py-20 lg:py-28 bg-sand-100/50 dark:bg-sand-900/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="chip bg-pastel-100 dark:bg-pastel-900/30 text-pastel-700 dark:text-pastel-300 mb-4 mx-auto">FAQ</div>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink dark:text-sand-50 tracking-tight text-balance">
            Common questions
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="card p-5">
              <h3 className="font-semibold text-ink dark:text-sand-100 mb-2">{f.q}</h3>
              <p className="text-sm text-ink-soft dark:text-sand-300 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <SmartLink to="/about" className="btn-ghost text-sm group">
            More about SerpCraft
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </SmartLink>
        </div>
      </div>
    </section>
  );
}

// =================== FINAL CTA ===================
function FinalCta({ t }: { t: ReturnType<typeof getTranslations> }) {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl border border-choco-200/70 dark:border-choco-800/60 bg-gradient-to-br from-sand-100 via-sand-50 to-sand-200/60 dark:from-sand-900 dark:via-sand-950 dark:to-sand-900 p-12 lg:p-16 text-center overflow-hidden">
          {/* Warm terracotta + cocoa glows */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-terra-200/40 dark:bg-terra-900/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-choco-200/40 dark:bg-choco-800/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-ink dark:text-sand-50 tracking-tight text-balance">
              {t.ctaTitle}
            </h2>
            <p className="mt-4 text-lg text-ink-soft dark:text-sand-300 leading-relaxed max-w-xl mx-auto text-balance">
              {t.ctaSubtitle}
            </p>
            <SmartLink
              to="/studio"
              className="btn-primary mt-8 px-7 py-3.5 text-base group"
            >
              {t.openStudio}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </SmartLink>
            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-ink-muted dark:text-sand-400">
              <span className="flex items-center gap-1.5"><Monitor size={15} /> Desktop</span>
              <span className="flex items-center gap-1.5"><Smartphone size={15} /> Mobile</span>
              <span className="flex items-center gap-1.5"><Globe size={15} /> All browsers</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

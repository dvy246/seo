// Localized SEO metadata (title + description) per locale.
// Falls back to the English pageMeta in src/data/pages.ts when a locale
// has no entry for a path. Only paths that exist in that locale are listed
// (tools, studio, home); trust pages are not localized (see Footer).

import type { Locale } from '@/lib/i18n';

export interface LocalizedMeta {
  title: string;
  description: string;
}

export const pageMetaLocalized: Partial<Record<Locale, Record<string, LocalizedMeta>>> = {
  es: {
    '/': {
      title: 'SerpCraft: herramientas SEO gratis y previsualización',
      description:
        'Kit de SEO gratuito en tu navegador: meta tags, Open Graph, Twitter Cards, JSON-LD, robots.txt y vistas previas SERP de Google. Sin registro.',
    },
    '/studio': {
      title: 'Estudio SEO: meta tags, JSON-LD y vista SERP | SerpCraft',
      description:
        'Crea todos los elementos SEO en un editor: meta tags, Open Graph, Twitter Cards, JSON-LD y robots.txt con vistas previas en vivo. Gratis, sin registro.',
    },
    '/meta-tag-generator': {
      title: 'Generador de meta tags gratis: título y descripción | SerpCraft',
      description:
        'Genera meta tags SEO, etiquetas de título, meta descripciones, canónicos y directivas de robots. Vista previa en vivo y copia en un clic. Gratis.',
    },
    '/open-graph-generator': {
      title: 'Generador Open Graph: OG tags gratis y vista previa | SerpCraft',
      description:
        'Genera etiquetas Open Graph (og:title, og:description, og:image, og:url) y previsualiza tu enlace en Facebook, LinkedIn, Slack y Discord. Gratis.',
    },
    '/twitter-card-generator': {
      title: 'Generador de Twitter Cards: etiquetas X gratis | SerpCraft',
      description:
        'Genera etiquetas de Twitter Card (twitter:card, twitter:title, twitter:image) y previsualiza cómo se ve tu enlace en X. Gratis, con vista previa en vivo.',
    },
    '/json-ld-generator': {
      title: 'Generador JSON-LD: esquema visual gratis | SerpCraft',
      description:
        'Crea datos estructurados JSON-LD con un editor visual para Article, Product, Organization, LocalBusiness y más. Generador JSON-LD gratis.',
    },
    '/schema-markup-generator': {
      title: 'Generador de marcado Schema.org: snippets gratis | SerpCraft',
      description:
        'Genera marcado JSON-LD de schema.org para productos, artículos, negocios locales y más con selector de tipo y campos guiados. Gratis.',
    },
    '/social-preview-tool': {
      title: 'Vista previa social: Facebook, X y LinkedIn | SerpCraft',
      description:
        'Previsualiza cómo se ve tu enlace en Facebook, X/Twitter, LinkedIn, Slack y Discord antes de publicar. Herramienta social gratis con edición en vivo.',
    },
    '/serp-preview-tool': {
      title: 'Vista previa SERP: prueba de Google por píxeles | SerpCraft',
      description:
        'Previsualiza cómo aparecen tu título y meta descripción en los resultados de Google con truncado por píxeles. Herramienta SERP gratis.',
    },
    '/robots-txt-generator': {
      title: 'Generador de robots.txt: reglas de rastreo gratis | SerpCraft',
      description:
        'Genera un archivo robots.txt con directivas allow, disallow, sitemap y crawl-delay. Generador de robots.txt gratis con copia en un clic.',
    },
    '/url-debugger': {
      title: 'Depurador de URL: mira qué leen Google y los bots | SerpCraft',
      description:
        'Pega una URL y ve qué leen Google, Facebook y otros rastreadores: estado, redirecciones, cabeceras, meta tags y conflictos. Informe gratis.',
    },
    '/seo-check': {
      title: 'Revisión SEO gratis: puntuación instantánea | SerpCraft',
      description:
        'Audita el SEO de cualquier web gratis: puntuación instantánea y lista priorizada de problemas on-page, técnicos, sociales y de IA en 21 comprobaciones.',
    },
    '/llms-txt-generator': {
      title: 'Generador de llms.txt: archivo para IA gratis | SerpCraft',
      description:
        'Genera un archivo llms.txt para que ChatGPT, Perplexity, Gemini y Claude descubran tu contenido. Generador llms.txt gratis con copia en un clic.',
    },
    '/hreflang-generator': {
      title: 'Generador de hreflang: etiquetas con validación gratis | SerpCraft',
      description:
        'Genera etiquetas hreflang para sitios multilingües con validación BCP-47, soporte x-default y detección de duplicados. Generador gratis.',
    },
    '/og-image-checker': {
      title: 'Comprobador de imagen OG: validador 1200x630 | SerpCraft',
      description:
        'Verifica tu imagen Open Graph en el servidor: formato, dimensiones 1200x630, proporción 1.91:1 y tamaño. Comprobador de imagen OG gratis.',
    },
    '/json-ld-validator': {
      title: 'Validador JSON-LD: datos estructurados gratis | SerpCraft',
      description:
        'Valida tus datos estructurados JSON-LD: sintaxis, campos obligatorios de schema.org y elegibilidad para resultados enriquecidos. Gratis, sin registro.',
    },
  },
  fr: {
    '/': {
      title: 'SerpCraft : outils SEO gratuits pour meta tags et aperçus',
      description:
        'Boîte à outils SEO gratuite dans votre navigateur : meta tags, Open Graph, Twitter Cards, JSON-LD, robots.txt et aperçus SERP Google. Sans inscription.',
    },
    '/studio': {
      title: 'Studio SEO : meta tags, JSON-LD et aperçu SERP | SerpCraft',
      description:
        'Créez tous vos éléments SEO dans un éditeur : meta tags, Open Graph, Twitter Cards, JSON-LD, robots.txt avec aperçus en direct. Gratuit, sans inscription.',
    },
    '/meta-tag-generator': {
      title: 'Générateur de meta tags gratuit : titre et description | SerpCraft',
      description:
        'Générez des meta tags SEO, balises title, meta descriptions, URL canoniques et directives robots. Aperçu en direct, copie en un clic. Gratuit.',
    },
    '/open-graph-generator': {
      title: 'Générateur Open Graph : balises OG et aperçu gratuits | SerpCraft',
      description:
        'Générez des balises Open Graph (og:title, og:description, og:image, og:url) et prévisualisez votre lien sur Facebook, LinkedIn, Slack et Discord. Gratuit.',
    },
    '/twitter-card-generator': {
      title: 'Générateur de Twitter Cards : balises X gratuites | SerpCraft',
      description:
        'Générez des balises Twitter Card (twitter:card, twitter:title, twitter:image) et prévisualisez votre lien sur X. Gratuit, avec aperçu en direct.',
    },
    '/json-ld-generator': {
      title: 'Générateur JSON-LD : éditeur visuel de schéma gratuit | SerpCraft',
      description:
        'Créez des données structurées JSON-LD avec un éditeur visuel pour Article, Product, Organization, LocalBusiness et plus. Générateur JSON-LD gratuit.',
    },
    '/schema-markup-generator': {
      title: 'Générateur de balisage Schema.org : extraits gratuits | SerpCraft',
      description:
        'Générez un balisage JSON-LD schema.org pour produits, articles, commerces locaux et plus avec sélecteur de type et champs guidés. Gratuit.',
    },
    '/social-preview-tool': {
      title: 'Outil d\u2019aperçu social : Facebook, X et LinkedIn | SerpCraft',
      description:
        'Prévisualisez votre lien sur Facebook, X/Twitter, LinkedIn, Slack et Discord avant publication. Outil d\u2019aperçu social gratuit avec édition en direct.',
    },
    '/serp-preview-tool': {
      title: 'Aperçu SERP : test Google précis au pixel | SerpCraft',
      description:
        'Prévisualisez l\u2019apparence de votre titre et de votre meta description dans les résultats Google avec troncature au pixel. Outil SERP gratuit.',
    },
    '/robots-txt-generator': {
      title: 'Générateur robots.txt : règles gratuites | SerpCraft',
      description:
        'Générez un fichier robots.txt avec directives allow, disallow, sitemap et crawl-delay. Générateur robots.txt gratuit avec copie en un clic.',
    },
    '/url-debugger': {
      title: 'Débogueur d’URL : ce que lisent Google et les bots | SerpCraft',
      description:
        'Collez une URL et voyez ce que lisent Google, Facebook et les autres robots : statut, redirections, en-têtes, meta tags et conflits. Rapport gratuit.',
    },
    '/seo-check': {
      title: 'Vérification SEO gratuite : audit et score instantanés | SerpCraft',
      description:
        'Audit SEO gratuit de n\u2019importe quel site : score instantané et liste priorisée des problèmes on-page, techniques, sociaux et d\u2019IA en 21 vérifications.',
    },
    '/llms-txt-generator': {
      title: 'Générateur llms.txt : fichier IA gratuit | SerpCraft',
      description:
        'Générez un fichier llms.txt pour que ChatGPT, Perplexity, Gemini et Claude découvrent votre contenu. Générateur llms.txt gratuit.',
    },
    '/hreflang-generator': {
      title: 'Générateur hreflang : balises avec validation gratuites | SerpCraft',
      description:
        'Générez des balises hreflang pour les sites multilingues avec validation BCP-47, support x-default et détection des doublons. Générateur gratuit.',
    },
    '/og-image-checker': {
      title: 'Vérificateur d\u2019image OG : validateur 1200x630 | SerpCraft',
      description:
        'Vérifiez votre image Open Graph côté serveur : format, dimensions 1200x630, ratio 1.91:1 et taille. Vérificateur d\u2019image OG gratuit.',
    },
    '/json-ld-validator': {
      title: 'Validateur JSON-LD : données structurées | SerpCraft',
      description:
        'Validez vos données structurées JSON-LD : syntaxe, champs schema.org requis et éligibilité aux résultats enrichis. Gratuit, sans inscription.',
    },
  },
  de: {
    '/': {
      title: 'SerpCraft: kostenlose SEO-Tools für Meta-Tags und Vorschauen',
      description:
        'Kostenlose SEO-Toolbox im Browser: Meta-Tags, Open Graph, Twitter Cards, JSON-LD, robots.txt und pixelgenaue Google-SERP-Vorschauen. Ohne Anmeldung.',
    },
    '/studio': {
      title: 'SEO-Studio: Meta-Tags, JSON-LD und SERP-Vorschau | SerpCraft',
      description:
        'Erstellen Sie alle SEO-Elemente in einem Editor: Meta-Tags, Open Graph, Twitter Cards, JSON-LD und robots.txt mit Live-Vorschauen. Kostenlos, ohne Anmeldung.',
    },
    '/meta-tag-generator': {
      title: 'Meta-Tag-Generator: kostenlose Titel & Beschreibung | SerpCraft',
      description:
        'Erzeugen Sie SEO-Meta-Tags, Titel-Tags, Meta-Descriptions, Canonicals und Robots-Anweisungen. Live-Vorschau, Ein-Klick-Kopieren. Kostenlos.',
    },
    '/open-graph-generator': {
      title: 'Open-Graph-Generator: OG-Tags & Vorschau | SerpCraft',
      description:
        'Erzeugen Sie Open-Graph-Tags (og:title, og:description, og:image, og:url) und sehen Sie, wie Ihr Link auf Facebook, LinkedIn, Slack und Discord aussieht. Kostenlos.',
    },
    '/twitter-card-generator': {
      title: 'Twitter-Card-Generator: kostenlose X-Card-Tags | SerpCraft',
      description:
        'Erzeugen Sie Twitter-Card-Tags (twitter:card, twitter:title, twitter:image) und sehen Sie die Vorschau auf X. Kostenlos, mit Live-Vorschau.',
    },
    '/json-ld-generator': {
      title: 'JSON-LD-Generator: visueller Schema-Builder | SerpCraft',
      description:
        'Erstellen Sie JSON-LD-Structured-Data mit visuellem Editor für Article, Product, Organization, LocalBusiness und mehr. Kostenlos.',
    },
    '/schema-markup-generator': {
      title: 'Schema.org-Markup-Generator: kostenlose Snippets | SerpCraft',
      description:
        'Erzeugen Sie Schema.org-JSON-LD-Markup für Produkte, Artikel, lokale Unternehmen und mehr mit Typauswahl und geführten Feldern. Kostenlos.',
    },
    '/social-preview-tool': {
      title: 'Social-Preview-Tool: Facebook, X und LinkedIn | SerpCraft',
      description:
        'Sehen Sie vor dem Veröffentlichen, wie Ihr Link auf Facebook, X/Twitter, LinkedIn, Slack und Discord aussieht. Kostenloses Tool mit Live-Bearbeitung.',
    },
    '/serp-preview-tool': {
      title: 'SERP-Vorschau: pixelgenauer Google-Test | SerpCraft',
      description:
        'Sehen Sie, wie Ihr Titel und Ihre Meta-Description in Google-Ergebnissen erscheinen, mit pixelgenauer Kürzung. Kostenloses SERP-Tool.',
    },
    '/robots-txt-generator': {
      title: 'Robots.txt-Generator: kostenlose Crawl-Regeln | SerpCraft',
      description:
        'Erzeugen Sie eine robots.txt mit allow-, disallow-, sitemap- und crawl-delay-Anweisungen. Kostenlos mit Ein-Klick-Kopieren.',
    },
    '/url-debugger': {
      title: 'URL-Debugger: sehen, was Google und Bots lesen | SerpCraft',
      description:
        'Fügen Sie eine URL ein und sehen Sie, was Google, Facebook und andere Crawler lesen: Status, Weiterleitungen, Header, Meta-Tags und Konflikte. Kostenlos.',
    },
    '/seo-check': {
      title: 'Kostenloser SEO-Check: sofortige Analyse und Score | SerpCraft',
      description:
        'Kostenloser SEO-Check für jede Website: Sofort-Score und priorisierte Liste von On-Page-, technischen, sozialen und KI-Readiness-Problemen in 21 Checks.',
    },
    '/llms-txt-generator': {
      title: 'llms.txt-Generator: kostenlose KI-Crawler-Datei | SerpCraft',
      description:
        'Erzeugen Sie eine llms.txt-Datei, damit ChatGPT, Perplexity, Gemini und Claude Ihre Inhalte entdecken können. Kostenlos mit Ein-Klick-Kopieren.',
    },
    '/hreflang-generator': {
      title: 'Hreflang-Generator: kostenlose Tags mit Validierung | SerpCraft',
      description:
        'Erzeugen Sie hreflang-Alternate-Tags für mehrsprachige Seiten mit BCP-47-Validierung, x-default-Support und Duplikaterkennung. Kostenlos.',
    },
    '/og-image-checker': {
      title: 'OG-Bild-Prüfer: 1200x630-Open-Graph-Validator | SerpCraft',
      description:
        'Prüfen Sie Ihr Open-Graph-Bild serverseitig: Format, 1200x630-Maße, 1.91:1-Seitenverhältnis und Dateigröße. Kostenloser OG-Bild-Checker.',
    },
    '/json-ld-validator': {
      title: 'JSON-LD-Validator: kostenloser Structured-Data-Check | SerpCraft',
      description:
        'Validieren Sie Ihre JSON-LD-Daten: Syntax, Pflichtfelder von schema.org und Rich-Results-Eignung. Kostenlos, ohne Anmeldung.',
    },
  },
  pt: {
    '/': {
      title: 'SerpCraft: ferramentas SEO grátis para meta tags e previews',
      description:
        'Kit de SEO gratuito no seu navegador: meta tags, Open Graph, Twitter Cards, JSON-LD, robots.txt e previews SERP do Google. Sem cadastro.',
    },
    '/studio': {
      title: 'Estúdio SEO: meta tags, JSON-LD e preview SERP | SerpCraft',
      description:
        'Crie todos os elementos de SEO em um editor: meta tags, Open Graph, Twitter Cards, JSON-LD e robots.txt com previews ao vivo. Grátis, sem cadastro.',
    },
    '/meta-tag-generator': {
      title: 'Gerador de meta tags grátis: título e descrição | SerpCraft',
      description:
        'Gere meta tags SEO, title tags, meta descriptions, canônicos e diretivas de robots. Preview ao vivo, cópia em um clique. Grátis.',
    },
    '/open-graph-generator': {
      title: 'Gerador Open Graph: tags OG grátis e preview | SerpCraft',
      description:
        'Gere tags Open Graph (og:title, og:description, og:image, og:url) e veja o preview do seu link no Facebook, LinkedIn, Slack e Discord. Grátis.',
    },
    '/twitter-card-generator': {
      title: 'Gerador de Twitter Cards: tags X grátis | SerpCraft',
      description:
        'Gere tags de Twitter Card (twitter:card, twitter:title, twitter:image) e veja como seu link aparece no X. Grátis, com preview ao vivo.',
    },
    '/json-ld-generator': {
      title: 'Gerador JSON-LD: construtor visual de schema grátis | SerpCraft',
      description:
        'Crie dados estruturados JSON-LD com um editor visual para Article, Product, Organization, LocalBusiness e mais. Gerador JSON-LD grátis.',
    },
    '/schema-markup-generator': {
      title: 'Gerador de marcação Schema.org: snippets grátis | SerpCraft',
      description:
        'Gere marcação JSON-LD schema.org para produtos, artigos, negócios locais e mais, com seletor de tipo e campos guiados. Grátis.',
    },
    '/social-preview-tool': {
      title: 'Ferramenta de preview social: Facebook, X e LinkedIn | SerpCraft',
      description:
        'Veja como seu link aparece no Facebook, X/Twitter, LinkedIn, Slack e Discord antes de publicar. Ferramenta grátis com edição ao vivo.',
    },
    '/serp-preview-tool': {
      title: 'Preview SERP: teste Google preciso por pixel | SerpCraft',
      description:
        'Veja como seu título e meta description aparecem nos resultados do Google com truncamento por pixel. Ferramenta SERP grátis.',
    },
    '/robots-txt-generator': {
      title: 'Gerador de robots.txt: regras de rastreio grátis | SerpCraft',
      description:
        'Gere um arquivo robots.txt com diretivas allow, disallow, sitemap e crawl-delay. Gerador de robots.txt grátis com cópia em um clique.',
    },
    '/url-debugger': {
      title: 'Debugger de URL: veja o que o Google e bots leem | SerpCraft',
      description:
        'Cole uma URL e veja o que o Google, Facebook e outros crawlers leem: status, redirecionamentos, headers, meta tags e conflitos. Relatório grátis.',
    },
    '/seo-check': {
      title: 'Check de SEO grátis: auditoria e score instantâneos | SerpCraft',
      description:
        'Audite o SEO de qualquer site grátis: score instantâneo e lista priorizada de problemas on-page, técnicos, sociais e de IA em 21 verificações.',
    },
    '/llms-txt-generator': {
      title: 'Gerador de llms.txt: arquivo para IA grátis | SerpCraft',
      description:
        'Gere um arquivo llms.txt para ChatGPT, Perplexity, Gemini e Claude descobrirem seu conteúdo. Gerador llms.txt grátis, cópia em um clique.',
    },
    '/hreflang-generator': {
      title: 'Gerador de hreflang: tags com validação grátis | SerpCraft',
      description:
        'Gere tags hreflang para sites multilíngues com validação BCP-47, suporte a x-default e detecção de duplicatas. Gerador grátis.',
    },
    '/og-image-checker': {
      title: 'Verificador de imagem OG: validador 1200x630 | SerpCraft',
      description:
        'Verifique sua imagem Open Graph no servidor: formato, dimensões 1200x630, proporção 1.91:1 e tamanho. Verificador de imagem OG grátis.',
    },
    '/json-ld-validator': {
      title: 'Validador JSON-LD: dados estruturados grátis | SerpCraft',
      description:
        'Valide seus dados estruturados JSON-LD: sintaxe, campos obrigatórios do schema.org e elegibilidade para rich results. Grátis, sem cadastro.',
    },
  },
  ja: {
    '/': {
      title: 'SerpCraft｜無料のメタタグ生成・プレビューSEOツール',
      description:
        'ブラウザで完結する無料SEOツールキット：メタタグ、Open Graph、Twitter Cards、JSON-LD、robots.txt、Google SERPプレビュー。登録不要。',
    },
    '/studio': {
      title: 'SEOスタジオ：メタタグ・JSON-LD・SERPプレビュー｜SerpCraft',
      description:
        'メタタグ、Open Graph、Twitter Cards、JSON-LD、robots.txtを1つのエディタで作成し、リアルタイムプレビューを確認。無料・登録不要。',
    },
    '/meta-tag-generator': {
      title: '無料メタタグ生成ツール：タイトルと説明文｜SerpCraft',
      description:
        'SEOメタタグ、タイトルタグ、メタディスクリプション、正規URL、robots指定を生成。ライブプレビュー、ワンクリックコピー。無料。',
    },
    '/open-graph-generator': {
      title: 'Open Graph生成：無料のOGタグ作成とプレビュー｜SerpCraft',
      description:
        'Open Graphタグ（og:title、og:description、og:image、og:url）を生成し、Facebook・LinkedIn・Slack・Discordでの見え方をプレビュー。無料。',
    },
    '/twitter-card-generator': {
      title: 'Twitterカード生成：無料のXカードタグ作成｜SerpCraft',
      description:
        'Twitter Cardタグ（twitter:card、twitter:title、twitter:image）を生成し、Xでの見え方をライブプレビュー。無料。',
    },
    '/json-ld-generator': {
      title: 'JSON-LD生成：無料のビジュアルスキーマ作成｜SerpCraft',
      description:
        'Article、Product、Organization、LocalBusinessなどのJSON-LD構造化データをビジュアルエディタで作成。無料のJSON-LD生成ツール。',
    },
    '/schema-markup-generator': {
      title: 'Schema.org生成：無料のマークアップ作成｜SerpCraft',
      description:
        '商品、記事、地域ビジネスなどのSchema.org JSON-LDマークアップを、タイプ選択とガイド付きフィールドで生成。無料。',
    },
    '/social-preview-tool': {
      title: 'ソーシャルプレビュー：Facebook・X・LinkedIn｜SerpCraft',
      description:
        '公開前にリンクがFacebook、X、LinkedIn、Slack、Discordでどう見えるかを確認。ライブ編集対応の無料プレビューツール。',
    },
    '/serp-preview-tool': {
      title: 'SERPプレビュー：ピクセル精度のGoogleテスト｜SerpCraft',
      description:
        'タイトルとメタディスクリプションがGoogle検索結果でどう表示されるか、ピクセル精度の切り詰めでプレビュー。無料。',
    },
    '/robots-txt-generator': {
      title: 'robots.txt生成：無料のクロールルール作成｜SerpCraft',
      description:
        'allow、disallow、sitemap、crawl-delayを指定したrobots.txtを生成。ワンクリックコピー対応の無料ジェネレーター。',
    },
    '/url-debugger': {
      title: 'URLデバッガー：Googleの読み取り内容を確認｜SerpCraft',
      description:
        'URLを貼り付けて、GoogleやFacebookなどが読む内容（ステータス、リダイレクト、ヘッダー、メタタグ、競合）を確認。無料レポート。',
    },
    '/seo-check': {
      title: '無料SEOチェック：即時サイト監査とスコア｜SerpCraft',
      description:
        '任意のサイトのSEOを無料でチェック。21項目のチェックでオンページ・技術・SNS・AI対応の問題を優先度順にスコア表示。登録不要。',
    },
    '/llms-txt-generator': {
      title: 'llms.txt生成：無料のAIクローラーファイル作成｜SerpCraft',
      description:
        'ChatGPT、Perplexity、Gemini、Claudeがコンテンツを発見できるllms.txtを生成。ワンクリックコピー対応、無料。',
    },
    '/hreflang-generator': {
      title: 'hreflang生成：検証付き無料タグ作成｜SerpCraft',
      description:
        '多言語サイト向けhreflang代替タグを、BCP-47検証、x-default対応、重複検出付きで生成。無料ジェネレーター。',
    },
    '/og-image-checker': {
      title: 'OG画像チェッカー：1200x630バリデーター｜SerpCraft',
      description:
        'Open Graph画像をサーバー側で検証：形式、1200x630サイズ、1.91:1比率、ファイル容量。無料のOG画像チェッカー。',
    },
    '/json-ld-validator': {
      title: 'JSON-LDバリデーター：無料の構造化データ検証｜SerpCraft',
      description:
        'JSON-LD構造化データの構文、schema.org必須フィールド、リッチリザルト適合性を検証。無料・登録不要。',
    },
  },
};

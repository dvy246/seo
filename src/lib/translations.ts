import type { Locale } from './i18n';

// Translation strings for UI elements.
// Tool pages and SEO content get localized metadata separately.

export interface UITranslations {
  // Navigation
  navStudio: string;
  navTools: string;
  navAbout: string;
  // Header
  openStudio: string;
  browseTools: string;
  // Hero
  heroBadge: string;
  heroTitlePrefix: string;
  heroTitleHighlight: string;
  heroTitleSuffix: string;
  heroSubtitle: string;
  noSignup: string;
  freeForever: string;
  runsInBrowser: string;
  // Features
  featuresBadge: string;
  featuresTitle: string;
  featuresSubtitle: string;
  // Tools
  toolsBadge: string;
  toolsTitle: string;
  toolsSubtitle: string;
  // How it works
  howBadge: string;
  howTitle: string;
  // SERP
  serpBadge: string;
  serpTitle: string;
  serpSubtitle: string;
  // Comparison
  comparisonBadge: string;
  comparisonTitle: string;
  // FAQ
  faqBadge: string;
  faqTitle: string;
  // CTA
  ctaTitle: string;
  ctaSubtitle: string;
  // Footer
  footerTools: string;
  footerCompany: string;
  footerAbout: string;
  footerPrivacy: string;
  footerTerms: string;
  footerRights: string;
  // Error pages
  error404Title: string;
  error404Desc: string;
  backToHome: string;
  error500Title: string;
  error500Desc: string;
  refreshPage: string;
  // Theme
  toggleTheme: string;
  // Language
  language: string;
}

const en: UITranslations = {
  navStudio: 'Studio',
  navTools: 'Tools',
  navAbout: 'About',
  openStudio: 'Open the Studio',
  browseTools: 'Browse tools',
  heroBadge: 'All-in-one SEO studio',
  heroTitlePrefix: 'Set up your entire page SEO in',
  heroTitleHighlight: 'one place',
  heroTitleSuffix: '.',
  heroSubtitle:
    'Stop bouncing between five tools. Meta tags, social previews, JSON-LD structured data, pixel-accurate SERP, and robots.txt — all in one studio, updating live as you type. Free, no signup.',
  noSignup: 'No signup',
  freeForever: 'Free forever',
  runsInBrowser: 'Runs in browser',
  featuresBadge: 'Why SerpCraft',
  featuresTitle: 'Everything a page needs for SEO, in one studio',
  featuresSubtitle:
    'Replaces the five-tool shuffle of meta tag generators, social preview checkers, JSON-LD builders, SERP preview tools, and robots.txt generators.',
  toolsBadge: 'Tool Suite',
  toolsTitle: 'Eight focused tools, one unified studio',
  toolsSubtitle:
    'Each tool has its own dedicated page with optimized SEO content. Use the studio for the full workflow, or jump straight to a single tool.',
  howBadge: 'How it works',
  howTitle: 'From blank page to fully tagged in minutes',
  serpBadge: 'Pixel-accurate SERP',
  serpTitle: 'Google truncates by pixel width. So does our preview.',
  serpSubtitle:
    "Most meta tag generators show a character counter and call it a day. That is wrong. Google cuts titles at approximately 580px and descriptions at 920px — pixel width, not characters. Two titles with the same character count can truncate at completely different points.",
  comparisonBadge: 'The difference',
  comparisonTitle: 'One studio vs. five separate tools',
  faqBadge: 'FAQ',
  faqTitle: 'Common questions',
  ctaTitle: 'Stop juggling five tabs.',
  ctaSubtitle:
    'Set up all your page SEO — meta tags, social previews, structured data, robots.txt — in one sitting. Free, no signup.',
  footerTools: 'Tools',
  footerCompany: 'Company',
  footerAbout: 'About',
  footerPrivacy: 'Privacy',
  footerTerms: 'Terms',
  footerRights: 'All rights reserved.',
  error404Title: 'Page not found',
  error404Desc:
    "The page you're looking for doesn't exist or may have been moved. Try heading back to the homepage or opening the SEO studio.",
  backToHome: 'Back to home',
  error500Title: 'Something went wrong',
  error500Desc:
    'An unexpected error occurred on our end. Your work is safe — everything is stored locally in your browser. Try refreshing the page or going back home.',
  refreshPage: 'Refresh page',
  toggleTheme: 'Toggle theme',
  language: 'Language',
};

const es: UITranslations = {
  navStudio: 'Estudio',
  navTools: 'Herramientas',
  navAbout: 'Acerca de',
  openStudio: 'Abrir el Estudio',
  browseTools: 'Explorar herramientas',
  heroBadge: 'Estudio SEO todo en uno',
  heroTitlePrefix: 'Configura todo el SEO de tu página en',
  heroTitleHighlight: 'un solo lugar',
  heroTitleSuffix: '.',
  heroSubtitle:
    'Deja de saltar entre cinco herramientas. Meta tags, vistas previas sociales, datos estructurados JSON-LD, SERP con precisión de píxel y robots.txt — todo en un estudio, actualizándose en vivo mientras escribes. Gratis, sin registro.',
  noSignup: 'Sin registro',
  freeForever: 'Gratis para siempre',
  runsInBrowser: 'Funciona en el navegador',
  featuresBadge: 'Por qué SerpCraft',
  featuresTitle: 'Todo lo que una página necesita para SEO, en un estudio',
  featuresSubtitle:
    'Reemplaza el baile de cinco herramientas: generadores de meta tags, comprobadores de vistas previas sociales, constructores de JSON-LD, herramientas de vista previa SERP y generadores de robots.txt.',
  toolsBadge: 'Conjunto de herramientas',
  toolsTitle: 'Ocho herramientas enfocadas, un estudio unificado',
  toolsSubtitle:
    'Cada herramienta tiene su propia página dedicada con contenido SEO optimizado. Usa el estudio para el flujo completo, o ve directo a una herramienta individual.',
  howBadge: 'Cómo funciona',
  howTitle: 'De página en blanco a totalmente etiquetada en minutos',
  serpBadge: 'SERP con precisión de píxel',
  serpTitle: 'Google trunca por ancho de píxel. Nuestra vista previa también.',
  serpSubtitle:
    'La mayoría de los generadores de meta tags muestran un contador de caracteres. Eso es incorrecto. Google corta los títulos a aproximadamente 580px y las descripciones a 920px — ancho de píxel, no caracteres.',
  comparisonBadge: 'La diferencia',
  comparisonTitle: 'Un estudio vs. cinco herramientas separadas',
  faqBadge: 'Preguntas frecuentes',
  faqTitle: 'Preguntas comunes',
  ctaTitle: 'Deja de cambiar entre cinco pestañas.',
  ctaSubtitle:
    'Configura todo el SEO de tu página — meta tags, vistas previas sociales, datos estructurados, robots.txt — de una sola vez. Gratis, sin registro.',
  footerTools: 'Herramientas',
  footerCompany: 'Empresa',
  footerAbout: 'Acerca de',
  footerPrivacy: 'Privacidad',
  footerTerms: 'Términos',
  footerRights: 'Todos los derechos reservados.',
  error404Title: 'Página no encontrada',
  error404Desc:
    'La página que buscas no existe o puede haber sido movida. Intenta volver a la página de inicio o abrir el estudio SEO.',
  backToHome: 'Volver al inicio',
  error500Title: 'Algo salió mal',
  error500Desc:
    'Ocurrió un error inesperado de nuestra parte. Tu trabajo está a salvo — todo se almacena localmente en tu navegador. Intenta recargar la página o volver al inicio.',
  refreshPage: 'Recargar página',
  toggleTheme: 'Cambiar tema',
  language: 'Idioma',
};

const fr: UITranslations = {
  navStudio: 'Studio',
  navTools: 'Outils',
  navAbout: 'À propos',
  openStudio: 'Ouvrir le Studio',
  browseTools: 'Parcourir les outils',
  heroBadge: 'Studio SEO tout-en-un',
  heroTitlePrefix: 'Configurez tout le SEO de votre page en',
  heroTitleHighlight: 'un seul endroit',
  heroTitleSuffix: '.',
  heroSubtitle:
    "Arrêtez de jongler entre cinq outils. Balises méta, aperçus sociaux, données structurées JSON-LD, SERP au pixel près et robots.txt — tout dans un seul studio, mis à jour en direct. Gratuit, sans inscription.",
  noSignup: 'Sans inscription',
  freeForever: 'Gratuit pour toujours',
  runsInBrowser: 'Fonctionne dans le navigateur',
  featuresBadge: 'Pourquoi SerpCraft',
  featuresTitle: "Tout ce dont une page a besoin pour le SEO, dans un studio",
  featuresSubtitle:
    "Remplace la danse des cinq outils : générateurs de balises méta, vérificateurs d'aperçus sociaux, constructeurs JSON-LD, outils d'aperçu SERP et générateurs de robots.txt.",
  toolsBadge: 'Suite d\'outils',
  toolsTitle: 'Huit outils ciblés, un studio unifié',
  toolsSubtitle:
    "Chaque outil a sa propre page dédiée avec un contenu SEO optimisé. Utilisez le studio pour le flux complet, ou accédez directement à un outil unique.",
  howBadge: 'Comment ça marche',
  howTitle: 'De page vierge à entièrement balisée en minutes',
  serpBadge: 'SERP au pixel près',
  serpTitle: 'Google tronque par largeur de pixel. Notre aperçu aussi.',
  serpSubtitle:
    "La plupart des générateurs de balises méta affichent un compteur de caractères. C'est faux. Google coupe les titres à environ 580px et les descriptions à 920px — largeur de pixel, pas de caractères.",
  comparisonBadge: 'La différence',
  comparisonTitle: 'Un studio vs. cinq outils séparés',
  faqBadge: 'FAQ',
  faqTitle: 'Questions courantes',
  ctaTitle: 'Arrêtez de jongler entre cinq onglets.',
  ctaSubtitle:
    "Configurez tout le SEO de votre page — balises méta, aperçus sociaux, données structurées, robots.txt — en une seule fois. Gratuit, sans inscription.",
  footerTools: 'Outils',
  footerCompany: 'Entreprise',
  footerAbout: 'À propos',
  footerPrivacy: 'Confidentialité',
  footerTerms: 'Conditions',
  footerRights: 'Tous droits réservés.',
  error404Title: 'Page introuvable',
  error404Desc:
    "La page que vous recherchez n'existe pas ou a peut-être été déplacée. Essayez de revenir à l'accueil ou d'ouvrir le studio SEO.",
  backToHome: "Retour à l'accueil",
  error500Title: 'Une erreur est survenue',
  error500Desc:
    "Une erreur inattendue s'est produite de notre côté. Votre travail est en sécurité — tout est stocké localement dans votre navigateur. Essayez de rafraîchir la page ou de revenir à l'accueil.",
  refreshPage: 'Rafraîchir la page',
  toggleTheme: 'Changer de thème',
  language: 'Langue',
};

const de: UITranslations = {
  navStudio: 'Studio',
  navTools: 'Werkzeuge',
  navAbout: 'Über uns',
  openStudio: 'Studio öffnen',
  browseTools: 'Werkzeuge durchsuchen',
  heroBadge: 'All-in-One SEO-Studio',
  heroTitlePrefix: 'Richten Sie Ihr gesamtes Seiten-SEO ein an',
  heroTitleHighlight: 'einem Ort',
  heroTitleSuffix: '.',
  heroSubtitle:
    'Hören Sie auf, zwischen fünf Tools zu springen. Meta-Tags, Social-Previews, JSON-LD strukturierte Daten, pixelgenaue SERP und robots.txt — alles in einem Studio, live aktualisiert. Kostenlos, keine Anmeldung.',
  noSignup: 'Keine Anmeldung',
  freeForever: 'Für immer kostenlos',
  runsInBrowser: 'Läuft im Browser',
  featuresBadge: 'Warum SerpCraft',
  featuresTitle: 'Alles, was eine Seite für SEO braucht, in einem Studio',
  featuresSubtitle:
    'Ersetzt den Fünf-Tool-Tanz aus Meta-Tag-Generatoren, Social-Preview-Prüfern, JSON-LD-Buildern, SERP-Preview-Tools und robots.txt-Generatoren.',
  toolsBadge: 'Werkzeug-Suite',
  toolsTitle: 'Acht fokussierte Werkzeuge, ein einheitliches Studio',
  toolsSubtitle:
    'Jedes Werkzeug hat eine eigene Seite mit optimierten SEO-Inhalten. Nutzen Sie das Studio für den kompletten Workflow oder springen Sie direkt zu einem einzelnen Werkzeug.',
  howBadge: 'So funktioniert\'s',
  howTitle: 'Von leerer Seite zu vollständig getaggt in Minuten',
  serpBadge: 'Pixelgenaue SERP',
  serpTitle: 'Google schneidet nach Pixelbreite ab. Unsere Vorschau auch.',
  serpSubtitle:
    'Die meisten Meta-Tag-Generatoren zeigen einen Zeichen-Zähler. Das ist falsch. Google schneidet Titel bei ca. 580px und Beschreibungen bei 920px ab — Pixelbreite, nicht Zeichen.',
  comparisonBadge: 'Der Unterschied',
  comparisonTitle: 'Ein Studio vs. fünf separate Tools',
  faqBadge: 'FAQ',
  faqTitle: 'Häufige Fragen',
  ctaTitle: 'Schluss mit fünf Tabs.',
  ctaSubtitle:
    'Richten Sie Ihr gesamtes Seiten-SEO ein — Meta-Tags, Social-Previews, strukturierte Daten, robots.txt — in einem Rutsch. Kostenlos, keine Anmeldung.',
  footerTools: 'Werkzeuge',
  footerCompany: 'Unternehmen',
  footerAbout: 'Über uns',
  footerPrivacy: 'Datenschutz',
  footerTerms: 'AGB',
  footerRights: 'Alle Rechte vorbehalten.',
  error404Title: 'Seite nicht gefunden',
  error404Desc:
    'Die gesuchte Seite existiert nicht oder wurde verschoben. Kehren Sie zur Startseite zurück oder öffnen Sie das SEO-Studio.',
  backToHome: 'Zur Startseite',
  error500Title: 'Etwas ist schiefgelaufen',
  error500Desc:
    'Ein unerwarteter Fehler ist auf unserer Seite aufgetreten. Ihre Arbeit ist sicher — alles wird lokal in Ihrem Browser gespeichert. Versuchen Sie, die Seite zu aktualisieren.',
  refreshPage: 'Seite aktualisieren',
  toggleTheme: 'Theme wechseln',
  language: 'Sprache',
};

const pt: UITranslations = {
  navStudio: 'Estúdio',
  navTools: 'Ferramentas',
  navAbout: 'Sobre',
  openStudio: 'Abrir o Estúdio',
  browseTools: 'Navegar ferramentas',
  heroBadge: 'Estúdio SEO tudo-em-um',
  heroTitlePrefix: 'Configure todo o SEO da sua página em',
  heroTitleHighlight: 'um só lugar',
  heroTitleSuffix: '.',
  heroSubtitle:
    'Pare de pular entre cinco ferramentas. Meta tags, prévias sociais, dados estruturados JSON-LD, SERP com precisão de pixel e robots.txt — tudo em um estúdio, atualizando ao vivo. Grátis, sem cadastro.',
  noSignup: 'Sem cadastro',
  freeForever: 'Grátis para sempre',
  runsInBrowser: 'Roda no navegador',
  featuresBadge: 'Por que SerpCraft',
  featuresTitle: 'Tudo que uma página precisa para SEO, em um estúdio',
  featuresSubtitle:
    'Substitui a dança de cinco ferramentas: geradores de meta tags, verificadores de prévias sociais, construtores de JSON-LD, ferramentas de prévia SERP e geradores de robots.txt.',
  toolsBadge: 'Conjunto de ferramentas',
  toolsTitle: 'Oito ferramentas focadas, um estúdio unificado',
  toolsSubtitle:
    'Cada ferramenta tem sua própria página com conteúdo SEO otimizado. Use o estúdio para o fluxo completo, ou vá direto a uma ferramenta.',
  howBadge: 'Como funciona',
  howTitle: 'De página em branco a totalmente etiquetada em minutos',
  serpBadge: 'SERP com precisão de pixel',
  serpTitle: 'Google trunca por largura de pixel. Nossa prévia também.',
  serpSubtitle:
    'A maioria dos geradores de meta tags mostra um contador de caracteres. Isso está errado. Google corta títulos em ~580px e descrições em 920px — largura de pixel, não caracteres.',
  comparisonBadge: 'A diferença',
  comparisonTitle: 'Um estúdio vs. cinco ferramentas separadas',
  faqBadge: 'FAQ',
  faqTitle: 'Perguntas comuns',
  ctaTitle: 'Pare de alternar entre cinco abas.',
  ctaSubtitle:
    'Configure todo o SEO da sua página — meta tags, prévias sociais, dados estruturados, robots.txt — de uma vez. Grátis, sem cadastro.',
  footerTools: 'Ferramentas',
  footerCompany: 'Empresa',
  footerAbout: 'Sobre',
  footerPrivacy: 'Privacidade',
  footerTerms: 'Termos',
  footerRights: 'Todos os direitos reservados.',
  error404Title: 'Página não encontrada',
  error404Desc:
    'A página que você procura não existe ou pode ter sido movida. Tente voltar à página inicial ou abrir o estúdio SEO.',
  backToHome: 'Voltar ao início',
  error500Title: 'Algo deu errado',
  error500Desc:
    'Ocorreu um erro inesperado. Seu trabalho está seguro — tudo é armazenado localmente no seu navegador. Tente recarregar a página.',
  refreshPage: 'Recarregar página',
  toggleTheme: 'Alternar tema',
  language: 'Idioma',
};

const ja: UITranslations = {
  navStudio: 'スタジオ',
  navTools: 'ツール',
  navAbout: '概要',
  openStudio: 'スタジオを開く',
  browseTools: 'ツールを見る',
  heroBadge: 'オールインワンSEOスタジオ',
  heroTitlePrefix: 'ページのSEO設定をすべて',
  heroTitleHighlight: '一箇所で',
  heroTitleSuffix: '。',
  heroSubtitle:
    '5つのツールを行き来するのはもう終わり。メタタグ、ソーシャルプレビュー、JSON-LD構造化データ、ピクセル精度のSERP、robots.txt — すべて1つのスタジオで、入力しながらリアルタイム更新。無料、登録不要。',
  noSignup: '登録不要',
  freeForever: '永久無料',
  runsInBrowser: 'ブラウザで動作',
  featuresBadge: 'SerpCraftの理由',
  featuresTitle: 'ページのSEOに必要なすべて、1つのスタジオで',
  featuresSubtitle:
    'メタタグジェネレーター、ソーシャルプレビューチェッカー、JSON-LDビルダー、SERPプレビューツール、robots.txtジェネレーターの5ツール間の往復を置き換えます。',
  toolsBadge: 'ツールスイート',
  toolsTitle: '8つの専門ツール、1つの統合スタジオ',
  toolsSubtitle:
    '各ツールには最適化されたSEOコンテンツを備えた専用ページがあります。フルワークフローにはスタジオを、個別ツールには直接アクセスを。',
  howBadge: '使い方',
  howTitle: '空白のページから完全タグ付けまで数分で',
  serpBadge: 'ピクセル精度のSERP',
  serpTitle: 'Googleはピクセル幅で切り詰めます。プレビューも同じ。',
  serpSubtitle:
    'ほとんどのメタタグジェネレーターは文字数カウンターを表示します。それは間違っています。Googleはタイトルを約580px、説明を920pxで切り詰めます — ピクセル幅であり、文字数ではありません。',
  comparisonBadge: '違い',
  comparisonTitle: '1つのスタジオ vs. 5つの別々のツール',
  faqBadge: 'よくある質問',
  faqTitle: 'よくある質問',
  ctaTitle: '5つのタブを行き来するのは終わりに。',
  ctaSubtitle:
    'ページのSEO設定をすべて — メタタグ、ソーシャルプレビュー、構造化データ、robots.txt — 一度に。無料、登録不要。',
  footerTools: 'ツール',
  footerCompany: '会社',
  footerAbout: '概要',
  footerPrivacy: 'プライバシー',
  footerTerms: '利用規約',
  footerRights: '全著作権所有。',
  error404Title: 'ページが見つかりません',
  error404Desc:
    'お探しのページは存在しないか、移動された可能性があります。ホームページに戻るか、SEOスタジオを開いてみてください。',
  backToHome: 'ホームに戻る',
  error500Title: 'エラーが発生しました',
  error500Desc:
    '予期しないエラーが発生しました。あなたの作業は安全です — すべてブラウザにローカル保存されています。ページを更新してみてください。',
  refreshPage: 'ページを更新',
  toggleTheme: 'テーマ切替',
  language: '言語',
};

const translations: Record<Locale, UITranslations> = { en, es, fr, de, pt, ja };

export function getTranslations(locale: Locale): UITranslations {
  return translations[locale] || translations.en;
}

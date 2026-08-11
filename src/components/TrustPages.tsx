import { SmartLink } from '@/components/SmartLink';
import { ChevronRight } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-1.5 text-sm text-ink-muted dark:text-sand-400 mb-6">
        <SmartLink to="/" className="hover:text-choco-600 dark:hover:text-choco-400 transition-colors">Home</SmartLink>
        <ChevronRight size={14} />
        <span className="text-ink dark:text-sand-50 font-medium">About</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-ink dark:text-sand-50 tracking-tight mb-6">
        About SerpCraft
      </h1>

      <div className="prose-meta">
        <p>
          SerpCraft is a free, all-in-one SEO studio for generating meta tags, social previews, JSON-LD structured data, and robots.txt — built by marketers and developers who got tired of bouncing between five different tools every time they published a new page.
        </p>

        <h2>The problem we are solving</h2>
        <p>
          To properly SEO a single page today, you typically need five tools: a meta tag generator, a social preview checker, a JSON-LD generator, a SERP preview tool, and a robots.txt generator. Each is a separate site, a separate tab, and a separate copy-paste round. None of them remember your brand or save your work. Every visit is a blank slate.
        </p>

        <h2>What SerpCraft does differently</h2>
        <p>
          SerpCraft puts everything in one place. You enter your title once and see it update in the Google, Facebook, X, LinkedIn, Slack, and Discord previews simultaneously. You generate JSON-LD structured data right next to your meta tags. You build your robots.txt without leaving the studio. And you save a brand profile once, so every new page inherits your defaults.
        </p>

        <h2>Privacy first</h2>
        <p>
          Everything runs in your browser. Your page setups, brand profile, and generated tags never leave your device. There is no server-side processing of your content. We do not require an account, and we do not track what you type. The site is supported by unobtrusive advertising.
        </p>

        <h2>Accuracy and transparency</h2>
        <p>
          The Google SERP preview measures actual pixel width — not character count — following Google's documented truncation behavior. The JSON-LD generator produces valid schema.org markup for the most common types. The social previews simulate each platform's rendering from the values you enter. We are transparent about what the tool does and does not do, and we recommend testing with Google's Rich Results Test and platform debuggers after publishing.
        </p>

        <h2>Free, forever</h2>
        <p>
          The core studio is and will remain free with no signup required. We believe aligned incentives — genuinely free, no account walls, no gated features — win in the long run. The site is supported by advertising and relevant affiliate placements, never by selling your data.
        </p>
      </div>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-1.5 text-sm text-ink-muted dark:text-sand-400 mb-6">
        <SmartLink to="/" className="hover:text-choco-600 dark:hover:text-choco-400 transition-colors">Home</SmartLink>
        <ChevronRight size={14} />
        <span className="text-ink dark:text-sand-50 font-medium">Privacy</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-ink dark:text-sand-50 tracking-tight mb-6">
        Privacy Policy
      </h1>

      <div className="prose-meta">
        <p><em>Last updated: {new Date().toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' })}</em></p>

        <h2>Summary</h2>
        <p>
          SerpCraft does not collect personal data. All data you enter into the tool — page setups, brand profiles, generated tags — is stored locally in your browser and never sent to our servers. We use privacy-friendly analytics to understand aggregate traffic patterns. Third-party advertising partners may use cookies as described below.
        </p>

        <h2>Data you enter</h2>
        <p>
          All data you enter into SerpCraft — titles, descriptions, URLs, images, schema data, brand profile, saved page setups — is stored exclusively in your browser's local storage. It is never transmitted to our servers. Clearing your browser data will delete your saved setups and brand profile.
        </p>

        <h2>Analytics</h2>
        <p>
          We use privacy-friendly analytics to understand which pages are visited and how the site is used. This data is aggregate and anonymous — it is not linked to your identity or to the content you enter into the tool.
        </p>

        <h2>Advertising</h2>
        <p>
          SerpCraft displays ads through third-party advertising partners (such as Google AdSense). These partners may use cookies to serve relevant ads. You can opt out of personalized advertising through your browser settings or the ad partner's opt-out tools. Ad partners may collect: cookie data, IP address (anonymized), browser type, device type, and pages visited on this site.
        </p>

        <h2>Cookies</h2>
        <p>
          SerpCraft itself does not set tracking cookies. Third-party advertising and analytics partners may set cookies. You can control cookies through your browser settings.
        </p>

        <h2>Third-party links</h2>
        <p>
          This site contains links to third-party tools and resources (Google's Rich Results Test, Facebook Sharing Debugger, etc.). We are not responsible for the privacy practices of those sites.
        </p>

        <h2>Children's privacy</h2>
        <p>
          SerpCraft is not directed at children under 13. We do not knowingly collect data from children.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          We may update this privacy policy from time to time. Changes will be posted on this page with an updated date.
        </p>
      </div>
    </div>
  );
}

export function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-1.5 text-sm text-ink-muted dark:text-sand-400 mb-6">
        <SmartLink to="/" className="hover:text-choco-600 dark:hover:text-choco-400 transition-colors">Home</SmartLink>
        <ChevronRight size={14} />
        <span className="text-ink dark:text-sand-50 font-medium">Terms</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-ink dark:text-sand-50 tracking-tight mb-6">
        Terms of Service
      </h1>

      <div className="prose-meta">
        <p><em>Last updated: {new Date().toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' })}</em></p>

        <h2>Acceptance of terms</h2>
        <p>
          By using SerpCraft, you agree to these terms. If you do not agree, do not use the tool.
        </p>

        <h2>The service</h2>
        <p>
          SerpCraft is a free, browser-based tool for generating SEO meta tags, social previews, JSON-LD structured data, and robots.txt files. The tool runs entirely in your browser and does not require an account.
        </p>

        <h2>Accuracy of output</h2>
        <p>
          SerpCraft generates meta tags, structured data, and previews based on the values you enter. While we strive for accuracy, the output is a starting point. Search engines and social platforms may render or interpret your tags differently. You are responsible for testing your tags with the appropriate tools (Google's Rich Results Test, platform debuggers) before and after publishing. We are not liable for how search engines or social platforms display your content.
        </p>

        <h2>Acceptable use</h2>
        <p>
          You agree not to use SerpCraft to generate tags or structured data for pages that contain illegal content, malware, or content that violates applicable laws. You are responsible for the content you generate.
        </p>

        <h2>Intellectual property</h2>
        <p>
          The SerpCraft tool, its design, and its code are the property of SerpCraft. The output you generate — meta tags, JSON-LD, robots.txt — belongs to you and is free to use on your sites.
        </p>

        <h2>No warranty</h2>
        <p>
          SerpCraft is provided "as is" without warranty of any kind. We do not guarantee that the tool will be error-free, uninterrupted, or that the generated output will result in specific search rankings or social preview appearances.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          SerpCraft is a free tool. We are not liable for any damages arising from the use or inability to use the tool, including but not limited to lost revenue, lost data, or business interruption.
        </p>

        <h2>Changes to terms</h2>
        <p>
          We may update these terms from time to time. Continued use of SerpCraft after changes constitutes acceptance of the updated terms.
        </p>
      </div>
    </div>
  );
}

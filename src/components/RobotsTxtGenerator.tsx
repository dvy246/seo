import type { RobotsRules } from '@/types';
import { generateRobotsTxt } from '@/lib/generators';
import { CodeBlock } from '@/components/CodeOutput';
import { Bot } from 'lucide-react';

interface RobotsTxtGeneratorProps {
  rules: RobotsRules;
  onChange: (rules: RobotsRules) => void;
}

export function RobotsTxtGenerator({ rules, onChange }: RobotsTxtGeneratorProps) {
  const update = (field: keyof RobotsRules, value: string) => {
    onChange({ ...rules, [field]: value });
  };

  const output = generateRobotsTxt(rules);

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-1">
        <Bot size={18} className="text-choco-500" />
        <h3 className="text-sm font-semibold text-ink dark:text-sand-100">Robots.txt Generator</h3>
      </div>
      <p className="text-xs text-ink-muted dark:text-sand-400 mb-4">
        Control how search engine crawlers access your site. Place the generated file at the root of your domain.
      </p>

      <div className="grid md:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="field-label">User-agent</label>
          <select
            className="field-input cursor-pointer dark:bg-sand-900 dark:text-sand-100"
            value={rules.userAgent}
            onChange={(e) => update('userAgent', e.target.value)}
          >
            <option value="*" className="dark:bg-sand-900 dark:text-sand-100">All crawlers (*)</option>
            <option value="Googlebot" className="dark:bg-sand-900 dark:text-sand-100">Google</option>
            <option value="Bingbot" className="dark:bg-sand-900 dark:text-sand-100">Bing</option>
            <option value="DuckDuckBot" className="dark:bg-sand-900 dark:text-sand-100">DuckDuckGo</option>
            <option value="Slurp" className="dark:bg-sand-900 dark:text-sand-100">Yahoo</option>
            <option value="Baiduspider" className="dark:bg-sand-900 dark:text-sand-100">Baidu</option>
            <option value="YandexBot" className="dark:bg-sand-900 dark:text-sand-100">Yandex</option>
          </select>
          <p className="field-hint">Which crawler these rules apply to.</p>
        </div>
        <div>
          <label className="field-label">Crawl-delay (seconds)</label>
          <input
            type="text"
            className="field-input"
            value={rules.crawlDelay}
            onChange={(e) => update('crawlDelay', e.target.value)}
            placeholder="e.g. 10"
          />
          <p className="field-hint">Optional. Delay between requests. Ignored by Google.</p>
        </div>
        <div>
          <label className="field-label">Allow</label>
          <input
            type="text"
            className="field-input"
            value={rules.allow}
            onChange={(e) => update('allow', e.target.value)}
            placeholder="e.g. / or /public/"
          />
          <p className="field-hint">Paths to allow. Usually "/" (everything).</p>
        </div>
        <div>
          <label className="field-label">Disallow</label>
          <textarea
            className="field-input min-h-[60px] resize-y font-mono text-[13px]"
            value={rules.disallow}
            onChange={(e) => update('disallow', e.target.value)}
            placeholder="/admin/&#10;/private/&#10;/cart/"
            rows={3}
          />
          <p className="field-hint">One path per line. Paths you don't want crawled.</p>
        </div>
        <div className="md:col-span-2">
          <label className="field-label">Sitemap URL</label>
          <input
            type="url"
            className="field-input"
            value={rules.sitemapUrl}
            onChange={(e) => update('sitemapUrl', e.target.value)}
            placeholder="https://example.com/sitemap.xml"
          />
          <p className="field-hint">Full URL to your XML sitemap. Helps crawlers discover all pages.</p>
        </div>
      </div>

      <CodeBlock label="robots.txt" code={output} language="text" filename="robots.txt" maxHeight="300px" />
    </div>
  );
}

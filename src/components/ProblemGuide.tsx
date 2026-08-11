import { SmartLink } from '@/components/SmartLink';
import { AlertTriangle, Wrench, Search, ArrowRight, BookOpen, Lightbulb } from 'lucide-react';
import type { ProblemGuide as ProblemGuideData } from '@/data/problems';

export function ProblemGuide({ guide }: { guide: ProblemGuideData }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
      {/* Symptom */}
      <div className="rounded-xl border border-warning/30 bg-warning/5 p-5">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-warning" />
          <h2 className="text-sm font-semibold text-ink dark:text-sand-50 uppercase tracking-wide">The symptom</h2>
        </div>
        <p className="text-sm text-ink-soft dark:text-sand-300 leading-relaxed">{guide.symptom}</p>
      </div>

      {/* Why it happens */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-4 h-4 text-choco-600 dark:text-choco-400" />
          <h2 className="text-lg font-semibold text-ink dark:text-sand-50">Why it happens</h2>
        </div>
        <ul className="space-y-2.5">
          {guide.whyItHappens.map((reason, i) => (
            <li key={i} className="flex gap-3 text-sm text-ink-soft dark:text-sand-300 leading-relaxed">
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-choco-500 mt-2" />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Diagnose */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-4 h-4 text-pastel-600 dark:text-pastel-300" />
          <h2 className="text-lg font-semibold text-ink dark:text-sand-50">Diagnose it — in order</h2>
        </div>
        <ol className="space-y-3">
          {guide.diagnose.map((step, i) => (
            <li key={i} className="card p-4">
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-pastel-500/10 text-pastel-600 dark:text-pastel-300 text-xs font-semibold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-ink dark:text-sand-50">{step.step}</p>
                  <p className="text-sm text-ink-soft dark:text-sand-300 mt-1 leading-relaxed">{step.detail}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Fix */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Wrench className="w-4 h-4 text-success" />
          <h2 className="text-lg font-semibold text-ink dark:text-sand-50">How to fix it</h2>
        </div>
        <ol className="space-y-3">
          {guide.fixes.map((step, i) => (
            <li key={i} className="card p-4">
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-success/10 text-success text-xs font-semibold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-ink dark:text-sand-50">{step.step}</p>
                  <p className="text-sm text-ink-soft dark:text-sand-300 mt-1 leading-relaxed">{step.detail}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Related tools */}
      {guide.relatedTools.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-ink-muted dark:text-sand-400" />
            <h2 className="text-sm font-semibold text-ink dark:text-sand-50 uppercase tracking-wide">Free tools that help</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {guide.relatedTools.map((tool) => (
              <SmartLink key={tool.path} to={tool.path} className="chip bg-sand-100 dark:bg-sand-800 text-ink-soft dark:text-sand-300 hover:bg-sand-200 dark:hover:bg-sand-700 transition-colors">
                {tool.label}
              </SmartLink>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <div className="card p-6 text-center">
        <h3 className="text-lg font-semibold text-ink dark:text-sand-50 mb-1">Still not sure what your page is sending?</h3>
        <p className="text-sm text-ink-soft dark:text-sand-300 mb-4">
          Run your URL through the free URL Debugger — it shows the raw HTML evidence, redirects, headers, and what Googlebot and Facebook each receive.
        </p>
        <SmartLink to="/url-debugger" className="btn btn-primary">
          Debug a URL free <ArrowRight className="w-4 h-4" />
        </SmartLink>
      </div>
    </div>
  );
}

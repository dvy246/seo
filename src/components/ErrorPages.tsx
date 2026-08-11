import { SmartLink } from '@/components/SmartLink';
import { Home, ArrowLeft, AlertTriangle, ServerOff, Search } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-lg text-center">
        <div className="relative inline-flex mb-8">
          <div className="absolute inset-0 bg-choco-200/40 blur-2xl rounded-full" />
          <div className="relative w-20 h-20 rounded-2xl bg-choco-50 flex items-center justify-center">
            <AlertTriangle size={36} className="text-choco-500" />
          </div>
        </div>
        <div className="font-serif text-7xl font-semibold text-choco-300 mb-2">404</div>
        <h1 className="font-serif text-2xl font-semibold text-ink mb-3">Page not found</h1>
        <p className="text-ink-soft leading-relaxed mb-8">
          The page you're looking for doesn't exist or may have been moved. Try heading back to the homepage or opening the SEO studio.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <SmartLink to="/" className="btn-primary">
            <Home size={16} /> Back to home
          </SmartLink>
          <SmartLink to="/studio" className="btn-secondary">
            <Search size={16} /> Open the Studio
          </SmartLink>
        </div>
        <div className="mt-10 pt-8 border-t border-sand-200">
          <p className="text-sm text-ink-muted mb-3">Or try one of these tools:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { label: 'Meta Tag Generator', path: '/meta-tag-generator' },
              { label: 'JSON-LD Generator', path: '/json-ld-generator' },
              { label: 'SERP Preview', path: '/serp-preview-tool' },
              { label: 'Robots.txt', path: '/robots-txt-generator' },
            ].map((t) => (
              <SmartLink
                key={t.path}
                to={t.path}
                className="chip bg-sand-100 text-ink-soft hover:bg-sand-200 transition-colors"
              >
                {t.label}
              </SmartLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ServerErrorPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-lg text-center">
        <div className="relative inline-flex mb-8">
          <div className="absolute inset-0 bg-error/20 blur-2xl rounded-full" />
          <div className="relative w-20 h-20 rounded-2xl bg-error/10 flex items-center justify-center">
            <ServerOff size={36} className="text-error" />
          </div>
        </div>
        <div className="font-serif text-7xl font-semibold text-choco-300 mb-2">500</div>
        <h1 className="font-serif text-2xl font-semibold text-ink mb-3">Something went wrong</h1>
        <p className="text-ink-soft leading-relaxed mb-8">
          An unexpected error occurred on our end. Your work is safe — everything is stored locally in your browser. Try refreshing the page or going back home.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => window.location.reload()} className="btn-primary">
            <ArrowLeft size={16} /> Refresh page
          </button>
          <SmartLink to="/" className="btn-secondary">
            <Home size={16} /> Back to home
          </SmartLink>
        </div>
      </div>
    </div>
  );
}

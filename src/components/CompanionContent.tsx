import { useState } from 'react';
import { companionContent } from '@/data/content';
import { ChevronDown, HelpCircle } from 'lucide-react';

export function CompanionContent({ path }: { path: string }) {
  const content = companionContent[path];
  if (!content) return null;

  return (
    <div className="prose-meta max-w-3xl">
      <p className="text-base text-ink-soft dark:text-sand-300 leading-relaxed">{content.intro}</p>

      {content.sections.map((section, i) => (
        <div key={i}>
          <h2>{section.heading}</h2>
          <p>{section.body}</p>
        </div>
      ))}

      {content.faq.length > 0 && (
        <>
          <h2>Frequently Asked Questions</h2>
          <div className="space-y-3 mt-4">
            {content.faq.map((item, i) => (
              <FaqItem key={i} question={item.question} answer={item.answer} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border border-sand-200 dark:border-sand-800 bg-white dark:bg-sand-900 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left hover:bg-sand-50 dark:hover:bg-sand-800 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <HelpCircle size={16} className="text-choco-500 flex-none" />
          <span className="text-sm font-medium text-ink dark:text-sand-100">{question}</span>
        </div>
        <ChevronDown size={16} className={`text-ink-muted dark:text-sand-400 flex-none transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-4 pb-4 pl-11 animate-slide-up">
          <p className="text-sm text-ink-soft dark:text-sand-300 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

// Inject FAQ schema for structured data on content pages
export function getFaqJsonLd(path: string): string | null {
  const content = companionContent[path];
  if (!content || content.faq.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faq.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
  return JSON.stringify(schema);
}

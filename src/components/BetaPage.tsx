import { useState } from 'react';
import { Mail, ArrowRight, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useTheme } from '@/lib/useTheme';

export interface FormData {
  name: string;
  email: string;
  company: string;
  stagingUrl: string;
  productionUrl: string;
  useCase: string;
}

export function BetaPage() {
  const { theme } = useTheme();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    stagingUrl: '',
    productionUrl: '',
    useCase: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validateStep1 = () => {
    const newErrors: Partial<FormData> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.company.trim()) newErrors.company = 'Company/role is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Partial<FormData> = {};
    if (!formData.stagingUrl.trim()) newErrors.stagingUrl = 'Staging URL is required';
    else if (!/^https?:\/\/.+/.test(formData.stagingUrl)) newErrors.stagingUrl = 'Must be a valid URL';
    if (!formData.productionUrl.trim()) newErrors.productionUrl = 'Production URL is required';
    else if (!/^https?:\/\/.+/.test(formData.productionUrl)) newErrors.productionUrl = 'Must be a valid URL';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!validateStep1()) return;
      setStep(2);
    } else if (step === 2) {
      if (!validateStep2()) return;
      setSubmitting(true);
      setSubmitError('');
      try {
        const response = await fetch('/api/beta-signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error('Signup failed');
        setSubmitted(true);
        setStep(3);
      } catch (err) {
        setSubmitError('Something went wrong. Please email beta@serpcraft.app directly.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full text-center">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100'}`}>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-3">You're on the list!</h1>
          <p className="text-muted-foreground mb-6">
            Thanks for signing up. We'll email you within 48 hours with your beta access link
            and next steps. In the meantime, check out our
            <a href="/pricing.md" className="text-primary underline hover:no-underline">pricing</a>
            and <a href="/llms.txt" className="text-primary underline hover:no-underline">llms.txt</a>.
          </p>
          <a href="/studio" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
            Try the current studio <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-3">SerpCraft Release Guard Beta</h1>
          <p className="text-muted-foreground text-lg">
            Compare staging vs production URLs. Catch SEO regressions before you ship.
          </p>
        </div>

        <div className={`rounded-2xl border p-8 ${theme === 'dark' ? 'border-neutral-800 bg-neutral-950' : 'border-neutral-200 bg-white'}`}>
          <div className="flex gap-2 mb-8">
            <div className={`flex-1 h-1.5 rounded ${step >= 1 ? 'bg-primary' : theme === 'dark' ? 'bg-neutral-700' : 'bg-neutral-200'}`} />
            <div className={`flex-1 h-1.5 rounded ${step >= 2 ? 'bg-primary' : theme === 'dark' ? 'bg-neutral-700' : 'bg-neutral-200'}`} />
            <div className={`flex-1 h-1.5 rounded ${step === 3 ? 'bg-primary' : theme === 'dark' ? 'bg-neutral-700' : 'bg-neutral-200'}`} />
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-xl font-semibold">Tell us about you</h2>
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => handleChange('name', e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-lg border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary ${errors.name ? 'border-red-500' : theme === 'dark' ? 'border-neutral-700' : 'border-neutral-300'}`}
                    placeholder="Your name"
                    autoFocus
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => handleChange('email', e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-lg border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary ${errors.email ? 'border-red-500' : theme === 'dark' ? 'border-neutral-700' : 'border-neutral-300'}`}
                    placeholder="you@company.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Company / Role</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={e => handleChange('company', e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-lg border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary ${errors.company ? 'border-red-500' : theme === 'dark' ? 'border-neutral-700' : 'border-neutral-300'}`}
                    placeholder="Acme Inc / SEO Lead"
                  />
                  {errors.company && <p className="mt-1 text-sm text-red-500">{errors.company}</p>}
                </div>
                <button
                  type="submit"
                  className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-xl font-semibold">Your URL pair</h2>
                <p className="text-sm text-muted-foreground">
                  We need a real staging and production URL to test the diff engine.
                  Both must be publicly accessible (no auth/firewall).
                </p>
                <div>
                  <label className="block text-sm font-medium mb-1">Staging URL</label>
                  <input
                    type="url"
                    value={formData.stagingUrl}
                    onChange={e => handleChange('stagingUrl', e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-lg border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary ${errors.stagingUrl ? 'border-red-500' : theme === 'dark' ? 'border-neutral-700' : 'border-neutral-300'}`}
                    placeholder="https://staging.example.com/page"
                  />
                  {errors.stagingUrl && <p className="mt-1 text-sm text-red-500">{errors.stagingUrl}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Production URL</label>
                  <input
                    type="url"
                    value={formData.productionUrl}
                    onChange={e => handleChange('productionUrl', e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-lg border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary ${errors.productionUrl ? 'border-red-500' : theme === 'dark' ? 'border-neutral-700' : 'border-neutral-300'}`}
                    placeholder="https://example.com/page"
                  />
                  {errors.productionUrl && <p className="mt-1 text-sm text-red-500">{errors.productionUrl}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Primary use case</label>
                  <select
                    value={formData.useCase}
                    onChange={e => handleChange('useCase', e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-lg border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary ${theme === 'dark' ? 'border-neutral-700' : 'border-neutral-300'}`}
                  >
                    <option value="">Select one</option>
                    <option value="staging-vs-prod">Staging vs Production (pre-deploy check)</option>
                    <option value="migration">Old URL → New URL (migration guard)</option>
                    <option value="regression">Regression watch (baseline comparison)</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                {submitError && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                    {submitError}
                  </div>
                )}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 px-6 border rounded-lg font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 px-6 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Join Beta <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground space-y-2">
          <p>By joining, you'll get:</p>
          <ul className="space-y-1 text-left max-w-xs mx-auto">
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Early access to Release Diff</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Free Pro tier for 6 months</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Direct line to founding team</li>
          </ul>
          <p className="mt-4">Questions? Email <a href="mailto:beta@serpcraft.app" className="underline hover:no-underline">beta@serpcraft.app</a></p>
        </div>
      </div>
    </div>
  );
}
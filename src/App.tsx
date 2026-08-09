import React from 'react';
import { useRouter } from '@/lib/router';
import { useDocumentHead } from '@/lib/useDocumentHead';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { StudioPage } from '@/components/StudioPage';
import { LandingPage } from '@/components/LandingPage';
import { AboutPage, PrivacyPage, TermsPage } from '@/components/TrustPages';
import { NotFoundPage, ServerErrorPage } from '@/components/ErrorPages';
import { pageMeta } from '@/data/pages';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {}
  render() {
    if (this.state.hasError) return <ServerErrorPage />;
    return this.props.children;
  }
}

function App() {
  const { path, locale } = useRouter();
  useDocumentHead(path);

  const isKnownPath = path === '/' || path === '/studio' || path === '/about' || path === '/privacy' || path === '/terms' || pageMeta[path];

  const renderPage = () => {
    if (!isKnownPath) return <NotFoundPage />;
    if (path === '/') return <LandingPage />;
    if (path === '/about') return <AboutPage />;
    if (path === '/privacy') return <PrivacyPage />;
    if (path === '/terms') return <TermsPage />;
    return <StudioPage path={path} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-sand-50 dark:bg-sand-950 transition-colors">
      <ErrorBoundary>
        <Header currentPath={path} locale={locale} />
        <main className="flex-1">{renderPage()}</main>
        <Footer />
      </ErrorBoundary>
    </div>
  );
}

export default App;

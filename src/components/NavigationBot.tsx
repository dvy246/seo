import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, ChevronRight, MessageSquare } from 'lucide-react';
import { SmartLink } from './SmartLink';

type Message = {
  id: string;
  sender: 'bot' | 'user';
  text: React.ReactNode;
  options?: Option[];
};

type Option = {
  label: string;
  action: () => void;
};

export function NavigationBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load state from sessionStorage on mount
  useEffect(() => {
    const savedState = sessionStorage.getItem('mf_navbot_open');
    if (savedState === 'true') {
      setIsOpen(true);
    }
    
    // Initialize if empty
    if (messages.length === 0) {
      showMainMenu();
    }
  }, []);

  // Save open state
  useEffect(() => {
    sessionStorage.setItem('mf_navbot_open', isOpen.toString());
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const addMessage = (msg: Omit<Message, 'id'>) => {
    setMessages(prev => [...prev, { ...msg, id: Math.random().toString(36).substring(7) }]);
  };

  const showMainMenu = () => {
    addMessage({
      sender: 'bot',
      text: "Hi! I'm your SerpCraft Guide. What area of search are you trying to improve today?",
      options: [
        { label: "Traditional SEO (Audits, Tags, Crawling)", action: () => handleCategorySelect("SEO") },
        { label: "AEO (Answer Engines & Rich Results)", action: () => handleCategorySelect("AEO") },
        { label: "GEO (AI Search & LLM Crawlers)", action: () => handleCategorySelect("GEO") },
      ]
    });
  };

  const handleCategorySelect = (category: "SEO" | "AEO" | "GEO") => {
    // Add user message
    addMessage({ sender: 'user', text: `I need help with ${category}.` });

    // Respond with sub-options
    setTimeout(() => {
      if (category === 'SEO') {
        addMessage({
          sender: 'bot',
          text: "Great! Traditional SEO covers how standard engines like Google index and rank your site. What's your specific goal?",
          options: [
            { label: "Audit a page's SEO score", action: () => handleRecommendation("I want to run an SEO audit.", "Use our Free SEO Check tool to run 21 automated checks.", "/seo-check") },
            { label: "Generate Meta & Social Tags", action: () => handleRecommendation("I need to make meta tags.", "Use the Social Meta Generator to build perfectly sized tags for Google, X, and Facebook.", "/social-meta") },
            { label: "See what a crawler actually sees", action: () => handleRecommendation("I want to debug a URL.", "Use the URL Debugger to see the raw HTML that search engine bots extract.", "/url-debugger") },
            { label: "Setup multilingual tags (hreflang)", action: () => handleRecommendation("I need help with international SEO.", "Use the Hreflang Generator to build valid language alternate links.", "/hreflang-generator") },
          ]
        });
      } else if (category === 'AEO') {
        addMessage({
          sender: 'bot',
          text: "Answer Engine Optimization relies heavily on Structured Data (JSON-LD) so AI summaries can extract pure facts. What do you need?",
          options: [
            { label: "Generate Schema.org markup", action: () => handleRecommendation("I need to generate Schema.", "Use the Schema Markup Generator to visually build valid JSON-LD for Articles, Products, etc.", "/schema-markup-generator") },
            { label: "Validate existing JSON-LD", action: () => handleRecommendation("I want to test my structured data.", "Use the JSON-LD Toolkit to validate your syntax.", "/json-ld") },
            { label: "Visual Interactive Workspace", action: () => handleRecommendation("I want a visual editor.", "Use the Visual SEO Studio to see how your tags and schema come together interactively.", "/visual-seo-studio") },
          ]
        });
      } else if (category === 'GEO') {
        addMessage({
          sender: 'bot',
          text: "Generative Engine Optimization ensures modern AI bots (like ChatGPT or Perplexity) can ingest your site. What's the goal?",
          options: [
            { label: "Create an llms.txt file", action: () => handleRecommendation("I want an llms.txt file.", "Use the llms.txt Generator to build a file that helps AI crawlers summarize your site.", "/llms-txt-generator") },
            { label: "Check if AI bots are blocked by JS", action: () => handleRecommendation("I want to see if AI can read my page.", "Use the URL Debugger to fetch your page exactly how an AI bot would see it.", "/url-debugger") },
          ]
        });
      }
    }, 400);
  };

  const handleRecommendation = (userText: string, botText: string, link: string) => {
    addMessage({ sender: 'user', text: userText });
    
    setTimeout(() => {
      addMessage({
        sender: 'bot',
        text: (
          <div className="space-y-3">
            <p>{botText}</p>
            <SmartLink to={link} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-choco-600 hover:bg-choco-700 text-white text-sm font-medium rounded-lg transition-colors">
              Go to Tool <ChevronRight className="w-4 h-4" />
            </SmartLink>
          </div>
        )
      });

      // Add a reset option shortly after
      setTimeout(() => {
        addMessage({
          sender: 'bot',
          text: "Need anything else?",
          options: [
            { label: "Start Over", action: () => showMainMenu() },
            { label: "No, thanks", action: () => setIsOpen(false) }
          ]
        });
      }, 1000);
    }, 500);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 print:hidden flex flex-col items-end">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-3 sm:mb-4 w-[calc(100vw-2rem)] sm:w-[340px] h-[75vh] sm:h-[480px] max-h-[70vh] bg-white dark:bg-sand-900 border border-sand-200 dark:border-sand-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-sand-50 dark:bg-sand-950 border-b border-sand-200 dark:border-sand-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-choco-100 dark:bg-choco-500/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-choco-600 dark:text-choco-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink dark:text-sand-50">SerpCraft Guide</h3>
                <p className="text-xs text-ink-muted dark:text-sand-400">Navigation Assistant</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-sand-400 hover:text-ink dark:hover:text-sand-100 rounded-lg hover:bg-sand-200 dark:hover:bg-sand-800 transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-sand-50/50 dark:bg-sand-900/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                  msg.sender === 'user' 
                    ? 'bg-choco-600 text-white rounded-br-none' 
                    : 'bg-white dark:bg-sand-800 border border-sand-200 dark:border-sand-700 text-ink dark:text-sand-100 rounded-bl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>

                {/* Options (only show if it's the latest bot message with options) */}
                {msg.options && msg.id === [...messages].reverse().find(m => !!m.options)?.id && (
                  <div className="mt-3 flex flex-col gap-2 w-full max-w-[90%]">
                    {msg.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={opt.action}
                        className="text-left text-sm px-4 py-2 rounded-xl border border-choco-200 dark:border-choco-500/30 bg-white dark:bg-sand-900 text-choco-700 dark:text-choco-300 hover:bg-choco-50 dark:hover:bg-choco-500/10 transition-colors shadow-sm"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-choco-600 hover:bg-choco-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center focus:ring-4 focus:ring-choco-500/30"
        aria-label="Open Navigation Guide"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>

    </div>
  );
}

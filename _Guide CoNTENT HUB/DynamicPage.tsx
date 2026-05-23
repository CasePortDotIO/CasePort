import React, { useMemo } from 'react';
import { useLocation } from 'wouter';
import allPagesData from '../lib/allPagesData.json';

interface PageData {
  slug: string;
  title: string;
  description: string;
  readTime: string;
  author: {
    name: string;
    title: string;
    credentials: string;
  };
  attorneyReviewed: boolean;
  heroStats?: Array<{ number: string; label: string }>;
  directAnswer?: { title: string; content: string };
  keyTakeaways?: string[];
  sections?: Array<{
    title: string;
    content: string;
    subsections?: Array<{ title: string; content: string }>;
  }>;
  faq?: Array<{ question: string; answer: string }>;
  relatedArticles?: Array<{ title: string; description: string; slug: string }>;
  cta?: { text: string; description: string };
  schemaMarkup?: any;
}

export const DynamicPage: React.FC = () => {
  const [location] = useLocation();
  
  const pageData = useMemo(() => {
    const pathParts = location.split('/').filter(Boolean);
    const data = allPagesData as any;
    
    if (pathParts[0] !== 'guides' || pathParts.length < 2) {
      return null;
    }

    // Handle different URL structures
    if (pathParts[1] === 'faq' && pathParts[2]) {
      // FAQ page: /guides/faq/[slug]
      // Search for matching FAQ by comparing slug
      for (const [key, page] of Object.entries(data.faqPages || {})) {
        if ((page as any).slug === pathParts[2]) {
          return page;
        }
      }
    } else if (pathParts[1] === 'states' && pathParts[2]) {
      // State page: /guides/states/[state]
      // Search for matching state by comparing slug
      for (const [key, page] of Object.entries(data.statePages || {})) {
        if ((page as any).slug === pathParts[2]) {
          return page;
        }
      }
    } else if (pathParts[1] === 'cities' && pathParts[2]) {
      // City page: /guides/cities/[city]
      // Search for matching city by comparing slug
      for (const [key, page] of Object.entries(data.cityPages || {})) {
        if ((page as any).slug === pathParts[2]) {
          return page;
        }
      }
    } else if (pathParts.length === 2) {
      // Pillar page: /guides/[pillar]
      // Search for matching pillar by comparing slug
      for (const [key, page] of Object.entries(data.pillarPages || {})) {
        if ((page as any).slug === pathParts[1]) {
          return page;
        }
      }
    } else if (pathParts.length === 3) {
      // Sub-page: /guides/[pillar]/[subpage]
      // Search for matching sub-page by comparing slug
      for (const [key, page] of Object.entries(data.subPages || {})) {
        if ((page as any).slug === `${pathParts[1]}/${pathParts[2]}`) {
          return page;
        }
      }
    }
    
    return null;
  }, [location]);

  if (!pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Page Not Found</h1>
          <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
          <a href="/guides" className="mt-6 inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
            Back to Guides
          </a>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IndoaXRlIi8+PC9zdmc+')] opacity-5"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          {(pageData as any).category && (
            <span className="inline-block px-3 py-1 bg-teal-600 text-white text-sm font-semibold rounded-full mb-4">
              {(pageData as any).category}
            </span>
          )}
          
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-4 leading-tight">
            {(pageData as any).title}
          </h1>
          
          <p className="text-xl text-slate-200 mb-6 max-w-2xl mx-auto">
            {(pageData as any).description}
          </p>
          
          <div className="flex items-center justify-center gap-6 text-slate-300">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00-.293.707l-.707.707a1 1 0 101.414 1.414L9 9.414V6z" />
              </svg>
              {(pageData as any).readTime} read
            </span>
            
            {(pageData as any).attorneyReviewed && (
              <span className="flex items-center gap-2 text-teal-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Attorney Reviewed
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Author Info */}
      {(pageData as any).author && (
        <section className="border-b border-border bg-card">
          <div className="max-w-4xl mx-auto px-4 py-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-lg">
              {(pageData as any).author.name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-foreground">{(pageData as any).author.name}</p>
              <p className="text-sm text-muted-foreground">{(pageData as any).author.title}</p>
              <p className="text-xs text-muted-foreground">{(pageData as any).author.credentials}</p>
            </div>
          </div>
        </section>
      )}

      {/* Hero Stats */}
      {(pageData as any).heroStats && (pageData as any).heroStats.length > 0 && (
        <section className="bg-background border-b border-border">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="grid grid-cols-3 gap-8">
              {(pageData as any).heroStats.map((stat: any, idx: number) => (
                <div key={idx} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">
                    {stat.number}
                  </p>
                  <p className="text-sm text-muted-foreground uppercase tracking-wide">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Direct Answer */}
      {(pageData as any).directAnswer && (
        <section className="bg-background border-b border-border">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="bg-teal-600 text-white rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-4">{(pageData as any).directAnswer.title}</h2>
              <p className="text-lg leading-relaxed">{(pageData as any).directAnswer.content}</p>
            </div>
          </div>
        </section>
      )}

      {/* Key Takeaways */}
      {(pageData as any).keyTakeaways && (pageData as any).keyTakeaways.length > 0 && (
        <section className="bg-background border-b border-border">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <h2 className="text-3xl font-bold text-foreground mb-8">Key Takeaways</h2>
            <div className="space-y-4">
              {(pageData as any).keyTakeaways.map((takeaway: string, idx: number) => (
                <div key={idx} className="flex gap-4 pb-4 border-l-4 border-teal-600 pl-4">
                  <p className="text-foreground leading-relaxed">{takeaway}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content Sections */}
      {(pageData as any).sections && (pageData as any).sections.length > 0 && (
        <section className="bg-background border-b border-border">
          <div className="max-w-4xl mx-auto px-4 py-12">
            {(pageData as any).sections.map((section: any, idx: number) => (
              <div key={idx} className="mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-6">{section.title}</h2>
                <div className="prose prose-invert max-w-none mb-6">
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">{section.content}</p>
                </div>
                
                {section.subsections && section.subsections.map((subsection: any, subIdx: number) => (
                  <div key={subIdx} className="mb-6 ml-4">
                    <h3 className="text-xl font-semibold text-foreground mb-3">{subsection.title}</h3>
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">{subsection.content}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {(pageData as any).faq && (pageData as any).faq.length > 0 && (
        <section className="bg-background border-b border-border">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <h2 className="text-3xl font-bold text-foreground mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {(pageData as any).faq.map((item: any, idx: number) => (
                <details key={idx} className="border border-border rounded-lg p-4 cursor-pointer hover:bg-card transition">
                  <summary className="font-semibold text-foreground">{item.question}</summary>
                  <p className="mt-4 text-muted-foreground leading-relaxed">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {(pageData as any).cta && (
        <section className="bg-teal-600 text-white">
          <div className="max-w-4xl mx-auto px-4 py-12 text-center">
            <h2 className="text-3xl font-bold mb-4">{(pageData as any).cta.text}</h2>
            <p className="text-lg mb-6 opacity-90">{(pageData as any).cta.description}</p>
            <button className="px-8 py-3 bg-white text-teal-600 font-bold rounded-lg hover:bg-slate-100 transition">
              {(pageData as any).cta.text}
            </button>
          </div>
        </section>
      )}

      {/* Related Articles */}
      {(pageData as any).relatedArticles && (pageData as any).relatedArticles.length > 0 && (
        <section className="bg-background border-b border-border">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <h2 className="text-3xl font-bold text-foreground mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(pageData as any).relatedArticles.map((article: any, idx: number) => (
                <a key={idx} href={`/guides/${article.slug}`} className="block p-4 border border-border rounded-lg hover:bg-card transition">
                  <h3 className="font-semibold text-foreground mb-2">{article.title}</h3>
                  <p className="text-sm text-muted-foreground">{article.description}</p>
                  <p className="text-teal-600 text-sm mt-3">Read More →</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
};

export default DynamicPage;

import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';
import Section from '../components/Section';
import FadeIn from '../components/FadeIn';
import { fetchPublishedBlogPosts, subscribeNewsletter } from '../lib/api';
import { usePageTitle } from '../hooks/usePageTitle';

interface DisplayPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  image: string;
}

const BlogPage: React.FC = () => {
  const { t, language } = useLanguage();
  usePageTitle(String(t('nav.blog')));
  const [activeCategory, setActiveCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState<DisplayPost[]>([]);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  useEffect(() => {
    const isIt = language === 'it';
    fetchPublishedBlogPosts()
      .then((rows) => {
        setPosts(
          rows.map((p) => ({
            slug: p.slug,
            title: isIt ? p.title_it : p.title_en,
            excerpt: isIt ? p.excerpt_it : p.excerpt_en,
            date: p.published_at
              ? new Date(p.published_at).toLocaleDateString(isIt ? 'it-IT' : 'en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              : '',
            author: p.author,
            category: p.blog_categories
              ? isIt
                ? p.blog_categories.name_it
                : p.blog_categories.name_en
              : '',
            image: p.image_url ?? '',
          })),
        );
      })
      .catch(() => {
        setPosts([]);
      });
  }, [language]);

  const categories = useMemo(() => {
    const set = new Set(posts.map((p) => p.category).filter(Boolean));
    return Array.from(set);
  }, [posts]);

  const filtered = useMemo(() => {
    return posts.filter((post) => {
      const matchCategory = activeCategory === 'all' || post.category === activeCategory;
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q || post.title.toLowerCase().includes(q) || post.excerpt.toLowerCase().includes(q);
      return matchCategory && matchQuery;
    });
  }, [activeCategory, query, posts]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterStatus('loading');
    try {
      await subscribeNewsletter(newsletterEmail);
      setNewsletterStatus('done');
      setNewsletterEmail('');
    } catch {
      setNewsletterStatus('error');
    }
  };

  return (
    <div>
      <PageHero
        title={t('blog.hero.title')}
        subtitle={t('blog.hero.subtitle')}
        image="https://images.pexels.com/photos/4270367/pexels-photo-4270367.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />

      <Section muted>
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex max-w-md flex-1 gap-2">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('blog.searchPlaceholder')}
              className="input-field"
              aria-label={t('blog.search')}
            />
          </div>
          <div className="flex snap-x gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`snap-start whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${
                activeCategory === 'all'
                  ? 'bg-brand-cyan text-white'
                  : 'bg-white text-ink-muted hover:bg-brand-cyan-soft'
              }`}
            >
              {t('blog.allCategories')}
            </button>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`snap-start whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${
                  activeCategory === category
                    ? 'bg-brand-cyan text-white'
                    : 'bg-white text-ink-muted hover:bg-brand-cyan-soft'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {featured ? (
          <>
            <FadeIn>
              <article className="mb-10 grid grid-cols-1 overflow-hidden border border-ink-soft/20 bg-white lg:grid-cols-2">
                <Link to={`/blog/${featured.slug}`} className="aspect-[16/10] lg:aspect-auto lg:min-h-[320px]">
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="h-full w-full object-cover"
                  />
                </Link>
                <div className="flex flex-col justify-center p-6 md:p-10">
                  <span className="mb-2 text-sm font-semibold text-brand-cyan">{featured.category}</span>
                  <h2 className="mb-3 font-display text-2xl font-bold text-ink md:text-3xl">
                    {featured.title}
                  </h2>
                  <p className="mb-5 leading-relaxed text-ink-muted">{featured.excerpt}</p>
                  <div className="mb-5 flex flex-wrap items-center gap-4 text-sm text-ink-soft">
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={14} /> {featured.date}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <User size={14} /> {featured.author}
                    </span>
                  </div>
                  <Link to={`/blog/${featured.slug}`} className="link-accent">
                    {t('common.readMore')} <ChevronRight size={14} className="ml-1" />
                  </Link>
                </div>
              </article>
            </FadeIn>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              {rest.map((post, i) => (
                <FadeIn key={post.slug} delay={i * 0.05}>
                  <article className="flex h-full flex-col border border-ink-soft/20 bg-white">
                    <Link to={`/blog/${post.slug}`} className="aspect-[16/10] overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col p-5">
                      <span className="mb-2 text-sm font-semibold text-brand-cyan">{post.category}</span>
                      <h3 className="mb-2 font-display text-lg font-semibold text-ink">{post.title}</h3>
                      <p className="mb-4 flex-1 text-sm leading-relaxed text-ink-muted">{post.excerpt}</p>
                      <div className="mb-3 flex flex-wrap gap-3 text-xs text-ink-soft">
                        <span className="inline-flex items-center gap-1">
                          <Calendar size={12} /> {post.date}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <User size={12} /> {post.author}
                        </span>
                      </div>
                      <Link to={`/blog/${post.slug}`} className="link-accent text-sm">
                        {t('common.readMore')} <ChevronRight size={14} className="ml-1" />
                      </Link>
                    </div>
                  </article>
                </FadeIn>
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-ink-muted">
            {language === 'it' ? 'Nessun articolo trovato.' : 'No articles found.'}
          </p>
        )}
      </Section>

      <section className="band-dark">
        <div className="container-page section-padding text-center">
          <FadeIn>
            <h2 className="heading-on-dark mb-4 text-2xl md:text-3xl">
              {t('blog.newsletter.title')}
            </h2>
            <p className="text-on-dark-muted mx-auto mb-8 max-w-2xl text-lg">
              {t('blog.newsletter.subtitle')}
            </p>
            <form
              className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
              onSubmit={handleNewsletter}
            >
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={t('blog.newsletter.placeholder')}
                className="input-field flex-1 border-0"
              />
              <button type="submit" className="btn-primary shrink-0" disabled={newsletterStatus === 'loading'}>
                {newsletterStatus === 'loading'
                  ? language === 'it'
                    ? '…'
                    : '…'
                  : t('blog.newsletter.button')}
              </button>
            </form>
            {newsletterStatus === 'done' && (
              <p className="mt-4 text-sm text-brand-cyan">
                {language === 'it' ? 'Iscrizione completata!' : 'Subscribed successfully!'}
              </p>
            )}
            {newsletterStatus === 'error' && (
              <p className="mt-4 text-sm text-red-300">
                {language === 'it' ? 'Iscrizione non riuscita.' : 'Subscription failed.'}
              </p>
            )}
          </FadeIn>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;

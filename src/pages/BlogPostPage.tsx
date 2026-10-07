import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LocalizedLink, useLocalizedPath } from '../i18n/LocalizedLink';
import { Calendar, CaretLeft, User } from '@phosphor-icons/react';
import { PUBLIC_ICON_WEIGHT } from '../components/ui/Icon';
import { useLanguage } from '../context/LanguageContext';
import Section from '../components/Section';
import FadeIn from '../components/FadeIn';
import { fetchBlogPostBySlug } from '../lib/api';
import Seo from '../seo/Seo';
import { articleSchema, breadcrumbSchema, dentistSchema, graph, physicianSchema, websiteSchema } from '../seo/schema';
import { ASSETS } from '../config/assets';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language, t } = useLanguage();
  const localize = useLocalizedPath();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<{
    title: string;
    excerpt: string;
    body: string;
    author: string;
    date: string;
    category: string;
    image: string;
  } | null>(null);


  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!slug) return;
      setLoading(true);
      try {
        const dbPost = await fetchBlogPostBySlug(slug);
        if (dbPost && !cancelled) {
          const isIt = language === 'it';
          setPost({
            title: isIt ? dbPost.title_it : dbPost.title_en,
            excerpt: isIt ? dbPost.excerpt_it : dbPost.excerpt_en,
            body: isIt ? dbPost.body_it : dbPost.body_en,
            author: dbPost.author,
            date: dbPost.published_at
              ? new Date(dbPost.published_at).toLocaleDateString(isIt ? 'it-IT' : 'en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              : '',
            category: dbPost.blog_categories
              ? isIt
                ? dbPost.blog_categories.name_it
                : dbPost.blog_categories.name_en
              : '',
            image: dbPost.image_url ?? ASSETS.about.hero,
          });
        } else if (!cancelled) {
          setPost(null);
        }
      } catch {
        if (!cancelled) setPost(null);
      }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [slug, language]);

  if (loading) {
    return (
      <Section>
        <p className="text-center text-ink-muted">{language === 'it' ? 'Caricamento…' : 'Loading…'}</p>
      </Section>
    );
  }

  if (!post) {
    return (
      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="heading-section mb-4">
            {language === 'it' ? 'Articolo non trovato' : 'Article not found'}
          </h1>
          <LocalizedLink to="/blog" className="link-accent inline-flex items-center gap-1">
            <CaretLeft size={16} weight={PUBLIC_ICON_WEIGHT} /> {language === 'it' ? 'Torna al blog' : 'Back to blog'}
          </LocalizedLink>
        </div>
      </Section>
    );
  }

  const postPath = localize(`/blog/${slug ?? ''}`);

  return (
    <div>
      <Seo
        title={post.title}
        description={post.excerpt}
        path={postPath}
        image={post.image}
        jsonLd={graph([
          dentistSchema(language),
          physicianSchema(),
          websiteSchema(language),
          breadcrumbSchema([
            { name: String(t('nav.home')), path: language === 'en' ? '/en' : '/' },
            { name: String(t('nav.blog')), path: localize('/blog') },
            { name: post.title, path: postPath },
          ]),
          articleSchema({
            title: post.title,
            description: post.excerpt,
            path: postPath,
            image: post.image,
            author: post.author,
          }),
        ])}
      />
      <Section>
        <FadeIn>
          <LocalizedLink to="/blog" className="link-accent mb-8 inline-flex items-center gap-1 text-sm">
            <CaretLeft size={16} weight={PUBLIC_ICON_WEIGHT} /> {language === 'it' ? 'Torna al blog' : 'Back to blog'}
          </LocalizedLink>
          {post.image && (
            <div className="mb-8 aspect-[21/9] overflow-hidden">
              <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
            </div>
          )}
          <span className="mb-2 block text-sm font-semibold text-brand-cyan">{post.category}</span>
          <h1 className="heading-section mb-4">{post.title}</h1>
          <div className="mb-8 flex flex-wrap items-center gap-4 text-sm text-ink-soft">
            <span className="inline-flex items-center gap-1">
              <Calendar size={14} weight={PUBLIC_ICON_WEIGHT} /> {post.date}
            </span>
            <span className="inline-flex items-center gap-1">
              <User size={14} weight={PUBLIC_ICON_WEIGHT} /> {post.author}
            </span>
          </div>
          <p className="mb-8 text-lg leading-relaxed text-ink-muted">{post.excerpt}</p>
          <div className="prose-blog whitespace-pre-wrap leading-relaxed text-ink-muted">{post.body}</div>
          <p className="mt-8 text-sm text-ink-soft">
            {t('about.doctor.reviewedBy')}
            {post.date ? ` · ${post.date}` : ''}
          </p>
        </FadeIn>
      </Section>
    </div>
  );
};

export default BlogPostPage;

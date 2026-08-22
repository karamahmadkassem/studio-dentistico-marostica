import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Send } from 'lucide-react';
import { adminApi } from '../../lib/api';
import { generateUniqueSlug } from '../../lib/slugify';
import type { BlogPost, BlogCategory } from '../../types/database';

const AdminBlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [newsletter, setNewsletter] = useState<{ count: number; recent: { email: string; subscribed_at: string }[] }>({ count: 0, recent: [] });
  const [editing, setEditing] = useState<Partial<BlogPost> | null>(null);
  const [newCat, setNewCat] = useState({ name_it: '', name_en: '' });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [p, c, n] = await Promise.all([
      adminApi.getBlogPosts(),
      adminApi.getBlogCategories(),
      adminApi.getNewsletter(),
    ]);
    setPosts(p);
    setCategories(c);
    setNewsletter(n);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const savePost = async () => {
    if (!editing) return;
    const payload = {
      ...editing,
      slug: generateUniqueSlug(
        editing.title_en || editing.title_it || 'post',
        posts.map((p) => p.slug),
        editing.id ? editing.slug : undefined,
      ),
    };
    if (editing.id) await adminApi.updateBlogPost(editing.id, payload);
    else await adminApi.createBlogPost(payload);
    setEditing(null);
    load();
  };

  const publish = async (id: string) => {
    if (!confirm('Publish and email all newsletter subscribers?')) return;
    await adminApi.publishBlogPost(id);
    load();
  };

  const addCategory = async () => {
    if (!newCat.name_en.trim() && !newCat.name_it.trim()) return;
    const slug = generateUniqueSlug(
      newCat.name_en || newCat.name_it || 'category',
      categories.map((c) => c.slug),
    );
    await adminApi.createBlogCategory({ ...newCat, slug, sort_order: categories.length });
    setNewCat({ name_it: '', name_en: '' });
    load();
  };

  const newPost = (): Partial<BlogPost> => ({
    title_it: '',
    title_en: '',
    excerpt_it: '',
    excerpt_en: '',
    body_it: '',
    body_en: '',
    author: '',
    published: false,
  });

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Blog</h1>
        <button type="button" className="btn-primary" onClick={() => setEditing(newPost())}>
          <Plus size={16} /> New post
        </button>
      </div>

      <div className="admin-card mb-6">
        <h2 className="font-display font-semibold text-ink">Newsletter subscribers</h2>
        <p className="mt-1 text-2xl font-bold text-brand-cyan">{newsletter.count}</p>
        <ul className="mt-3 max-h-32 overflow-y-auto text-sm text-ink-muted">
          {newsletter.recent.map((s) => (
            <li key={s.email}>{s.email} — {new Date(s.subscribed_at).toLocaleDateString()}</li>
          ))}
        </ul>
      </div>

      <div className="admin-card mb-6">
        <h2 className="mb-3 font-display font-semibold text-ink">Categories</h2>
        <div className="mb-3 flex flex-wrap gap-2">
          {categories.map((c) => (
            <span key={c.id} className="inline-flex items-center gap-2 rounded-md bg-surface-muted px-3 py-1 text-sm">
              {c.name_en}
              <button type="button" className="text-red-600" onClick={() => adminApi.deleteBlogCategory(c.id).then(load)}><Trash2 size={14} /></button>
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <input className="input-field w-40" placeholder="Name IT" value={newCat.name_it} onChange={(e) => setNewCat({ ...newCat, name_it: e.target.value })} />
          <input className="input-field w-40" placeholder="Name EN" value={newCat.name_en} onChange={(e) => setNewCat({ ...newCat, name_en: e.target.value })} />
          <button type="button" className="btn-navy px-4 py-2 text-sm" onClick={addCategory}>Add</button>
        </div>
      </div>

      {loading ? <p>Loading…</p> : (
        <div className="space-y-3">
          {posts.map((p) => (
            <div key={p.id} className="admin-card flex justify-between gap-4">
              <div>
                <p className="font-semibold">{p.title_en}</p>
                <p className="text-sm text-ink-muted">{p.published ? 'Published' : 'Draft'}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" className="admin-icon-btn" onClick={() => setEditing(p)}>Edit</button>
                {!p.published && (
                  <button type="button" className="btn-primary text-sm" onClick={() => publish(p.id)}><Send size={14} /> Publish</button>
                )}
                <button type="button" className="admin-icon-btn text-red-600" onClick={() => adminApi.deleteBlogPost(p.id).then(load)}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="admin-modal-overlay" onClick={() => setEditing(null)}>
          <div className="admin-modal admin-modal--wide max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="heading-section text-lg">{editing.id ? 'Edit post' : 'New post'}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(['title_it', 'title_en', 'author', 'image_url'] as const).map((f) => (
                <div key={f} className={f.includes('title') ? 'sm:col-span-2' : ''}>
                  <label className="label-field">{f.replace('_', ' ')}</label>
                  <input className="input-field" value={(editing[f] as string) ?? ''} onChange={(e) => setEditing({ ...editing, [f]: e.target.value })} />
                </div>
              ))}
              <div>
                <label className="label-field">Category</label>
                <select className="input-field" value={editing.category_id ?? ''} onChange={(e) => setEditing({ ...editing, category_id: e.target.value || null })}>
                  <option value="">None</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name_en}</option>)}
                </select>
              </div>
              {(['excerpt_it', 'excerpt_en', 'body_it', 'body_en'] as const).map((f) => (
                <div key={f} className="sm:col-span-2">
                  <label className="label-field">{f.replace('_', ' ')}</label>
                  <textarea className="input-field" rows={f.startsWith('body') ? 8 : 2} value={(editing[f] as string) ?? ''} onChange={(e) => setEditing({ ...editing, [f]: e.target.value })} />
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-2">
              <button type="button" className="btn-primary" onClick={savePost}>Save draft</button>
              <button type="button" className="btn-white border" onClick={() => setEditing(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogPage;

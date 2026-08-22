import { getFunctionsUrl, isSupabaseConfigured, supabase } from './supabase';
import type { OpeningHour, Service, SlotInfo } from '../types/database';

const SESSION_KEY = 'sdm-admin-token';

export function getAdminToken(): string | null {
  return sessionStorage.getItem(SESSION_KEY);
}

export function setAdminToken(token: string) {
  sessionStorage.setItem(SESSION_KEY, token);
}

export function clearAdminToken() {
  sessionStorage.removeItem(SESSION_KEY);
}

async function publicFetch(path: string, options: RequestInit = {}) {
  const base = getFunctionsUrl();
  if (!base) throw new Error('Supabase not configured');
  const res = await fetch(`${base}/${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

async function adminFetch(path: string, options: RequestInit = {}) {
  const token = getAdminToken();
  if (!token) throw new Error('Not authenticated');
  const base = getFunctionsUrl();
  const res = await fetch(`${base}/admin-api/${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  const data = await res.json();
  if (res.status === 401) {
    clearAdminToken();
    throw new Error('Session expired');
  }
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// --- Public API ---
export async function fetchAvailability(date: string): Promise<{ isClosed: boolean; slots: SlotInfo[] }> {
  if (!isSupabaseConfigured) return { isClosed: false, slots: [] };
  return publicFetch(`get-availability?date=${date}`);
}

export async function createBooking(payload: Record<string, unknown>) {
  return publicFetch('create-booking', { method: 'POST', body: JSON.stringify(payload) });
}

export async function subscribeNewsletter(email: string) {
  return publicFetch('subscribe-newsletter', { method: 'POST', body: JSON.stringify({ email }) });
}

export async function submitReview(token: string, payload: Record<string, unknown>) {
  return publicFetch(`submit-review?token=${token}`, { method: 'POST', body: JSON.stringify(payload) });
}

export async function fetchPublishedServices(lang: 'it' | 'en'): Promise<Service[]> {
  if (!supabase) return [];
  const { data } = await supabase.from('services').select('*').eq('published', true).order('sort_order');
  return (data ?? []).map((s) => ({
    ...s,
    details_it: Array.isArray(s.details_it) ? s.details_it : JSON.parse(s.details_it || '[]'),
    details_en: Array.isArray(s.details_en) ? s.details_en : JSON.parse(s.details_en || '[]'),
  }));
}

export async function fetchPublishedReviews() {
  if (!supabase) return [];
  const { data } = await supabase.from('reviews').select('*').eq('status', 'published').order('created_at', { ascending: false });
  return data ?? [];
}

export async function fetchPublishedBlogPosts() {
  if (!supabase) return [];
  const { data } = await supabase
    .from('blog_posts')
    .select('*, blog_categories(name_it, name_en, slug)')
    .eq('published', true)
    .order('published_at', { ascending: false });
  return data ?? [];
}

export async function fetchBlogPostBySlug(slug: string) {
  if (!supabase) return null;
  const { data } = await supabase
    .from('blog_posts')
    .select('*, blog_categories(name_it, name_en, slug)')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();
  return data;
}

export async function fetchAboutSections() {
  if (!supabase) return [];
  const { data } = await supabase.from('about_sections').select('*');
  return data ?? [];
}

export async function fetchOpeningHoursPublic(): Promise<OpeningHour[]> {
  if (!supabase) return [];
  const { data } = await supabase.from('opening_hours').select('*').order('day_of_week');
  return data ?? [];
}

// --- Admin API ---
export async function adminLogin(username: string, password: string) {
  const data = await publicFetch('admin-login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  setAdminToken(data.token);
  return data;
}

export async function adminLogout() {
  const token = getAdminToken();
  try {
    if (token && isSupabaseConfigured) {
      await fetch(`${getFunctionsUrl()}/admin-me`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  } finally {
    clearAdminToken();
  }
}

export async function adminCheckSession() {
  const token = getAdminToken();
  if (!token || !isSupabaseConfigured) return false;
  const res = await fetch(`${getFunctionsUrl()}/admin-me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.ok;
}

export const adminApi = {
  getAppointments: (from?: string, to?: string) => {
    const q = new URLSearchParams();
    if (from) q.set('from', from);
    if (to) q.set('to', to);
    return adminFetch(`appointments?${q}`);
  },
  updateAppointment: (id: string, body: Record<string, unknown>) =>
    adminFetch(`appointments/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  sendReviewInvite: (id: string) =>
    adminFetch(`appointments/${id}/send-review`, { method: 'POST' }),
  cancelAppointment: (id: string, reason?: string) =>
    adminFetch(`appointments/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason: reason ?? '' }),
    }),
  getOpeningHours: () => adminFetch('opening-hours'),
  saveOpeningHours: (hours: OpeningHour[]) =>
    adminFetch('opening-hours', { method: 'PUT', body: JSON.stringify(hours) }),
  getServices: () => adminFetch('services'),
  createService: (body: Record<string, unknown>) =>
    adminFetch('services', { method: 'POST', body: JSON.stringify(body) }),
  updateService: (id: string, body: Record<string, unknown>) =>
    adminFetch(`services/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteService: (id: string) => adminFetch(`services/${id}`, { method: 'DELETE' }),
  reorderServices: (order: string[]) =>
    adminFetch('services/reorder', { method: 'POST', body: JSON.stringify({ order }) }),
  getAbout: () => adminFetch('about'),
  saveAbout: (section_key: string, content: Record<string, unknown>) =>
    adminFetch('about', { method: 'PUT', body: JSON.stringify({ section_key, content }) }),
  getBlogCategories: () => adminFetch('blog/categories'),
  createBlogCategory: (body: Record<string, unknown>) =>
    adminFetch('blog/categories', { method: 'POST', body: JSON.stringify(body) }),
  deleteBlogCategory: (id: string) => adminFetch(`blog/categories/${id}`, { method: 'DELETE' }),
  getBlogPosts: () => adminFetch('blog/posts'),
  createBlogPost: (body: Record<string, unknown>) =>
    adminFetch('blog/posts', { method: 'POST', body: JSON.stringify(body) }),
  updateBlogPost: (id: string, body: Record<string, unknown>) =>
    adminFetch(`blog/posts/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteBlogPost: (id: string) => adminFetch(`blog/posts/${id}`, { method: 'DELETE' }),
  publishBlogPost: (id: string) => adminFetch(`blog/posts/${id}/publish`, { method: 'POST' }),
  getNewsletter: () => adminFetch('newsletter'),
  getReviews: (status?: string) => adminFetch(`reviews${status ? `?status=${status}` : ''}`),
  updateReview: (id: string, body: Record<string, unknown>) =>
    adminFetch(`reviews/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
};

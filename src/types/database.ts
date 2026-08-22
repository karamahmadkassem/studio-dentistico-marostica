export type AppointmentStatus = 'pending' | 'accepted' | 'review_sent' | 'cancelled';
export type ReviewStatus = 'pending' | 'published' | 'archived';

export interface Service {
  id: string;
  slug: string;
  icon_key: string;
  title_it: string;
  title_en: string;
  description_it: string;
  description_en: string;
  details_it: string[];
  details_en: string[];
  sort_order: number;
  published: boolean;
}

export interface Appointment {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  service_id: string | null;
  service_name: string;
  appointment_date: string;
  appointment_time: string;
  message: string | null;
  status: AppointmentStatus;
  cancellation_reason?: string | null;
  locale: string;
  created_at: string;
}

export interface OpeningHour {
  day_of_week: number;
  is_closed: boolean;
  open_time: string | null;
  close_time: string | null;
}

export interface BlogPost {
  id: string;
  slug: string;
  title_it: string;
  title_en: string;
  excerpt_it: string;
  excerpt_en: string;
  body_it: string;
  body_en: string;
  author: string;
  category_id: string | null;
  image_url: string | null;
  published: boolean;
  published_at: string | null;
  blog_categories?: { name_it: string; name_en: string } | null;
}

export interface BlogCategory {
  id: string;
  slug: string;
  name_it: string;
  name_en: string;
  sort_order: number;
}

export interface Review {
  id: string;
  name: string;
  email: string | null;
  rating: number;
  treatment_type: string;
  body: string;
  status: ReviewStatus;
  helpful_count: number;
  created_at: string;
}

export interface AboutSection {
  section_key: string;
  content: Record<string, unknown>;
}

export interface SlotInfo {
  time: string;
  available: boolean;
}

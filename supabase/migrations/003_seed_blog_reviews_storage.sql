-- Seed blog posts and published reviews; create blog images storage bucket

INSERT INTO blog_posts (slug, title_it, title_en, excerpt_it, excerpt_en, body_it, body_en, author, category_id, image_url, published, published_at)
SELECT
  'prevenzione-salute-orale',
  'L''importanza della prevenzione nella salute orale',
  'The importance of prevention in oral health',
  'La prevenzione è fondamentale per mantenere denti e gengive sani.',
  'Prevention is essential for healthy teeth and gums.',
  'La prevenzione resta il pilastro della salute orale.',
  'Prevention remains the cornerstone of oral health.',
  'Dott. Alessandro Bianchi',
  bc.id,
  'https://images.pexels.com/photos/3845126/pexels-photo-3845126.jpeg?auto=compress&cs=tinysrgb&w=1200',
  true,
  '2025-05-15T10:00:00Z'
FROM blog_categories bc WHERE bc.slug = 'prevenzione'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO blog_posts (slug, title_it, title_en, excerpt_it, excerpt_en, body_it, body_en, author, category_id, image_url, published, published_at)
SELECT
  'implantologia-carico-immediato',
  'Implantologia a carico immediato: denti fissi in un giorno',
  'Immediate-load implantology: fixed teeth in one day',
  'Sostituire i denti mancanti in una sola seduta.',
  'Replace missing teeth in a single session.',
  'Protocolli avanzati e pianificazione digitale.',
  'Advanced protocols and digital planning.',
  'Dott. Roberto Verdi',
  bc.id,
  'https://images.pexels.com/photos/4269696/pexels-photo-4269696.jpeg?auto=compress&cs=tinysrgb&w=1200',
  true,
  '2025-04-10T10:00:00Z'
FROM blog_categories bc WHERE bc.slug = 'implantologia'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO blog_posts (slug, title_it, title_en, excerpt_it, excerpt_en, body_it, body_en, author, category_id, image_url, published, published_at)
SELECT
  'sbiancamento-miti-verita',
  'Sbiancamento dentale: miti e verità',
  'Teeth whitening: myths and facts',
  'Come ottenere un sorriso più bianco in sicurezza.',
  'How to brighten your smile safely.',
  'Lo sbiancamento professionale è sicuro ed efficace.',
  'Professional whitening is safe and effective.',
  'Dott. Alessandro Bianchi',
  bc.id,
  'https://images.pexels.com/photos/3762453/pexels-photo-3762453.jpeg?auto=compress&cs=tinysrgb&w=1200',
  true,
  '2025-04-02T10:00:00Z'
FROM blog_categories bc WHERE bc.slug = 'estetica'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO reviews (name, rating, treatment_type, body, status, helpful_count, created_at)
SELECT * FROM (VALUES
  ('Marco Rossi', 5, 'Implantologia', 'Ottimo studio dentistico! Il Dott. Bianchi è un professionista eccellente.', 'published'::review_status, 12, '2025-05-15T10:00:00Z'::timestamptz),
  ('Giulia Bianchi', 5, 'Estetica Dentale', 'Ho sempre avuto paura del dentista, ma qui mi sono sentita subito a mio agio.', 'published'::review_status, 8, '2025-04-28T10:00:00Z'::timestamptz),
  ('Luca Verdi', 4, 'Chirurgia Orale', 'Esperienza positiva per un intervento di estrazione del dente del giudizio.', 'published'::review_status, 6, '2025-04-10T10:00:00Z'::timestamptz),
  ('Sofia Russo', 5, 'Estetica Dentale', 'Ho fatto uno sbiancamento dentale e sono rimasta molto soddisfatta del risultato.', 'published'::review_status, 10, '2025-04-02T10:00:00Z'::timestamptz),
  ('Elena Martini', 5, 'Odontoiatria Pediatrica', 'Esperienza fantastica per la prima visita di mio figlio.', 'published'::review_status, 15, '2025-03-05T10:00:00Z'::timestamptz)
) AS v(name, rating, treatment_type, body, status, helpful_count, created_at)
WHERE NOT EXISTS (SELECT 1 FROM reviews LIMIT 1);

-- Storage bucket for blog images (public read)
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY blog_images_public_read ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-images');

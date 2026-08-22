-- Seed admin user (password: changeme — CHANGE IMMEDIATELY after first login)
-- bcrypt hash for 'changeme' cost 12
INSERT INTO admin_users (username, password_hash) VALUES (
  'admin',
  '$2b$12$8UxKFjUurxNQLeFtXiCAMObldgY1714zJjsTOJSvymh6sGfu5rKWm'
) ON CONFLICT (username) DO NOTHING;

INSERT INTO services (slug, icon_key, title_it, title_en, description_it, description_en, details_it, details_en, sort_order) VALUES
('general', 'smile', 'Odontoiatria generale', 'General dentistry',
 'Cure di base per mantenere la salute orale e prevenire problemi dentali.',
 'Essential care to maintain oral health and prevent problems.',
 '["Controlli periodici e prevenzione","Pulizia professionale e detartrasi","Otturazioni estetiche in composito","Trattamenti di canali radicolari","Estrazioni semplici e complesse"]',
 '["Regular check-ups and prevention","Professional cleaning and scaling","Aesthetic composite fillings","Root canal treatments","Simple and complex extractions"]', 1),
('implants', 'activity', 'Implantologia', 'Implantology',
 'Sostituzione di denti mancanti con impianti di alta qualità per un risultato naturale.',
 'Replacement of missing teeth with high-quality implants.',
 '["Impianti dentali in titanio","Riabilitazioni complete","All-on-4 e All-on-6","Rigenerazione ossea guidata","Rialzo del seno mascellare"]',
 '["Titanium dental implants","Full rehabilitations","All-on-4 and All-on-6","Guided bone regeneration","Sinus lift"]', 2),
('aesthetics', 'heart', 'Estetica dentale', 'Dental aesthetics',
 'Procedure per migliorare l''aspetto del tuo sorriso con risultati naturali.',
 'Procedures to enhance your smile with natural results.',
 '["Sbiancamento dentale professionale","Faccette in ceramica","Corone estetiche","Ricostruzioni in composito","Digital Smile Design"]',
 '["Professional teeth whitening","Ceramic veneers","Aesthetic crowns","Composite reconstructions","Digital Smile Design"]', 3),
('prosthetics', 'layers', 'Protesi dentarie', 'Dental prosthetics',
 'Riabilitazioni protesiche personalizzate per funzionalità ed estetica.',
 'Custom prosthetic rehabilitations for function and aesthetics.',
 '["Corone e ponti fissi","Protesi parziali removibili","Protesi totali","Protesi su impianti","Materiali di ultima generazione"]',
 '["Fixed crowns and bridges","Removable partial dentures","Complete dentures","Implant-supported prostheses","Latest-generation materials"]', 4),
('periodontics', 'leaf', 'Parodontologia', 'Periodontics',
 'Terapie dedicate alla salute di gengive e parodonto.',
 'Therapies dedicated to gum and periodontal health.',
 '["Diagnosi e trattamento delle gengiviti","Terapia per la parodontite","Levigatura radicolare","Chirurgia parodontale","Mantenimento parodontale"]',
 '["Diagnosis and treatment of gingivitis","Periodontitis therapy","Root planing","Periodontal surgery","Periodontal maintenance"]', 5),
('pediatric', 'baby', 'Odontoiatria pediatrica', 'Pediatric dentistry',
 'Cure gentili e specializzate per i più piccoli.',
 'Gentle, specialized care for children.',
 '["Controlli regolari per bambini","Sigillature dei solchi","Fluoroprofilassi","Trattamenti conservativi","Educazione all''igiene orale"]',
 '["Regular check-ups for children","Fissure sealants","Fluoride treatment","Conservative treatments","Oral hygiene education"]', 6),
('surgery', 'scissors', 'Chirurgia orale', 'Oral surgery',
 'Interventi chirurgici precisi per casi complessi.',
 'Precise surgical procedures for complex cases.',
 '["Estrazione denti del giudizio","Chirurgia pre-protesica","Biopsia dei tessuti orali","Asportazione di cisti","Chirurgia ossea ricostruttiva"]',
 '["Wisdom tooth extraction","Pre-prosthetic surgery","Oral tissue biopsy","Cyst removal","Reconstructive bone surgery"]', 7)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO about_sections (section_key, content) VALUES
('mission', '{"title_it":"La nostra missione","title_en":"Our mission","p1_it":"Forniamo cure odontoiatriche di alta qualità in un ambiente confortevole e accogliente.","p1_en":"We provide high-quality dental care in a comfortable, welcoming environment.","p2_it":"Crediamo nella prevenzione e nell''educazione del paziente.","p2_en":"We believe in prevention and patient education."}'),
('values', '{"items":[{"key":"excellence","title_it":"Eccellenza","title_en":"Excellence","desc_it":"Qualità elevata in ogni fase del percorso di cura.","desc_en":"High quality at every stage of care."},{"key":"integrity","title_it":"Integrità","title_en":"Integrity","desc_it":"Onestà e trasparenza nelle decisioni cliniche.","desc_en":"Honesty and transparency in clinical decisions."},{"key":"innovation","title_it":"Innovazione","title_en":"Innovation","desc_it":"Tecnologie e metodi aggiornati.","desc_en":"Updated technology and methods."},{"key":"empathy","title_it":"Empatia","title_en":"Empathy","desc_it":"Ascolto e comfort per ogni paziente.","desc_en":"Listening and comfort for every patient."}]}'),
('history', '{"items":[{"year":"2005","title_it":"Gli inizi","title_en":"The beginning","text_it":"Lo Studio nasce a Marostica.","text_en":"The practice was founded in Marostica."},{"year":"Oggi","title_it":"Punto di riferimento","title_en":"A trusted reference","text_it":"Riconosciuti per professionalità e innovazione.","text_en":"Known for professionalism and innovation."}]}'),
('team', '{"members":[{"name":"Dott. Alessandro Bianchi","role_it":"Direttore Sanitario | Odontoiatra","role_en":"Medical Director | Dentist","bio_it":"Specializzato in Implantologia e Chirurgia Orale.","bio_en":"Specialized in implantology and oral surgery.","image":"https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=800"},{"name":"Dott.ssa Maria Rossi","role_it":"Odontoiatra","role_en":"Dentist","bio_it":"Esperta in trattamenti per adulti e bambini.","bio_en":"Expert in treatments for adults and children.","image":"https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=800"}]}'),
('technology', '{"title_it":"Tecnologia all''avanguardia","title_en":"Cutting-edge technology","content_it":"Investiamo in strumenti moderni per trattamenti precisi e confortevoli.","content_en":"We invest in modern tools for precise, comfortable treatments.","items_it":["Scanner intraorali digitali 3D","Radiografie digitali a bassa emissione","Sistemi CAD/CAM","Laser dentali minimamente invasivi"],"items_en":["3D intraoral scanners","Low-dose digital radiography","CAD/CAM systems","Minimally invasive dental lasers"]}')
ON CONFLICT (section_key) DO NOTHING;

INSERT INTO blog_categories (slug, name_it, name_en, sort_order) VALUES
('prevenzione', 'Prevenzione', 'Prevention', 1),
('implantologia', 'Implantologia', 'Implantology', 2),
('estetica', 'Estetica Dentale', 'Dental aesthetics', 3),
('alimentazione', 'Alimentazione', 'Nutrition', 4)
ON CONFLICT (slug) DO NOTHING;

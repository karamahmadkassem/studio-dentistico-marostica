-- Real clinic data: opening hours, services, Google reviews, about intro

UPDATE opening_hours SET is_closed = true, open_time = NULL, close_time = NULL, updated_at = now()
WHERE day_of_week = 0;

UPDATE opening_hours SET is_closed = false, open_time = '09:00', close_time = '13:00', updated_at = now()
WHERE day_of_week = 1;

UPDATE opening_hours SET is_closed = false, open_time = '09:00', close_time = '19:30', updated_at = now()
WHERE day_of_week = 2;

UPDATE opening_hours SET is_closed = false, open_time = '09:00', close_time = '13:00', updated_at = now()
WHERE day_of_week = 3;

UPDATE opening_hours SET is_closed = false, open_time = '09:00', close_time = '19:30', updated_at = now()
WHERE day_of_week = 4;

UPDATE opening_hours SET is_closed = false, open_time = '09:00', close_time = '13:00', updated_at = now()
WHERE day_of_week = 5;

UPDATE opening_hours SET is_closed = false, open_time = '09:00', close_time = '12:00', updated_at = now()
WHERE day_of_week = 6;

DELETE FROM services;

INSERT INTO services (slug, icon_key, title_it, title_en, description_it, description_en, details_it, details_en, sort_order, published) VALUES
('sbiancamento-dentale', 'sparkles', 'Sbiancamento dentale', 'Teeth whitening',
 'Trattamenti professionali per un sorriso più luminoso in sicurezza.',
 'Professional treatments for a brighter smile, safely.',
 '["Sbiancamento in studio","Valutazione del colore naturale","Protocolli personalizzati","Risultati visibili e naturali"]',
 '["In-office whitening","Natural shade assessment","Personalised protocols","Visible, natural results"]', 1, true),
('conservativa', 'smile', 'Conservativa', 'Restorative dentistry',
 'Otturazioni estetiche e cure per preservare i denti naturali.',
 'Aesthetic fillings and care to preserve natural teeth.',
 '["Otturazioni estetiche in composito","Ricostruzioni dentali","Cura delle carie","Materiali di alta qualità"]',
 '["Aesthetic composite fillings","Dental reconstructions","Cavity treatment","High-quality materials"]', 2, true),
('endodonzia', 'activity', 'Endodonzia', 'Endodontics',
 'Devitalizzazioni e ritrattamenti canalari con precisione.',
 'Root canal treatments and retreatments with precision.',
 '["Devitalizzazioni","Ritrattamenti endodontici","Cura del dolore acuto","Salvataggio dei denti naturali"]',
 '["Root canal therapy","Endodontic retreatments","Acute pain relief","Saving natural teeth"]', 3, true),
('chirurgia-orale', 'scissors', 'Chirurgia orale', 'Oral surgery',
 'Interventi semplici ed estrazioni, inclusi denti del giudizio.',
 'Simple surgery and extractions, including wisdom teeth.',
 '["Estrazioni dentali","Denti del giudizio","Chirurgia pre-protesica","Procedure mininvasive"]',
 '["Dental extractions","Wisdom teeth","Pre-prosthetic surgery","Minimally invasive procedures"]', 4, true),
('pedodonzia', 'baby', 'Pedodonzia (bambini)', 'Paediatric dentistry',
 'Approccio delicato per il primo sorriso dei più piccoli.',
 'A gentle approach for children''s first dental experiences.',
 '["Prima visita per bambini","Prevenzione e sigillature","Educazione all''igiene","Ambiente accogliente"]',
 '["First dental visits","Prevention and sealants","Hygiene education","Welcoming environment"]', 5, true),
('igiene-orale', 'leaf', 'Igiene orale', 'Oral hygiene',
 'Profilassi professionale e programmi di richiamo personalizzati.',
 'Professional hygiene and personalised recall programmes.',
 '["Detartrasi professionale","Igiene e lucidatura","Programmi di richiamo","Prevenzione gengivale"]',
 '["Professional scaling","Hygiene and polishing","Recall programmes","Gum prevention"]', 6, true),
('implantologia', 'activity', 'Implantologia', 'Implantology',
 'Impianti osteointegrati e riabilitazioni fisse su impianti.',
 'Osseointegrated implants and fixed implant rehabilitations.',
 '["Impianti dentali","Protesi su impianti","Pianificazione digitale","Riabilitazioni complete"]',
 '["Dental implants","Implant prosthetics","Digital planning","Full rehabilitations"]', 7, true),
('protesi', 'layers', 'Protesi', 'Prosthetics',
 'Protesi fissa e mobile su denti naturali e impianti.',
 'Fixed and removable prosthetics on natural teeth and implants.',
 '["Corone e ponti","Protesi parziali","Protesi complete","Soluzioni su impianti"]',
 '["Crowns and bridges","Partial dentures","Complete dentures","Implant solutions"]', 8, true),
('prevenzione', 'shield', 'Prevenzione', 'Prevention',
 'Visite di controllo e percorsi per mantenere la salute orale.',
 'Check-ups and pathways to maintain oral health.',
 '["Visite periodiche","Controlli gengivali","Piani personalizzati","Educazione del paziente"]',
 '["Regular check-ups","Gum assessments","Personalised plans","Patient education"]', 9, true),
('ortodonzia', 'align', 'Ortodonzia', 'Orthodontics',
 'Allineamento del sorriso con soluzioni su misura.',
 'Smile alignment with tailored orthodontic solutions.',
 '["Valutazione ortodontica","Apparecchi fissi e removibili","Allineamento estetico","Controllo nel tempo"]',
 '["Orthodontic assessment","Fixed and removable appliances","Aesthetic alignment","Long-term follow-up"]', 10, true),
('estetica-dentale', 'heart', 'Estetica dentale', 'Dental aesthetics',
 'Faccette estetiche e trattamenti per armonizzare il sorriso.',
 'Aesthetic veneers and treatments to harmonise your smile.',
 '["Faccette estetiche","Ricostruzioni estetiche","Armonizzazione del sorriso","Risultati naturali"]',
 '["Aesthetic veneers","Cosmetic reconstructions","Smile harmonisation","Natural results"]', 11, true);

DELETE FROM reviews;

INSERT INTO reviews (name, rating, treatment_type, body, status, helpful_count, created_at) VALUES
('racha', 5, 'Visita', 'Esperienza molto positiva! Staff gentile e professionale, ambiente pulito e accogliente. Ho apprezzato la competenza, la puntualità e l''attenzione dedicata al paziente. Consiglio vivamente lo Studio Dentistico Marostica a chi cerca un servizio di qualità. Complimenti a tutto il team!', 'published', 3, '2025-11-12T10:00:00Z'),
('Valentina Baggio', 5, 'Pedodonzia', 'Dentista super consigliato! Instaura un ottimo rapporto di fiducia con i pazienti adulti e lavora bene! É bravissimo anche con i bambini: prima esperienza dal dentista per nostro figlio, avevamo paura che uscisse spaventato e invece è molto fiero del suo dentista.', 'published', 5, '2025-10-28T10:00:00Z'),
('Alexandra Mariana Dalae', 5, 'Estetica dentale', 'Non posso che esprimere tutta la mia gratitudine per il lavoro straordinario svolto dal mio dentista. Grazie alla sua altissima professionalità, precisione e attenzione ai dettagli, oggi posso finalmente sorridere con sicurezza. Consiglio vivamente questo studio a chiunque cerchi qualità, serietà e risultati eccellenti.', 'published', 4, '2025-10-15T10:00:00Z'),
('Roberto Campagnolo', 5, 'Chirurgia orale', 'Sono riusciti a farmi passare la fifa del dentista, non avendo mai sentito dolore quando ho avuto bisogno del loro intervento. Dottore e assistente accoglienti e empatici ti mettono a tuo agio. Grazie', 'published', 2, '2025-09-20T10:00:00Z'),
('Dakhouya Aya', 5, 'Visita', 'Il dottore è bravissimo e ha sempre la battuta pronta, il che aiuta tantissimo a rilassarsi. L''infermiera poi è gentilissima, ti fa sentire subito il benvenuto appena entri. Sono un team fantastico e lavorano con una passione affascinante, per non parlare della professionalità. Bravissimi in tutti i campi, consigliatissimi.', 'published', 3, '2025-09-08T10:00:00Z'),
('Michele Brotto', 5, 'Visita', 'Consigliatissimo per la competenza e professionalità del Dottore e per la gentilezza e cordialità sia del Dottore che dell''assistente che vi fanno sentire a proprio agio. Grazie ancora per l''ottimo lavoro svolto.', 'published', 2, '2025-08-30T10:00:00Z'),
('Narciso Marabese', 5, 'Visita', 'Ottima esperienza, ottima qualità/prezzo. Ma soprattutto mi è stato fatto un ottimo lavoro, piacevole è stata anche la gentilezza e la cordialità sia del dottore che dell'' assistente.', 'published', 1, '2025-08-12T10:00:00Z'),
('Romina Moretto', 1, 'Implantologia', 'La mia peggiore esperienza dentistica. Fatto un impianto tolto con infezione dopo 3 mesi, mentre prendeva l''impronta con la pasta nel togliere mi ha spostato la paletta davanti, ora sono con paletta dolorante, e senza il dente tolto a causa infezione impianto ma con una piccola protesi di ripiego che è impossibile da portare.', 'published', 0, '2025-07-22T10:00:00Z'),
('racha', 5, 'Visita', 'Grande professionalità e attenzione ai dettagli. Le spiegazioni sui trattamenti sono chiare e complete. Sono molto soddisfatto del risultato! Consigliatissimo!', 'published', 1, '2025-07-10T10:00:00Z'),
('Stefania Siben', 5, 'Igiene orale', 'Ho trovato gentilezza e professionalità. Ottima pulizia dei denti! Grazie.', 'published', 1, '2025-06-18T10:00:00Z'),
('Samantha Crestani', 5, 'Visita', 'Qui trovate cordialità e professionalità e per chi ha quel piccolo incubo da dentista come me vi mettono a vostro agio!', 'published', 2, '2025-06-02T10:00:00Z'),
('Nereo Viero', 5, 'Estetica dentale', 'Dolce la assistente è un raggio di sole illumina la giornata dal dentista. Complimenti al medico per il suo operato per il mio nuovo sorriso. Consigliatissimo!', 'published', 2, '2025-05-20T10:00:00Z'),
('Alessandro Da Rugna', 5, 'Pedodonzia', 'Sono venuto allo Studio Dentistico Marostica in quanto il mio precedente dentista ha raggiunto l''età pensionabile. Qui ho trovato un''equipe medica a dir poco eccezionale! Cordialità, simpatia, empatia e professionalità. Consiglio a tutti, in modo particolare a tutte le mamme che dovranno accompagnare i loro piccoli dal dentista.', 'published', 4, '2025-04-14T10:00:00Z'),
('Ivano Morello', 5, 'Visita', 'Ho trovato in questo studio dentistico sicurezza, professionalità e simpatia per il dottore e la sua assistente', 'published', 1, '2025-03-28T10:00:00Z'),
('Gianluca Ranzato', 5, 'Urgenza', 'Per una emergenza sono andato presso Studio Dentistico Marostica, ho trovato professionalità, pulizia, serietà e cortesia. Grazie infinite a tutto lo staff.', 'published', 2, '2025-03-10T10:00:00Z'),
('Davide Zanin', 5, 'Visita', 'Professionalità e simpatia. Finalmente uno studio dentistico dove mi sento a mio agio.', 'published', 1, '2025-02-22T10:00:00Z'),
('Rushana Bikulova', 5, 'Estetica dentale', 'Cordialità, professionalità e pulizia. Qui trovate il sorriso perfetto.', 'published', 1, '2025-02-05T10:00:00Z'),
('Jasmine Zanon', 5, 'Visita', 'Studio dentistico nel centro di Marostica, dove la professionalità e la gentilezza ne fanno da padrone. Il dottore e la sua assistente sono davvero molto carini e professionali, sempre pronti ad aiutare e dare consigli per il miglior risultato possibile. La cura dei denti e del paziente sempre al primo posto. Bravissimi.', 'published', 3, '2025-01-18T10:00:00Z');

UPDATE about_sections SET content = jsonb_set(
  content,
  '{p1_it}',
  '"Lo Studio Dentistico Marostica è un luogo dove la relazione tra medico e paziente è sempre al centro delle cure, grazie a un team altamente specializzato in un ambiente accogliente e rilassante."'
) WHERE section_key = 'mission';

UPDATE about_sections SET content = jsonb_set(
  content,
  '{p1_en}',
  '"Studio Dentistico Marostica is a place where the doctor-patient relationship is always at the heart of care, thanks to a highly specialised team in a welcoming, relaxing environment."'
) WHERE section_key = 'mission';

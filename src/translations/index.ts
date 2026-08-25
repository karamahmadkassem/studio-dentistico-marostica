export type Language = 'it' | 'en';

type TranslationValue = string | string[] | { [key: string]: TranslationValue };

export const translations: Record<Language, TranslationValue> = {
  it: {
    nav: {
      home: 'Home',
      services: 'Servizi',
      about: 'Chi Siamo',
      blog: 'Blog',
      reviews: 'Recensioni',
      contact: 'Contatti',
    },
    common: {
      brand: 'Studio Dentistico Marostica',
      readMore: 'Leggi di più',
      bookAppointment: 'Prenota una visita',
      callNow: 'Chiama ora',
      learnMore: 'Scopri di più',
      allServices: 'Tutti i servizi',
      sendMessage: 'Invia messaggio',
      privacy: 'Privacy Policy',
      terms: 'Termini e Condizioni',
      menu: 'Menu',
      included: 'Cosa include',
      viewAllReviews: 'Tutte le recensioni',
      contactUs: 'Contattaci',
      fabBook: 'Prenota',
      fabWhatsApp: 'WhatsApp',
      fabCall: 'Chiama',
    },
    home: {
      hero: {
        title: 'Il tuo sorriso merita il meglio',
        subtitle: 'Cure odontoiatriche di eccellenza a Marostica, in un ambiente moderno e accogliente.',
        cta: 'Prenota una visita',
        secondary: 'I nostri servizi',
      },
      features: {
        title: 'Perché sceglierci',
        subtitle: 'Un approccio chiaro, tecnologico e umano.',
        flexible: {
          title: 'Appuntamenti flessibili',
          description: 'Orari pensati per te, anche serali.',
        },
        technology: {
          title: 'Tecnologia avanzata',
          description: 'Strumentazione digitale per diagnosi precise e trattamenti confortevoli.',
        },
        team: {
          title: 'Team esperto',
          description: 'Professionisti qualificati e in continuo aggiornamento.',
        },
      },
      services: {
        title: 'I nostri servizi',
        subtitle: 'Trattamenti completi per ogni esigenza.',
        cta: 'Tutti i servizi',
        learnMore: 'Scopri di più',
      },
      about: {
        title: 'Chi siamo',
        content:
          'Il Dott. Moustapha Mourtada unisce formazione universitaria, esperienza clinica e un approccio umano centrato su prevenzione e cura del paziente.',
        more: 'Scopri di più su di noi',
      },
      testimonials: {
        title: 'Cosa dicono i nostri pazienti',
        subtitle: 'La fiducia di chi si affida a noi ogni giorno.',
      },
      cta: {
        title: 'Prenota una visita oggi',
        subtitle: 'Siamo pronti ad accoglierti e a prenderti cura del tuo sorriso.',
        button: 'Contattaci ora',
      },
    },
    services: {
      hero: {
        title: 'I nostri servizi',
        subtitle: 'Trattamenti odontoiatrici avanzati per ogni età.',
      },
      intro: {
        title: 'Soluzioni dentali complete',
        content:
          'Offriamo cure personalizzate e di alta qualità in un ambiente confortevole, con tecnologie moderne e un team dedicato.',
      },
      services: {
        included: 'Cosa include',
        'general-dentistry': {
          title: 'Odontoiatria generale',
          description:
            'Prevenzione, cure conservative e trattamenti per mantenere denti e gengive in salute.',
          details: [
            'Controlli periodici e prevenzione',
            'Otturazioni estetiche in composito',
            'Estrazioni semplici',
            'Visite di urgenza',
            'Piani di cura personalizzati',
          ],
        },
        'dental-hygiene': {
          title: 'Igiene dentale',
          description:
            'Profilassi professionale e programmi personalizzati per un sorriso pulito e sano.',
          details: [
            'Detartrasi e pulizia professionale',
            'Lucidatura e rimozione delle macchie',
            'Programmi di richiamo personalizzati',
            'Educazione all’igiene orale',
            'Prevenzione delle malattie gengivali',
          ],
        },
        'gum-treatment': {
          title: 'Cura delle gengive',
          description:
            'Diagnosi e terapie per gengiviti e parodontite, con follow-up dedicato.',
          details: [
            'Diagnosi e trattamento delle gengiviti',
            'Terapia parodontale non chirurgica',
            'Levigatura radicolare',
            'Chirurgia parodontale',
            'Mantenimento parodontale',
          ],
        },
        implants: {
          title: 'Implantologia',
          description:
            'Impianti osteointegrati e riabilitazioni fisse per sostituire i denti mancanti.',
          details: [
            'Impianti dentali in titanio',
            'Protesi fisse su impianti',
            'Pianificazione digitale',
            'Riabilitazioni complete',
            'All-on-4 e soluzioni su misura',
          ],
        },
        endodonzia: {
          title: 'Endodonzia',
          description:
            'Devitalizzazioni e ritrattamenti canalari per salvare i denti naturali con precisione.',
          details: [
            'Devitalizzazioni',
            'Ritrattamenti endodontici',
            'Cura del dolore acuto',
            'Salvataggio dei denti naturali',
            'Trattamenti sotto microscopio',
          ],
        },
        protesi: {
          title: 'Protesi',
          description:
            'Protesi fissa e mobile su denti naturali e impianti per funzione ed estetica.',
          details: [
            'Corone e ponti fissi',
            'Protesi parziali removibili',
            'Protesi complete',
            'Soluzioni su impianti',
            'Materiali di alta qualità',
          ],
        },
        'cosmetic-dentistry': {
          title: 'Odontoiatria estetica',
          description:
            'Sbiancamento, faccette e ricostruzioni per armonizzare e valorizzare il sorriso.',
          details: [
            'Sbiancamento professionale',
            'Faccette estetiche in ceramica',
            'Ricostruzioni estetiche',
            'Armonizzazione del sorriso',
            'Risultati naturali e duraturi',
          ],
        },
        'oral-surgery': {
          title: 'Chirurgia orale',
          description:
            'Interventi chirurgici mirati, inclusi denti del giudizio e procedure pre-protesiche.',
          details: [
            'Estrazione denti del giudizio',
            'Estrazioni complesse',
            'Chirurgia pre-protesica',
            'Asportazione di cisti',
            'Procedure mininvasive',
          ],
        },
        'snoring-sleep-apnea': {
          title: 'Russamento e apnee notturne',
          description:
            'Valutazione e dispositivi personalizzati per migliorare il sonno e la respirazione notturna.',
          details: [
            'Valutazione del russamento',
            'Dispositivi MAD personalizzati',
            'Approccio multidisciplinare',
            'Miglioramento della qualità del sonno',
            'Follow-up e adattamento del dispositivo',
          ],
        },
      },
      approach: {
        title: 'Il nostro approccio',
        diagnosis: {
          title: 'Diagnosi accurata',
          description:
            'Partiamo da una valutazione approfondita con tecnologie digitali per pianificare il trattamento migliore.',
        },
        plan: {
          title: 'Piano personalizzato',
          description:
            'Definiamo un percorso su misura, trasparente su tempi, obiettivi e costi.',
        },
        care: {
          title: 'Cura continua',
          description:
            'Ti accompagniamo anche dopo il trattamento con controlli e indicazioni chiare.',
        },
      },
      cta: {
        title: 'Hai bisogno di un servizio dentale?',
        subtitle: 'Contattaci per una consulenza e scopri il percorso più adatto a te.',
        call: 'Chiama ora',
        book: 'Prenota online',
      },
    },
    about: {
      hero: {
        title: 'Chi siamo',
        subtitle: 'Professionalità, formazione e attenzione al paziente al servizio del tuo sorriso.',
      },
      doctor: {
        name: 'Dr. Moustapha Mourtada',
        role: 'Odontoiatria e Protesi Dentaria',
        intro:
          'Laureato in Odontoiatria e Protesi Dentaria e abilitato all’esercizio della professione presso l’Università degli Studi di Trieste, con iscrizione all’Ordine dei Medici Chirurghi e degli Odontoiatri prima di Trieste e poi di Vicenza.',
        experience:
          'Ho acquisito un’ampia esperienza in chirurgia, odontoiatria conservativa, endodonzia, protesi dentaria, prevenzione e diagnostica, presso la Clinica Odontostomatologica dell’Ospedale di Trieste e in diversi studi e strutture private con cui ho collaborato.',
        trainingTitle: 'Formazione e aggiornamento',
        trainingItems: [
          'Master di II livello in Implanto-Protesi presso l’Università degli Studi di Siena',
          'Corso di perfezionamento in odontoiatria restaurativa adesiva ed estetica nei settori anteriori e posteriori con il Dott. Veneziani Marco',
          'Corso di perfezionamento in protesi dentale fissa con il Prof. Ezio Bruna',
          'Partecipazione a convegni e congressi nazionali ed internazionali',
        ],
        approach:
          'Proveniente da una famiglia di medici ed odontoiatri, ho coltivato fin da piccolo la passione per l’odontoiatria e la chirurgia. Rivolgo particolare attenzione ai bambini — sono padre di tre meravigliose creature — e al primo approccio con il paziente, con forte attenzione alla prevenzione.',
        languagesTitle: 'Lingue parlate',
        languages: 'Italiano, inglese, francese e arabo',
      },
      team: {
        title: 'Il nostro team',
        imageAlt: 'Dr. Moustapha Mourtada',
      },
    },
    contact: {
      hero: {
        title: 'Contatti',
        subtitle: 'Siamo qui per te: prenota una visita o chiedi informazioni.',
      },
      info: {
        title: 'Informazioni di contatto',
        address: 'Indirizzo',
        mobile: 'Cellulare',
        phone: 'Telefono',
        email: 'Email',
        hours: 'Orari di apertura',
        hoursWeek: 'Lunedì – Venerdì: 9:00 – 19:00',
        hoursSat: 'Sabato: 9:00 – 13:00',
        hoursSun: 'Domenica: Chiuso',
        map: 'Dove siamo',
      },
      form: {
        title: 'Prenota una visita',
        scheduleSection: 'Quando preferisci venire?',
        scheduleHint: 'Scegli una data disponibile e poi un orario libero.',
        calendarTitle: 'Data',
        calendarTime: 'Orario',
        calendarSelectDate: 'Seleziona una data disponibile per vedere gli orari.',
        calendarPrev: 'Mese precedente',
        calendarNext: 'Mese successivo',
        calendarRequired: 'Seleziona data e orario per completare la prenotazione.',
        firstName: 'Nome',
        lastName: 'Cognome',
        phone: 'Telefono',
        email: 'Email',
        service: 'Servizio di interesse',
        servicePlaceholder: 'Seleziona un servizio',
        bookingServices: {
          general: 'Odontoiatria generale',
          urgency: 'Urgenza',
          visit: 'Visita',
        },
        message: 'Messaggio (facoltativo)',
        privacyBefore: 'Acconsento al trattamento dei miei dati personali in conformità con la',
        submit: 'Conferma prenotazione',
        submitting: 'Invio in corso…',
        successTitle: 'Richiesta inviata',
        successMessage:
          'Grazie! Abbiamo ricevuto la sua richiesta di prenotazione. Il nostro team la esaminerà e la contatterà al più presto per confermare data e ora. Nel frattempo, la richiesta risulta in attesa di conferma da parte dello studio.',
        bookAnother: 'Prenota un altro appuntamento',
        calendarClosed: 'Nessun orario disponibile in questa data.',
        success: 'Richiesta di prenotazione inviata con successo! Ti ricontatteremo per confermare.',
      },
      faq: {
        title: 'Domande frequenti',
        items: [
          {
            q: 'Come posso prenotare un appuntamento?',
            a: 'Puoi chiamarci, scriverci via email o usare il form di contatto. Ti risponderemo al più presto per confermare.',
          },
          {
            q: 'Quali metodi di pagamento accettate?',
            a: 'Accettiamo contanti, bancomat, carte e bonifico. Per trattamenti più impegnativi sono disponibili piani di finanziamento.',
          },
          {
            q: 'È possibile richiedere un preventivo?',
            a: 'Sì. Nella prima visita riceverai un piano di trattamento dettagliato con preventivo.',
          },
          {
            q: 'Cosa fare in caso di emergenza dentale?',
            a: 'Chiamaci subito: cerchiamo di riservare spazi per le urgenze. Fuori orario, lascia un messaggio e ti ricontatteremo appena possibile.',
          },
        ],
      },
      cta: {
        title: 'Prenota la tua visita oggi',
        subtitle: 'Non rimandare la salute del tuo sorriso.',
        call: 'Chiama ora',
        write: 'Prenota online',
      },
    },
    blog: {
      hero: {
        title: 'Blog',
        subtitle: 'Consigli e approfondimenti per un sorriso sano.',
      },
      search: 'Cerca',
      searchPlaceholder: 'Cerca articoli...',
      categories: 'Categorie',
      allCategories: 'Tutte le categorie',
      recent: 'Articoli recenti',
      newsletter: {
        title: 'Iscriviti alla newsletter',
        subtitle: 'Ricevi consigli e novità direttamente nella tua email.',
        placeholder: 'La tua email',
        button: 'Iscriviti',
      },
    },
    reviews: {
      hero: {
        title: 'Recensioni',
        subtitle: 'Le esperienze di chi si è affidato al nostro studio.',
      },
      summary: {
        title: 'La voce dei nostri pazienti',
        subtitle: 'La soddisfazione dei pazienti guida ogni nostra scelta.',
        basedOn: 'Basato su {count} recensioni',
      },
      filters: {
        all: 'Tutte le recensioni',
      },
      helpful: 'Utile',
      submit: {
        pageTitle: 'Lascia una recensione',
        title: 'La tua opinione conta',
        subtitle: 'Grazie per aver scelto il nostro studio. Condividi la tua esperienza con noi.',
        invalidTitle: 'Link non valido',
        invalidMessage: 'Questo link non è valido o è scaduto. Contattaci se hai bisogno di assistenza.',
        backToReviews: 'Vedi le recensioni',
        successTitle: 'Grazie!',
        successMessage:
          'La tua recensione è stata inviata ed è in attesa di approvazione. Apparirà sul sito dopo la verifica da parte dello studio.',
        ratingRequired: 'Seleziona una valutazione.',
        error: 'Invio non riuscito. Riprova più tardi.',
      },
      form: {
        title: 'Lascia una recensione',
        subtitle: 'La tua opinione ci aiuta a migliorare.',
        name: 'Nome',
        email: 'Email',
        rating: 'Valutazione',
        treatment: 'Tipo di trattamento',
        selectTreatment: 'Seleziona un trattamento',
        review: 'La tua recensione',
        placeholder: 'Condividi la tua esperienza...',
        submit: 'Invia recensione',
      },
    },
    footer: {
      tagline: 'Il tuo sorriso è la nostra priorità.',
      rights: 'Tutti i diritti riservati.',
      address: 'Via XXIV Maggio 39, Marostica - Vicenza',
      mobile: '+39 351 8228984',
      mobileHref: '+393518228984',
      phone: '+39 0424 73061',
      phoneHref: '+39042473061',
      email: 'info@studiodentisticomarostica.it',
      hoursWeek: 'Lun – Ven: 9:00 – 19:00',
      hoursSat: 'Sab: 9:00 – 13:00',
      contacts: 'Contatti',
    },
    legal: {
      privacy: {
        pageTitle: 'Privacy Policy',
        hero: {
          title: 'Privacy Policy',
          subtitle: 'Informativa sul trattamento dei dati personali ai sensi del Regolamento UE 2016/679 (GDPR).',
        },
        updated: 'Ultimo aggiornamento: 9 agosto 2026',
        sections: [
          {
            title: '1. Titolare del trattamento',
            paragraphs: [
              'Il Titolare del trattamento dei dati personali è Studio Dentistico Marostica, con sede in Via XXIV Maggio 39, Marostica - Vicenza, email info@studiodentisticomarostica.it, cellulare 351 8228984, telefono 0424 73061.',
              'Per qualsiasi richiesta relativa alla privacy è possibile contattare il Titolare ai recapiti indicati.',
            ],
          },
          {
            title: '2. Tipologie di dati trattati',
            paragraphs: [
              'Attraverso il sito web e i moduli di contatto possono essere raccolti: dati identificativi (nome e cognome), numero di telefono, indirizzo email (facoltativo), servizio di interesse, contenuto del messaggio e dati tecnici di navigazione (indirizzo IP, tipo di browser, pagine visitate).',
              'I dati contrassegnati come obbligatori sono necessari per gestire la richiesta di appuntamento o di informazioni.',
            ],
          },
          {
            title: '3. Finalità e base giuridica',
            paragraphs: [
              'I dati personali sono trattati per: rispondere a richieste di informazioni e prenotazioni inviate tramite il sito; fornire assistenza telefonica; adempiere a obblighi di legge; tutelare i diritti del Titolare in sede giudiziaria.',
              'La base giuridica del trattamento è l’esecuzione di misure precontrattuali su richiesta dell’interessato (art. 6, par. 1, lett. b GDPR), il consenso espresso per il modulo di contatto (art. 6, par. 1, lett. a GDPR) e, ove applicabile, il legittimo interesse del Titolare (art. 6, par. 1, lett. f GDPR).',
            ],
          },
          {
            title: '4. Modalità e sicurezza del trattamento',
            paragraphs: [
              'Il trattamento avviene con strumenti informatici e telematici, nel rispetto dei principi di liceità, correttezza, trasparenza, minimizzazione e integrità. Sono adottate misure tecniche e organizzative adeguate a proteggere i dati da accessi non autorizzati, perdita o divulgazione.',
            ],
          },
          {
            title: '5. Conservazione dei dati',
            paragraphs: [
              'I dati inviati tramite form di contatto sono conservati per il tempo necessario a evadere la richiesta e, successivamente, per un periodo massimo di 24 mesi salvo diversi obblighi di legge o necessità di tutela in giudizio.',
            ],
          },
          {
            title: '6. Comunicazione e destinatari',
            paragraphs: [
              'I dati possono essere comunicati a collaboratori e fornitori tecnici (es. hosting, posta elettronica) nominati Responsabili del trattamento, ove necessario. Non è prevista la diffusione dei dati personali.',
            ],
          },
          {
            title: '7. Diritti dell’interessato',
            paragraphs: [
              'L’interessato può esercitare in qualsiasi momento i diritti di accesso, rettifica, cancellazione, limitazione, opposizione e portabilità previsti dagli artt. 15–22 GDPR, scrivendo al Titolare.',
              'Ha inoltre diritto di proporre reclamo all’Autorità Garante per la protezione dei dati personali (www.garanteprivacy.it).',
            ],
          },
          {
            title: '8. Cookie e strumenti di navigazione',
            paragraphs: [
              'Il sito può utilizzare cookie tecnici necessari al funzionamento e, previo consenso, strumenti di analisi o integrazione con servizi di terze parti. Le preferenze possono essere gestite dalle impostazioni del browser.',
            ],
          },
          {
            title: '9. Modifiche alla presente informativa',
            paragraphs: [
              'Il Titolare si riserva di aggiornare la presente Privacy Policy in qualsiasi momento. Le modifiche saranno pubblicate su questa pagina con indicazione della data di aggiornamento.',
            ],
          },
        ],
      },
      terms: {
        pageTitle: 'Termini e Condizioni',
        hero: {
          title: 'Termini e Condizioni',
          subtitle: 'Condizioni generali di utilizzo del sito web Studio Dentistico Marostica.',
        },
        updated: 'Ultimo aggiornamento: 9 agosto 2026',
        sections: [
          {
            title: '1. Oggetto',
            paragraphs: [
              'I presenti Termini e Condizioni regolano l’accesso e l’utilizzo del sito web www.studiodentisticomarostica.com (di seguito “Sito”), di proprietà di Studio Dentistico Marostica.',
              'L’utilizzo del Sito implica l’accettazione integrale dei presenti Termini.',
            ],
          },
          {
            title: '2. Informazioni sullo studio',
            paragraphs: [
              'Studio Dentistico Marostica è uno studio odontoiatrico con sede in Via XXIV Maggio 39, Marostica - Vicenza. Per appuntamenti e informazioni: cellulare 351 8228984, telefono 0424 73061, email info@studiodentisticomarostica.it.',
            ],
          },
          {
            title: '3. Uso del sito',
            paragraphs: [
              'L’utente si impegna a utilizzare il Sito in modo lecito, corretto e conforme alla normativa vigente. È vietato qualsiasi uso che possa compromettere la sicurezza, l’integrità o la disponibilità del Sito.',
            ],
          },
          {
            title: '4. Prenotazioni e richieste di contatto',
            paragraphs: [
              'Le richieste inviate tramite form o telefono non costituiscono conferma automatica di appuntamento. Lo studio si impegna a ricontattare l’utente per confermare data, ora e tipologia di visita.',
              'L’utente è tenuto a fornire dati veritieri e completi, in particolare un recapito telefonico valido per essere ricontattato.',
            ],
          },
          {
            title: '5. Contenuti e proprietà intellettuale',
            paragraphs: [
              'Testi, immagini, loghi, grafica e layout del Sito sono di proprietà di Studio Dentistico Marostica o utilizzati con licenza. È vietata la riproduzione, distribuzione o modifica non autorizzata dei contenuti.',
            ],
          },
          {
            title: '6. Limitazione di responsabilità',
            paragraphs: [
              'Le informazioni presenti sul Sito hanno carattere informativo generale e non sostituiscono la valutazione clinica del professionista. Studio Dentistico Marostica non garantisce l’assenza di interruzioni o errori tecnici del Sito, pur adottando ogni ragionevole cura per mantenerlo aggiornato e funzionante.',
            ],
          },
          {
            title: '7. Link a siti di terze parti',
            paragraphs: [
              'Il Sito può contenere collegamenti a siti esterni. Studio Dentistico Marostica non è responsabile dei contenuti o delle politiche di tali siti.',
            ],
          },
          {
            title: '8. Legge applicabile e foro competente',
            paragraphs: [
              'I presenti Termini sono regolati dalla legge italiana. Per ogni controversia relativa all’utilizzo del Sito è competente in via esclusiva il Foro di Vicenza, salvo diversa disposizione inderogabile a tutela del consumatore.',
            ],
          },
          {
            title: '9. Modifiche',
            paragraphs: [
              'Studio Dentistico Marostica si riserva il diritto di modificare i presenti Termini in qualsiasi momento. Le versioni aggiornate saranno pubblicate su questa pagina.',
            ],
          },
        ],
      },
    },
  },
  en: {
    nav: {
      home: 'Home',
      services: 'Services',
      about: 'About',
      blog: 'Blog',
      reviews: 'Reviews',
      contact: 'Contact',
    },
    common: {
      brand: 'Studio Dentistico Marostica',
      readMore: 'Read more',
      bookAppointment: 'Book a visit',
      callNow: 'Call now',
      learnMore: 'Learn more',
      allServices: 'All services',
      sendMessage: 'Send message',
      privacy: 'Privacy Policy',
      terms: 'Terms & Conditions',
      menu: 'Menu',
      included: 'What’s included',
      viewAllReviews: 'All reviews',
      contactUs: 'Contact us',
      fabBook: 'Book',
      fabWhatsApp: 'WhatsApp',
      fabCall: 'Call',
    },
    home: {
      hero: {
        title: 'Your smile deserves the best',
        subtitle: 'Exceptional dental care in Marostica, in a modern and welcoming environment.',
        cta: 'Book a visit',
        secondary: 'Our services',
      },
      features: {
        title: 'Why choose us',
        subtitle: 'Clear, modern, and human care.',
        flexible: {
          title: 'Flexible appointments',
          description: 'Hours that fit your life, including evenings.',
        },
        technology: {
          title: 'Advanced technology',
          description: 'Digital tools for precise diagnosis and comfortable treatments.',
        },
        team: {
          title: 'Expert team',
          description: 'Highly qualified professionals who keep learning.',
        },
      },
      services: {
        title: 'Our services',
        subtitle: 'Complete treatments for every need.',
        cta: 'All services',
        learnMore: 'Learn more',
      },
      about: {
        title: 'About us',
        content:
          'Dr. Moustapha Mourtada combines university training, clinical experience, and a human approach focused on prevention and patient care.',
        more: 'Learn more about us',
      },
      testimonials: {
        title: 'What our patients say',
        subtitle: 'Trust built visit after visit.',
      },
      cta: {
        title: 'Book a visit today',
        subtitle: 'We are ready to welcome you and care for your smile.',
        button: 'Contact us now',
      },
    },
    services: {
      hero: {
        title: 'Our services',
        subtitle: 'Advanced dental treatments for every age.',
      },
      intro: {
        title: 'Complete dental solutions',
        content:
          'Personalized, high-quality care in a comfortable setting, with modern technology and a dedicated team.',
      },
      services: {
        included: 'What’s included',
        'general-dentistry': {
          title: 'General dentistry',
          description:
            'Prevention, restorative care, and treatments to keep teeth and gums healthy.',
          details: [
            'Regular check-ups and prevention',
            'Aesthetic composite fillings',
            'Simple extractions',
            'Emergency visits',
            'Personalised treatment plans',
          ],
        },
        'dental-hygiene': {
          title: 'Dental hygiene',
          description:
            'Professional prophylaxis and personalised programmes for a clean, healthy smile.',
          details: [
            'Scaling and professional cleaning',
            'Polishing and stain removal',
            'Personalised recall programmes',
            'Oral hygiene education',
            'Gum disease prevention',
          ],
        },
        'gum-treatment': {
          title: 'Gum treatment',
          description:
            'Diagnosis and therapy for gingivitis and periodontitis, with dedicated follow-up.',
          details: [
            'Diagnosis and treatment of gingivitis',
            'Non-surgical periodontal therapy',
            'Root planing',
            'Periodontal surgery',
            'Periodontal maintenance',
          ],
        },
        implants: {
          title: 'Implants',
          description:
            'Osseointegrated implants and fixed rehabilitations to replace missing teeth.',
          details: [
            'Titanium dental implants',
            'Fixed implant prosthetics',
            'Digital planning',
            'Full rehabilitations',
            'All-on-4 and tailored solutions',
          ],
        },
        endodonzia: {
          title: 'Endodontics',
          description:
            'Root canal treatments and retreatments to save natural teeth with precision.',
          details: [
            'Root canal therapy',
            'Endodontic retreatments',
            'Acute pain relief',
            'Saving natural teeth',
            'Microscope-assisted treatment',
          ],
        },
        protesi: {
          title: 'Dental prosthetics',
          description:
            'Fixed and removable prosthetics on natural teeth and implants for function and aesthetics.',
          details: [
            'Fixed crowns and bridges',
            'Removable partial dentures',
            'Complete dentures',
            'Implant-supported solutions',
            'High-quality materials',
          ],
        },
        'cosmetic-dentistry': {
          title: 'Cosmetic dentistry',
          description:
            'Whitening, veneers, and reconstructions to harmonise and enhance your smile.',
          details: [
            'Professional teeth whitening',
            'Aesthetic ceramic veneers',
            'Cosmetic reconstructions',
            'Smile harmonisation',
            'Natural, lasting results',
          ],
        },
        'oral-surgery': {
          title: 'Oral surgery',
          description:
            'Targeted surgical procedures, including wisdom teeth and pre-prosthetic care.',
          details: [
            'Wisdom tooth extraction',
            'Complex extractions',
            'Pre-prosthetic surgery',
            'Cyst removal',
            'Minimally invasive procedures',
          ],
        },
        'snoring-sleep-apnea': {
          title: 'Snoring & sleep apnea',
          description:
            'Assessment and custom devices to improve sleep and nighttime breathing.',
          details: [
            'Snoring assessment',
            'Custom MAD devices',
            'Multidisciplinary approach',
            'Improved sleep quality',
            'Device follow-up and adjustment',
          ],
        },
      },
      approach: {
        title: 'Our approach',
        diagnosis: {
          title: 'Accurate diagnosis',
          description:
            'We start with a thorough assessment using digital technology to plan the best treatment.',
        },
        plan: {
          title: 'Personalized plan',
          description:
            'A tailored path with clear timelines, goals, and costs.',
        },
        care: {
          title: 'Continuous care',
          description:
            'We stay with you after treatment with check-ups and clear guidance.',
        },
      },
      cta: {
        title: 'Need a dental service?',
        subtitle: 'Contact us for a consultation and find the right path for you.',
        call: 'Call now',
        book: 'Book online',
      },
    },
    about: {
      hero: {
        title: 'About us',
        subtitle: 'Professionalism, training, and patient care at the heart of your smile.',
      },
      doctor: {
        name: 'Dr. Moustapha Mourtada',
        role: 'Dentistry and Dental Prosthetics',
        intro:
          'Graduate in Dentistry and Dental Prosthetics, licensed to practice by the University of Trieste, and registered with the Order of Physicians and Dentists first in Trieste and then in Vicenza.',
        experience:
          'I have gained extensive experience in surgery, conservative dentistry, endodontics, dental prosthetics, prevention, and diagnostics at the Dental Clinic of Trieste Hospital and in various private practices and facilities where I have worked.',
        trainingTitle: 'Training and continuing education',
        trainingItems: [
          'Second-level Master in Implant-Prosthetics at the University of Siena',
          'Advanced course in adhesive and aesthetic restorative dentistry in anterior and posterior sectors with Dr. Marco Veneziani',
          'Advanced course in fixed dental prosthetics with Prof. Ezio Bruna',
          'Participation in national and international conferences and congresses',
        ],
        approach:
          'Coming from a family of physicians and dentists, I developed a passion for dentistry and surgery from an early age. I pay special attention to children — I am the father of three wonderful kids — and to the first patient visit, with a strong focus on prevention.',
        languagesTitle: 'Languages spoken',
        languages: 'Italian, English, French, and Arabic',
      },
      team: {
        title: 'Our team',
        imageAlt: 'Dr. Moustapha Mourtada',
      },
    },
    contact: {
      hero: {
        title: 'Contact',
        subtitle: 'We are here for you — book a visit or ask a question.',
      },
      info: {
        title: 'Contact information',
        address: 'Address',
        mobile: 'Mobile',
        phone: 'Phone',
        email: 'Email',
        hours: 'Opening hours',
        hoursWeek: 'Monday – Friday: 9:00 – 19:00',
        hoursSat: 'Saturday: 9:00 – 13:00',
        hoursSun: 'Sunday: Closed',
        map: 'Where we are',
      },
      form: {
        title: 'Book a visit',
        scheduleSection: 'When would you like to come?',
        scheduleHint: 'Pick an available date, then choose a free time slot.',
        calendarTitle: 'Date',
        calendarTime: 'Time',
        calendarSelectDate: 'Select an available date to view time slots.',
        calendarPrev: 'Previous month',
        calendarNext: 'Next month',
        calendarRequired: 'Please select a date and time to complete your booking.',
        firstName: 'First name',
        lastName: 'Last name',
        phone: 'Phone',
        email: 'Email',
        service: 'Service of interest',
        servicePlaceholder: 'Select a service',
        bookingServices: {
          general: 'General dentistry',
          urgency: 'Emergency',
          visit: 'Visit',
        },
        message: 'Message (optional)',
        privacyBefore: 'I agree to the processing of my personal data in accordance with the',
        submit: 'Confirm booking',
        submitting: 'Sending…',
        successTitle: 'Request sent',
        successMessage:
          'Thank you! We have received your booking request. Our team will review it and contact you shortly to confirm your date and time. Until then, your request is pending confirmation by the clinic.',
        bookAnother: 'Book another visit',
        calendarClosed: 'No time slots available on this date.',
        success: 'Booking request sent successfully! We will contact you to confirm.',
      },
      faq: {
        title: 'Frequently asked questions',
        items: [
          {
            q: 'How can I book an appointment?',
            a: 'Call us, email us, or use the contact form. We will reply as soon as possible to confirm.',
          },
          {
            q: 'Which payment methods do you accept?',
            a: 'We accept cash, debit cards, credit cards, and bank transfer. Financing options are available for larger treatments.',
          },
          {
            q: 'Can I request a quote?',
            a: 'Yes. During the first visit you will receive a detailed treatment plan with a quote.',
          },
          {
            q: 'What should I do in a dental emergency?',
            a: 'Call us immediately — we try to keep slots for urgent cases. Outside hours, leave a message and we will get back to you as soon as possible.',
          },
        ],
      },
      cta: {
        title: 'Book your visit today',
        subtitle: 'Don’t put your smile health on hold.',
        call: 'Call now',
        write: 'Book online',
      },
    },
    blog: {
      hero: {
        title: 'Blog',
        subtitle: 'Tips and insights for a healthy smile.',
      },
      search: 'Search',
      searchPlaceholder: 'Search articles...',
      categories: 'Categories',
      allCategories: 'All categories',
      recent: 'Recent articles',
      newsletter: {
        title: 'Subscribe to our newsletter',
        subtitle: 'Get tips and updates delivered to your inbox.',
        placeholder: 'Your email',
        button: 'Subscribe',
      },
    },
    reviews: {
      hero: {
        title: 'Reviews',
        subtitle: 'Experiences from patients who trust our practice.',
      },
      summary: {
        title: 'Our patients’ voice',
        subtitle: 'Patient satisfaction guides every choice we make.',
        basedOn: 'Based on {count} reviews',
      },
      filters: {
        all: 'All reviews',
      },
      helpful: 'Helpful',
      submit: {
        pageTitle: 'Leave a review',
        title: 'Your opinion matters',
        subtitle: 'Thank you for choosing our practice. Share your experience with us.',
        invalidTitle: 'Invalid link',
        invalidMessage: 'This link is invalid or has expired. Contact us if you need assistance.',
        backToReviews: 'View reviews',
        successTitle: 'Thank you!',
        successMessage:
          'Your review has been submitted and is pending approval. It will appear on the site after verification by the clinic.',
        ratingRequired: 'Please select a rating.',
        error: 'Submission failed. Please try again later.',
      },
      form: {
        title: 'Leave a review',
        subtitle: 'Your feedback helps us improve.',
        name: 'Name',
        email: 'Email',
        rating: 'Rating',
        treatment: 'Treatment type',
        selectTreatment: 'Select a treatment',
        review: 'Your review',
        placeholder: 'Share your experience...',
        submit: 'Submit review',
      },
    },
    footer: {
      tagline: 'Your smile is our priority.',
      rights: 'All rights reserved.',
      address: 'Via XXIV Maggio 39, Marostica - Vicenza',
      mobile: '+39 351 8228984',
      mobileHref: '+393518228984',
      phone: '+39 0424 73061',
      phoneHref: '+39042473061',
      email: 'info@studiodentisticomarostica.it',
      hoursWeek: 'Mon – Fri: 9:00 – 19:00',
      hoursSat: 'Sat: 9:00 – 13:00',
      contacts: 'Contacts',
    },
    legal: {
      privacy: {
        pageTitle: 'Privacy Policy',
        hero: {
          title: 'Privacy Policy',
          subtitle: 'Information on the processing of personal data under EU Regulation 2016/679 (GDPR).',
        },
        updated: 'Last updated: August 9, 2026',
        sections: [
          {
            title: '1. Data controller',
            paragraphs: [
              'The data controller is Studio Dentistico Marostica, located at Via XXIV Maggio 39, Marostica - Vicenza, Italy, email info@studiodentisticomarostica.it, mobile 351 8228984, phone 0424 73061.',
              'For any privacy-related request, you may contact the controller using the details above.',
            ],
          },
          {
            title: '2. Types of data processed',
            paragraphs: [
              'Through the website and contact forms we may collect: identification data (full name), phone number, email address (optional), service of interest, message content, and technical browsing data (IP address, browser type, pages visited).',
              'Fields marked as required are necessary to handle appointment requests or information enquiries.',
            ],
          },
          {
            title: '3. Purposes and legal basis',
            paragraphs: [
              'Personal data are processed to: respond to information and booking requests sent via the website; provide telephone assistance; comply with legal obligations; protect the controller’s rights in legal proceedings.',
              'The legal basis is the performance of pre-contractual measures at the data subject’s request (Art. 6(1)(b) GDPR), explicit consent for the contact form (Art. 6(1)(a) GDPR), and, where applicable, the controller’s legitimate interest (Art. 6(1)(f) GDPR).',
            ],
          },
          {
            title: '4. Processing methods and security',
            paragraphs: [
              'Processing is carried out using IT and telematic tools in compliance with lawfulness, fairness, transparency, minimisation, and integrity principles. Appropriate technical and organisational measures are adopted to protect data against unauthorised access, loss, or disclosure.',
            ],
          },
          {
            title: '5. Data retention',
            paragraphs: [
              'Data submitted through contact forms are kept for as long as needed to handle the request and, subsequently, for a maximum period of 24 months unless longer retention is required by law or for legal defence.',
            ],
          },
          {
            title: '6. Communication and recipients',
            paragraphs: [
              'Data may be shared with staff and technical providers (e.g. hosting, email services) appointed as data processors where necessary. Personal data are not disseminated.',
            ],
          },
          {
            title: '7. Data subject rights',
            paragraphs: [
              'You may exercise at any time the rights of access, rectification, erasure, restriction, objection, and portability under Articles 15–22 GDPR by writing to the controller.',
              'You also have the right to lodge a complaint with the Italian Data Protection Authority (www.garanteprivacy.it).',
            ],
          },
          {
            title: '8. Cookies and browsing tools',
            paragraphs: [
              'The website may use technical cookies necessary for operation and, with consent, analytics or third-party integration tools. Preferences can be managed through browser settings.',
            ],
          },
          {
            title: '9. Changes to this policy',
            paragraphs: [
              'The controller reserves the right to update this Privacy Policy at any time. Changes will be published on this page with the updated date.',
            ],
          },
        ],
      },
      terms: {
        pageTitle: 'Terms and Conditions',
        hero: {
          title: 'Terms and Conditions',
          subtitle: 'General terms of use of the Studio Dentistico Marostica website.',
        },
        updated: 'Last updated: August 9, 2026',
        sections: [
          {
            title: '1. Scope',
            paragraphs: [
              'These Terms and Conditions govern access to and use of the website www.studiodentisticomarostica.com (the “Website”), owned by Studio Dentistico Marostica.',
              'Use of the Website implies full acceptance of these Terms.',
            ],
          },
          {
            title: '2. Information about the practice',
            paragraphs: [
              'Studio Dentistico Marostica is a dental practice located at Via XXIV Maggio 39, Marostica - Vicenza, Italy. For appointments and information: mobile 351 8228984, phone 0424 73061, email info@studiodentisticomarostica.it.',
            ],
          },
          {
            title: '3. Use of the website',
            paragraphs: [
              'Users agree to use the Website lawfully, correctly, and in compliance with applicable regulations. Any use that may compromise the security, integrity, or availability of the Website is prohibited.',
            ],
          },
          {
            title: '4. Bookings and contact requests',
            paragraphs: [
              'Requests sent via form or phone do not automatically confirm an appointment. The practice will contact you to confirm date, time, and type of visit.',
              'Users must provide accurate and complete information, especially a valid phone number to be contacted.',
            ],
          },
          {
            title: '5. Content and intellectual property',
            paragraphs: [
              'Text, images, logos, graphics, and layout on the Website are owned by Studio Dentistico Marostica or used under licence. Unauthorised reproduction, distribution, or modification of content is prohibited.',
            ],
          },
          {
            title: '6. Limitation of liability',
            paragraphs: [
              'Information on the Website is general in nature and does not replace a clinical assessment by a professional. Studio Dentistico Marostica does not guarantee uninterrupted or error-free operation of the Website, although reasonable care is taken to keep it updated and functional.',
            ],
          },
          {
            title: '7. Links to third-party sites',
            paragraphs: [
              'The Website may contain links to external sites. Studio Dentistico Marostica is not responsible for the content or policies of such sites.',
            ],
          },
          {
            title: '8. Governing law and jurisdiction',
            paragraphs: [
              'These Terms are governed by Italian law. Any dispute relating to use of the Website shall fall under the exclusive jurisdiction of the Court of Vicenza, subject to mandatory consumer protection rules.',
            ],
          },
          {
            title: '9. Changes',
            paragraphs: [
              'Studio Dentistico Marostica reserves the right to amend these Terms at any time. Updated versions will be published on this page.',
            ],
          },
        ],
      },
    },
  },
};

export function getTranslation(language: Language, key: string): unknown {
  const keys = key.split('.');
  let value: unknown = translations[language];
  for (const k of keys) {
    if (value && typeof value === 'object' && k in (value as Record<string, unknown>)) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }
  if (value === undefined || value === null) return key;
  return value;
}

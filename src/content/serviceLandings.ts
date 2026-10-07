import type { ServiceCatalogKey } from '../config/servicesCatalog';
import type { Language } from '../translations';

export type ServiceLanding = {
  summary: string;
  audience: string;
  stepsTitle: string;
  steps: string[];
  duration: string;
  local: string;
  body: string[];
  faqs: { q: string; a: string }[];
};

const CONTENT: Record<ServiceCatalogKey, Record<Language, ServiceLanding>> = {
  'general-dentistry': {
    it: {
      summary:
        'L’odontoiatria generale a Marostica comprende visite di controllo, prevenzione, otturazioni e prime diagnosi. È il punto di partenza per mantenere denti e gengive in salute, con un piano di cura chiaro e personalizzato.',
      audience:
        'Indicata per chi desidera un controllo periodico, avverte fastidio, ha una carie o vuole un piano di prevenzione per tutta la famiglia, compresi i bambini.',
      stepsTitle: 'Come si svolge la visita',
      steps: [
        'Anamnesi e ascolto dei sintomi o delle esigenze',
        'Esame clinico di denti, gengive e occlusione',
        'Eventuali radiografie o fotografie intraorali',
        'Spiegazione del piano di cura e delle alternative',
      ],
      duration: 'Una visita di controllo dura in genere 30–45 minuti. I trattamenti conservativi variano in base al caso.',
      local:
        'Lo studio si trova in Via XXIV Maggio 39 a Marostica, comodo anche da Bassano del Grappa, Thiene, Breganze, Nove e Schiavon.',
      body: [
        'La prevenzione resta il modo più efficace per evitare trattamenti complessi. I controlli regolari permettono di individuare carie, infiammazioni gengivali e usura quando sono ancora semplici da gestire.',
        'In studio utilizziamo materiali compositi estetici per le otturazioni e spieghiamo sempre tempi, sequenza e obiettivi del piano, senza promettere risultati irrealistici.',
        'Se serve un approfondimento (endodonzia, implantologia o chirurgia), la visita generale è il momento in cui si valuta insieme il percorso più appropriato.',
      ],
      faqs: [
        { q: 'Ogni quanto fare una visita dal dentista?', a: 'Per la maggior parte delle persone è consigliato un controllo ogni 6–12 mesi, con richiami più ravvicinati in caso di gengiviti, carie ricorrenti o terapie in corso.' },
        { q: 'La prima visita è dolorosa?', a: 'No. La prima visita è un esame clinico e un colloquio. Eventuali trattamenti si programmano dopo aver condiviso il piano.' },
        { q: 'Trattate anche le urgenze?', a: 'Sì, cerchiamo di riservare spazi per dolore acuto, otturazioni staccate o traumi. È meglio chiamare lo studio per valutare la priorità.' },
        { q: 'Fate visite anche ai bambini?', a: 'Sì. Poniamo attenzione al primo approccio con i più piccoli, con un ritmo calmo e spiegazioni adatte all’età.' },
      ],
    },
    en: {
      summary:
        'General dentistry in Marostica covers check-ups, prevention, fillings and first diagnosis. It is the starting point for keeping teeth and gums healthy, with a clear, personalised care plan.',
      audience:
        'Suitable if you want a routine check-up, feel discomfort, have a cavity, or need a prevention plan for the whole family, including children.',
      stepsTitle: 'What happens at the visit',
      steps: [
        'Medical history and discussion of symptoms or goals',
        'Clinical exam of teeth, gums and bite',
        'X-rays or intraoral photos if needed',
        'Explanation of the care plan and alternatives',
      ],
      duration: 'A check-up usually lasts 30–45 minutes. Restorative treatments vary by case.',
      local:
        'The practice is at Via XXIV Maggio 39 in Marostica, easy to reach from Bassano del Grappa, Thiene, Breganze, Nove and Schiavon.',
      body: [
        'Prevention is still the most effective way to avoid complex treatment. Regular visits help find cavities, gum inflammation and wear while they are still simple to manage.',
        'We use aesthetic composite materials for fillings and always explain timing, sequence and goals, without promising unrealistic results.',
        'If you need endodontics, implants or surgery, the general visit is when we decide together on the most appropriate path.',
      ],
      faqs: [
        { q: 'How often should I see the dentist?', a: 'Most people benefit from a check-up every 6–12 months, or sooner if they have gum disease, frequent cavities or ongoing treatment.' },
        { q: 'Is the first visit painful?', a: 'No. The first visit is an exam and a conversation. Any treatment is planned after you have agreed the plan.' },
        { q: 'Do you treat dental emergencies?', a: 'Yes. We try to keep slots for acute pain, lost fillings or trauma. Please call the practice so we can assess priority.' },
        { q: 'Do you see children?', a: 'Yes. We pay special attention to a child’s first visit, with a calm pace and age-appropriate explanations.' },
      ],
    },
  },
  'dental-hygiene': {
    it: {
      summary:
        'L’igiene dentale professionale a Marostica rimuove tartaro e biofilm che lo spazzolino non raggiunge, riduce l’infiammazione gengivale e aiuta a prevenire carie e parodontite.',
      audience:
        'Utile per chi ha tartaro, alito cattivo, gengive che sanguinano, apparecchi o impianti, e per chi vuole un programma di richiamo personalizzato.',
      stepsTitle: 'Come avviene la seduta',
      steps: [
        'Valutazione di placca, tartaro e gengive',
        'Detartrasi e rimozione dei depositi sopragengivali',
        'Lucidatura e, se indicato, trattamento delle macchie',
        'Istruzioni di igiene domiciliare e pianificazione del richiamo',
      ],
      duration: 'Una seduta di igiene dura in genere 45–60 minuti.',
      local:
        'I pazienti arrivano da Marostica, Bassano del Grappa e dai comuni vicini per i richiami di igiene nello studio in centro.',
      body: [
        'La pulizia professionale non sostituisce lo spazzolino: completa la routine quotidiana e permette di controllare i punti critici (spazi interdentali, sotto il bordo gengivale, intorno a restauri).',
        'In presenza di gengivite o tasche, il richiamo può essere più frequente. Spieghiamo tecnica di spazzolamento, filo o scovolini in modo pratico, adattato a età e manualità.',
        'Dopo impianti, ortodonzia o terapie parodontali, l’igiene professionale è parte integrante del mantenimento a lungo termine.',
      ],
      faqs: [
        { q: 'Ogni quanto fare l’igiene professionale?', a: 'Spesso ogni 6 mesi. Chi ha gengivite, impianti, diabete o accumulo rapido di tartaro può beneficiare di richiami a 3–4 mesi.' },
        { q: 'La detartrasi fa male?', a: 'Può dare un lieve fastidio se le gengive sono infiammate. In quei casi adattiamo strumenti e tempi; il disagio di solito si riduce dopo le prime sedute.' },
        { q: 'Sbianca i denti l’igiene?', a: 'Rimuove macchie superficiali e tartaro, quindi i denti possono apparire più puliti. Non è uno sbiancamento cosmetico; quello è un trattamento separato.' },
        { q: 'Posso farla se ho impianti o corone?', a: 'Sì, ed è importante. Usiamo protocolli adatti a restauri e impianti per non danneggiare le superfici.' },
      ],
    },
    en: {
      summary:
        'Professional dental hygiene in Marostica removes tartar and biofilm that a toothbrush cannot reach, reduces gum inflammation and helps prevent cavities and periodontitis.',
      audience:
        'Helpful if you have tartar, bad breath, bleeding gums, braces or implants, or want a tailored recall programme.',
      stepsTitle: 'What the appointment includes',
      steps: [
        'Assessment of plaque, tartar and gums',
        'Scaling and removal of deposits above the gumline',
        'Polishing and stain removal if indicated',
        'Home-care advice and recall planning',
      ],
      duration: 'A hygiene visit usually lasts 45–60 minutes.',
      local:
        'Patients come from Marostica, Bassano del Grappa and nearby towns for hygiene recalls at the town-centre practice.',
      body: [
        'Professional cleaning does not replace brushing: it completes daily care and lets us check critical areas (between teeth, under the gumline, around restorations).',
        'If you have gingivitis or pockets, recalls may be more frequent. We explain brushing, floss or interdental brushes in a practical way, adapted to age and dexterity.',
        'After implants, orthodontics or gum therapy, professional hygiene is part of long-term maintenance.',
      ],
      faqs: [
        { q: 'How often should I have a professional clean?', a: 'Often every 6 months. People with gingivitis, implants, diabetes or rapid tartar build-up may benefit from 3–4 month recalls.' },
        { q: 'Does scaling hurt?', a: 'It can feel slightly uncomfortable if gums are inflamed. We adapt instruments and timing; discomfort usually eases after the first visits.' },
        { q: 'Does hygiene whiten teeth?', a: 'It removes surface stains and tartar, so teeth can look cleaner. It is not cosmetic bleaching, which is a separate treatment.' },
        { q: 'Can I have it with implants or crowns?', a: 'Yes, and it is important. We use protocols suited to restorations and implants so surfaces are not damaged.' },
      ],
    },
  },
  'gum-treatment': {
    it: {
      summary:
        'La cura delle gengive a Marostica riguarda gengiviti e parodontite: diagnosi, detersione delle tasche, istruzione all’igiene e follow-up per stabilizzare i tessuti e ridurre il rischio di perdere denti.',
      audience:
        'Indicata se le gengive sanguinano, sono retratte, c’è alito persistente, denti che si muovono o tasche segnalate in una visita precedente.',
      stepsTitle: 'Percorso di cura',
      steps: [
        'Misurazione di tasche, recessioni e infiammazione',
        'Radiografie per valutare l’osso di supporto',
        'Terapia non chirurgica (scaling e root planing) nei siti interessati',
        'Rivalutazione e programma di mantenimento',
      ],
      duration: 'La fase attiva può richiedere più sedute. Il mantenimento è periodico, spesso ogni 3–4 mesi.',
      local:
        'Trattiamo pazienti di Marostica e dell’area di Bassano e Thiene che cercano una gestione chiara della parodontite, senza allarmismi.',
      body: [
        'La parodontite è una malattia infiammatoria dei tessuti di supporto del dente. Non si “risolve” con un collutorio: serve rimuovere i depositi sotto gengiva e mantenere un’igiene adeguata.',
        'Molti casi rispondono alla terapia non chirurgica. Se restano tasche profonde o infiammazione, si valuta un approfondimento chirurgico o un invio specialistico.',
        'Il fumo, il diabete e una igiene irregolare influenzano la prognosi: ne parliamo in modo concreto, perché il risultato dipende anche dalle abitudini quotidiane.',
      ],
      faqs: [
        { q: 'Il sanguinamento delle gengive è normale?', a: 'No. È un segno di infiammazione. Va valutato: può essere una gengivite reversibile o una parodontite già in atto.' },
        { q: 'Si può curare la parodontite?', a: 'Si può controllare e stabilizzare nella maggior parte dei casi, con terapia e mantenimento. Il tessuto perso non torna sempre, ma si può rallentare o fermare la progressione.' },
        { q: 'Serve la chirurgia?', a: 'Non sempre. Si parte dalla terapia non chirurgica e si rivaluta. La chirurgia si considera se restano tasche o anatomie che non si possono pulire altrimenti.' },
        { q: 'Quanto dura il mantenimento?', a: 'È a lungo termine. Come per altre condizioni croniche, i richiami regolari riducono il rischio di recidiva.' },
      ],
    },
    en: {
      summary:
        'Gum treatment in Marostica covers gingivitis and periodontitis: diagnosis, cleaning of pockets, hygiene instruction and follow-up to stabilise tissues and reduce the risk of tooth loss.',
      audience:
        'Indicated if gums bleed or recede, breath stays unpleasant, teeth feel mobile, or pockets were noted at a previous visit.',
      stepsTitle: 'Care pathway',
      steps: [
        'Measurement of pockets, recession and inflammation',
        'X-rays to assess supporting bone',
        'Non-surgical therapy (scaling and root planing) at involved sites',
        'Reassessment and a maintenance programme',
      ],
      duration: 'The active phase may need several visits. Maintenance is periodic, often every 3–4 months.',
      local:
        'We treat patients from Marostica and the Bassano and Thiene area who want a clear plan for periodontitis, without alarmism.',
      body: [
        'Periodontitis is an inflammatory disease of the tooth’s supporting tissues. It is not solved by mouthwash alone: deposits under the gum must be removed and daily hygiene improved.',
        'Many cases respond to non-surgical therapy. If deep pockets or inflammation remain, we consider surgical options or a specialist referral.',
        'Smoking, diabetes and irregular hygiene affect the outlook. We discuss this in practical terms, because results also depend on daily habits.',
      ],
      faqs: [
        { q: 'Is gum bleeding normal?', a: 'No. It is a sign of inflammation and should be assessed. It may be reversible gingivitis or established periodontitis.' },
        { q: 'Can periodontitis be cured?', a: 'It can usually be controlled and stabilised with therapy and maintenance. Lost tissue does not always return, but progression can often be slowed or stopped.' },
        { q: 'Is surgery required?', a: 'Not always. We start with non-surgical therapy and reassess. Surgery is considered if pockets or anatomy cannot otherwise be cleaned.' },
        { q: 'How long does maintenance last?', a: 'It is long term. As with other chronic conditions, regular recalls reduce the risk of relapse.' },
      ],
    },
  },
  endodonzia: {
    it: {
      summary:
        'L’endodonzia (devitalizzazione) a Marostica tratta l’infiammazione o l’infezione della polpa dentale, per conservare il dente quando è possibile, con una sequenza di pulizia, disinfezione e otturazione dei canali.',
      audience:
        'Indicata in caso di dolore spontaneo, sensibilità prolungata al caldo, ascesso, trauma o carie profonda che ha raggiunto la polpa.',
      stepsTitle: 'Fasi del trattamento',
      steps: [
        'Diagnosi clinica e radiografica',
        'Anestesia e isolamento del dente',
        'Pulizia e sagomatura dei canali',
        'Otturazione canalare e ricostruzione della corona',
      ],
      duration: 'Può richiedere una o più sedute, a seconda dell’anatomia e della presenza di infezione.',
      local:
        'Se hai un dente che duole a Marostica o arrivi da Bassano del Grappa, una visita tempestiva aiuta a capire se il dente è recuperabile.',
      body: [
        'L’obiettivo dell’endodonzia è conservare la radice quando la corona può ancora essere ricostruita. Non tutti i denti doloranti vanno estratti: molti rispondono alla terapia canalare.',
        'Dopo la cura, il dente è più fragile e spesso serve un restauro solido (intarsio o corona) per ridurne la frattura. Lo spieghiamo prima di iniziare.',
        'In caso di ritrattamento o anatomie complesse valutiamo limiti e alternative, inclusa l’estrazione e un’eventuale sostituzione implantare, senza presentare una sola opzione come inevitabile.',
      ],
      faqs: [
        { q: 'La devitalizzazione è dolorosa?', a: 'Si esegue in anestesia locale. Il fastidio post-operatorio, se presente, è di solito gestibile e transitorio.' },
        { q: 'Un dente devitalizzato diventa nero?', a: 'Non è automatico. Eventuali cambiamenti di colore si possono valutare in seguito con restauri o trattamenti estetici adeguati.' },
        { q: 'Quante sedute servono?', a: 'Dipende da anatomia, infezione e restauri esistenti. Alcuni casi si chiudono in una seduta, altri richiedono un appuntamento di completamento.' },
        { q: 'Cosa succede se non tratto l’infezione?', a: 'Può estendersi all’osso intorno alla radice, con ascesso, dolore o perdita del dente. Una visita permette di pesare rischi e tempi.' },
      ],
    },
    en: {
      summary:
        'Endodontics (root canal treatment) in Marostica treats inflammation or infection of the dental pulp, to keep the tooth when possible, by cleaning, disinfecting and filling the canals.',
      audience:
        'Indicated for spontaneous pain, lingering heat sensitivity, abscess, trauma, or a deep cavity that has reached the pulp.',
      stepsTitle: 'Treatment stages',
      steps: [
        'Clinical and radiographic diagnosis',
        'Local anaesthesia and isolation of the tooth',
        'Cleaning and shaping of the canals',
        'Root filling and restoration of the crown',
      ],
      duration: 'It may take one or more visits, depending on anatomy and infection.',
      local:
        'If a tooth hurts in Marostica or you are coming from Bassano del Grappa, a timely visit helps us see whether the tooth can be saved.',
      body: [
        'The aim of endodontics is to keep the root when the crown can still be restored. Not every painful tooth must be extracted: many respond to root canal treatment.',
        'Afterwards the tooth is more brittle and often needs a strong restoration (onlay or crown) to reduce fracture risk. We explain this before starting.',
        'For retreatment or complex anatomy we discuss limits and alternatives, including extraction and a possible implant, without presenting one option as inevitable.',
      ],
      faqs: [
        { q: 'Is a root canal painful?', a: 'It is done under local anaesthetic. Any post-operative discomfort is usually manageable and temporary.' },
        { q: 'Will a root-treated tooth go dark?', a: 'Not automatically. Colour changes, if they occur, can later be addressed with suitable restorations or aesthetic treatment.' },
        { q: 'How many visits are needed?', a: 'It depends on anatomy, infection and existing restorations. Some cases finish in one visit; others need a completion appointment.' },
        { q: 'What if I leave the infection?', a: 'It can spread to the bone around the root, with abscess, pain or tooth loss. A visit lets us weigh risks and timing.' },
      ],
    },
  },
  implants: {
    it: {
      summary:
        'L’implantologia a Marostica sostituisce uno o più denti mancanti con una vite in titanio integrata nell’osso, sulla quale si applica una corona o una protesi. Il percorso prevede diagnosi, pianificazione e tempi di guarigione realistici.',
      audience:
        'Per chi ha perso un dente, porta una protesi mobile instabile, o non può (o non vuole) coinvolgere i denti vicini in un ponte, previa valutazione ossea e medica.',
      stepsTitle: 'Fasi del percorso implantare',
      steps: [
        'Visita, radiografie e, se serve, CBCT',
        'Discussione di alternative (ponte, protesi rimovibile, impianto)',
        'Inserimento dell’impianto e fase di integrazione',
        'Corona o protesi definitiva dopo i tempi di guarigione',
      ],
      duration: 'Dall’inserimento alla corona definitiva possono passare alcuni mesi. I tempi dipendono da osso, sito e eventuali innesti.',
      local:
        'Pazienti di Marostica, Bassano del Grappa e Vicenza nord vengono in studio per valutare se un impianto è indicato nel loro caso, non come unica soluzione.',
      body: [
        'Un impianto non è adatto a tutti: quantità e qualità ossea, salute gengivale, fumo, patologie sistemiche e igiene influenzano indicazione e prognosi.',
        'Spieghiamo rischi (infezione, mancata integrazione, necessità di innesto) e impegno di mantenimento. L’impianto richiede igiene e controlli come un dente naturale, a volte con richiami più frequenti.',
        'I costi dipendono da numero di impianti, tipo di restauro e procedure accessorie. Dopo la diagnosi forniamo un piano scritto; non pubblichiamo prezzi promozionali.',
      ],
      faqs: [
        { q: 'L’impianto è doloroso?', a: 'L’inserimento avviene in anestesia locale. Il post-operatorio è in genere gestibile con le indicazioni che forniamo.' },
        { q: 'Quanto dura un impianto?', a: 'Con igiene e controlli può funzionare molti anni. Non è “a vita” in senso assoluto: va mantenuto e rivalutato nel tempo.' },
        { q: 'Serve sempre l’innesto osseo?', a: 'No. Si valuta sul singolo sito. Se l’osso è insufficiente, se ne discute prima, con tempi e limiti.' },
        { q: 'Posso fare un impianto se fumo?', a: 'Il fumo aumenta il rischio di complicanze. Non è sempre una controindicazione assoluta, ma va considerato onestamente nella prognosi.' },
      ],
    },
    en: {
      summary:
        'Dental implants in Marostica replace one or more missing teeth with a titanium fixture in the bone, supporting a crown or prosthesis. The pathway includes diagnosis, planning and realistic healing times.',
      audience:
        'For people who have lost a tooth, wear an unstable removable denture, or prefer not to involve neighbouring teeth in a bridge — after bone and medical assessment.',
      stepsTitle: 'Implant pathway',
      steps: [
        'Visit, X-rays and CBCT if needed',
        'Discussion of alternatives (bridge, removable denture, implant)',
        'Placement of the implant and integration phase',
        'Final crown or prosthesis after healing',
      ],
      duration: 'From placement to the final crown can take several months. Timing depends on bone, site and any grafting.',
      local:
        'Patients from Marostica, Bassano del Grappa and northern Vicenza come to the practice to see whether an implant is indicated — not as the only option.',
      body: [
        'An implant is not suitable for everyone: bone volume and quality, gum health, smoking, medical conditions and hygiene affect indication and outlook.',
        'We explain risks (infection, failure to integrate, possible grafting) and the maintenance commitment. An implant needs hygiene and check-ups like a natural tooth, sometimes with more frequent recalls.',
        'Costs depend on the number of implants, the type of restoration and extra procedures. After diagnosis we provide a written plan; we do not advertise promotional prices.',
      ],
      faqs: [
        { q: 'Is implant surgery painful?', a: 'Placement is under local anaesthetic. Recovery is usually manageable with the instructions we give.' },
        { q: 'How long does an implant last?', a: 'With hygiene and reviews it can function for many years. It is not “for life” in an absolute sense: it must be maintained and reassessed.' },
        { q: 'Is a bone graft always needed?', a: 'No. It is assessed site by site. If bone is insufficient, we discuss it beforehand, including extra time and limits.' },
        { q: 'Can I have an implant if I smoke?', a: 'Smoking raises the risk of complications. It is not always an absolute contraindication, but it must be considered honestly in the prognosis.' },
      ],
    },
  },
  protesi: {
    it: {
      summary:
        'La protesi dentale a Marostica ripristina denti mancanti o compromessi con corone, ponti, protesi fisse su impianti o protesi rimovibili, per masticazione, fonetica e un aspetto naturale coerente con i denti residui.',
      audience:
        'Utile se manca uno o più denti, una corona è usurata, una protesi mobile non è più stabile, o serve ricostruire un dente dopo una devitalizzazione.',
      stepsTitle: 'Come procediamo',
      steps: [
        'Valutazione di denti, gengive, occlusione e aspettative',
        'Scelta tra opzioni fisse e rimovibili, con limiti di ciascuna',
        'Preparazione, impronte o scansione e prove estetiche',
        'Consegna, adattamenti e istruzioni di manutenzione',
      ],
      duration: 'Un restauro singolo può richiedere poche sedute; riabilitazioni più estese si distribuiscono su settimane.',
      local:
        'Lo studio a Marostica segue riabilitazioni protesiche anche per chi arriva da Bassano, Thiene e dai paesi della pedemontana vicentina.',
      body: [
        'Non esiste una protesi “migliore” in assoluto: si sceglie in base a denti residui, osso, igiene, budget e volontà di chirurgia. Un ponte, un impianto o una protesi rimovibile hanno indicazioni diverse.',
        'Materiali e forma si valutano insieme, soprattutto nei settori anteriori. L’obiettivo è un risultato armonico, non un’estetica standardizzata.',
        'Dopo la consegna servono controlli: una protesi ben fatta dura di più se igiene e occlusione restano sotto osservazione.',
      ],
      faqs: [
        { q: 'Meglio un ponte o un impianto?', a: 'Dipende dai denti vicini, dall’osso e dalle abitudini. Li confrontiamo caso per caso, con tempi, rischi e manutenzione.' },
        { q: 'Le protesi mobili sono ancora usate?', a: 'Sì, quando mancano più denti o la chirurgia non è indicata o desiderata. Oggi si possono migliorare stabilità e comfort in molti casi.' },
        { q: 'Una corona è sempre necessaria dopo la devitalizzazione?', a: 'Non sempre, ma spesso il dente è più fragile. Si valuta quanto tessuto resta e il carico masticatorio.' },
        { q: 'Quanto dura una corona?', a: 'Anni, se i margini restano pulibili e l’occlusione è controllata. Non è permanente: va monitorata.' },
      ],
    },
    en: {
      summary:
        'Dental prosthetics in Marostica restore missing or compromised teeth with crowns, bridges, implant-supported restorations or removable dentures, for chewing, speech and a natural look that matches remaining teeth.',
      audience:
        'Useful if one or more teeth are missing, a crown is worn, a denture is unstable, or a tooth needs rebuilding after root canal treatment.',
      stepsTitle: 'How we proceed',
      steps: [
        'Assessment of teeth, gums, bite and expectations',
        'Choice between fixed and removable options, with the limits of each',
        'Preparation, impressions or scans and aesthetic try-ins',
        'Fitting, adjustments and maintenance advice',
      ],
      duration: 'A single restoration may take a few visits; larger rehabilitations are spread over weeks.',
      local:
        'The Marostica practice provides prosthetic care also for patients from Bassano, Thiene and the surrounding Vicenza foothills.',
      body: [
        'There is no universally “best” prosthesis: the choice depends on remaining teeth, bone, hygiene, budget and willingness for surgery. A bridge, an implant and a removable denture have different indications.',
        'Materials and shape are decided together, especially at the front. The aim is a harmonious result, not a standardised look.',
        'After fitting, reviews matter: a well-made prosthesis lasts longer if hygiene and bite stay under observation.',
      ],
      faqs: [
        { q: 'Is a bridge or an implant better?', a: 'It depends on neighbouring teeth, bone and habits. We compare them case by case, including time, risks and maintenance.' },
        { q: 'Are removable dentures still used?', a: 'Yes, when several teeth are missing or surgery is not indicated or wanted. Stability and comfort can often be improved today.' },
        { q: 'Is a crown always needed after a root canal?', a: 'Not always, but the tooth is often more fragile. We assess remaining tooth structure and biting load.' },
        { q: 'How long does a crown last?', a: 'Years, if the margins stay cleanable and the bite is controlled. It is not permanent and needs monitoring.' },
      ],
    },
  },
  'cosmetic-dentistry': {
    it: {
      summary:
        'L’estetica dentale a Marostica include sbiancamento professionale, restauri adesivi e, quando indicato, faccette o riallineamenti conservativi. L’obiettivo è un sorriso armonico, con indicazioni chiare e senza promesse di “perfezione”.',
      audience:
        'Per chi ha discromie, usura, piccoli diastemi o restauri anteriori da aggiornare, dopo una visita che valuta gengive, morso e aspettative.',
      stepsTitle: 'Valutazione estetica',
      steps: [
        'Analisi di forma, colore, gengive e occlusione',
        'Fotografie e, se utile, prova del sorriso (mock-up)',
        'Scelta della tecnica meno invasiva adeguata al caso',
        'Trattamento e indicazioni di mantenimento',
      ],
      duration: 'Uno sbiancamento si conclude in una o poche sedute. Faccette o restauri estesi richiedono più appuntamenti.',
      local:
        'Chi cerca sbiancamento o rifiniture estetiche a Marostica e nel basso bassanese trova in studio un approccio prudente, orientato alla conservazione dello smalto.',
      body: [
        'Prima di qualsiasi trattamento estetico controlliamo carie, gengiviti e parafunzioni. Sbiancare o applicare faccette su tessuti infiammati o denti non sani non è indicato.',
        'Lo sbiancamento professionale schiarisce lo smalto in modo controllato; non è permanente e non funziona allo stesso modo su corone o otturazioni.',
        'Le faccette rimuovono una quantità variabile di smalto: le proponiamo solo se il beneficio giustifica la preparazione, dopo aver considerato compositi diretti o solo lo sbiancamento.',
      ],
      faqs: [
        { q: 'Lo sbiancamento rovina i denti?', a: 'Eseguito con protocolli professionali e dopo una visita, è generalmente sicuro. Sensibilità transitoria è possibile. Non va improvvisato con prodotti non idonei.' },
        { q: 'Quanto dura lo sbiancamento?', a: 'Mesi o qualche anno, in base a caffè, tè, fumo e igiene. Si può ripetere in modo ragionato.' },
        { q: 'Le faccette sono reversibili?', a: 'Spesso no, perché si prepara lo smalto. Per questo valutiamo prima opzioni più conservative.' },
        { q: 'Posso sbiancare se ho otturazioni anteriori?', a: 'Lo smalto schiarisce, i compositi no. Potrebbe servire sostituire i restauri dopo lo sbiancamento per uniformare il colore.' },
      ],
    },
    en: {
      summary:
        'Cosmetic dentistry in Marostica includes professional whitening, adhesive restorations and, when indicated, veneers or conservative reshaping. The aim is a harmonious smile, with clear indications and no promise of “perfection”.',
      audience:
        'For people with staining, wear, small gaps or older front restorations — after a visit that assesses gums, bite and expectations.',
      stepsTitle: 'Aesthetic assessment',
      steps: [
        'Analysis of shape, colour, gums and bite',
        'Photographs and, if useful, a smile trial (mock-up)',
        'Choice of the least invasive technique that fits the case',
        'Treatment and maintenance advice',
      ],
      duration: 'Whitening is completed in one or a few visits. Veneers or larger restorations need more appointments.',
      local:
        'People looking for whitening or aesthetic refinements in Marostica and the Bassano area will find a cautious approach here, aimed at conserving enamel.',
      body: [
        'Before any aesthetic treatment we check for cavities, gingivitis and grinding. Whitening or veneers on inflamed tissues or unhealthy teeth is not indicated.',
        'Professional whitening lightens enamel in a controlled way; it is not permanent and does not change crowns or fillings in the same way.',
        'Veneers remove a variable amount of enamel. We propose them only if the benefit justifies preparation, after considering direct composite or whitening alone.',
      ],
      faqs: [
        { q: 'Does whitening damage teeth?', a: 'With professional protocols and after a visit it is generally safe. Temporary sensitivity can occur. It should not be improvised with unsuitable products.' },
        { q: 'How long does whitening last?', a: 'Months to a few years, depending on coffee, tea, smoking and hygiene. It can be repeated in a considered way.' },
        { q: 'Are veneers reversible?', a: 'Often not, because enamel is prepared. That is why we first consider more conservative options.' },
        { q: 'Can I whiten if I have front fillings?', a: 'Enamel lightens; composite does not. Restorations may need replacing afterwards to match the new colour.' },
      ],
    },
  },
  'oral-surgery': {
    it: {
      summary:
        'La chirurgia orale a Marostica comprende estrazioni, denti del giudizio, residuali radicolari e piccoli interventi sui tessuti molli, con anestesia locale, spiegazione dei rischi e indicazioni chiare per il post-operatorio.',
      audience:
        'Quando un dente non è recuperabile, un dente del giudizio è incluso o infiammato, c’è un ascesso da drenare o serve una piccola chirurgia pre-protesica.',
      stepsTitle: 'Prima e dopo l’intervento',
      steps: [
        'Visita, radiografia e discussione di alternative conservative se esistono',
        'Pianificazione di anestesia, tempi e eventuali punti di sutura',
        'Intervento in anestesia locale',
        'Istruzioni scritte, farmacologiche se indicate, e controllo di guarigione',
      ],
      duration: 'Un’estrazione semplice può durare pochi minuti; un dente del giudizio incluso richiede più tempo e un recupero di alcuni giorni.',
      local:
        'Estrazioni e denti del giudizio si eseguono in studio a Marostica; i pazienti arrivano anche da Bassano del Grappa e Thiene per una valutazione in tempi ragionevoli.',
      body: [
        'L’estrazione è l’ultima opzione quando il dente non è conservabile o il rapporto rischio/beneficio della conservazione è sfavorevole. Lo spieghiamo con radiografie alla mano.',
        'I denti del giudizio non vanno sempre tolti: si estraggono se carie, infiammazioni ricorrenti, cisti, danno ai denti vicini o indicazioni ortodontiche lo giustificano.',
        'Dopo l’intervento: ghiaccio, alimentazione morbida, igiene delicata e rispetto dei tempi. Il fumo peggiora la guarigione: lo diciamo in modo esplicito.',
      ],
      faqs: [
        { q: 'Fa male togliere un dente del giudizio?', a: 'Si opera in anestesia locale. Gonfiore e fastidio nei giorni successivi sono comuni e di solito gestibili con le indicazioni che forniamo.' },
        { q: 'Devo togliere tutti i denti del giudizio?', a: 'No. Si valuta ogni dente: posizione, sintomi, igiene e radiografia. Un dente asintomatico e pulibile può essere solo controllato.' },
        { q: 'Quando posso lavorare o fare sport?', a: 'Spesso il giorno dopo per estrazioni semplici; per interventi più impegnativi consigliamo riposo di 24–72 ore, da adattare al caso.' },
        { q: 'Cosa fare se sanguina a casa?', a: 'Tamponare con garza umida e pressione. Se il sanguinamento non si riduce, chiamare lo studio. Evitare di sciacquare con forza nelle prime ore.' },
      ],
    },
    en: {
      summary:
        'Oral surgery in Marostica includes extractions, wisdom teeth, residual roots and minor soft-tissue procedures, under local anaesthetic, with a clear explanation of risks and aftercare.',
      audience:
        'When a tooth cannot be saved, a wisdom tooth is impacted or inflamed, an abscess needs drainage, or small pre-prosthetic surgery is required.',
      stepsTitle: 'Before and after surgery',
      steps: [
        'Visit, X-ray and discussion of conservative alternatives if they exist',
        'Planning of anaesthesia, timing and any sutures',
        'Procedure under local anaesthetic',
        'Written instructions, medicines if indicated, and a healing review',
      ],
      duration: 'A simple extraction can take a few minutes; an impacted wisdom tooth takes longer, with several days of recovery.',
      local:
        'Extractions and wisdom teeth are treated at the Marostica practice; patients also come from Bassano del Grappa and Thiene for timely assessment.',
      body: [
        'Extraction is the last option when a tooth cannot be kept or the risk–benefit of keeping it is poor. We explain this with the X-rays in front of you.',
        'Wisdom teeth do not always need removal: we extract them if decay, recurrent inflammation, cysts, damage to neighbours or orthodontic reasons justify it.',
        'Afterwards: ice, soft food, gentle hygiene and rest as advised. Smoking delays healing — we say this plainly.',
      ],
      faqs: [
        { q: 'Does wisdom-tooth removal hurt?', a: 'It is done under local anaesthetic. Swelling and soreness in the following days are common and usually manageable with the advice we give.' },
        { q: 'Must all wisdom teeth come out?', a: 'No. Each tooth is assessed: position, symptoms, hygiene and X-ray. A symptom-free, cleanable tooth can simply be monitored.' },
        { q: 'When can I work or exercise?', a: 'Often the next day after simple extractions; after more involved surgery we advise 24–72 hours of rest, adapted to the case.' },
        { q: 'What if it bleeds at home?', a: 'Bite on damp gauze with pressure. If bleeding does not ease, call the practice. Avoid forceful rinsing in the first hours.' },
      ],
    },
  },
  'snoring-sleep-apnea': {
    it: {
      summary:
        'Il russamento e le apnee notturne possono avere un contributo odontostomatologico. A Marostica valutiamo se un dispositivo di avanzamento mandibolare è appropriato, in collaborazione con il medico che segue il sonno, senza sostituire la diagnosi medica.',
      audience:
        'Adulti che russano, hanno sonno non ristoratore, pause respiratorie riferite dal partner, o una diagnosi di OSAS lieve-moderata per cui è stato proposto un bite di avanzamento.',
      stepsTitle: 'Come lavoriamo',
      steps: [
        'Raccolta di sintomi, abitudini e, se presente, referto del sonno',
        'Esame di denti, articolazioni, morso e vie aeree orali',
        'Confronto con il percorso medico (otorino, pneumologo, centro del sonno)',
        'Eventuale dispositivo personalizzato e controlli di adattamento',
      ],
      duration: 'La valutazione iniziale dura circa una visita. Un dispositivo, se indicato, richiede impronte e successivi adattamenti.',
      local:
        'Chi cerca un dentista per russamento o apnee nell’area di Marostica e Bassano del Grappa può trovare qui un primo orientamento odontostomatologico, integrato — non sostitutivo — della visita medica.',
      body: [
        'L’apnea ostruttiva del sonno è una condizione medica. Il dentista non pone da solo la diagnosi: può collaborare quando è già stata inquadrata o quando i segni orali (bruxismo, usura, palato stretto) suggeriscono un approfondimento.',
        'I dispositivi di avanzamento mandibolare spostano in avanti la mandibola per ridurre il collasso delle vie aeree in casi selezionati, spesso OSAS lieve-moderata o russamento, se il morso e le articolazioni lo consentono.',
        'Non sostituiscono automaticamente la CPAP quando questa è indicata. Effetti collaterali (fastidio articolare, spostamenti dentali) esistono e vanno monitorati.',
      ],
      faqs: [
        { q: 'Il bite per russare funziona sempre?', a: 'No. Funziona in casi selezionati. Serve una valutazione del morso e, per le apnee, un inquadramento medico del sonno.' },
        { q: 'Posso evitare la polisonnografia?', a: 'La diagnostica del sonno spetta al medico competente. Noi non la sostituiamo: la chiediamo o la consigliamo quando i sintomi lo richiedono.' },
        { q: 'Fa male all’articolazione della mandibola?', a: 'Può dare fastidio, soprattutto all’inizio. Se il dolore persiste si adatta o si sospende il dispositivo.' },
        { q: 'È a carico del Servizio sanitario?', a: 'I percorsi e le coperture variano. In visita indichiamo cosa è competenza medica e cosa possiamo realizzare in studio.' },
      ],
    },
    en: {
      summary:
        'Snoring and sleep apnoea can have a dental contribution. In Marostica we assess whether a mandibular advancement device is appropriate, together with the physician managing sleep, without replacing a medical diagnosis.',
      audience:
        'Adults who snore, wake unrefreshed, have witnessed breathing pauses, or have mild–moderate OSA for which an advancement splint has been suggested.',
      stepsTitle: 'How we work',
      steps: [
        'Review of symptoms, habits and any sleep study report',
        'Exam of teeth, joints, bite and the oral airway',
        'Coordination with the medical pathway (ENT, pulmonology, sleep clinic)',
        'A custom device if indicated, plus adaptation reviews',
      ],
      duration: 'The first assessment is about one visit. A device, if indicated, needs impressions and later adjustments.',
      local:
        'If you are looking for a dentist for snoring or apnoea in the Marostica and Bassano del Grappa area, we can offer a dental orientation that complements — not replaces — medical care.',
      body: [
        'Obstructive sleep apnoea is a medical condition. The dentist does not diagnose it alone: we collaborate when it is already classified, or when oral signs (grinding, wear, a narrow palate) suggest further investigation.',
        'Mandibular advancement devices move the lower jaw forward to reduce airway collapse in selected cases, often mild–moderate OSA or snoring, if the bite and joints allow it.',
        'They do not automatically replace CPAP when CPAP is indicated. Side effects (joint discomfort, tooth movement) exist and must be monitored.',
      ],
      faqs: [
        { q: 'Does an anti-snoring splint always work?', a: 'No. It works in selected cases. The bite must be assessed and, for apnoea, a medical sleep work-up is needed.' },
        { q: 'Can I skip a sleep study?', a: 'Sleep diagnostics belong to the relevant physician. We do not replace them: we request or recommend them when symptoms require it.' },
        { q: 'Will it hurt the jaw joint?', a: 'It can cause discomfort, especially at first. If pain persists we adjust or stop the device.' },
        { q: 'Is it covered by the health service?', a: 'Pathways and coverage vary. At the visit we explain what is medical care and what we can provide in the practice.' },
      ],
    },
  },
};

export function getServiceLanding(key: ServiceCatalogKey, language: Language): ServiceLanding {
  return CONTENT[key][language];
}

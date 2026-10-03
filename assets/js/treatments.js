/**
 * LUMÉA - Treatments Dataset & Engine
 */

(function () {
  const TREATMENTS_DATA = [
    {
      id: 'hydrafacial-md',
      title: 'Hydrafacial MD® Elite Infusion',
      category: 'Hydrafacials',
      concern: ['Hydration', 'Texture', 'Maintenance', 'Brightening'],
      duration: 60,
      startingPrice: 5499,
      depositPercent: 20,
      rating: 4.96,
      reviewsCount: 342,
      providerCount: 18,
      earliestSlot: 'Today, 2:30 PM',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80',
      shortDesc: 'A patented 3-step medical-grade facial combining deep vortex cleansing, painless extraction, and antioxidant peptide infusion.',
      fullDesc: 'The Hydrafacial MD® is the gold standard in non-invasive clinical rejuvenation. Using patented Vortex-Fusion technology, it deeply cleanses congested pores, exfoliates dead cellular debris with mild salicylic and glycolic acids, and saturates the skin barrier with intensive hyaluronic acid, peptides, and botanical antioxidants.',
      includes: [
        'Vortex deep pore suction & salicylic acid prep',
        'Gentle non-irritating peel exfoliation',
        'Automated painless blackhead vortex extraction',
        'Custom antioxidant & hyaluronic peptide infusion',
        'Soothing finishing barrier protection with SPF'
      ],
      durationOptions: [
        { label: '45 min Express', duration: 45, price: 4499 },
        { label: '60 min Signature', duration: 60, price: 5499, default: true },
        { label: '75 min Platinum Deluxe', duration: 75, price: 7299 }
      ],
      availableAddons: [
        { id: 'addon-led', name: 'Clinical Red/Blue LED Therapy', price: 999, duration: 15 },
        { id: 'addon-cooling-mask', name: 'Cryo Soothing Algae Mask', price: 799, duration: 10 },
        { id: 'addon-neck', name: 'Neck & Décolleté Booster Infusion', price: 1499, duration: 15 },
        { id: 'addon-scalp', name: 'Relaxing Botanical Scalp Acupressure', price: 699, duration: 10 }
      ],
      prep: 'Discontinue prescription retinol and direct active acids 3 days prior. Avoid recent sun exposure or harsh physical scrubs.',
      aftercare: 'Maintain hydration, apply broad-spectrum SPF 50+, avoid heavy makeup for 12 hours, and enjoy immediate glass-skin luminosity.',
      frequency: 'Every 4 to 6 weeks for optimal skin barrier health and sustained pore purity.',
      whoFor: 'Ideal for all skin types, especially dehydrated, congested, dull, or event-ready complexions seeking instant glow with zero downtime.'
    },
    {
      id: 'biorepeel-glow',
      title: 'BioRePeelCl3® 35% TCA Glow Peel',
      category: 'Chemical Peels',
      concern: ['Acne & Breakouts', 'Brightening', 'Texture', 'Anti-Aging'],
      duration: 50,
      startingPrice: 4899,
      depositPercent: 20,
      rating: 4.92,
      reviewsCount: 218,
      providerCount: 14,
      earliestSlot: 'Tomorrow, 11:00 AM',
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=900&q=80',
      shortDesc: 'An innovative biphasic medical peel delivering 35% TCA bio-stimulation without painful peeling or visible social downtime.',
      fullDesc: 'BioRePeelCl3® is an internationally acclaimed Italian medical peeling protocol. Its patented two-phase formula bypasses the outer epidermis to stimulate deep collagen synthesis, regulate sebum production, dissolve stubborn hyperpigmentation, and tighten skin texture with minimal surface flaking.',
      includes: [
        'Pre-peel lipid balancing cleanse',
        'BioRePeel biphasic active massage application',
        'Neutralization & epidermal pH restoration',
        'Post-peel soothing ceramide calm balm',
        'Mineral solar protection'
      ],
      durationOptions: [
        { label: '35 min Targeted Face', duration: 35, price: 4899, default: true },
        { label: '50 min Face & Neck Matrix', duration: 50, price: 6299 },
        { label: '65 min Face, Neck & Décolleté', duration: 65, price: 7999 }
      ],
      availableAddons: [
        { id: 'addon-led', name: 'Anti-Inflammatory Yellow LED', price: 999, duration: 15 },
        { id: 'addon-hyaluronic', name: 'Pure Cross-linked Hyaluronic Shield', price: 899, duration: 10 },
        { id: 'addon-ice-globes', name: 'Cryo Ice Globe Lymphatic Drainage', price: 599, duration: 10 }
      ],
      prep: 'Stop AHA/BHA exfoliants and retinoids 5 days prior. Avoid facial waxing or laser 10 days before treatment.',
      aftercare: 'Mild dryness may occur on days 3–4. Keep skin generously moisturized with gentle barrier creams. Wear broad-spectrum SPF 50 daily.',
      frequency: 'Course of 4 sessions spaced 10–14 days apart for corrective results, then monthly maintenance.',
      whoFor: 'Clients struggling with active acne, post-inflammatory marks, melasma, enlarged pores, or rough skin texture.'
    },
    {
      id: 'medical-microneedling',
      title: 'Clinical Microneedling + Exosome Infusion',
      category: 'Microneedling',
      concern: ['Anti-Aging', 'Texture', 'Acne & Breakouts'],
      duration: 75,
      startingPrice: 7999,
      depositPercent: 25,
      rating: 4.98,
      reviewsCount: 405,
      providerCount: 16,
      earliestSlot: 'Today, 4:00 PM',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80',
      shortDesc: 'Automated collagen induction therapy coupled with billion-exosome bio-regenerative serum for rapid scar and texture repair.',
      fullDesc: 'Using medical-grade precision micro-channels, this therapy triggers your skin natural neocollagenesis while simultaneously delivering pure plant-derived exosomes rich in growth factors and mRNA. It dramatically improves acne scars, fine lines, skin laxity, and pore structure.',
      includes: [
        'Topical medical-grade numbing preparation (25 min)',
        'Sterile micro-needling with customized depth mapping',
        'Freshly reconstituted active exosome serum infusion',
        'Post-needling calming biocellulose sheet mask',
        'Take-home 48-hour recovery soothing ampoule'
      ],
      durationOptions: [
        { label: '60 min Face Protocol', duration: 60, price: 7999, default: true },
        { label: '75 min Face & Neck Dual Zone', duration: 75, price: 10499 },
        { label: '90 min Face, Neck & Scars Protocol', duration: 90, price: 12999 }
      ],
      availableAddons: [
        { id: 'addon-led-calm', name: 'Near-Infrared Healing LED', price: 1199, duration: 15 },
        { id: 'addon-growth-ampoule', name: 'Double Exosome Concentration Boost', price: 2499, duration: 0 },
        { id: 'addon-calm-mask', name: 'Medical Cryo Recovery Shield', price: 899, duration: 10 }
      ],
      prep: 'Avoid blood-thinning supplements 48 hours before. Ensure no active cold sores or severe cystic flareups.',
      aftercare: 'Mild redness like a light sunburn for 24 hours. No sweating, sauna, or heavy makeup for 24-48 hours. Keep applying recovery serum.',
      frequency: '3 to 5 treatments spaced 4 weeks apart.',
      whoFor: 'Anyone targeting stubborn acne scarring, deep texture irregularities, fine lines, or loss of collagen elasticity.'
    },
    {
      id: 'clinical-led-therapy',
      title: 'Dermalux® Tri-Wave MD Phototherapy',
      category: 'LED Therapy',
      concern: ['Sensitivity', 'Acne & Breakouts', 'Anti-Aging', 'Maintenance'],
      duration: 45,
      startingPrice: 2499,
      depositPercent: 20,
      rating: 4.89,
      reviewsCount: 164,
      providerCount: 22,
      earliestSlot: 'Today, 1:00 PM',
      image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=900&q=80',
      shortDesc: 'Medically certified light phototherapy combining simultaneous Blue 415nm, Red 633nm, and NIR 830nm wavelengths.',
      fullDesc: 'Clinically proven light therapy that energizes cellular ATP, destroys acne-causing bacteria (P. acnes), speeds wound healing, calms rosacea redness, and stimulates fibroblasts for noticeable firmness and soothing relief without heat or discomfort.',
      includes: [
        'Enzymatic cleanse and gentle polish',
        'Targeted barrier prep serum',
        '20 min Tri-Wave MD clinical LED exposure',
        'Hyaluronic quench barrier sealant',
        'Cooling jade roller finish'
      ],
      durationOptions: [
        { label: '30 min Standalone Light Session', duration: 30, price: 2499, default: true },
        { label: '45 min Light + Bio-Cellulose Mask', duration: 45, price: 3499 },
        { label: '60 min Light + Lymphatic Drainage', duration: 60, price: 4499 }
      ],
      availableAddons: [
        { id: 'addon-hydro-jelly', name: 'Electrolyte Infused Hydrojelly Mask', price: 799, duration: 15 },
        { id: 'addon-neck-led', name: 'Neck & Chest LED Panel Extension', price: 999, duration: 15 }
      ],
      prep: 'Arrive without heavy makeup. Contact lenses should ideally be removed if sensitive to bright light.',
      aftercare: 'Zero downtime. You can immediately return to work, apply makeup, and carry on your day.',
      frequency: '1 to 2 times weekly for acne/wound healing courses, or bi-weekly for skin health maintenance.',
      whoFor: 'Sensitive skin, rosacea-prone clients, active acne, or as an instant radiance pick-me-up.'
    },
    {
      id: 'clarifying-acne-facial',
      title: 'Deep Pore Clarifying & Sebum Balance Facial',
      category: 'Acne Treatments',
      concern: ['Acne & Breakouts', 'Texture', 'Sensitivity'],
      duration: 60,
      startingPrice: 3999,
      depositPercent: 20,
      rating: 4.91,
      reviewsCount: 280,
      providerCount: 19,
      earliestSlot: 'Today, 5:30 PM',
      image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=900&q=80',
      shortDesc: 'A multi-step decongesting facial utilizing ultrasonic cavitation, enzymatic exfoliation, and high-frequency anti-bacterial therapy.',
      fullDesc: 'Specially engineered for oily, combination, and acne-prone skin. It clears blocked microcomedones, dissolves excess sebum plugs with botanical enzymes, sanitizes the follicle with ozone high frequency, and balances the skin microbiome.',
      includes: [
        'Double purifying tea tree & salicylic cleanse',
        'Warm ionic steam & gentle ultrasonic blade peeling',
        'Manual extraction of stubborn blackheads & milia',
        'Anti-bacterial High-Frequency ozone wand treatment',
        'Calming sulfur & zinc purifying mask with ice therapy'
      ],
      durationOptions: [
        { label: '50 min Standard Clarifying', duration: 50, price: 3999, default: true },
        { label: '70 min Intensive Anti-Blemish Deluxe', duration: 70, price: 5499 }
      ],
      availableAddons: [
        { id: 'addon-blue-led', name: 'Blue Light 415nm Acne Neutralizer', price: 899, duration: 15 },
        { id: 'addon-salicylic-spot', name: 'Targeted Salicylic Micro-Peel Spotting', price: 699, duration: 10 }
      ],
      prep: 'Avoid aggressive home pore strips or self-squeezing blemishes 48 hours prior.',
      aftercare: 'Avoid touching face, clean cell phone screen, change pillowcase, and skip makeup for the remainder of the day.',
      frequency: 'Every 3 to 4 weeks depending on acne grade.',
      whoFor: 'Oily skin, stubborn blackheads, whiteheads, hormonal jawline congestion, and recurring breakouts.'
    },
    {
      id: 'rf-microneedling-lift',
      title: 'Morpheus8 Matrix RF Micro-Tightening',
      category: 'Anti-Aging Treatments',
      concern: ['Anti-Aging', 'Texture'],
      duration: 90,
      startingPrice: 14999,
      depositPercent: 30,
      rating: 4.97,
      reviewsCount: 189,
      providerCount: 11,
      earliestSlot: 'Saturday, 10:00 AM',
      image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80',
      shortDesc: 'Fractional radiofrequency subdermal remodeling that contours jawline, tightens sagging tissue, and rebuilds elastin fibers.',
      fullDesc: 'The ultimate non-surgical lifting treatment combining silicone-insulated micro-pins with focused radiofrequency thermal energy delivered deep into the subdermal fibroseptal network. Restructures collagen, tightens jowls, and smoothes deep wrinkles.',
      includes: [
        'Comprehensive 3D digital facial scan & consultation',
        'Deep topical prescription numbing (45 min)',
        'Multi-depth Morpheus8 RF energy delivery',
        'Cooling medical epidermal compress',
        'Growth-factor peptide recovery infusion'
      ],
      durationOptions: [
        { label: '60 min Lower Face & Jawline Sculpt', duration: 60, price: 14999, default: true },
        { label: '90 min Full Face & Neck Remodeling', duration: 90, price: 19999 },
        { label: '120 min Face, Neck & Décolletage Master', duration: 120, price: 24999 }
      ],
      availableAddons: [
        { id: 'addon-prp', name: 'Autologous Growth Factor Serum', price: 4999, duration: 15 },
        { id: 'addon-cryo-calm', name: 'Post-Procedure Cryo Cooling Therapy', price: 1499, duration: 15 }
      ],
      prep: 'Avoid NSAIDs, blood-thinning teas, alcohol, and retinoids 72 hours prior.',
      aftercare: 'Micro-crusting will appear on days 2–5. Use provided gentle cleanser and healing ointment only. Avoid heat and direct sunlight.',
      frequency: 'Series of 2 to 3 sessions spaced 6 weeks apart for long-lasting structural lifting.',
      whoFor: 'Clients experiencing loss of facial contour definition, neck laxity, deep nasolabial folds, or pronounced acne pitting.'
    },
    {
      id: 'brightening-c-infusion',
      title: 'L-Ascorbic Vitamin C + Glutathione Glow',
      category: 'Skin Brightening',
      concern: ['Brightening', 'Maintenance', 'Sensitivity'],
      duration: 60,
      startingPrice: 4299,
      depositPercent: 20,
      rating: 4.93,
      reviewsCount: 312,
      providerCount: 17,
      earliestSlot: 'Today, 3:15 PM',
      image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=900&q=80',
      shortDesc: 'Potent 20% freshly stabilized Vitamin C and master antioxidant Glutathione iontophoresis infusion for radiant glass skin.',
      fullDesc: 'Combat environmental oxidation, sun-induced pigmentation, and fatigue. This treatment uses sonophoresis sound waves to infuse high-potency chirally correct Vitamin C, Ferulic acid, and pure Glutathione into dermal layers to inhibit tyrosinase and restore luminous clarity.',
      includes: [
        'Brightening citrus enzyme gentle polish',
        'Sonophoresis Vitamin C & Glutathione infusion',
        'Hydrating algae brightening peel-off mask',
        'Lymphatic pressure point facial massage',
        'Illuminating peptide moisturizer & SPF'
      ],
      durationOptions: [
        { label: '45 min Radiance Boost', duration: 45, price: 3499 },
        { label: '60 min Signature Illuminator', duration: 60, price: 4299, default: true },
        { label: '75 min Platinum Brightening with Neck', duration: 75, price: 5899 }
      ],
      availableAddons: [
        { id: 'addon-eye-bright', name: 'Targeted Eye Contour Caffeine Infusion', price: 899, duration: 15 },
        { id: 'addon-led-red', name: 'Red Collagen Stimulating Light', price: 999, duration: 15 }
      ],
      prep: 'No special preparation required. Gentle for all skin tones.',
      aftercare: 'Immediate glowing glass finish. Maintain results with daily topical antioxidant serums.',
      frequency: 'Every 3 to 4 weeks or right before major social celebrations and weddings.',
      whoFor: 'Sun-damaged, tired, dull skin, uneven tone, or pre-event radiance seekers.'
    },
    {
      id: 'back-body-clarifying-peel',
      title: 'Bespoke Back & Shoulder Clarifying Peel',
      category: 'Body Treatments',
      concern: ['Acne & Breakouts', 'Texture'],
      duration: 55,
      startingPrice: 4999,
      depositPercent: 20,
      rating: 4.88,
      reviewsCount: 142,
      providerCount: 13,
      earliestSlot: 'Tomorrow, 3:00 PM',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80',
      shortDesc: 'A dedicated medical back facial targeting stubborn "bacne", clogged hair follicles, and post-inflammatory pigmentation.',
      fullDesc: 'The skin on the back and shoulders is thicker and has high sebaceous density. This treatment combines steam, deep ultrasonic exfoliation, customized salicylic-mandelic acid peel, extractions, and tea-tree clay clarifying wrap to leave the back smooth and blemish-free.',
      includes: [
        'Deep purifying back wash & ultrasonic exfoliation',
        'Warm clarifying botanical steam',
        'Back micro-extractions for clogged pores',
        '20% Salicylic-Mandelic clarifying back peel',
        'Zinc & green clay detoxifying back wrap'
      ],
      durationOptions: [
        { label: '45 min Upper Back Protocol', duration: 45, price: 4499 },
        { label: '55 min Full Back & Shoulders', duration: 55, price: 4999, default: true },
        { label: '75 min Full Back + LED Therapy', duration: 75, price: 6499 }
      ],
      availableAddons: [
        { id: 'addon-body-led', name: 'Blue/Red LED Back Panel', price: 1299, duration: 20 },
        { id: 'addon-scrub-sugar', name: 'Eucalyptus Sea Salt Polish', price: 799, duration: 15 }
      ],
      prep: 'Avoid waxing the back area within 5 days before the appointment.',
      aftercare: 'Wear loose breathable cotton clothing. Avoid intense workouts or sweating for 24 hours.',
      frequency: 'Every 4 weeks until active breakouts subside, then maintenance.',
      whoFor: 'Athletes, gym-goers, or anyone dealing with bacne, keratosis pilaris, or clogged shoulder pores.'
    },
    {
      id: 'clear-brilliant-laser',
      title: 'Clear + Brilliant® Perméa Fractional Laser',
      category: 'Anti-Aging Treatments',
      concern: ['Brightening', 'Texture', 'Anti-Aging', 'Pores'],
      duration: 50,
      startingPrice: 6999,
      depositPercent: 20,
      rating: 4.97,
      reviewsCount: 285,
      providerCount: 16,
      earliestSlot: 'Today, 4:00 PM',
      image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=900&q=80',
      shortDesc: 'Gentle non-ablative fractional diode laser that creates millions of microscopic thermal zones to renew skin texture and boost permeability.',
      fullDesc: 'Clear + Brilliant® is often called "baby Fraxel" – a gentle yet clinically transformative laser resurfacing technology. The 1927nm Perméa handpiece creates precise micro-thermal injury zones in the upper dermal layers, stimulating accelerated cellular turnover, shrinking pore size, reducing early photo-aging, and boosting antioxidant absorption by 17x.',
      includes: [
        'Topical numbing gel application (20 mins)',
        'Optical tracking full-face laser pass',
        'Post-laser antioxidant physiological serum infusion',
        'Soothing biocellulose cryo calming sheet mask',
        'Physical titanium dioxide SPF 50+ finish'
      ],
      durationOptions: [
        { label: '35 min Full Face Standard', duration: 35, price: 6999, default: true },
        { label: '50 min Face & Neck Rejuvenation', duration: 50, price: 8999 },
        { label: '65 min Face, Neck & Hands Platinum', duration: 65, price: 10999 }
      ],
      availableAddons: [
        { id: 'addon-exosome-boost', name: 'Recombinant Exosome Topical Infusion', price: 1999, duration: 15 },
        { id: 'addon-led-calm', name: 'Post-Laser Red LED Phototherapy', price: 999, duration: 15 }
      ],
      prep: 'Avoid retinoids, AHA/BHA chemical exfoliants, and direct sun exposure 5 days prior to treatment.',
      aftercare: 'Mild sunburn sensation and sandpaper texture for 2–4 days. Keep skin richly hydrated with lipid creams and physical SPF 50+.',
      frequency: 'Series of 3 to 4 sessions spaced 3 to 4 weeks apart, followed by seasonal maintenance.',
      whoFor: 'Clients seeking refined pore texture, tone evening, and prevention of early lines with minimal downtime.'
    }
  ];

  function getAllTreatments() {
    return TREATMENTS_DATA;
  }

  function getTreatmentById(id) {
    return TREATMENTS_DATA.find(t => t.id === id) || TREATMENTS_DATA[0];
  }

  function filterTreatments(query = '', category = '', concern = '', maxPrice = null, sort = 'recommended') {
    let list = [...TREATMENTS_DATA];

    if (query) {
      const q = query.toLowerCase().trim();
      list = list.filter(t => 
        t.title.toLowerCase().includes(q) ||
        t.shortDesc.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.concern.some(c => c.toLowerCase().includes(q))
      );
    }

    if (category && category !== 'All' && category !== 'All Treatments') {
      list = list.filter(t => t.category.toLowerCase() === category.toLowerCase());
    }

    if (concern && concern !== 'All Concerns' && concern !== 'All') {
      list = list.filter(t => t.concern.some(c => c.toLowerCase() === concern.toLowerCase()));
    }

    if (maxPrice) {
      list = list.filter(t => t.startingPrice <= maxPrice);
    }

    if (sort === 'price-low') {
      list.sort((a, b) => a.startingPrice - b.startingPrice);
    } else if (sort === 'price-high') {
      list.sort((a, b) => b.startingPrice - a.startingPrice);
    } else if (sort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'reviews') {
      list.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    return list;
  }

  window.LumeaTreatments = {
    getAll: getAllTreatments,
    getById: getTreatmentById,
    filter: filterTreatments,
    data: TREATMENTS_DATA
  };
})();

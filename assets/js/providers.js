/**
 * LUMÉA - Providers Dataset & Engine
 */

(function () {
  const PROVIDERS_DATA = [
    {
      id: 'prov-aesthetica-dermal',
      name: 'Aesthétika Advanced Dermatology',
      providerType: 'Dermatology Clinics',
      verified: true,
      rating: 4.97,
      reviewsCount: 428,
      location: 'Bandra West, Mumbai',
      fullAddress: 'Suite 402, Horizon Heritage, Linking Road, Bandra West, Mumbai, 400050',
      heroImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=900&q=80',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
      specialistName: 'Dr. Alisha Merchant, MD (Dermatology)',
      experienceYears: 14,
      startingPrice: 4899,
      treatmentsCount: 16,
      nextAvailableSlot: 'Today, 3:30 PM',
      specialties: ['Clinical Peels', 'Hydrafacials', 'Laser Skin Resurfacing', 'Exosome Therapy', 'Acne Protocols'],
      bio: 'A premier dermatology studio headed by Dr. Alisha Merchant, specializing in evidence-based clinical facial rejuvenation, precision micro-needling, and bespoke chemical peeling.',
      clinicPhotos: [
        'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80'
      ],
      availableSlotsToday: ['11:30 AM', '02:00 PM', '03:30 PM', '05:00 PM', '06:30 PM'],
      availableSlotsTomorrow: ['10:00 AM', '11:30 AM', '01:00 PM', '03:00 PM', '04:30 PM', '06:00 PM'],
      tierRate: 1.05 // 5% clinic tier markup for advanced sterile facility
    },
    {
      id: 'prov-lumina-skin-lab',
      name: 'Lumina Aesthetic Skin Studio',
      providerType: 'Skin Specialists',
      verified: true,
      rating: 4.94,
      reviewsCount: 310,
      location: 'Indiranagar, Bengaluru',
      fullAddress: '12th Main, 100 Feet Rd, Indiranagar, Bengaluru, 560038',
      heroImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80',
      avatar: 'https://images.unsplash.com/photo-1594824813627-844a49c336b4?auto=format&fit=crop&w=400&q=80',
      specialistName: 'Meera Nambiar, CIDESCO Certified Master Esthetician',
      experienceYears: 10,
      startingPrice: 3999,
      treatmentsCount: 12,
      nextAvailableSlot: 'Today, 4:15 PM',
      specialties: ['Hydrafacial MD', 'LED Light Therapy', 'Lymphatic Drainage', 'Barrier Restoration'],
      bio: 'Lumina Studio combines clean clinical protocols with sensory luxury, offering tailored treatments that nourish cellular vitality and deliver enduring glass-skin glow.',
      clinicPhotos: [
        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=800&q=80'
      ],
      availableSlotsToday: ['01:30 PM', '04:15 PM', '05:45 PM'],
      availableSlotsTomorrow: ['09:30 AM', '11:00 AM', '02:00 PM', '03:30 PM', '05:00 PM'],
      tierRate: 1.00
    },
    {
      id: 'prov-novaclinic-dermatology',
      name: 'NovaDerma Medi-Clinic',
      providerType: 'Dermatology Clinics',
      verified: true,
      rating: 4.98,
      reviewsCount: 512,
      location: 'Vasant Vihar, New Delhi',
      fullAddress: 'C-Block Market, Vasant Vihar, New Delhi, 110057',
      heroImage: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=900&q=80',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
      specialistName: 'Dr. Rohan Mathur & Team',
      experienceYears: 18,
      startingPrice: 5499,
      treatmentsCount: 22,
      nextAvailableSlot: 'Tomorrow, 10:30 AM',
      specialties: ['Morpheus8 RF', 'Medical Microneedling', 'BioRePeel', 'TCA Peels', 'Pigmentation Correction'],
      bio: 'Equipped with US-FDA approved technologies, NovaDerma offers cutting-edge dermatological solutions for scar remodeling, deep tissue collagen synthesis, and precision laser aesthetics.',
      clinicPhotos: [
        'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80'
      ],
      availableSlotsToday: ['05:30 PM'],
      availableSlotsTomorrow: ['10:30 AM', '12:00 PM', '02:30 PM', '04:00 PM', '06:00 PM'],
      tierRate: 1.10
    },
    {
      id: 'prov-pure-botanique-spa',
      name: 'Pure Botanique Holistic Skin Atelier',
      providerType: 'Estheticians',
      verified: true,
      rating: 4.89,
      reviewsCount: 195,
      location: 'Koregaon Park, Pune',
      fullAddress: 'Lane 7, North Main Road, Koregaon Park, Pune, 411001',
      heroImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      specialistName: 'Sanjana Desai, Holistic Skin Therapist',
      experienceYears: 8,
      startingPrice: 3499,
      treatmentsCount: 10,
      nextAvailableSlot: 'Today, 5:00 PM',
      specialties: ['Custom Clarifying Facials', 'Vitamin C Infusion', 'Gua Sha Sculpting', 'Enzyme Peels'],
      bio: 'Focused on gentle, biocompatible skincare protocols and active botanical extracts that nurture your natural epidermal lipid barrier.',
      clinicPhotos: [
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
      ],
      availableSlotsToday: ['02:00 PM', '05:00 PM'],
      availableSlotsTomorrow: ['11:00 AM', '01:30 PM', '03:30 PM'],
      tierRate: 0.95
    },
    {
      id: 'prov-clarity-dermatology-hub',
      name: 'Clarity Medi-Aesthetic Centre',
      providerType: 'Beauty Studios',
      verified: true,
      rating: 4.91,
      reviewsCount: 264,
      location: 'Jubilee Hills, Hyderabad',
      fullAddress: 'Rd Number 36, Jubilee Hills, Hyderabad, 500033',
      heroImage: 'https://images.unsplash.com/photo-1512290900672-1f02e6a0d4c8?auto=format&fit=crop&w=900&q=80',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
      specialistName: 'Dr. Vivek Reddy, Clinical Dermatologist',
      experienceYears: 12,
      startingPrice: 4299,
      treatmentsCount: 15,
      nextAvailableSlot: 'Today, 2:00 PM',
      specialties: ['Acne Clear Genesis', 'Tri-Wave LED', 'Carbon Laser Peel', 'Hydrafacials'],
      bio: 'A state-of-the-art medi-aesthetic facility dedicated to clarifying congested skin, hyperpigmentation erasure, and personalized clinical maintenance.',
      clinicPhotos: [
        'https://images.unsplash.com/photo-1512290900672-1f02e6a0d4c8?auto=format&fit=crop&w=800&q=80'
      ],
      availableSlotsToday: ['02:00 PM', '04:00 PM', '06:00 PM'],
      availableSlotsTomorrow: ['10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM'],
      tierRate: 1.00
    },
    {
      id: 'prov-solaris-wellness-clinic',
      name: 'Solaris Skin & Wellness Clinic',
      providerType: 'Wellness Clinics',
      verified: true,
      rating: 4.95,
      reviewsCount: 388,
      location: 'T Nagar, Chennai',
      fullAddress: 'GN Chetty Road, T Nagar, Chennai, 600017',
      heroImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80',
      avatar: 'https://images.unsplash.com/photo-1594824813627-844a49c336b4?auto=format&fit=crop&w=400&q=80',
      specialistName: 'Dr. Priyamvada Raman',
      experienceYears: 16,
      startingPrice: 4999,
      treatmentsCount: 18,
      nextAvailableSlot: 'Tomorrow, 11:15 AM',
      specialties: ['Exosome Needling', 'BioRePeel', 'Back Body Peels', 'Microdermabrasion'],
      bio: 'Solaris pairs advanced non-invasive cellular restoration with serene spa-grade hospitality, helping clients achieve long-term radiant dermal equilibrium.',
      clinicPhotos: [
        'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80'
      ],
      availableSlotsToday: ['03:00 PM'],
      availableSlotsTomorrow: ['11:15 AM', '01:45 PM', '03:30 PM', '05:15 PM'],
      tierRate: 1.05
    }
  ];

  function getAllProviders() {
    return PROVIDERS_DATA;
  }

  function getProviderById(id) {
    return PROVIDERS_DATA.find(p => p.id === id) || PROVIDERS_DATA[0];
  }

  function filterProviders(query = '', type = '', location = '', sort = 'recommended') {
    let list = [...PROVIDERS_DATA];

    if (query) {
      const q = query.toLowerCase().trim();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.specialties.some(s => s.toLowerCase().includes(q)) ||
        p.specialistName.toLowerCase().includes(q)
      );
    }

    if (type && type !== 'All' && type !== 'All Provider Types') {
      list = list.filter(p => p.providerType.toLowerCase() === type.toLowerCase());
    }

    if (location && location !== 'All Locations') {
      list = list.filter(p => p.location.toLowerCase().includes(location.toLowerCase()));
    }

    if (sort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'reviews') {
      list.sort((a, b) => b.reviewsCount - a.reviewsCount);
    } else if (sort === 'price-low') {
      list.sort((a, b) => a.startingPrice - b.startingPrice);
    } else if (sort === 'price-high') {
      list.sort((a, b) => b.startingPrice - a.startingPrice);
    }

    return list;
  }

  window.LumeaProviders = {
    getAll: getAllProviders,
    getById: getProviderById,
    filter: filterProviders,
    data: PROVIDERS_DATA
  };
})();

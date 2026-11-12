const destinations = [
  {
    id: "bali",
    name: "Bali",
    country: "Indonesia",
    category: "beach",
    tag: "Beach escape",
    image: "Assets/bali.webp",
    gradient: "linear-gradient(135deg, #1b6b5a, #8ed9b6)",
    price: 180,
    rating: 4.9,
    stays: 42,
    blurb: "Rice terraces, temple mornings and sunsets that refuse to be photographed properly."
  },
  {
    id: "santorini",
    name: "Santorini",
    country: "Greece",
    category: "island",
    tag: "Island life",
    image: "Assets/santorini.webp",
    gradient: "linear-gradient(135deg, #1d5f8a, #b9e5f5)",
    price: 460,
    rating: 4.9,
    stays: 36,
    blurb: "Whitewashed cliffs, cobalt domes and long dinners above a very blue sea."
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    category: "city",
    tag: "City break",
    image: "Assets/tokyo.webp",
    gradient: "linear-gradient(135deg, #3a2455, #ff8a7a)",
    price: 210,
    rating: 4.8,
    stays: 58,
    blurb: "Neon alleys, quiet shrines and the best late-night noodles of your life."
  },
  {
    id: "paris",
    name: "Paris",
    country: "France",
    category: "culture",
    tag: "Culture",
    image: "Assets/paris.webp",
    gradient: "linear-gradient(135deg, #5b4a63, #e9c9b8)",
    price: 380,
    rating: 4.8,
    stays: 49,
    blurb: "Boulangerie mornings, museum afternoons and golden-hour walks by the Seine."
  },
  {
    id: "dubai",
    name: "Dubai",
    country: "United Arab Emirates",
    category: "desert",
    tag: "Desert luxury",
    image: "Assets/dubai.webp",
    gradient: "linear-gradient(135deg, #7a4a1f, #f3c27b)",
    price: 450,
    rating: 4.9,
    stays: 33,
    blurb: "Skyline pools, spice-scented souks and dunes that glow at golden hour."
  },
  {
    id: "maldives",
    name: "Maldives",
    country: "Maldives",
    category: "island",
    tag: "Overwater",
    image: "Assets/maldives.webp",
    gradient: "linear-gradient(135deg, #0c6d7a, #9ff0e0)",
    price: 680,
    rating: 5.0,
    stays: 24,
    blurb: "Glass-clear lagoons, overwater villas and absolutely nowhere to be."
  },
  {
    id: "switzerland",
    name: "Zermatt",
    country: "Switzerland",
    category: "mountain",
    tag: "Mountain air",
    image: "Assets/zermatt.webp",
    gradient: "linear-gradient(135deg, #31565e, #d6e7e4)",
    price: 310,
    rating: 4.8,
    stays: 29,
    blurb: "Snow-dusted peaks, alpine trains and fondue with a side of silence."
  },
  {
    id: "newyork",
    name: "New York",
    country: "United States",
    category: "city",
    tag: "City break",
    image: "Assets/new-york.webp",
    gradient: "linear-gradient(135deg, #25303f, #f0b45b)",
    price: 340,
    rating: 4.7,
    stays: 61,
    blurb: "Rooftop views, tiny jazz bars and a city that never asks you to slow down."
  }
];

const hotels = [
  {
    id: "mango-grove",
    name: "The Mango Grove",
    location: "Ubud, Bali",
    destination: "Bali",
    destinationId: "bali",
    image: "Assets/mango-grove.webp",
    gradient: "linear-gradient(135deg, #1f6b57, #9ad9b8)",
    rating: 4.9,
    reviews: 1284,
    price: 240,
    tag: "Guest favourite",
    amenities: ["Pool", "Spa", "Breakfast"]
  },
  {
    id: "cliffside-azure",
    name: "Cliffside Azure",
    location: "Uluwatu, Bali",
    destination: "Bali",
    destinationId: "bali",
    image: "Assets/cliffside-azure.webp",
    gradient: "linear-gradient(135deg, #165b6e, #a9e4ee)",
    rating: 4.8,
    reviews: 862,
    price: 410,
    tag: "Infinity pool",
    amenities: ["Sea view", "Pool", "Bar"]
  },
  {
    id: "aegean-pearl",
    name: "Aegean Pearl Suites",
    location: "Oia, Santorini",
    destination: "Santorini",
    destinationId: "santorini",
    image: "Assets/aegean-pearl.webp",
    gradient: "linear-gradient(135deg, #235a86, #c3e8f6)",
    rating: 4.9,
    reviews: 1032,
    price: 520,
    tag: "Sea view",
    amenities: ["Sea view", "Breakfast", "Spa"]
  },
  {
    id: "sakura-house",
    name: "Sakura House",
    location: "Shibuya, Tokyo",
    destination: "Tokyo",
    destinationId: "tokyo",
    image: "Assets/sakura-house.webp",
    gradient: "linear-gradient(135deg, #3d2a5c, #f4a7b9)",
    rating: 4.7,
    reviews: 2140,
    price: 295,
    tag: "City view",
    amenities: ["City view", "Wi-Fi", "Bar"]
  },
  {
    id: "maison-lumiere",
    name: "Maison Lumière",
    location: "Le Marais, Paris",
    destination: "Paris",
    destinationId: "paris",
    image: "Assets/maison-lumiere.webp",
    gradient: "linear-gradient(135deg, #564355, #e6c9b7)",
    rating: 4.8,
    reviews: 1540,
    price: 380,
    tag: "Boutique",
    amenities: ["Breakfast", "Wi-Fi", "Concierge"]
  },
  {
    id: "palm-mirage",
    name: "Palm Mirage Resort",
    location: "Palm Jumeirah, Dubai",
    destination: "Dubai",
    destinationId: "dubai",
    image: "Assets/palm-mirage.webp",
    gradient: "linear-gradient(135deg, #7c4b21, #f4c987)",
    rating: 4.9,
    reviews: 1910,
    price: 450,
    tag: "Beachfront",
    amenities: ["Beach", "Pool", "Spa"]
  },
  {
    id: "coral-lagoon",
    name: "Coral Lagoon Villas",
    location: "Baa Atoll, Maldives",
    destination: "Maldives",
    destinationId: "maldives",
    image: "Assets/coral-lagoon.webp",
    gradient: "linear-gradient(135deg, #0c6b78, #a6efe2)",
    rating: 5.0,
    reviews: 640,
    price: 680,
    tag: "Overwater villa",
    amenities: ["Overwater", "Snorkel", "Spa"]
  },
  {
    id: "alpine-loft",
    name: "The Alpine Loft",
    location: "Zermatt, Switzerland",
    destination: "Zermatt",
    destinationId: "switzerland",
    image: "Assets/alpine-loft.webp",
    gradient: "linear-gradient(135deg, #31565e, #d7e8e4)",
    rating: 4.8,
    reviews: 980,
    price: 310,
    tag: "Mountain view",
    amenities: ["Mountain view", "Fireplace", "Sauna"]
  },
  {
    id: "skyline-loft",
    name: "Skyline Loft",
    location: "Manhattan, New York",
    destination: "New York",
    destinationId: "newyork",
    image: "Assets/skyline-loft.webp",
    gradient: "linear-gradient(135deg, #26313f, #efb45e)",
    rating: 4.6,
    reviews: 3200,
    price: 340,
    tag: "Rooftop bar",
    amenities: ["City view", "Rooftop", "Gym"]
  },
  {
    id: "ubud-rice-retreat",
    name: "Ubud Rice Retreat",
    location: "Tegallalang, Bali",
    destination: "Bali",
    destinationId: "bali",
    image: "Assets/ubud-rice-retreat.webp",
    gradient: "linear-gradient(135deg, #2b6b3f, #c9e6a8)",
    rating: 4.6,
    reviews: 720,
    price: 180,
    tag: "Nature escape",
    amenities: ["Garden", "Yoga", "Breakfast"]
  },
  {
    id: "cyclades-breeze",
    name: "Cyclades Breeze",
    location: "Imerovigli, Santorini",
    destination: "Santorini",
    destinationId: "santorini",
    image: "Assets/cyclades-breeze.webp",
    gradient: "linear-gradient(135deg, #1f5a82, #b8e2f4)",
    rating: 4.7,
    reviews: 540,
    price: 460,
    tag: "Adults only",
    amenities: ["Sea view", "Pool", "Adults only"]
  },
  {
    id: "neon-nest",
    name: "Neon Nest Hotel",
    location: "Shinjuku, Tokyo",
    destination: "Tokyo",
    destinationId: "tokyo",
    image: "Assets/neon-nest.webp",
    gradient: "linear-gradient(135deg, #33234f, #ff8d7a)",
    rating: 4.5,
    reviews: 1670,
    price: 210,
    tag: "Great value",
    amenities: ["Wi-Fi", "Bar", "Laundry"]
  }
];

const offers = [
  {
    id: "sunset-escape",
    title: "Sunset escape",
    description: "Save on cliffside stays across the Greek islands — sunsets included, no extra charge.",
    discount: "20%",
    code: "SUNSET20",
    expiry: "31 Aug 2026",
    tag: "Limited time",
    image: "Assets/santorini.webp"
  },
  {
    id: "stay-three",
    title: "Stay 3, pay 2",
    description: "Three nights, two on the bill. Perfect for long weekends that accidentally get longer.",
    discount: "33%",
    code: "STAY3",
    expiry: "15 Sep 2026",
    tag: "Most popular",
    image: "Assets/paris.webp"
  },
  {
    id: "island-state",
    title: "Island state of mind",
    description: "Overwater villas and lagoon breakfasts at a very agreeable price. Shoes optional.",
    discount: "25%",
    code: "ISLAND25",
    expiry: "30 Sep 2026",
    tag: "Island exclusive",
    image: "Assets/maldives.webp"
  },
  {
    id: "city-lights",
    title: "City lights deal",
    description: "Rooftop views in New York and Paris, with a little left over for the good coffee.",
    discount: "15%",
    code: "CITY15",
    expiry: "31 Oct 2026",
    tag: "City break",
    image: "Assets/new-york.webp"
  }
];

const coupons = {
  SUNSET20: { rate: 0.2, label: "Sunset escape" },
  STAY3: { rate: 0.33, label: "Stay 3, pay 2" },
  ISLAND25: { rate: 0.25, label: "Island state of mind" },
  CITY15: { rate: 0.15, label: "City lights deal" }
};

const testimonials = [
  {
    name: "Amelia Laurent",
    role: "Designer · London",
    location: "Santorini, Greece",
    avatar: "Assets/avatar-amelia-laurent.webp",
    rating: 5,
    quote: "Stackly found us a cave suite we'd never have discovered on our own. The little notes about where to watch the sunset were better than any guidebook."
  },
  {
    name: "Marcus Kim",
    role: "Photographer · Seoul",
    location: "Tokyo, Japan",
    avatar: "Assets/avatar-marcus-kim.webp",
    rating: 5,
    quote: "Booked a last-minute trip in about four minutes. The hotel was exactly as photographed — rare — and the price beat everywhere else I looked."
  },
  {
    name: "Sofia Alvarez",
    role: "Chef · Barcelona",
    location: "Bali, Indonesia",
    avatar: "Assets/avatar-sofia-alvarez.webp",
    rating: 5,
    quote: "The wishlist feature is dangerously good. I had six stays saved before I'd finished my coffee, and we ended up booking two of them."
  },
  {
    name: "Noah Bennett",
    role: "Writer · Melbourne",
    location: "Maldives",
    avatar: "Assets/avatar-noah-bennett.webp",
    rating: 5,
    quote: "Our flight was delayed and the Stackly team rearranged the transfer before we'd even landed. That's the kind of thing you remember."
  },
  {
    name: "Priya Nair",
    role: "Product lead · Bengaluru",
    location: "Paris, France",
    avatar: "Assets/avatar-priya-nair.webp",
    rating: 5,
    quote: "A boutique hotel with actual character, not just another beige room. The coupon code saved us enough for a very good dinner by the river."
  },
  {
    name: "Daniel Okafor",
    role: "Architect · Lagos",
    location: "Zermatt, Switzerland",
    avatar: "Assets/avatar-daniel-okafor.webp",
    rating: 5,
    quote: "I'm fussy about design and Stackly's edit is genuinely good. Every place on my shortlist looked like somewhere I'd actually want to wake up."
  }
];

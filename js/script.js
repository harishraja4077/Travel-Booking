"use strict";

const WISHLIST_KEY = "stackly_wishlist";
const RECENT_KEY = "stackly_recent_searches";
const NEWSLETTER_KEY = "stackly_newsletter";
const BOOKINGS_KEY = "stackly_bookings";

const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const AOS_AVAILABLE = typeof window.AOS !== "undefined" && !prefersReducedMotion;

const header = $("#siteHeader");
const navToggle = $("#navToggle");
const navClose = $("#navClose");
const primaryNav = $("#primaryNav");
const navOverlay = $("#navOverlay");
const scrollProgress = $("#scrollProgress");
const backToTop = $("#backToTop");

const heroSearch = $("#heroSearch");
const heroDestination = $("#heroDestination");
const heroCheckin = $("#heroCheckin");
const heroCheckout = $("#heroCheckout");
const heroNights = $("#heroNights");
const destinationSuggestions = $("#destinationSuggestions");
const travellerTrigger = $("#travellerTrigger");
const travellerPopover = $("#travellerPopover");
const travellerLabel = $("#travellerLabel");
const adultCount = $("#adultCount");
const childrenCount = $("#childrenCount");
const roomCount = $("#roomCount");
const recentSearchWrap = $("#recentSearchWrap");
const recentSearches = $("#recentSearches");

const destinationFilters = $("#destinationFilters");
const destinationGrid = $("#destinationGrid");
const destinationEmpty = $("#destinationEmpty");
const resetDestinationSearch = $("#resetDestinationSearch");
const tickerTrack = $("#tickerTrack");

const hotelSearch = $("#hotelSearch");
const priceRange = $("#priceRange");
const priceValue = $("#priceValue");
const ratingPills = $("#ratingPills");
const hotelSort = $("#hotelSort");
const clearFilters = $("#clearFilters");
const hotelResults = $("#hotelResults");
const activeFilters = $("#activeFilters");
const hotelGrid = $("#hotelGrid");
const hotelEmpty = $("#hotelEmpty");
const resetHotelFilters = $("#resetHotelFilters");

const offersGrid = $("#offersGrid");
const testimonialShell = $("#testimonialShell");
const testimonialTrack = $("#testimonialTrack");
const testimonialDots = $("#testimonialDots");
const testimonialPrev = $("#testimonialPrev");
const testimonialNext = $("#testimonialNext");

const newsletterForm = $("#newsletterForm");
const newsletterEmail = $("#newsletterEmail");
const newsletterMessage = $("#newsletterMessage");

const wishlistBtn = $("#wishlistBtn");
const wishlistCount = $("#wishlistCount");
const wishlistDrawer = $("#wishlistDrawer");
const wishlistItems = $("#wishlistItems");
const wishlistDrawerCount = $("#wishlistDrawerCount");
const wishlistClose = $("#wishlistClose");
const drawerOverlay = $("#drawerOverlay");
const wishlistBrowse = $("#wishlistBrowse");

const bookingModal = $("#bookingModal");
const bookingImage = $("#bookingImage");
const bookingTag = $("#bookingTag");
const bookingTitle = $("#bookingTitle");
const bookingLocation = $("#bookingLocation");
const bookingRating = $("#bookingRating");
const bookingForm = $("#bookingForm");
const bookingCheckin = $("#bookingCheckin");
const bookingCheckout = $("#bookingCheckout");
const bookingGuests = $("#bookingGuests");
const bookingRooms = $("#bookingRooms");
const bookingCoupon = $("#bookingCoupon");
const applyCoupon = $("#applyCoupon");
const couponMessage = $("#couponMessage");
const summaryRate = $("#summaryRate");
const summaryNights = $("#summaryNights");
const summaryRooms = $("#summaryRooms");
const summarySubtotal = $("#summarySubtotal");
const summaryService = $("#summaryService");
const summaryTaxes = $("#summaryTaxes");
const discountRow = $("#discountRow");
const summaryDiscount = $("#summaryDiscount");
const summaryTotal = $("#summaryTotal");
const confirmBooking = $("#confirmBooking");

const toastContainer = $("#toastContainer");

const state = {
  destinationFilter: "all",
  destinationQuery: "",
  hotelQuery: "",
  maxPrice: 800,
  minRating: 0,
  sort: "recommended",
  destinationLocation: null,
  wishlist: [],
  travellers: { adults: 2, children: 0, rooms: 1 },
  currentHotel: null,
  coupon: null,
  testimonialIndex: 0,
  lastFocused: null
};

let aosReady = false;
let testimonialTimer = null;

const money = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const escapeHTML = (value) =>
  String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    return entities[character];
  });

const debounce = (callback, wait = 200) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), wait);
  };
};

const readStorage = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed = JSON.parse(raw);
    return parsed === null || parsed === undefined ? fallback : parsed;
  } catch (error) {
    return fallback;
  }
};

const writeStorage = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    return false;
  }
};

const pad = (value) => String(value).padStart(2, "0");

const toDateValue = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const parseDateValue = (value) => {
  if (!value) return null;
  const parts = value.split("-").map(Number);
  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) return null;
  return new Date(parts[0], parts[1] - 1, parts[2]);
};

const addDays = (date, days) => {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  next.setDate(next.getDate() + days);
  return next;
};

const nightsBetween = (start, end) =>
  Math.round((end.getTime() - start.getTime()) / 86400000);

const formatNights = (nights) => `${nights} night${nights === 1 ? "" : "s"}`;
const formatRooms = (rooms) => `${rooms} room${rooms === 1 ? "" : "s"}`;
const formatGuests = (guests) => `${guests} guest${guests === 1 ? "" : "s"}`;

const showToast = (message, type = "success") => {
  if (!toastContainer) return;
  const toast = document.createElement("div");
  toast.className = `toast${type === "error" ? " error" : ""}`;
  toast.setAttribute("role", "status");
  const icon = type === "error" ? "icon-info" : "icon-check";
  toast.innerHTML = `<span class="toast-icon"><svg class="icon"><use href="#${icon}"></use></svg></span><span>${escapeHTML(message)}</span>`;
  toastContainer.appendChild(toast);
  window.requestAnimationFrame(() => toast.classList.add("show"));
  window.setTimeout(() => {
    toast.classList.remove("show");
    window.setTimeout(() => toast.remove(), 420);
  }, 3200);
};

const refreshAOS = debounce(() => {
  if (AOS_AVAILABLE && aosReady) window.AOS.refreshHard();
}, 180);

const aosAttrs = (delay = 0) =>
  AOS_AVAILABLE ? ` data-aos="fade-up" data-aos-delay="${delay}"` : "";

const scrollToSection = (selector) => {
  const target = $(selector);
  if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
};

const copyText = (text) => {
  const fallbackCopy = () =>
    new Promise((resolve, reject) => {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.top = "-1000px";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.focus();
      area.select();
      area.setSelectionRange(0, text.length);
      try {
        const copied = document.execCommand("copy");
        if (copied) resolve();
        else reject(new Error("Copy command was rejected"));
      } catch (error) {
        reject(error);
      } finally {
        area.remove();
      }
    });

  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text).catch(fallbackCopy);
  }
  return fallbackCopy();
};

const renderTicker = () => {
  if (!tickerTrack) return;
  const items = destinations
    .map(
      (destination) =>
        `<span class="ticker-item"><svg class="icon"><use href="#icon-star"></use></svg>${escapeHTML(destination.name)}, ${escapeHTML(destination.country)}</span>`
    )
    .join("");
  tickerTrack.innerHTML = `<div class="ticker-group">${items}</div><div class="ticker-group" aria-hidden="true">${items}</div>`;
};

const renderDestinations = () => {
  if (!destinationGrid) return;
  const query = state.destinationQuery.trim().toLowerCase();
  const filter = state.destinationFilter;

  const list = destinations.filter((destination) => {
    const matchesCategory = filter === "all" || destination.category === filter;
    const matchesQuery =
      !query ||
      destination.name.toLowerCase().includes(query) ||
      destination.country.toLowerCase().includes(query) ||
      destination.category.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  destinationGrid.innerHTML = list
    .map(
      (destination, index) => `
      <article class="destination-card"${aosAttrs((index % 4) * 60)}>
        <div class="destination-media" style="--gradient:${destination.gradient}">
          <img src="${destination.image}" alt="${escapeHTML(destination.name)}, ${escapeHTML(destination.country)}" loading="lazy" onerror="this.remove()">
          <span class="destination-tag">${escapeHTML(destination.tag)}</span>
          <span class="destination-rating"><svg class="icon"><use href="#icon-star"></use></svg>${destination.rating.toFixed(1)}</span>
        </div>
        <div class="destination-body">
          <div class="destination-title-row">
            <div>
              <h3>${escapeHTML(destination.name)}</h3>
              <p class="destination-country">${escapeHTML(destination.country)}</p>
            </div>
            <span class="destination-stays">${destination.stays} stays</span>
          </div>
          <p class="destination-blurb">${escapeHTML(destination.blurb)}</p>
          <div class="destination-foot">
            <div class="destination-price"><span>from</span><strong>${money(destination.price)}</strong> <em>/ night</em></div>
            <button class="explore-btn" type="button" data-explore="${destination.id}" aria-label="Explore stays in ${escapeHTML(destination.name)}">
              <svg class="icon"><use href="#icon-arrow-right"></use></svg>
            </button>
          </div>
        </div>
      </article>`
    )
    .join("");

  if (destinationEmpty) destinationEmpty.hidden = list.length !== 0;
  refreshAOS();
};

const setDestinationFilter = (filter, clearQuery = false) => {
  state.destinationFilter = filter;
  if (clearQuery) {
    state.destinationQuery = "";
    if (heroDestination) heroDestination.value = "";
  }
  $$(".chip", destinationFilters).forEach((chip) => {
    chip.classList.toggle("is-active", chip.dataset.filter === filter);
  });
  renderDestinations();
};

const saveRecentSearch = (query) => {
  const clean = query.trim();
  if (!clean) return;
  const stored = readStorage(RECENT_KEY, []);
  const list = Array.isArray(stored) ? stored.filter((item) => typeof item === "string") : [];
  const next = [clean, ...list.filter((item) => item.toLowerCase() !== clean.toLowerCase())].slice(0, 4);
  writeStorage(RECENT_KEY, next);
  renderRecentSearches();
};

const renderRecentSearches = () => {
  if (!recentSearchWrap || !recentSearches) return;
  const stored = readStorage(RECENT_KEY, []);
  const list = Array.isArray(stored) ? stored.filter((item) => typeof item === "string") : [];
  if (!list.length) {
    recentSearchWrap.hidden = true;
    recentSearches.innerHTML = "";
    return;
  }
  recentSearchWrap.hidden = false;
  recentSearches.innerHTML = list
    .map(
      (item) =>
        `<button class="trend-chip" type="button" data-recent="${escapeHTML(item)}">${escapeHTML(item)}</button>`
    )
    .join("");
};

const performDestinationSearch = (query) => {
  const clean = query.trim();
  if (!clean) {
    showToast("Where would you like to go?", "error");
    if (heroDestination) heroDestination.focus();
    return;
  }

  const lower = clean.toLowerCase();
  const matches = destinations.filter(
    (destination) =>
      destination.name.toLowerCase().includes(lower) ||
      destination.country.toLowerCase().includes(lower) ||
      destination.category.toLowerCase().includes(lower)
  );

  if (!matches.length) {
    state.destinationQuery = "";
    setDestinationFilter("all");
    hideSuggestions();
    scrollToSection("#destinations");
    showToast(`No stays for "${clean}" yet — showing everywhere instead.`, "error");
    return;
  }

  state.destinationQuery = clean;
  state.destinationFilter = "all";
  $$(".chip", destinationFilters).forEach((chip) => {
    chip.classList.toggle("is-active", chip.dataset.filter === "all");
  });
  renderDestinations();
  saveRecentSearch(matches[0].name);
  hideSuggestions();
  scrollToSection("#destinations");
  showToast(`Showing ${matches.length} destination${matches.length === 1 ? "" : "s"} for "${clean}"`);
};

const updateRangeFill = () => {
  if (!priceRange) return;
  const min = Number(priceRange.min) || 0;
  const max = Number(priceRange.max) || 100;
  const value = Number(priceRange.value);
  const percentage = ((value - min) / (max - min)) * 100;
  priceRange.style.background = `linear-gradient(to right, var(--coral) ${percentage}%, #e7dfd1 ${percentage}%)`;
};

const getFilteredHotels = () => {
  const query = state.hotelQuery.trim().toLowerCase();
  const location = state.destinationLocation;

  const filtered = hotels.filter((hotel) => {
    const matchesQuery =
      !query ||
      hotel.name.toLowerCase().includes(query) ||
      hotel.location.toLowerCase().includes(query) ||
      hotel.destination.toLowerCase().includes(query);
    const matchesPrice = hotel.price <= state.maxPrice;
    const matchesRating = hotel.rating >= state.minRating;
    const matchesLocation = !location || hotel.destinationId === location.id;
    return matchesQuery && matchesPrice && matchesRating && matchesLocation;
  });

  return filtered.sort((a, b) => {
    switch (state.sort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating-desc":
        return b.rating - a.rating || b.reviews - a.reviews;
      default: {
        const scoreA = a.rating * 1000 + Math.min(a.reviews, 3000) / 100;
        const scoreB = b.rating * 1000 + Math.min(b.reviews, 3000) / 100;
        return scoreB - scoreA;
      }
    }
  });
};

const renderHotels = () => {
  if (!hotelGrid) return;
  const list = getFilteredHotels();

  if (hotelResults) {
    hotelResults.textContent = `${list.length} stay${list.length === 1 ? "" : "s"} found`;
  }

  hotelGrid.innerHTML = list
    .map((hotel, index) => {
      const saved = state.wishlist.includes(hotel.id);
      return `
      <article class="hotel-card"${aosAttrs((index % 3) * 70)}>
        <div class="hotel-media" style="--gradient:${hotel.gradient}">
          <img src="${hotel.image}" alt="${escapeHTML(hotel.name)} in ${escapeHTML(hotel.location)}" loading="lazy" onerror="this.remove()">
          <span class="hotel-tag">${escapeHTML(hotel.tag)}</span>
          <button class="icon-btn wishlist-toggle${saved ? " is-active" : ""}" type="button" data-wishlist="${hotel.id}" aria-pressed="${saved}" aria-label="${saved ? "Remove" : "Save"} ${escapeHTML(hotel.name)} ${saved ? "from" : "to"} wishlist">
            <svg class="icon"><use href="#icon-heart"></use></svg>
          </button>
        </div>
        <div class="hotel-body">
          <p class="hotel-location"><svg class="icon"><use href="#icon-pin"></use></svg>${escapeHTML(hotel.location)}</p>
          <h3>${escapeHTML(hotel.name)}</h3>
          <div class="hotel-amenities">
            ${hotel.amenities.map((amenity) => `<span>${escapeHTML(amenity)}</span>`).join("")}
          </div>
          <div class="hotel-meta">
            <span class="rating-score"><svg class="icon"><use href="#icon-star"></use></svg>${hotel.rating.toFixed(1)}</span>
            <span class="hotel-reviews">${hotel.reviews.toLocaleString("en-US")} reviews</span>
            <span class="hotel-excellent">Excellent</span>
          </div>
          <div class="hotel-footer">
            <div class="hotel-price"><span>from</span><strong>${money(hotel.price)}</strong> <em>/ night</em></div>
            <button class="btn btn-dark btn-sm" type="button" data-book="${hotel.id}">Book now</button>
          </div>
        </div>
      </article>`;
    })
    .join("");

  if (hotelEmpty) hotelEmpty.hidden = list.length !== 0;
  renderActiveFilters();
  refreshAOS();
};

const renderActiveFilters = () => {
  if (!activeFilters) return;
  const tags = [];

  if (state.destinationLocation) {
    tags.push(
      `<button class="filter-tag" type="button" data-clear-filter="location">${escapeHTML(state.destinationLocation.name)} <svg class="icon"><use href="#icon-close"></use></svg></button>`
    );
  }
  if (state.hotelQuery.trim()) {
    tags.push(
      `<button class="filter-tag" type="button" data-clear-filter="query">"${escapeHTML(state.hotelQuery.trim())}" <svg class="icon"><use href="#icon-close"></use></svg></button>`
    );
  }
  if (state.maxPrice < Number(priceRange.max)) {
    tags.push(
      `<button class="filter-tag" type="button" data-clear-filter="price">Under ${money(state.maxPrice)} <svg class="icon"><use href="#icon-close"></use></svg></button>`
    );
  }
  if (state.minRating > 0) {
    tags.push(
      `<button class="filter-tag" type="button" data-clear-filter="rating">${state.minRating.toFixed(1)}+ rating <svg class="icon"><use href="#icon-close"></use></svg></button>`
    );
  }

  activeFilters.innerHTML = tags.join("");
};

const clearAllHotelFilters = (notify = true) => {
  state.hotelQuery = "";
  state.maxPrice = Number(priceRange.max);
  state.minRating = 0;
  state.sort = "recommended";
  state.destinationLocation = null;

  hotelSearch.value = "";
  priceRange.value = priceRange.max;
  priceValue.textContent = money(Number(priceRange.max));
  hotelSort.value = "recommended";
  $$(".rating-pill", ratingPills).forEach((pill) => {
    pill.classList.toggle("is-active", Number(pill.dataset.rating) === 0);
  });
  updateRangeFill();
  renderHotels();
  if (notify) showToast("Hotel filters reset");
};

const exploreDestination = (id) => {
  const destination = destinations.find((item) => item.id === id);
  if (!destination) return;

  state.destinationLocation = { id: destination.id, name: destination.name };
  state.hotelQuery = "";
  state.minRating = 0;
  hotelSearch.value = "";
  $$(".rating-pill", ratingPills).forEach((pill) => {
    pill.classList.toggle("is-active", Number(pill.dataset.rating) === 0);
  });

  renderHotels();
  scrollToSection("#hotels");
  showToast(`Showing stays in ${destination.name}`);
};

const loadWishlist = () => {
  const stored = readStorage(WISHLIST_KEY, []);
  const valid = Array.isArray(stored)
    ? stored.filter((id) => hotels.some((hotel) => hotel.id === id))
    : [];
  state.wishlist = Array.from(new Set(valid));
};

const persistWishlist = () => {
  const saved = writeStorage(WISHLIST_KEY, state.wishlist);
  if (!saved) showToast("Local storage is blocked — saved for this visit only.", "error");
};

const updateWishlistUI = () => {
  if (wishlistCount) wishlistCount.textContent = String(state.wishlist.length);
  if (wishlistDrawerCount) wishlistDrawerCount.textContent = `(${state.wishlist.length})`;

  $$("[data-wishlist]").forEach((button) => {
    const id = button.dataset.wishlist;
    const active = state.wishlist.includes(id);
    const hotel = hotels.find((item) => item.id === id);
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
    if (hotel) {
      button.setAttribute(
        "aria-label",
        `${active ? "Remove" : "Save"} ${hotel.name} ${active ? "from" : "to"} wishlist`
      );
    }
  });
};

const renderWishlistDrawer = () => {
  if (!wishlistItems) return;
  const saved = state.wishlist
    .map((id) => hotels.find((hotel) => hotel.id === id))
    .filter(Boolean);

  if (!saved.length) {
    wishlistItems.innerHTML = `
      <div class="wishlist-empty">
        <span class="empty-icon"><svg class="icon"><use href="#icon-heart"></use></svg></span>
        <h4>Nothing saved yet</h4>
        <p>Tap the heart on any stay and it'll wait for you right here.</p>
      </div>`;
    return;
  }

  wishlistItems.innerHTML = saved
    .map(
      (hotel) => `
      <div class="wishlist-item">
        <div class="wishlist-thumb">
          <img src="${hotel.image}" alt="${escapeHTML(hotel.name)}" loading="lazy" onerror="this.remove()">
        </div>
        <div class="wishlist-info">
          <h4>${escapeHTML(hotel.name)}</h4>
          <p>${escapeHTML(hotel.location)}</p>
          <strong>${money(hotel.price)} <em>/ night</em></strong>
        </div>
        <div class="wishlist-actions">
          <button class="wishlist-remove" type="button" data-remove-wishlist="${hotel.id}" aria-label="Remove ${escapeHTML(hotel.name)} from wishlist">
            <svg class="icon"><use href="#icon-close"></use></svg>
          </button>
          <button class="wishlist-book" type="button" data-book="${hotel.id}">Book</button>
        </div>
      </div>`
    )
    .join("");
};

const toggleWishlist = (id) => {
  const hotel = hotels.find((item) => item.id === id);
  if (!hotel) return;
  const index = state.wishlist.indexOf(id);
  const button = $(`[data-wishlist="${id}"]`);

  if (index > -1) {
    state.wishlist.splice(index, 1);
    showToast(`${hotel.name} removed from saved stays`);
  } else {
    state.wishlist.push(id);
    showToast(`${hotel.name} saved to your wishlist`);
    if (button) {
      button.classList.add("popping");
      window.setTimeout(() => button.classList.remove("popping"), 500);
    }
  }

  persistWishlist();
  updateWishlistUI();
  renderWishlistDrawer();
};

const openWishlist = () => {
  if (!wishlistDrawer) return;
  state.wishlistTrigger = document.activeElement;
  wishlistDrawer.classList.add("open");
  drawerOverlay.classList.add("open");
  wishlistDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("drawer-open");
  window.setTimeout(() => {
    if (wishlistClose) wishlistClose.focus();
  }, 80);
};

const closeWishlist = (restoreFocus = true) => {
  if (!wishlistDrawer) return;
  wishlistDrawer.classList.remove("open");
  drawerOverlay.classList.remove("open");
  wishlistDrawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("drawer-open");
  if (restoreFocus && state.wishlistTrigger && document.contains(state.wishlistTrigger)) {
    state.wishlistTrigger.focus();
  }
};

const renderOffers = () => {
  if (!offersGrid) return;
  offersGrid.innerHTML = offers
    .map(
      (offer, index) => `
      <article class="offer-card" style="--offer-image:url('${offer.image}')"${aosAttrs(index * 80)}>
        <span class="offer-tag">${escapeHTML(offer.tag)}</span>
        <div>
          <div class="offer-discount"><strong>${escapeHTML(offer.discount)}</strong><span>off</span></div>
          <h3>${escapeHTML(offer.title)}</h3>
          <p>${escapeHTML(offer.description)}</p>
          <div class="offer-footer">
            <div class="coupon"><span>Promo code</span><strong>${escapeHTML(offer.code)}</strong></div>
            <button class="btn btn-light btn-sm copy-coupon" type="button" data-coupon="${offer.code}">
              <svg class="icon"><use href="#icon-copy"></use></svg><span>Copy code</span>
            </button>
          </div>
          <span class="offer-expiry">Valid until ${escapeHTML(offer.expiry)}</span>
        </div>
      </article>`
    )
    .join("");
};

const initialsOf = (name) =>
  name
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

const renderTestimonials = () => {
  if (!testimonialTrack) return;
  const star = '<svg class="icon"><use href="#icon-star"></use></svg>';

  testimonialTrack.innerHTML = testimonials
    .map(
      (testimonial, index) => `
      <div class="testimonial-slide" role="group" aria-roledescription="slide" aria-label="${index + 1} of ${testimonials.length}">
        <article class="testimonial-card">
          <div class="testimonial-stars">${star.repeat(5)}</div>
          <blockquote>“${escapeHTML(testimonial.quote)}”</blockquote>
          <div class="testimonial-foot">
            <div class="testimonial-person">
              <span class="avatar"><span>${initialsOf(testimonial.name)}</span><img src="${testimonial.avatar}" alt="${escapeHTML(testimonial.name)}" loading="lazy" onerror="this.remove()"></span>
              <div><strong>${escapeHTML(testimonial.name)}</strong><span>${escapeHTML(testimonial.role)}</span></div>
            </div>
            <span class="testimonial-place"><svg class="icon"><use href="#icon-pin"></use></svg>${escapeHTML(testimonial.location)}</span>
          </div>
        </article>
      </div>`
    )
    .join("");

  testimonialDots.innerHTML = testimonials
    .map(
      (_, index) =>
        `<button class="slider-dot" type="button" data-slide="${index}" aria-label="Show testimonial ${index + 1}"></button>`
    )
    .join("");

  updateTestimonial(0);
};

const updateTestimonial = (index) => {
  if (!testimonialTrack) return;
  const count = testimonials.length;
  state.testimonialIndex = ((index % count) + count) % count;
  testimonialTrack.style.transform = `translateX(-${state.testimonialIndex * 100}%)`;

  $$(".slider-dot", testimonialDots).forEach((dot, dotIndex) => {
    const active = dotIndex === state.testimonialIndex;
    dot.classList.toggle("is-active", active);
    dot.setAttribute("aria-current", active ? "true" : "false");
  });
};

const nextTestimonial = () => updateTestimonial(state.testimonialIndex + 1);
const prevTestimonial = () => updateTestimonial(state.testimonialIndex - 1);

const stopTestimonials = () => {
  if (testimonialTimer) {
    window.clearInterval(testimonialTimer);
    testimonialTimer = null;
  }
};

const startTestimonials = () => {
  stopTestimonials();
  if (prefersReducedMotion) return;
  testimonialTimer = window.setInterval(nextTestimonial, 6500);
};

function hideSuggestions() {
  if (!destinationSuggestions) return;
  destinationSuggestions.hidden = true;
  destinationSuggestions.innerHTML = "";
}

function renderSuggestions(query) {
  if (!destinationSuggestions) return;
  const clean = query.trim().toLowerCase();
  if (!clean) {
    hideSuggestions();
    return;
  }

  const matches = destinations
    .filter(
      (destination) =>
        destination.name.toLowerCase().includes(clean) ||
        destination.country.toLowerCase().includes(clean) ||
        destination.category.toLowerCase().includes(clean)
    )
    .slice(0, 5);

  if (!matches.length) {
    destinationSuggestions.innerHTML =
      '<li class="suggestion-empty">No matches — try Bali, Tokyo or Greece.</li>';
    destinationSuggestions.hidden = false;
    return;
  }

  destinationSuggestions.innerHTML = matches
    .map(
      (destination) => `
      <li>
        <button type="button" role="option" data-suggestion="${destination.id}">
          <span class="suggestion-thumb"><img src="${destination.image}" alt="" loading="lazy" onerror="this.remove()"></span>
          <span class="suggestion-text"><strong>${escapeHTML(destination.name)}</strong><span>${escapeHTML(destination.country)} · from ${money(destination.price)}</span></span>
        </button>
      </li>`
    )
    .join("");
  destinationSuggestions.hidden = false;
}

function initHeroSearch() {
  if (!heroSearch) return;

  heroDestination.addEventListener("input", () => renderSuggestions(heroDestination.value));
  heroDestination.addEventListener("focus", () => {
    if (heroDestination.value.trim()) renderSuggestions(heroDestination.value);
  });
  heroDestination.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      hideSuggestions();
      return;
    }
    if (event.key === "ArrowDown" && !destinationSuggestions.hidden) {
      const first = $("button", destinationSuggestions);
      if (first) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  heroSearch.addEventListener("submit", (event) => {
    event.preventDefault();
    window.location.href = "404.html";
  });

  destinationSuggestions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-suggestion]");
    if (!button) return;
    const destination = destinations.find((item) => item.id === button.dataset.suggestion);
    if (!destination) return;
    heroDestination.value = destination.name;
    hideSuggestions();
    heroSearch.requestSubmit();
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".search-destination")) hideSuggestions();
  });
}

function closeTravellerPopover() {
  if (!travellerPopover || !travellerTrigger) return;
  travellerPopover.hidden = true;
  travellerTrigger.setAttribute("aria-expanded", "false");
}

function updateTravellerUI() {
  if (!travellerPopover) return;
  const travellers = state.travellers;
  const totalGuests = travellers.adults + travellers.children;

  travellerLabel.textContent = `${formatGuests(totalGuests)} · ${formatRooms(travellers.rooms)}`;
  adultCount.textContent = String(travellers.adults);
  childrenCount.textContent = String(travellers.children);
  roomCount.textContent = String(travellers.rooms);

  const limits = {
    adults: { min: 1, max: 10 },
    children: { min: 0, max: 8 },
    rooms: { min: 1, max: 5 }
  };

  $$("[data-traveller]", travellerPopover).forEach((button) => {
    const field = button.dataset.traveller;
    const step = Number(button.dataset.step);
    const value = travellers[field];
    const limit = limits[field];
    button.disabled = step < 0 ? value <= limit.min : value >= limit.max;
  });
}

function initTravellers() {
  if (!travellerTrigger || !travellerPopover) return;

  travellerTrigger.addEventListener("click", () => {
    const isOpen = !travellerPopover.hidden;
    travellerPopover.hidden = isOpen;
    travellerTrigger.setAttribute("aria-expanded", String(!isOpen));
  });

  travellerPopover.addEventListener("click", (event) => {
    const button = event.target.closest("[data-traveller]");
    if (!button) return;
    const field = button.dataset.traveller;
    const step = Number(button.dataset.step);
    const limits = {
      adults: { min: 1, max: 10 },
      children: { min: 0, max: 8 },
      rooms: { min: 1, max: 5 }
    };
    state.travellers[field] = clamp(state.travellers[field] + step, limits[field].min, limits[field].max);
    updateTravellerUI();
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".search-travellers")) closeTravellerPopover();
  });

  travellerPopover.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeTravellerPopover();
      travellerTrigger.focus();
    }
  });

  updateTravellerUI();
}

function initHotelFilters() {
  hotelSearch.addEventListener(
    "input",
    debounce(() => {
      state.hotelQuery = hotelSearch.value;
      renderHotels();
    }, 160)
  );

  priceRange.addEventListener("input", () => {
    state.maxPrice = Number(priceRange.value);
    priceValue.textContent = money(state.maxPrice);
    updateRangeFill();
    renderHotels();
  });

  ratingPills.addEventListener("click", (event) => {
    const pill = event.target.closest("[data-rating]");
    if (!pill) return;
    state.minRating = Number(pill.dataset.rating);
    $$(".rating-pill", ratingPills).forEach((item) => {
      item.classList.toggle("is-active", item === pill);
    });
    renderHotels();
  });

  hotelSort.addEventListener("change", () => {
    state.sort = hotelSort.value;
    renderHotels();
  });

  clearFilters.addEventListener("click", () => clearAllHotelFilters());
  resetHotelFilters.addEventListener("click", () => clearAllHotelFilters());

  activeFilters.addEventListener("click", (event) => {
    const tag = event.target.closest("[data-clear-filter]");
    if (!tag) return;
    const filter = tag.dataset.clearFilter;

    if (filter === "location") state.destinationLocation = null;
    if (filter === "query") {
      state.hotelQuery = "";
      hotelSearch.value = "";
    }
    if (filter === "price") {
      state.maxPrice = Number(priceRange.max);
      priceRange.value = priceRange.max;
      priceValue.textContent = money(state.maxPrice);
      updateRangeFill();
    }
    if (filter === "rating") {
      state.minRating = 0;
      $$(".rating-pill", ratingPills).forEach((pill) => {
        pill.classList.toggle("is-active", Number(pill.dataset.rating) === 0);
      });
    }
    renderHotels();
  });

  destinationFilters.addEventListener("click", (event) => {
    const chip = event.target.closest("[data-filter]");
    if (!chip) return;
    setDestinationFilter(chip.dataset.filter, true);
  });

  resetDestinationSearch.addEventListener("click", () => {
    setDestinationFilter("all", true);
    showToast("Showing all destinations");
  });
}

function initWishlist() {
  wishlistBtn.addEventListener("click", () => {
    window.location.href = "404.html";
  });
  wishlistClose.addEventListener("click", () => closeWishlist());
  drawerOverlay.addEventListener("click", () => closeWishlist());
  wishlistBrowse.addEventListener("click", () => closeWishlist(false));
}

function handleCouponCopy(button) {
  const code = button.dataset.coupon;
  const label = $("span", button);

  copyText(code)
    .then(() => {
      showToast(`Code ${code} copied — see you at checkout.`);
      if (label) {
        const original = label.textContent;
        label.textContent = "Copied!";
        button.disabled = true;
        window.setTimeout(() => {
          label.textContent = original;
          button.disabled = false;
        }, 1800);
      }
    })
    .catch(() => showToast(`Couldn't copy — your code is ${code}`, "error"));
}

function initTestimonials() {
  testimonialPrev.addEventListener("click", () => {
    prevTestimonial();
    startTestimonials();
  });
  testimonialNext.addEventListener("click", () => {
    nextTestimonial();
    startTestimonials();
  });
  testimonialDots.addEventListener("click", (event) => {
    const dot = event.target.closest("[data-slide]");
    if (!dot) return;
    updateTestimonial(Number(dot.dataset.slide));
    startTestimonials();
  });

  testimonialShell.addEventListener("mouseenter", stopTestimonials);
  testimonialShell.addEventListener("mouseleave", startTestimonials);
  testimonialShell.addEventListener("focusin", stopTestimonials);
  testimonialShell.addEventListener("focusout", startTestimonials);

  testimonialShell.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      prevTestimonial();
      startTestimonials();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      nextTestimonial();
      startTestimonials();
    }
  });

  let startX = null;
  testimonialShell.addEventListener("pointerdown", (event) => {
    startX = event.clientX;
  });
  testimonialShell.addEventListener("pointerup", (event) => {
    if (startX === null) return;
    const difference = event.clientX - startX;
    startX = null;
    if (Math.abs(difference) < 50) return;
    if (difference < 0) nextTestimonial();
    else prevTestimonial();
    startTestimonials();
  });
  testimonialShell.addEventListener("pointercancel", () => {
    startX = null;
  });

  startTestimonials();
}

function setNewsletterMessage(text, isError = false) {
  newsletterMessage.textContent = text;
  newsletterMessage.className = `form-message${isError ? " error" : ""}`;
  newsletterForm.classList.toggle("invalid", isError);
}

function initNewsletter() {
  const saved = readStorage(NEWSLETTER_KEY, null);
  if (typeof saved === "string" && saved) {
    newsletterEmail.value = saved;
    setNewsletterMessage("You're already on the list — we'll be in touch.");
  }

  newsletterEmail.addEventListener("input", () => {
    newsletterForm.classList.remove("invalid");
    if (newsletterMessage.classList.contains("error")) {
      newsletterMessage.textContent = "";
      newsletterMessage.className = "form-message";
    }
  });

  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    window.location.href = "404.html";
  });
}

function openNav() {
  document.body.classList.add("nav-open");
  navToggle.setAttribute("aria-expanded", "true");
  navToggle.setAttribute("aria-label", "Close menu");
}

function closeNav() {
  document.body.classList.remove("nav-open");
  if (navToggle) {
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }
}

function initNav() {
  navToggle.addEventListener("click", () => {
    if (document.body.classList.contains("nav-open")) closeNav();
    else openNav();
  });

  navOverlay.addEventListener("click", closeNav);
  navClose?.addEventListener("click", closeNav);

  primaryNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeNav();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 960) closeNav();
  });
}

function initScrollUI() {
  let ticking = false;

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      const offset = window.scrollY;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const percentage = scrollable > 0 ? Math.min(100, (offset / scrollable) * 100) : 0;

      header.classList.toggle("scrolled", offset > 10);
      backToTop.classList.toggle("show", offset > 600);
      scrollProgress.style.width = `${percentage}%`;
      ticking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function animateCounter(element) {
  const target = Number(element.dataset.count) || 0;
  const suffix = element.dataset.suffix || "";

  if (prefersReducedMotion) {
    element.textContent = `${target.toLocaleString("en-US")}${suffix}`;
    return;
  }

  const duration = 1500;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = `${Math.round(target * eased).toLocaleString("en-US")}${suffix}`;
    if (progress < 1) window.requestAnimationFrame(tick);
  };

  window.requestAnimationFrame(tick);
}

function initCounters() {
  const counters = $$("[data-count]");
  if (!counters.length) return;

  if (!("IntersectionObserver" in window)) {
    counters.forEach((counter) => {
      counter.textContent = `${Number(counter.dataset.count).toLocaleString("en-US")}${counter.dataset.suffix || ""}`;
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function initDates() {
  const today = new Date();
  const start = addDays(today, 7);
  const end = addDays(start, 3);

  heroCheckin.min = toDateValue(today);
  heroCheckout.min = toDateValue(addDays(today, 1));
  heroCheckin.value = toDateValue(start);
  heroCheckout.value = toDateValue(end);

  heroCheckin.addEventListener("change", () => {
    const checkin = parseDateValue(heroCheckin.value);
    if (!checkin) return;
    const minimumCheckout = addDays(checkin, 1);
    heroCheckout.min = toDateValue(minimumCheckout);
    const checkout = parseDateValue(heroCheckout.value);
    if (!checkout || checkout <= checkin) {
      heroCheckout.value = toDateValue(minimumCheckout);
      showToast("Check-out moved to the next day.", "error");
    }
    updateHeroNights();
  });

  heroCheckout.addEventListener("change", () => {
    const checkin = parseDateValue(heroCheckin.value);
    const checkout = parseDateValue(heroCheckout.value);
    if (checkin && checkout && checkout <= checkin) {
      heroCheckout.value = toDateValue(addDays(checkin, 1));
      showToast("Check-out must be after check-in.", "error");
    }
    updateHeroNights();
  });

  updateHeroNights();
}

function updateHeroNights() {
  const checkin = parseDateValue(heroCheckin.value);
  const checkout = parseDateValue(heroCheckout.value);
  const nights = checkin && checkout ? nightsBetween(checkin, checkout) : 0;
  heroNights.textContent = nights > 0 ? formatNights(nights) : "Select dates";
}

function calculateBooking() {
  if (!state.currentHotel) return null;

  const checkin = parseDateValue(bookingCheckin.value);
  const checkout = parseDateValue(bookingCheckout.value);
  const nights = checkin && checkout ? nightsBetween(checkin, checkout) : 0;
  const rooms = clamp(parseInt(bookingRooms.value, 10) || 1, 1, 5);
  const guests = clamp(parseInt(bookingGuests.value, 10) || 1, 1, 12);
  const rate = state.currentHotel.price;
  const subtotal = rate * Math.max(nights, 0) * rooms;
  const service = Math.round(subtotal * 0.12);
  const taxes = Math.round(subtotal * 0.08);
  const discount = state.coupon ? Math.round(subtotal * state.coupon.rate) : 0;
  const total = Math.max(0, subtotal + service + taxes - discount);

  return { checkin, checkout, nights, rooms, guests, rate, subtotal, service, taxes, discount, total };
}

function recalcBooking() {
  const calc = calculateBooking();
  if (!calc) return;

  summaryRate.textContent = money(calc.rate);
  summaryNights.textContent = formatNights(calc.nights);
  summaryRooms.textContent = formatRooms(calc.rooms);
  summarySubtotal.textContent = money(calc.subtotal);
  summaryService.textContent = money(calc.service);
  summaryTaxes.textContent = money(calc.taxes);
  summaryDiscount.textContent = `-${money(calc.discount)}`;
  summaryTotal.textContent = money(calc.total);
  discountRow.hidden = calc.discount <= 0;
  confirmBooking.disabled = calc.nights < 1;
}

function openBooking(id) {
  const hotel = hotels.find((item) => item.id === id);
  if (!hotel || !bookingModal) return;

  state.currentHotel = hotel;
  state.coupon = null;
  state.lastFocused = document.activeElement;

  closeWishlist(false);
  closeNav();
  hideSuggestions();
  closeTravellerPopover();

  bookingImage.style.display = "";
  bookingImage.src = hotel.image;
  bookingImage.alt = `${hotel.name} in ${hotel.location}`;
  bookingTag.textContent = hotel.tag;
  bookingTitle.textContent = hotel.name;
  bookingLocation.innerHTML = `<svg class="icon"><use href="#icon-pin"></use></svg>${escapeHTML(hotel.location)}`;
  bookingRating.innerHTML =
    '<svg class="icon"><use href="#icon-star"></use></svg>'.repeat(5) +
    `<span>${hotel.rating.toFixed(1)} · ${hotel.reviews.toLocaleString("en-US")} reviews</span>`;

  const today = new Date();
  const todayValue = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const heroIn = parseDateValue(heroCheckin.value);
  const heroOut = parseDateValue(heroCheckout.value);
  const checkin = heroIn && heroIn >= todayValue ? heroIn : addDays(todayValue, 7);
  const checkout = heroOut && heroOut > checkin ? heroOut : addDays(checkin, 3);

  bookingCheckin.min = toDateValue(todayValue);
  bookingCheckin.value = toDateValue(checkin);
  bookingCheckout.min = toDateValue(addDays(checkin, 1));
  bookingCheckout.value = toDateValue(checkout);
  bookingGuests.value = String(clamp(state.travellers.adults + state.travellers.children, 1, 12));
  bookingRooms.value = String(clamp(state.travellers.rooms, 1, 5));

  bookingCoupon.value = "";
  couponMessage.textContent = "";
  couponMessage.className = "coupon-message";
  recalcBooking();

  bookingModal.classList.add("open");
  bookingModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  window.setTimeout(() => {
    const closeButton = $(".modal-close", bookingModal);
    if (closeButton) closeButton.focus();
  }, 80);
}

function closeBooking() {
  if (!bookingModal) return;
  bookingModal.classList.remove("open");
  bookingModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  state.coupon = null;

  const target = state.lastFocused;
  if (target && document.contains(target) && !wishlistDrawer.contains(target)) {
    target.focus();
  } else if (wishlistBtn) {
    wishlistBtn.focus();
  }
}

function applyCouponCode() {
  const code = bookingCoupon.value.trim().toUpperCase();

  if (!code) {
    state.coupon = null;
    couponMessage.textContent = "Coupon removed.";
    couponMessage.className = "coupon-message";
    recalcBooking();
    return;
  }

  const coupon = coupons[code];
  if (!coupon) {
    state.coupon = null;
    couponMessage.textContent = "That code isn't valid. Try SUNSET20.";
    couponMessage.className = "coupon-message error";
    recalcBooking();
    showToast("Invalid coupon code", "error");
    return;
  }

  state.coupon = { code, rate: coupon.rate, label: coupon.label };
  couponMessage.textContent = `${coupon.label} applied — ${Math.round(coupon.rate * 100)}% off.`;
  couponMessage.className = "coupon-message success";
  recalcBooking();
  showToast(`Coupon ${code} applied`);
}

function initBooking() {
  if (!bookingModal) return;

  bookingImage.addEventListener("error", () => {
    bookingImage.style.display = "none";
  });

  bookingCheckin.addEventListener("change", () => {
    const checkin = parseDateValue(bookingCheckin.value);
    if (!checkin) return;
    const minimumCheckout = addDays(checkin, 1);
    bookingCheckout.min = toDateValue(minimumCheckout);
    const checkout = parseDateValue(bookingCheckout.value);
    if (!checkout || checkout <= checkin) {
      bookingCheckout.value = toDateValue(minimumCheckout);
      showToast("Check-out moved to the next day.", "error");
    }
    recalcBooking();
  });

  bookingCheckout.addEventListener("change", () => {
    const checkin = parseDateValue(bookingCheckin.value);
    const checkout = parseDateValue(bookingCheckout.value);
    if (checkin && checkout && checkout <= checkin) {
      bookingCheckout.value = toDateValue(addDays(checkin, 1));
      showToast("Check-out must be after check-in.", "error");
    }
    recalcBooking();
  });

  bookingGuests.addEventListener("change", () => {
    bookingGuests.value = String(clamp(parseInt(bookingGuests.value, 10) || 1, 1, 12));
    recalcBooking();
  });

  bookingRooms.addEventListener("change", () => {
    bookingRooms.value = String(clamp(parseInt(bookingRooms.value, 10) || 1, 1, 5));
    recalcBooking();
  });

  bookingCoupon.addEventListener("input", () => {
    if (couponMessage.classList.contains("error")) {
      couponMessage.textContent = "";
      couponMessage.className = "coupon-message";
    }
  });

  bookingCoupon.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      applyCouponCode();
    }
  });

  applyCoupon.addEventListener("click", applyCouponCode);

  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    window.location.href = "404.html";
  });
}

function initGlobalListeners() {
  document.addEventListener("click", (event) => {
    const wishlistOpener = event.target.closest("[data-open-wishlist]");
    if (wishlistOpener) {
      event.preventDefault();
      window.location.href = "404.html";
      return;
    }

    const wishlistToggle = event.target.closest("[data-wishlist]");
    if (wishlistToggle) {
      event.preventDefault();
      window.location.href = "404.html";
      return;
    }

    const wishlistRemove = event.target.closest("[data-remove-wishlist]");
    if (wishlistRemove) {
      event.preventDefault();
      toggleWishlist(wishlistRemove.dataset.removeWishlist);
      return;
    }

    const bookButton = event.target.closest("[data-book]");
    if (bookButton) {
      event.preventDefault();
      openBooking(bookButton.dataset.book);
      return;
    }

    const exploreButton = event.target.closest("[data-explore]");
    if (exploreButton) {
      event.preventDefault();
      exploreDestination(exploreButton.dataset.explore);
      return;
    }

    const couponButton = event.target.closest("[data-coupon]");
    if (couponButton) {
      event.preventDefault();
      window.location.href = "404.html";
      return;
    }

    const closeModalButton = event.target.closest("[data-close-modal]");
    if (closeModalButton) {
      event.preventDefault();
      closeBooking();
      return;
    }

    const trendChip = event.target.closest("[data-trending], [data-recent]");
    if (trendChip) {
      const value = trendChip.dataset.trending || trendChip.dataset.recent;
      heroDestination.value = value;
      performDestinationSearch(value);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    hideSuggestions();
    closeTravellerPopover();
    closeNav();
    if (bookingModal.classList.contains("open")) closeBooking();
    else if (wishlistDrawer.classList.contains("open")) closeWishlist();
  });
}

function initAOS() {
  if (!AOS_AVAILABLE) {
    $$("[data-aos]").forEach((element) => {
      element.removeAttribute("data-aos");
      element.removeAttribute("data-aos-delay");
    });
    return;
  }

  window.AOS.init({
    duration: 750,
    easing: "ease-out-cubic",
    once: true,
    offset: 70
  });
  aosReady = true;
}

function init() {
  loadWishlist();
  renderTicker();
  renderRecentSearches();
  renderDestinations();
  renderHotels();
  renderOffers();
  renderTestimonials();

  priceValue.textContent = money(state.maxPrice);
  updateRangeFill();

  initHeroSearch();
  initTravellers();
  initHotelFilters();
  initWishlist();
  initTestimonials();
  initNewsletter();
  initNav();
  initScrollUI();
  initCounters();
  initDates();
  initBooking();
  initGlobalListeners();

  updateWishlistUI();
  renderWishlistDrawer();
  initAOS();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}




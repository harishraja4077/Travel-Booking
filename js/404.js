const navToggle = document.getElementById("navToggle");
const navClose = document.getElementById("navClose");
const navOverlay = document.getElementById("navOverlay");
const primaryNav = document.getElementById("primaryNav");
const header = document.getElementById("siteHeader");

const setNavOpen = (open) => {
  document.body.classList.toggle("nav-open", open);
  if (navToggle) {
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
};

navToggle?.addEventListener("click", () => {
  setNavOpen(!document.body.classList.contains("nav-open"));
});

navOverlay?.addEventListener("click", () => setNavOpen(false));
navClose?.addEventListener("click", () => setNavOpen(false));

primaryNav?.addEventListener("click", (event) => {
  if (event.target.closest("a")) setNavOpen(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setNavOpen(false);
});

const updateHeader = () => {
  header?.classList.toggle("scrolled", window.scrollY > 8);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

const errorBack = document.getElementById("errorBack");
errorBack?.addEventListener("click", () => {
  if (window.history.length > 1) {
    window.history.back();
  } else if (document.referrer) {
    window.location.assign(document.referrer);
  } else {
    window.location.assign("index.html");
  }
});

const destinations = [
  "Kyoto, Japan",
  "Amalfi Coast, Italy",
  "Bali, Indonesia",
  "Santorini, Greece",
  "Marrakech, Morocco",
  "Lisbon, Portugal",
  "Queenstown, New Zealand",
  "Cape Town, South Africa"
];

const suggestion = document.getElementById("errorSuggestion");
const errorTip = document.getElementById("errorTip");
const errorShuffle = document.getElementById("errorShuffle");
let lastSuggestion = 0;

const pickSuggestion = () => {
  if (!suggestion || destinations.length < 2) return;

  let next = lastSuggestion;
  while (next === lastSuggestion) {
    next = Math.floor(Math.random() * destinations.length);
  }

  lastSuggestion = next;
  suggestion.textContent = destinations[next];

  if (errorTip) {
    errorTip.classList.remove("is-shuffling");
    void errorTip.offsetWidth;
    errorTip.classList.add("is-shuffling");
  }
};

errorShuffle?.addEventListener("click", pickSuggestion);
errorTip?.addEventListener("animationend", () => {
  errorTip.classList.remove("is-shuffling");
});

const errorVisual = document.getElementById("errorVisual");
const errorPostcard = document.getElementById("errorPostcard");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (errorVisual && errorPostcard && !reduceMotion) {
  const resetTilt = () => {
    errorPostcard.style.setProperty("--tilt-x", "0deg");
    errorPostcard.style.setProperty("--tilt-y", "0deg");
  };

  errorVisual.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;

    const rect = errorVisual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    errorPostcard.style.setProperty("--tilt-x", `${(-y * 5).toFixed(2)}deg`);
    errorPostcard.style.setProperty("--tilt-y", `${(x * 7).toFixed(2)}deg`);
  });

  errorVisual.addEventListener("pointerleave", resetTilt);
  errorVisual.addEventListener("pointercancel", resetTilt);
}

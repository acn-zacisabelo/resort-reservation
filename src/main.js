import { stays } from "./stays.js";
import {
  formatPesos,
  getMatchingStays,
  localDateString,
  validateStay,
} from "./booking.js";
import { icon, hydrateIcons } from "./icons.js";
import { openDialog, setupDialogs, showStay } from "./dialogs.js";

const byId = (id) => document.getElementById(id);
const storageKey = "hansys-saved-stays";
const readSaved = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return Array.isArray(parsed)
      ? parsed.filter((id) => stays.some((stay) => stay.id === id))
      : [];
  } catch {
    return [];
  }
};
const state = {
  category: "all",
  guests: 2,
  maxPrice: 10000,
  savedOnly: false,
  savedIds: readSaved(),
  searched: false,
};
let toastTimer;

const notify = (message) => {
  byId("toast").textContent = message;
  byId("toast").classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(
    () => byId("toast").classList.remove("visible"),
    3000,
  );
};

const toggleSaved = (id) => {
  const wasSaved = state.savedIds.includes(id);
  state.savedIds = wasSaved
    ? state.savedIds.filter((item) => item !== id)
    : [...state.savedIds, id];
  try {
    localStorage.setItem(storageKey, JSON.stringify(state.savedIds));
  } catch {
    notify("Saved for this visit. Browser storage is unavailable.");
    renderStays();
    return;
  }
  notify(
    wasSaved
      ? "Removed from your saved stays"
      : "A little escape, saved for later",
  );
  renderStays();
  byId("stay-grid")
    .querySelector(`[data-save="${id}"]`)
    ?.focus({ preventScroll: true });
};

const card = (stay) => `<article class="stay-card">
  <div class="stay-image-wrap"><button class="stay-image-link" data-stay="${stay.id}" aria-label="Explore ${stay.name}"><img src="/public/images/${stay.image}" alt="Illustrative ${stay.name.toLowerCase()}" loading="lazy" width="600" height="530"></button><span class="stay-tag">${stay.tag}</span><button class="favorite-button" data-save="${stay.id}" aria-label="Save ${stay.name}" aria-pressed="${state.savedIds.includes(stay.id)}">${icon("heart")}</button></div>
  <h3><button class="card-title" data-stay="${stay.id}">${stay.name}</button></h3><p class="stay-subtitle">${stay.subtitle}</p><p class="stay-specs">${stay.capacity} guests · ${stay.beds}</p><p class="stay-price"><strong>${formatPesos(stay.price)}</strong> / night <small>sample rate</small></p>
</article>`;

const renderStays = () => {
  const results = getMatchingStays(stays, state);
  byId("stay-grid").innerHTML = results.map(card).join("");
  byId("empty-state").hidden = results.length > 0;
  byId("saved-count").textContent = state.savedIds.length
    ? ` (${state.savedIds.length})`
    : "";
  byId("show-saved").setAttribute("aria-pressed", String(state.savedOnly));
  byId("filter-count").textContent =
    state.maxPrice < 10000 || state.savedOnly ? " ·" : "";
  byId("results-meta").textContent =
    state.searched || state.savedOnly || state.maxPrice < 10000
      ? `${results.length} sample stay${results.length === 1 ? "" : "s"}${state.savedOnly ? " saved" : ` for ${state.guests} guest${state.guests === 1 ? "" : "s"}`} · Availability to be confirmed`
      : "";
  document.querySelectorAll("[data-category]").forEach((button) => {
    const active = button.dataset.category === state.category;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
};

const setCategory = (category) => {
  state.category = category;
  byId("stay-type").value = category;
  renderStays();
};

const resetFilters = () => {
  Object.assign(state, {
    category: "all",
    guests: 2,
    maxPrice: 10000,
    savedOnly: false,
    searched: false,
  });
  byId("stay-type").value = "all";
  byId("guests").value = "2";
  byId("search-error").textContent = "";
  renderStays();
};

const setupBrowsing = () => {
  document
    .querySelectorAll("[data-category]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        setCategory(button.dataset.category),
      ),
    );
  byId("stay-grid").addEventListener("click", (event) => {
    const saveButton = event.target.closest("[data-save]");
    if (saveButton) return toggleSaved(saveButton.dataset.save);
    const stayButton = event.target.closest("[data-stay]");
    if (stayButton) showStay(stayButton.dataset.stay);
  });
  byId("show-saved").addEventListener("click", () => {
    state.savedOnly = !state.savedOnly;
    state.category = "all";
    byId("stay-type").value = "all";
    renderStays();
    byId("stays").scrollIntoView({ behavior: "smooth" });
    if (!state.savedIds.length && state.savedOnly)
      notify("Tap a heart on a stay to save it here");
  });
  byId("reset-filters").addEventListener("click", resetFilters);
};

const setupFilters = () => {
  const resetDialog = () => {
    byId("max-price").value = "10000";
    byId("price-output").textContent = formatPesos(10000);
    byId("saved-only").checked = false;
  };
  byId("open-filters").addEventListener("click", () => {
    byId("max-price").value = String(state.maxPrice);
    byId("price-output").textContent = formatPesos(state.maxPrice);
    byId("saved-only").checked = state.savedOnly;
    openDialog("filters-dialog");
  });
  byId("max-price").addEventListener("input", (event) => {
    byId("price-output").textContent = formatPesos(Number(event.target.value));
  });
  byId("clear-filter-dialog").addEventListener("click", resetDialog);
  byId("filter-form").addEventListener("submit", (event) => {
    event.preventDefault();
    state.maxPrice = Number(byId("max-price").value);
    state.savedOnly = byId("saved-only").checked;
    renderStays();
    byId("filters-dialog").close();
  });
};

const setupSearch = () => {
  byId("check-in").min = localDateString();
  byId("check-out").min = localDateString();
  byId("check-in").addEventListener("change", () => {
    byId("check-out").min = byId("check-in").value || localDateString();
    if (
      byId("check-out").value &&
      byId("check-out").value <= byId("check-in").value
    ) {
      byId("check-out").value = "";
      byId("search-error").textContent =
        "Choose a check-out date after your new check-in date.";
    } else byId("search-error").textContent = "";
  });
  byId("booking").addEventListener("submit", (event) => {
    event.preventDefault();
    const selection = {
      checkIn: byId("check-in").value,
      checkOut: byId("check-out").value,
      guests: Number(byId("guests").value),
    };
    const result = validateStay(selection);
    byId("search-error").textContent = result.error;
    if (!result.valid) return;
    Object.assign(state, {
      guests: selection.guests,
      category: byId("stay-type").value,
      searched: true,
    });
    renderStays();
    byId("stays").scrollIntoView({ behavior: "smooth" });
    notify(
      `${result.nights} night${result.nights === 1 ? "" : "s"} of possibility · Sample stays only`,
    );
  });
};

hydrateIcons();
setupDialogs();
setupBrowsing();
setupFilters();
setupSearch();
renderStays();
byId("year").textContent = String(new Date().getFullYear());

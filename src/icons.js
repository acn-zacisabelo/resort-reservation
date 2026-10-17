const paths = {
  "arrow-right": '<path d="M5 12h14m-5-5 5 5-5 5"/>',
  heart:
    '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 1v2m0 18v2M1 12h2m18 0h2M4.2 4.2l1.4 1.4m12.8 12.8 1.4 1.4M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  bed: '<path d="M3 18v3m18-3v3M3 12V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M2 18v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5H2Z"/><path d="M6 11V8h4v3m4 0V8h4v3"/>',
  calendar:
    '<rect x="3" y="5" width="18" height="17" rx="2"/><path d="M16 2v6M8 2v6M3 11h18m-13 4h1m6 0h1m-8 4h1m6 0h1"/>',
  users:
    '<circle cx="9" cy="7" r="4"/><path d="M2 21v-2a7 7 0 0 1 14 0v2M16 3a4 4 0 0 1 0 8m3 4a6 6 0 0 1 3 6"/>',
  search: '<circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5 5"/>',
  waves:
    '<path d="M2 7c3-4 5 4 10 0s7 4 10 0M2 13c3-4 5 4 10 0s7 4 10 0M2 19c3-4 5 4 10 0s7 4 10 0"/>',
  pool: '<path d="M7 15V4a2 2 0 0 1 4 0m4 11V4a2 2 0 0 1 4 0M7 7h8m-8 5h8M2 18c3-3 4 3 8 0s6 3 12 0M2 22c3-3 4 3 8 0s6 3 12 0"/>',
  leaf: '<path d="M20 3C9 1 2 7 5 14s15 7 15-11ZM4 21 16 9M8 17v-6m0 6h6"/>',
  sliders:
    '<path d="M3 6h7m4 0h7M3 12h2m4 0h12M3 18h12m4 0h2"/><circle cx="12" cy="6" r="2"/><circle cx="7" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
  sparkles:
    '<path d="m12 3 2.8 6.2L21 12l-6.2 2.8L12 21l-2.8-6.2L3 12l6.2-2.8L12 3Zm8-2v4m-2-2h4M3 18v4m-2-2h4"/>',
  coffee:
    '<path d="M4 8h13v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8Zm13 1h2a3 3 0 0 1 0 6h-2M2 23h19M7 1v3m4-3v3m4-3v3"/>',
  "map-pin":
    '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  x: '<path d="m6 6 12 12M6 18 18 6"/>',
};
export const icon = (name) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.sun}</svg>`;
export const hydrateIcons = (root = document) =>
  root.querySelectorAll("[data-icon]").forEach((el) => {
    el.innerHTML = icon(el.dataset.icon);
  });

import { stays } from "./stays.js";
import { formatPesos, localDateString, validateStay } from "./booking.js";
import { icon } from "./icons.js";

const byId = (id) => document.getElementById(id);
const niceDate = (value) =>
  new Date(`${value}T12:00:00`).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
export const openDialog = (id) => {
  document.querySelectorAll("dialog[open]").forEach((dialog) => dialog.close());
  byId(id).showModal();
};

const openInquiry = (stay) => {
  byId("inquiry-stay").value = stay.id;
  byId("inquiry-in").value = byId("check-in").value;
  byId("inquiry-out").value = byId("check-out").value;
  byId("inquiry-in").min = localDateString();
  byId("inquiry-out").min = byId("inquiry-in").value || localDateString();
  byId("inquiry-guests").value = Math.min(
    Number(byId("guests").value),
    stay.capacity,
  );
  byId("inquiry-guests").max = stay.capacity;
  byId("inquiry-form").hidden = false;
  byId("inquiry-summary").hidden = true;
  byId("inquiry-error").textContent = "";
  openDialog("inquiry-dialog");
};

export const showStay = (id) => {
  const stay = stays.find((item) => item.id === id);
  if (!stay) return;
  byId("stay-detail").innerHTML = `
    <img class="detail-image" src="/public/images/${stay.image}" alt="Illustrative ${stay.name.toLowerCase()}">
    <div class="detail-heading"><div><h2 id="stay-dialog-title">${stay.name}</h2><p>Up to ${stay.capacity} guests · ${stay.beds}</p></div><span class="sample-label">${stay.tag}</span></div>
    <p class="detail-description">${stay.description}</p>
    <div class="detail-amenities">${stay.amenities.map((amenity) => `<span>${amenity}</span>`).join("")}</div>
    <div class="detail-bottom"><p class="stay-price"><strong>${formatPesos(stay.price)}</strong> / night<br><small>Illustrative rate</small></p><button class="button primary" id="prepare-inquiry">Plan this stay ${icon("arrow-right")}</button></div>
    <p class="fine-print">Sample room, amenities, and stock photo. Actual property details to be confirmed.</p>`;
  byId("prepare-inquiry").addEventListener("click", () => openInquiry(stay));
  openDialog("stay-dialog");
};

const previewInquiry = (event) => {
  event.preventDefault();
  const stay = stays.find((item) => item.id === byId("inquiry-stay").value);
  const selection = {
    checkIn: byId("inquiry-in").value,
    checkOut: byId("inquiry-out").value,
    guests: Number(byId("inquiry-guests").value),
  };
  const result = validateStay(selection);
  if (!result.valid || selection.guests > stay.capacity) {
    byId("inquiry-error").textContent =
      result.error ||
      `This sample stay accommodates up to ${stay.capacity} guests.`;
    return;
  }
  const total = stay.price * result.nights;
  byId("inquiry-summary").innerHTML = `
    <h3 class="summary-room" tabindex="-1" id="summary-heading">${stay.name}</h3>
    <div class="summary-row"><span>Check in</span><span>${niceDate(selection.checkIn)}</span></div>
    <div class="summary-row"><span>Check out</span><span>${niceDate(selection.checkOut)}</span></div>
    <div class="summary-row"><span>Your people</span><span>${selection.guests} guest${selection.guests === 1 ? "" : "s"}</span></div>
    <div class="summary-row"><span>${formatPesos(stay.price)} × ${result.nights} night${result.nights === 1 ? "" : "s"}</span><span>${formatPesos(total)}</span></div>
    <div class="summary-row summary-total"><span>Sample room subtotal</span><span>${formatPesos(total)}</span></div>
    <p class="summary-note">An illustration for planning only. Taxes, fees, current rates, and availability are not provided.</p>
    <div class="summary-actions"><button class="button primary" id="download-inquiry">Download my plan ${icon("arrow-right")}</button><button class="button outline" id="edit-inquiry">Edit dates</button></div>`;
  byId("inquiry-form").hidden = true;
  byId("inquiry-summary").hidden = false;
  byId("summary-heading").focus();
  byId("download-inquiry").addEventListener("click", () => {
    const text = `Hansy's Resort — SAMPLE STAY PLAN\n\n${stay.name}\nCheck in: ${selection.checkIn}\nCheck out: ${selection.checkOut}\nGuests: ${selection.guests}\nNights: ${result.nights}\nIllustrative room subtotal: ${formatPesos(total)}\n\nThis is a website concept, not a reservation or sent inquiry. No availability has been checked. Photos, rooms, and rates are samples. Taxes and fees are not included. Contact details are not yet configured.`;
    const url = URL.createObjectURL(
      new Blob([text], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "hansys-sample-stay-plan.txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  byId("edit-inquiry").addEventListener("click", () => {
    byId("inquiry-form").hidden = false;
    byId("inquiry-summary").hidden = true;
    byId("inquiry-in").focus();
  });
};

export const setupDialogs = () => {
  document
    .querySelectorAll(".close-dialog")
    .forEach((button) =>
      button.addEventListener("click", () => button.closest("dialog").close()),
    );
  document.querySelectorAll("dialog").forEach((dialog) =>
    dialog.addEventListener("click", (event) => {
      const rect = dialog.getBoundingClientRect();
      if (
        event.target === dialog &&
        (event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom)
      )
        dialog.close();
    }),
  );
  byId("open-gallery").addEventListener("click", () => {
    byId("gallery-grid").innerHTML = [
      { image: "hero-coast.png", name: "A tropical state of mind" },
      ...stays,
    ]
      .map(
        (item) =>
          `<figure><img src="/public/images/${item.image}" alt="Illustrative ${item.name.toLowerCase()}" loading="lazy"><figcaption>${item.name} · Inspiration photo</figcaption></figure>`,
      )
      .join("");
    openDialog("gallery-dialog");
  });
  byId("about-demo").addEventListener("click", () =>
    openDialog("about-dialog"),
  );
  byId("inquiry-form").addEventListener("submit", previewInquiry);
  byId("inquiry-in").addEventListener("change", () => {
    byId("inquiry-out").min = byId("inquiry-in").value || localDateString();
    if (
      byId("inquiry-out").value &&
      byId("inquiry-out").value <= byId("inquiry-in").value
    ) {
      byId("inquiry-out").value = "";
      byId("inquiry-error").textContent =
        "Choose a check-out date after your new check-in date.";
    } else byId("inquiry-error").textContent = "";
  });
};

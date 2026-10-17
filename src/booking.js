export function localDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isCalendarDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  date.setUTCHours(0, 0, 0, 0);
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function validateStay(
  { checkIn, checkOut, guests } = {},
  today = localDateString(),
) {
  const invalid = (error) => ({ valid: false, error, nights: 0 });

  if (!checkIn || !checkOut) return invalid("Dates are required");
  if (!isCalendarDate(checkIn) || !isCalendarDate(checkOut)) {
    return invalid("Dates must be valid calendar dates");
  }
  if (checkIn < today) return invalid("Check-in cannot be in the past");
  if (checkOut <= checkIn) return invalid("Check-out must be after check-in");
  if (!Number.isInteger(guests) || guests < 1 || guests > 12) {
    return invalid("Guests must be an integer from 1 to 12");
  }

  const nights =
    (Date.parse(`${checkOut}T00:00:00Z`) - Date.parse(`${checkIn}T00:00:00Z`)) /
    86_400_000;
  return { valid: true, error: "", nights };
}

export function getMatchingStays(
  stays,
  {
    category = "all",
    guests = 1,
    maxPrice = Infinity,
    savedOnly = false,
    savedIds = [],
  } = {},
) {
  return stays.filter(
    (stay) =>
      (category === "all" || stay.category === category) &&
      stay.capacity >= guests &&
      stay.price <= maxPrice &&
      (!savedOnly || savedIds.includes(stay.id)),
  );
}

export function formatPesos(value) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(value);
}

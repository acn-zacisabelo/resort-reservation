import test from "node:test";
import assert from "node:assert/strict";
import {
  formatPesos,
  getMatchingStays,
  localDateString,
  validateStay,
} from "../src/booking.js";

test("localDateString formats the local calendar date", () => {
  const date = new Date(2026, 0, 9, 23, 45);
  assert.equal(localDateString(date), "2026-01-09");
});

test("validateStay accepts a valid stay and calculates nights using calendar days", () => {
  assert.deepEqual(
    validateStay(
      { checkIn: "2026-10-19", checkOut: "2026-10-22", guests: 2 },
      "2026-10-18",
    ),
    { valid: true, error: "", nights: 3 },
  );
});

test("validateStay rejects missing dates, impossible dates, past dates, invalid checkout and guest counts", () => {
  const invalidInputs = [
    [{ checkOut: "2026-10-20", guests: 1 }, "Dates are required"],
    [
      { checkIn: "2026-02-30", checkOut: "2026-03-02", guests: 1 },
      "Dates must be valid calendar dates",
    ],
    [
      { checkIn: "2026-10-17", checkOut: "2026-10-20", guests: 1 },
      "Check-in cannot be in the past",
    ],
    [
      { checkIn: "2026-10-19", checkOut: "2026-10-19", guests: 1 },
      "Check-out must be after check-in",
    ],
    [
      { checkIn: "2026-10-19", checkOut: "2026-10-20", guests: 0 },
      "Guests must be an integer from 1 to 12",
    ],
    [
      { checkIn: "2026-10-19", checkOut: "2026-10-20", guests: 13 },
      "Guests must be an integer from 1 to 12",
    ],
    [
      { checkIn: "2026-10-19", checkOut: "2026-10-20", guests: 1.5 },
      "Guests must be an integer from 1 to 12",
    ],
  ];

  for (const [input, error] of invalidInputs) {
    const result = validateStay(input, "2026-10-18");
    assert.equal(result.valid, false);
    assert.equal(result.error, error);
    assert.equal(result.nights, 0);
  }
});

test("getMatchingStays applies all filters without mutating the input", () => {
  const stays = [
    { id: "a", category: "villa", capacity: 4, price: 15000 },
    { id: "b", category: "suite", capacity: 2, price: 9000 },
    { id: "c", category: "villa", capacity: 6, price: 22000 },
  ];
  const original = structuredClone(stays);

  assert.deepEqual(
    getMatchingStays(stays, {
      category: "villa",
      guests: 3,
      maxPrice: 16000,
      savedOnly: true,
      savedIds: ["a", "c"],
    }),
    [stays[0]],
  );
  assert.deepEqual(stays, original);
});

test("getMatchingStays defaults to all categories and supports saved-only filtering", () => {
  const stays = [
    { id: "a", category: "villa", capacity: 4, price: 15000 },
    { id: "b", category: "suite", capacity: 2, price: 9000 },
  ];
  assert.deepEqual(getMatchingStays(stays), stays);
  assert.deepEqual(
    getMatchingStays(stays, { savedOnly: true, savedIds: ["b"] }),
    [stays[1]],
  );
});

test("formatPesos formats PHP with no fractional digits", () => {
  assert.equal(
    formatPesos(12345),
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(12345),
  );
});

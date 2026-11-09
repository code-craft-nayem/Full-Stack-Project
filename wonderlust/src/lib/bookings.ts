export type BookingStatus = "confirmed" | "pending";

export type Booking = {
  /** Mongo `_id`; also used to order the list newest-first. */
  id: string;
  /** Destination `_id` from the booking payload — used to link the View button. */
  destinationId: string;
  name: string;
  country: string;
  price: number;
  imageUrl: string;
  status: BookingStatus;
  /** Raw value as stored, e.g. "2026-02-22". */
  departureDate: string;
  /** "February 22, 2026", or "" when the value is missing or unparsable. */
  departureLabel: string;
  /** Short reference shown on the card, e.g. "860EB9". */
  reference: string;
};

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Date-only strings ("2026-02-22") are parsed as UTC by `new Date`, so build
 * them locally instead — otherwise `toLocaleDateString` can shift the day
 * backwards for viewers west of Greenwich.
 */
function parseDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (match) {
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  }
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/** Formats a booking date as "February 22, 2026"; "" when it can't be parsed. */
export function formatBookingDate(value: string): string {
  const date = parseDate(value);
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * The API stores no `status` field, so derive it: a booking carrying both a
 * departure date and a booking date is complete and therefore confirmed;
 * anything incomplete is still pending.
 */
function statusOf(departureDate: string, bookingDate: string): BookingStatus {
  const hasDeparture = parseDate(departureDate) !== null;
  const hasBooking = parseDate(bookingDate) !== null;
  return hasDeparture && hasBooking ? "confirmed" : "pending";
}

/** Normalizes a Mongo document from GET /my-bookings/:email into a Booking. */
export function normalizeBooking(raw: unknown): Booking | null {
  if (!raw || typeof raw !== "object") return null;
  const doc = raw as Record<string, unknown>;

  const name = str(doc.name);
  if (!name) return null;

  const mongoId = str(doc._id);
  const departureDate = str(doc.departureDate);
  const rawPrice =
    typeof doc.price === "number"
      ? doc.price
      : Number(str(doc.price).replace(/[^0-9.]/g, ""));

  return {
    id: mongoId || str(doc.id) || `${name}-${departureDate}`,
    destinationId: str(doc.id),
    name,
    country: str(doc.country),
    price: Number.isFinite(rawPrice) && rawPrice > 0 ? rawPrice : 0,
    imageUrl: str(doc.imageUrl) || str(doc.image) || str(doc.photo),
    status: statusOf(departureDate, str(doc.bookingDate)),
    departureDate,
    departureLabel: formatBookingDate(departureDate),
    reference: mongoId ? mongoId.slice(-8).toUpperCase() : "",
  };
}

/**
 * Docs created via POST /booking carry an empty imageUrl, so hand each
 * imageless card one of the six local photos — same cycling trick as
 * `fillMissingImages` in destinations.ts.
 */
export function fillMissingBookingImages(bookings: Booking[]): Booking[] {
  let next = 0;
  return bookings.map((booking) => {
    if (booking.imageUrl) return booking;
    next += 1;
    return {
      ...booking,
      imageUrl: `/images/destinations/image${((next - 1) % 6) + 1}.png`,
    };
  });
}

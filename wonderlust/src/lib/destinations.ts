export type Destination = {
  id: string;
  name: string;
  country: string;
  category: string;
  price: number;
  duration: string;
  imageUrl: string;
  rating: number;
};

/**
 * Fallback shown when the API at localhost:8000 is unreachable or empty.
 * Labels are verbatim from the mockup (all six cards show the same data).
 */
export const seedDestinations: Destination[] = [
  {
    id: "seed-1",
    name: "Bali Paradise",
    country: "Nepal",
    category: "beach",
    price: 2700,
    duration: "7 Days/6 Nights",
    imageUrl: "/images/destinations/image1.png",
    rating: 4.5,
  },
  {
    id: "seed-2",
    name: "Bali Paradise",
    country: "Nepal",
    category: "mountain",
    price: 2700,
    duration: "7 Days/6 Nights",
    imageUrl: "/images/destinations/image2.png",
    rating: 4.5,
  },
  {
    id: "seed-3",
    name: "Bali Paradise",
    country: "Nepal",
    category: "city",
    price: 2700,
    duration: "7 Days/6 Nights",
    imageUrl: "/images/destinations/image3.png",
    rating: 4.5,
  },
  {
    id: "seed-4",
    name: "Bali Paradise",
    country: "Nepal",
    category: "adventure",
    price: 2700,
    duration: "7 Days/6 Nights",
    imageUrl: "/images/destinations/image4.png",
    rating: 4.5,
  },
  {
    id: "seed-5",
    name: "Bali Paradise",
    country: "Nepal",
    category: "cultural",
    price: 2700,
    duration: "7 Days/6 Nights",
    imageUrl: "/images/destinations/image5.png",
    rating: 4.5,
  },
  {
    id: "seed-6",
    name: "Bali Paradise",
    country: "Nepal",
    category: "beach",
    price: 2700,
    duration: "7 Days/6 Nights",
    imageUrl: "/images/destinations/image6.png",
    rating: 4.5,
  },
];

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/** Normalizes a Mongo document from GET /all-destinations into a Destination. */
export function normalizeDestination(raw: unknown): Destination | null {
  if (!raw || typeof raw !== "object") return null;
  const doc = raw as Record<string, unknown>;

  const name = str(doc.name) || str(doc.title);
  if (!name) return null;

  const rawPrice = typeof doc.price === "number" ? doc.price : Number(str(doc.price).replace(/[^0-9.]/g, ""));
  const rawRating = typeof doc.rating === "number" ? doc.rating : Number(str(doc.rating));

  return {
    id: str(doc._id) || str(doc.id) || `${name}-${str(doc.country)}`,
    name,
    country: str(doc.country) || str(doc.location) || str(doc.region),
    category: str(doc.category).toLowerCase() || "other",
    price: Number.isFinite(rawPrice) && rawPrice > 0 ? rawPrice : 0,
    duration: str(doc.duration) || "Flexible",
    imageUrl: str(doc.imageUrl) || str(doc.image) || str(doc.photo),
    rating: Number.isFinite(rawRating) && rawRating > 0 ? rawRating : 4.5,
  };
}

export type DestinationDetail = Destination & {
  description: string;
  highlights: string[];
  reviewCount: number;
  date: string;
};

/** Copy from the detail mockup; used when the API omits description/highlights. */
export const DEFAULT_DESCRIPTION =
  "Discover the magic of Bali with pristine beaches, ancient temples, and vibrant culture. Experience luxury resorts, tropical landscapes, and unforgettable sunsets.";

/** Row-major order so a two-column grid renders them like the mockup. */
export const DEFAULT_HIGHLIGHTS = [
  "Luxury beachfront accommodation",
  "Visit Uluwatu Temple at sunset",
  "Traditional Balinese spa treatment",
  "Private beach dinner experience",
  "Sunrise trek to Mount Batur",
];

function countFrom(raw: unknown): number | null {
  if (Array.isArray(raw)) return raw.length;
  if (typeof raw === "number" && Number.isFinite(raw) && raw >= 0) return raw;
  if (typeof raw === "string" && raw.trim()) {
    const parsed = Number(raw);
    if (Number.isFinite(parsed) && parsed >= 0) return parsed;
  }
  return null;
}

/** Normalizes a Mongo document from GET /all-destination/:id into a DestinationDetail. */
export function normalizeDestinationDetail(
  raw: unknown,
): DestinationDetail | null {
  const base = normalizeDestination(raw);
  if (!base) return null;
  const doc = raw as Record<string, unknown>;

  const description =
    str(doc.description) || str(doc.overview) || DEFAULT_DESCRIPTION;
  const highlights = Array.isArray(doc.highlights)
    ? doc.highlights.map(str).filter(Boolean)
    : [];

  return {
    ...base,
    description,
    highlights: highlights.length > 0 ? highlights : DEFAULT_HIGHLIGHTS,
    reviewCount: countFrom(doc.reviewCount) ?? countFrom(doc.reviews) ?? 234,
    date: str(doc.date),
  };
}

/**
 * Docs created via POST /add-destination may have an empty imageUrl.
 * Gives each imageless card one of the six local photos so no two
 * neighboring cards share the same picture.
 */
export function fillMissingImages(items: Destination[]): Destination[] {
  let next = 0;
  return items.map((item) => {
    if (item.imageUrl) return item;
    next += 1;
    return {
      ...item,
      imageUrl: `/images/destinations/image${((next - 1) % 6) + 1}.png`,
    };
  });
}

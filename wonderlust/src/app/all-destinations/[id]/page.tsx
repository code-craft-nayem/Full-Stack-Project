import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  MapPin,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_HIGHLIGHTS,
  normalizeDestinationDetail,
  seedDestinations,
  type DestinationDetail,
} from "@/lib/destinations";
import EditDestination from "@/components/EditDestination";
import DeletDestination from "@/components/DeletDestination";
import BookingCard from "@/components/Booking/BookingCard";

const API_URL = "http://localhost:8000/all-destination";


/**
 * Fetches the API with a hard timeout; falls back to seed data when it's
 * down. Returns null when the API says the document doesn't exist (it
 * answers findOne() misses with an empty 200), so deleted destinations
 * render a 404 instead of seed placeholder content.
 */
async function getDestination(
  id: string,
): Promise<DestinationDetail | null> {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) {
      const body = await res.text();
      if (!body.trim()) return null;
      const detail = normalizeDestinationDetail(JSON.parse(body));
      if (detail) return detail;
    }
  } catch {
    // API unreachable or bad payload — fall through to the seed fallback below.
  }

  const seed =
    seedDestinations.find((item) => item.id === id) ?? seedDestinations[0];
  return {
    ...seed,
    // Placeholder photo of its own → the hero falls back to detail-hero.webp.
    imageUrl: "",
    description: DEFAULT_DESCRIPTION,
    highlights: DEFAULT_HIGHLIGHTS,
    reviewCount: 234,
    date: "",
  };
}

const DetailDestinationPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const destination = await getDestination(id);
  if (!destination) notFound();

  const heroImage =
    destination.imageUrl || "/images/destinations/detail-hero.webp";

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-[1280px] px-6 pt-6 pb-20 sm:px-10">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/all-destinations"
            className="flex items-center gap-2 text-[15px] text-[#6c696d] transition-colors hover:text-[#0c0b0b]"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to Destinations
          </Link>

          {/* Edit opens the dialog; Delete asks for confirmation first. */}
          <div className="flex items-center gap-3">
            <EditDestination destination={destination} />
            <DeletDestination id={id} />

          </div>
        </div>

        {/* Hero */}
        <div className="relative mt-6 aspect-[4/3] w-full overflow-hidden sm:aspect-[13/5]">
          <Image
            src={heroImage}
            alt={destination.name}
            fill
            priority
            sizes="(min-width: 1280px) 1200px, 100vw"
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* Left column */}
          <div>
            <div className="flex items-center gap-1.5 text-sm text-[#6c696d]">
              <MapPin className="size-4" aria-hidden="true" />
              {destination.country}
            </div>

            <h1 className="mt-3 text-[clamp(2.25rem,4vw,3rem)] leading-none font-normal tracking-[-0.02em] text-[#0c0b0b]">
              {destination.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              <span className="flex items-center gap-1.5">
                <Star
                  className="size-4 fill-[#1e9e35] text-[#1e9e35]"
                  aria-hidden="true"
                />
                <span className="font-semibold text-[#0c0b0b]">
                  {destination.rating.toFixed(1)}
                </span>
                <span className="text-[#6c696d]">
                  ({destination.reviewCount} reviews)
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="size-4 text-[#6c696d]" aria-hidden="true" />
                <span className="font-semibold text-[#0c0b0b]">
                  {destination.duration}
                </span>
              </span>
            </div>

            <section className="mt-10">
              <h2 className="text-2xl font-normal text-[#0c0b0b]">Overview</h2>
              <p className="mt-4 text-[15px] leading-7 text-[#6c696d]">
                {destination.description}
              </p>
            </section>

            <section className="mt-10">
              <h2 className="text-2xl font-normal text-[#0c0b0b]">Highlights</h2>
              <p className="mt-4 text-[15px] leading-7 text-[#6c696d]">
                {destination.description}
              </p>
              <ul className="mt-5 grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2">
                {destination.highlights.map((highlight, index) => (
                  <li
                    key={`${index}-${highlight}`}
                    className="flex items-start gap-2.5 text-[15px] leading-6 text-[#333136]"
                  >
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-[#1e9e35]"
                      aria-hidden="true"
                    />
                    {highlight}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Booking card */}

          <BookingCard destination={destination} />
        </div>

      </div>
    </main>
  );
};

export default DetailDestinationPage;


import {
  fillMissingImages,
  normalizeDestination,
  seedDestinations,
  type Destination,
} from "@/lib/destinations";
import DestinationsExplorer from "./destinations-explorer";

const API_URL = "http://localhost:8000/all-destinations";

/** Fetches the API with a hard timeout; falls back to seed data when it's down or empty. */
async function getDestinations(): Promise<Destination[]> {
  try {
    const res = await fetch(API_URL, {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return seedDestinations;

    const data: unknown = await res.json();
    if (!Array.isArray(data) || data.length === 0) return seedDestinations;

    const items = data
      .map(normalizeDestination)
      .filter((item): item is Destination => item !== null);

    return items.length > 0 ? fillMissingImages(items) : seedDestinations;
  } catch {
    return seedDestinations;
  }
}

export default async function AllDestinationsPage() {
  const destinations = await getDestinations();

  return (
    <>

      <main className="bg-white">
        <div className="mx-auto max-w-[1280px] px-6 pt-20 pb-20 sm:px-10">
          <h1 className="text-[clamp(2.25rem,4.5vw,3.75rem)] leading-none font-normal tracking-[-0.03em] text-[#0c0b0b]">
            Explore All Destinations
          </h1>
          <p className="mt-4 text-xl leading-8 tracking-[-0.03em] text-[#6c696d]">
            Find your perfect travel experience from our curated collection
          </p>

          <DestinationsExplorer destinations={destinations} />
        </div>
      </main>

    </>
  );
}

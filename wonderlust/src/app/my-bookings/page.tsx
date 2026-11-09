import Link from "next/link";
import { headers } from "next/headers";
import { CalendarX, User } from "lucide-react";
import BookingListItem from "@/components/Booking/BookingListItem";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { auth } from "@/lib/auth";
import {
  fillMissingBookingImages,
  normalizeBooking,
  type Booking,
} from "@/lib/bookings";

const API_URL = "http://localhost:8000/my-bookings";

/** Fetches the API with a hard timeout; returns [] when it's down or empty. */
async function getBookings(email: string): Promise<Booking[]> {
  try {
    const res = await fetch(`${API_URL}/${encodeURIComponent(email)}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return [];

    const data: unknown = await res.json();
    if (!Array.isArray(data)) return [];

    const items = data
      .map(normalizeBooking)
      .filter((item): item is Booking => item !== null);

    // ObjectIds sort chronologically, so this surfaces the newest booking first.
    const sorted = items.sort((a, b) => b.id.localeCompare(a.id));

    return fillMissingBookingImages(sorted);
  } catch {
    return [];
  }
}

const MyBookingsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;
  const bookings = user?.email ? await getBookings(user.email) : [];

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-[1280px] px-6 pt-20 pb-20 sm:px-10">
        <h1 className="text-[clamp(2.25rem,4.5vw,3.75rem)] leading-none font-normal tracking-[-0.03em] text-[#0c0b0b]">
          My Bookings
        </h1>
        <p className="mt-4 text-xl leading-8 tracking-[-0.03em] text-[#6c696d]">
          Manage and view your upcoming travel plans
        </p>

        {!user?.email ? (
          <Empty className="mt-10 border border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <User aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>Sign in to view your bookings</EmptyTitle>
              <EmptyDescription>
                You need to be signed in to see and manage your travel plans.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button
                render={<Link href="/login" />}
                className="h-10 rounded-lg bg-brand px-5 text-white hover:bg-brand/90"
              >
                Sign in
              </Button>
            </EmptyContent>
          </Empty>
        ) : bookings.length === 0 ? (
          <Empty className="mt-10 border border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CalendarX aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No bookings yet</EmptyTitle>
              <EmptyDescription>
                Trips you book will show up here so you can track departure
                dates and booking details in one place.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button
                render={<Link href="/all-destinations" />}
                className="h-10 rounded-lg bg-brand px-5 text-white hover:bg-brand/90"
              >
                Explore destinations
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <div className="mt-10 flex flex-col gap-6">
            {bookings.map((booking) => (
              <BookingListItem key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default MyBookingsPage;

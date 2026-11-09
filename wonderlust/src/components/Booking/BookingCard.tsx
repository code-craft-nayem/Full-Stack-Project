'use client';
import { ArrowRight, Check } from "lucide-react";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";

const bookingPerks = [
  "Free cancellation up to 7 days",
  "Travel insurance included",
  "24/7 customer support",
];



const BookingCard = ({ destination }) => {
  const { data: session } = authClient.useSession()
  const user = session?.user;

  const handleBooking = async (e) => {
    e.preventDefault();
    const departureDate = e.target.departureDate.value;
    const bookingData = {
      userId: user?.id,
      username: user?.name,
      userEmail: user?.email,
      userImage: user?.image,
      ...destination,
      departureDate: departureDate,
      bookingDate: new Date(),
    };
    console.log("Booking Data:", bookingData);

    const res = await fetch("http://localhost:8000/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });

    const data = await res.json();
    console.log("Response Data:", data);
  };

  return (
    <aside className="self-start rounded-lg border border-[#e8e8e8] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] lg:sticky lg:top-24">
      <p className="text-sm text-[#6c696d]">Starting from</p>
      <p className="mt-1 text-3xl leading-none font-semibold text-brand">
        ${destination.price}
      </p>
      <p className="mt-2 text-sm text-[#6c696d]">per person</p>

      <form onSubmit={handleBooking}>
        <input
          type="date"
          name="departureDate"
          aria-label="departureDate"
          defaultValue={destination.date}
          className="mt-4 h-11 w-full rounded-md border border-transparent bg-[#f4f4f5] px-3 text-sm text-[#0c0b0b] outline-none transition-colors focus:border-brand/40 focus:ring-2 focus:ring-brand/20"
        />

        <Button

          type="submit"
          className="mt-4 h-11 w-full gap-2 rounded-md bg-brand px-4 text-[15px] font-medium text-white hover:bg-brand/90"
        >
          Book Now
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </form>

      <ul className="mt-5 flex flex-col gap-3">
        {bookingPerks.map((perk) => (
          <li
            key={perk}
            className="flex items-start gap-2.5 text-sm leading-5 text-[#333136]"
          >
            <Check
              className="mt-0.5 size-4 shrink-0 text-[#1e9e35]"
              aria-hidden="true"
            />
            {perk}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default BookingCard;
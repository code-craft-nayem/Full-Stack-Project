"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, CircleCheck, Clock, Eye, MapPin, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "cn";
import type { Booking, BookingStatus } from "@/lib/bookings";
import { redirect } from "next/navigation";

const statusStyles: Record<
  BookingStatus,
  { label: string; badgeClassName: string; icon: typeof CircleCheck }
> = {
  confirmed: {
    label: "Confirmed",
    badgeClassName: "border-transparent bg-[#e8f7ee] text-[#15803d]",
    icon: CircleCheck,
  },
  pending: {
    label: "Pending",
    badgeClassName: "border-transparent bg-[#fdf1e0] text-[#b45309]",
    icon: Clock,
  },
};

/**
 * One row of the My Bookings list: thumbnail, status pill, trip details,
 * price and the Cancel / View actions. Distinct from BookingCard.tsx, which
 * is the booking *form* on the destination detail page.
 */
const BookingListItem = ({ booking }: { booking: Booking }) => {
  const handleCancelBooking = async () => {
    const res = await fetch(`http://localhost:8000/my-bookings/${booking.id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    console.log(data);
    redirect("/my-bookings");
  };

  const status = statusStyles[booking.status];
  const StatusIcon = status.icon;

  return (
    <Card className="gap-0 overflow-hidden rounded-xl border border-[#e8e8e8] bg-white p-0 shadow-[0_1px_3px_rgba(0,0,0,0.04)] ring-0 transition-shadow hover:shadow-[0_4px_14px_rgba(0,0,0,0.07)]">
      <div className="flex flex-col sm:flex-row">
        <div className="relative aspect-[16/9] w-full shrink-0 sm:aspect-auto sm:w-1/3 sm:min-h-[248px]">
          <Image
            src={booking.imageUrl}
            alt={booking.name}
            fill
            sizes="(min-width: 640px) 33vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge
              className={cn(
                "h-7 gap-1.5 rounded-full px-3 text-sm font-medium",
                status.badgeClassName,
              )}
            >
              <StatusIcon aria-hidden="true" />
              {status.label}
            </Badge>
            {booking.reference && (
              <span className="text-xs font-medium tracking-[0.02em] text-[#6c696d]">
                Booking #{booking.reference}
              </span>
            )}
          </div>

          <h3 className="text-xl leading-tight font-medium tracking-[-0.015em] text-[#0c0b0b] sm:text-2xl">
            {booking.name}
          </h3>

          <div className="flex flex-col gap-2 text-sm leading-6 text-[#333136]">
            <div className="flex items-center gap-2">
              <Calendar
                className="size-4 shrink-0 text-[#6c696d]"
                aria-hidden="true"
              />
              <span>
                <span className="text-[#6c696d]">Departure: </span>
                {booking.departureLabel || "Flexible"}
              </span>
            </div>
            {booking.country && (
              <div className="flex items-center gap-2">
                <MapPin
                  className="size-4 shrink-0 text-[#6c696d]"
                  aria-hidden="true"
                />
                <span>{booking.country}</span>
              </div>
            )}
          </div>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-3">
            <span className="text-[28px] leading-none font-semibold text-brand">
              ${booking.price}
            </span>

            <div className="flex items-center gap-3">
              {/* Cancel is UI-only for now — the DELETE endpoint doesn't exist yet. */}
              <Button
                onClick={handleCancelBooking}
                type="button"
                variant="outline"
                className="h-10 gap-2 rounded-lg border-destructive/40 px-4 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 aria-hidden="true" />
                Cancel
              </Button>
              <Button
                render={
                  <Link
                    href={
                      booking.destinationId
                        ? `/all-destinations/${booking.destinationId}`
                        : "/all-destinations"
                    }
                  />
                }
                className="h-10 gap-2 rounded-lg bg-brand px-5 text-white hover:bg-brand/90"
              >
                <Eye aria-hidden="true" />
                View
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BookingListItem;

"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    quote:
      '"The Bali Trip Was Absolutely Magical! Every Detail Was Perfectly Planned. The Resorts Were Luxurious And The Cultural Experiences Were Unforgettable."',
    name: "Michael Chen",
    location: "Singapore",
    image: "/images/person2.png",
  },
  {
    quote:
      '"Swiss Alps Adventure Exceeded All Expectations. The Mountain Views Were Breathtaking And Our Guide Was Incredibly Knowledgeable. Highly Recommend!"',
    name: "Sarah Johnson",
    location: "New York, USA",
    image: "/images/person1.png",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white px-6 py-16 md:py-20">
      <Carousel className="mx-auto max-w-6xl">
        {/* Header + carousel arrows */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-light text-foreground">
              What Travelers Say
            </h2>
            <p className="mt-3 text-sm text-muted-foreground md:text-[15px]">
              Real experiences from our happy travelers
            </p>
          </div>
          <div className="mt-2 flex shrink-0 gap-3">
            <CarouselPrevious className="static my-0 size-11 text-gray-400 hover:text-brand" />
            <CarouselNext className="static my-0 size-11 text-gray-400 hover:text-brand" />
          </div>
        </div>

        {/* Slides */}
        <CarouselContent className="mt-10">
          {testimonials.map((item) => (
            <CarouselItem key={item.name} className="md:basis-1/2">
              <article className="flex gap-5 border border-border bg-white p-5">
                <div className="flex flex-1 flex-col">
                  <p className="text-[17px] leading-relaxed text-foreground">
                    {item.quote}
                  </p>
                  <div className="mt-auto pt-6">
                    <p className="text-[15px]">
                      <span className="text-brand">— </span>
                      {item.name}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.location}
                    </p>
                  </div>
                </div>
                <Image
                  src={item.image}
                  alt={item.name}
                  width={160}
                  height={185}
                  className="h-44 w-32 shrink-0 object-cover md:w-40"
                />
              </article>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}

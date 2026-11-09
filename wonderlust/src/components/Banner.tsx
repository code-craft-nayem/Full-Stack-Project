import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const searchFields = [
  { label: "Location", value: "Address, City Or Zip" },
  { label: "Date/Duration", value: "Anytime/3 Days" },
  { label: "Budget", value: "$0-$3000" },
  { label: "People", value: "5-10" },
];

export default function Banner() {
  return (
    <section className="relative flex min-h-[85vh] flex-col">
      {/* Background */}
      <Image
        src="/images/Banner.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/" aria-hidden="true" />

      {/* Centered content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-16 pt-24 text-center">
        <h1 className="max-w-4xl text-[clamp(2.5rem,7vw,5.5rem)] font-light leading-[1.05] tracking-tight text-white">
          Discover Your
          <br />
          Next Adventure
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/90 md:text-lg">
          Explore breathtaking destinations and create unforgettable memories
          with our curated travel experiences.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="#"
            className="inline-flex items-center gap-3 bg-brand px-8 py-4 text-sm font-medium uppercase tracking-wider text-white transition-opacity hover:opacity-90"
          >
            Explore Now
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="#"
            className="inline-flex items-center bg-white/30 px-8 py-4 text-sm font-medium uppercase tracking-wider text-white backdrop-blur-sm transition-colors hover:bg-white/30"
          >
            View Destination
          </Link>
        </div>
      </div>

      {/* Static search strip */}
      <div className="relative z-10 grid grid-cols-2 border-t border-white/20 bg-white/30 md:grid-cols-[1fr_1fr_1fr_1fr_auto]">
        {searchFields.map((field, index) => (
          <div
            key={field.label}
            className={[
              "px-5 py-4 md:px-7",
              index % 2 === 1 ? "border-l border-white/20" : "",
              index >= 2 ? "border-t border-white/20 md:border-t-0" : "",
              index >= 1 ? "md:border-l md:border-white/20" : "md:border-l-0",
            ].join(" ")}
          >
            <p className="text-[15px] font-semibold text-white">
              {field.label}
            </p>
            <p className="mt-1 text-[13px] text-white/70">{field.value}</p>
          </div>
        ))}
        <button
          type="button"
          className="col-span-2 bg-brand px-6 py-4 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 md:col-span-1 md:px-10"
        >
          Search
        </button>
      </div>
    </section>
  );
}

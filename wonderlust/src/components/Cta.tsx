import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Cta() {
  return (
    <section className="relative flex min-h-[320px] items-center justify-center overflow-hidden md:min-h-[440px]">
      <Image
        src="/images/CTA.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <h2 className="text-[clamp(1.75rem,4vw,3.25rem)] font-light text-white">
          Ready To Start Your Journey?
        </h2>
        <p className="mt-4 max-w-2xl text-base text-white/90 md:text-lg">
          Join thousands of travelers who have discovered the world with us
        </p>
        <Link
          href="#"
          className="mt-9 inline-flex items-center gap-3 bg-white px-8 py-4 text-[13px] font-medium uppercase tracking-wider text-black transition-colors hover:bg-gray-100"
        >
          Book Your Trip Today
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

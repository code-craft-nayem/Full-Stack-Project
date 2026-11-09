import Image from "next/image";

const features = [
  {
    icon: "/images/ShieldCheck.png",
    title: "Safe & Secure",
    description:
      "Your safety is our priority with comprehensive travel insurance and 24/7 support.",
  },
  {
    icon: "/images/MapTrifold.png",
    title: "Expert Guides",
    description:
      "Local experts who bring destinations to life with authentic cultural insights.",
  },
  {
    icon: "/images/Headset.png",
    title: "24/7 Support",
    description:
      "Round-the-clock customer service to assist you wherever your journey takes you.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-[#e6f7fb] px-6 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-light text-foreground">
            Why Choose Wanderlust
          </h2>
          <p className="mt-3 text-sm text-muted-foreground md:text-[15px]">
            Your trusted partner for exceptional travel experiences
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:mt-12 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="bg-white p-8">
              <Image
                src={feature.icon}
                alt=""
                width={48}
                height={48}
                className="h-10 w-10"
              />
              <h3 className="mt-6 text-xl font-normal text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

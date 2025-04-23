import { ProcessStep } from "@/components/process-step";
import Image from "next/image";

const steps = [
  {
    number: "/assets/01.png",
    title: "Registration",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse hendrerit a ex eget accumsan. Aliquam ullamcorper porttitor odio, non bibendum lorem consequat in.",
    icon: "/assets/work1.png",
    color: "#d0e8ff",
  },
  {
    number: "/assets/02.png",
    title: "Registration",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse hendrerit a ex eget accumsan. Aliquam ullamcorper porttitor odio, non bibendum lorem consequat in.",
    icon: "/assets/work2.png",
    color: "#e2ffe7",
  },
  {
    number: "/assets/03.png",
    title: "Registration",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse hendrerit a ex eget accumsan. Aliquam ullamcorper porttitor odio, non bibendum lorem consequat in.",
    icon: "/assets/work3.png",
    color: "#ffe1db",
  },
  {
    number: "/assets/04.png",
    title: "Registration",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse hendrerit a ex eget accumsan. Aliquam ullamcorper porttitor odio, non bibendum lorem consequat in.",
    icon: "/assets/work4.png",
    color: "#fff9dd",
  },
];

export function HowItWorksSection() {
  return (
    <section className="mt-24">
      <div className="relative mx-auto">
        {/* Title */}
        <h1 className="text-5xl font-semibold text-center mb-10">
          How does it work?
        </h1>

        {/* Background Line */}
        <div className="absolute top-[40%] z-0 pointer-events-none w-full">
          <Image
            src="/assets/work-liner.png"
            alt="work liner"
            width={1440}
            height={210}
            className="w-full"
          />
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 relative z-10 container">
          {steps.map((step, index) => (
            <ProcessStep
              key={index}
              number={step.number}
              title={step.title}
              icon={step.icon}
              description={step.description}
              color={step.color}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

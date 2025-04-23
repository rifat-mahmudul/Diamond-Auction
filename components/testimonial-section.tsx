import Image from "next/image";
import { MoveLeft, MoveRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TestimonialSection() {
  return (
    <section className="container mt-24">
      <div className="grid gap-8 grid-cols-1 md:grid-cols-6">
        <div className="col-span-2">
          <h2 className="mb-4 text-5xl font-bold tracking-tight">
            What does our client say?
          </h2>
        </div>

        <div className="col-span-4">
          <div className="relative mb-5 pl-6">
            <Quote className="absolute left-0 top-0 h-5 w-5 text-[#8a7357]" />
            <p className="text-lg italic text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse varius enim in eros elementum tristique. Duis cursus,
              mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam
              libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum
              lorem imperdiet. Nunc ut sem vitae risus tristique posuere.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 overflow-hidden rounded-full">
              <Image
                src="/assets/hero.png"
                alt="Courtney Henry"
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-medium">Courtney Henry</h4>
              <p className="text-sm text-muted-foreground">CEO at Company</p>
            </div>

            <div className="ml-auto flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-[48px] w-[80px] rounded-sm border-[#645949]"
              >
                <MoveLeft className="h-4 w-4 -rotate-45" />
                <span className="sr-only">Previous</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-[48px] w-[80px] rounded-sm border-[#645949]"
              >
                <MoveRight className="h-4 w-4 -rotate-45" />
                <span className="sr-only">Next</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

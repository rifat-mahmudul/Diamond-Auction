import Image from "next/image"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"

export function TestimonialSection() {
  return (
    <section className="container py-12 md:py-16">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-2xl font-bold tracking-tight md:text-3xl">What does our client say?</h2>
          <div className="relative mb-8 pl-6">
            <Quote className="absolute left-0 top-0 h-5 w-5 text-[#8a7357]" />
            <p className="text-lg italic text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum
              tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae
              erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique
              posuere.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 overflow-hidden rounded-full">
              <Image
                src="/placeholder.svg?height=48&width=48"
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
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-[#8a7357]">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous</span>
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-[#8a7357]">
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-[#e8e1d5] p-6 md:p-8">
          <h2 className="mb-4 text-2xl font-bold tracking-tight md:text-3xl">Get in touch with us</h2>
          <p className="mb-6 text-muted-foreground">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum
            tristique. Duis cursus, mi quis viverra ornare.
          </p>
          <Button className="w-full bg-[#8a7357] hover:bg-[#6d5a44] text-white">Get Started</Button>
        </div>
      </div>
    </section>
  )
}

import { Button } from "@/components/ui/button"

export function ContactSection() {
  return (
    <section className="bg-[#e8e1d5] py-12 md:py-16">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-2xl font-bold tracking-tight md:text-3xl">Get in touch with us</h2>
          <p className="mb-6 text-muted-foreground">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum
            tristique. Duis cursus, mi quis viverra ornare.
          </p>
          <Button className="bg-[#8a7357] hover:bg-[#6d5a44] text-white">Contact Us</Button>
        </div>
      </div>
    </section>
  )
}

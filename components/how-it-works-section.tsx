import { ClipboardCheck, Package, CreditCard, UserCheck } from "lucide-react"
import { SectionHeader } from "@/components/section-header"
import { ProcessStep } from "@/components/process-step"

const steps = [
  {
    number: "01",
    title: "Registration",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
    icon: <UserCheck className="h-8 w-8 text-white" />,
    color: "bg-blue-500",
  },
  {
    number: "02",
    title: "Select Product",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
    icon: <Package className="h-8 w-8 text-white" />,
    color: "bg-green-500",
  },
  {
    number: "03",
    title: "Go to Bidding",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
    icon: <ClipboardCheck className="h-8 w-8 text-white" />,
    color: "bg-pink-500",
  },
  {
    number: "04",
    title: "Make Payment",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
    icon: <CreditCard className="h-8 w-8 text-white" />,
    color: "bg-yellow-500",
  },
]

export function HowItWorksSection() {
  return (
    <section className="container py-12 md:py-16">
      <SectionHeader title="How does it work?" />

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
        {steps.map((step, index) => (
          <ProcessStep
            key={index}
            number={step.number}
            title={step.title}
            description={step.description}
            icon={step.icon}
            color={step.color}
          />
        ))}
      </div>
    </section>
  )
}

import type { ReactNode } from "react"

interface ProcessStepProps {
  number: string
  title: string
  description: string
  icon: ReactNode
  color: string
}

export function ProcessStep({ number, title, description, icon, color }: ProcessStepProps) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className={`flex h-16 w-16 items-center justify-center rounded-full ${color}`}>{icon}</div>
      <div className="relative">
        <div className="absolute -left-3 -top-6 text-4xl font-bold opacity-20">{number}</div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

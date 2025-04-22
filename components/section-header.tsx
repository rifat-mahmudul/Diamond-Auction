"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface SectionHeaderProps {
  title: string
  description?: string
  showControls?: boolean
  onPrev?: () => void
  onNext?: () => void
}

export function SectionHeader({ title, description, showControls = false, onPrev, onNext }: SectionHeaderProps) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>

      {showControls && (
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={onPrev} className="h-8 w-8 rounded-full border-[#8a7357]">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous</span>
          </Button>
          <Button variant="outline" size="icon" onClick={onNext} className="h-8 w-8 rounded-full border-[#8a7357]">
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next</span>
          </Button>
        </div>
      )}
    </div>
  )
}

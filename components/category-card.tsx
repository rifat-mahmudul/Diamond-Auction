import Image from "next/image"
import Link from "next/link"

interface CategoryCardProps {
  icon: string
  title: string
  href: string
}

export function CategoryCard({ icon, title, href }: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center gap-3 rounded-lg bg-[#e8e1d5] p-4 text-center transition-all hover:bg-[#d9d0c0]"
    >
      <div className="relative h-12 w-12">
        <Image
          src={icon || "/placeholder.svg"}
          alt={title}
          width={48}
          height={48}
          className="h-full w-full object-contain"
        />
      </div>
      <span className="text-sm font-medium">{title}</span>
    </Link>
  )
}

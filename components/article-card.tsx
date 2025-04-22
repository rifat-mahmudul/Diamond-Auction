import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ArticleCardProps {
  image: string
  title: string
  description: string
  href: string
}

export function ArticleCard({ image, title, description, href }: ArticleCardProps) {
  return (
    <Card className="overflow-hidden border-none bg-[#f5f0e8]">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          width={400}
          height={225}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="mb-2 font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button variant="outline" size="sm" asChild className="border-[#8a7357] text-[#8a7357]">
          <Link href={href}>Read more</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

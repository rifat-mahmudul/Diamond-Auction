import { Button } from "@/components/ui/button"
import { SectionHeader } from "@/components/section-header"
import { ArticleCard } from "@/components/article-card"

const articles = [
  {
    id: 1,
    image: "/placeholder.svg?height=225&width=400",
    title: "Lorem ipsum dolor sit amet",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
    href: "/blog/article-1",
  },
  {
    id: 2,
    image: "/placeholder.svg?height=225&width=400",
    title: "Lorem ipsum dolor sit amet",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
    href: "/blog/article-2",
  },
  {
    id: 3,
    image: "/placeholder.svg?height=225&width=400",
    title: "Lorem ipsum dolor sit amet",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
    href: "/blog/article-3",
  },
]

export function ArticlesSection() {
  return (
    <section className="container py-12 md:py-16">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <SectionHeader title="Exploring Our Article" />
        <Button variant="outline" className="border-[#8a7357] text-[#8a7357]">
          Explore All
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            image={article.image}
            title={article.title}
            description={article.description}
            href={article.href}
          />
        ))}
      </div>
    </section>
  )
}

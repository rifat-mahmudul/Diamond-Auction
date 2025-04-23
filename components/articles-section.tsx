import { Button } from "@/components/ui/button";
import { ArticleCard } from "@/components/article-card";
import { MoveRight } from "lucide-react";

const articles = [
  {
    id: 1,
    image: "/assets/manCard.png",
    title: "Lorem ipsum dolor sit amet",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
    href: "/blog/article-1",
  },
  {
    id: 2,
    image: "/assets/manCard.png",
    title: "Lorem ipsum dolor sit amet",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
    href: "/blog/article-2",
  },
  {
    id: 3,
    image: "/assets/manCard.png",
    title: "Lorem ipsum dolor sit amet",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
    href: "/blog/article-3",
  },
];

export function ArticlesSection() {
  return (
    <section className="container mt-24">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-7 items-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-5xl mt-2 col-span-3">
            Exploring Our Article
          </h1>
          <p className=" col-span-3">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            hendrerit a ex eget accumsan. Aliquam ullamcorper porttitor odio.
          </p>

          <div className="col-span-1 text-end">
            <Button
              className="bg-[#645949]"
            >
              Explore All <MoveRight />
            </Button>
          </div>
        </div>
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
  );
}

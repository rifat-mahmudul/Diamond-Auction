import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";

interface ArticleCardProps {
  image: string;
  title: string;
  description: string;
  href: string;
}

export function ArticleCard({
  image,
  title,
  description,
}: ArticleCardProps) {
  return (
    <Card className="overflow-hidden border-none text-white p-0 bg-[#645949]">
      <div className="relative aspect-video overflow-hidden">
        <div className=" absolute left-2 top-2 bg-[#645949] px-4 rounded-md">
          12 Dec 2025
        </div>

        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          width={400}
          height={225}
          className="h-full w-full object-cover transition-transform"
        />
      </div>

      <CardContent className="p-4">
        <h3 className="mb-2 font-medium text-xl">{title}</h3>
        <p className="text-sm text-gray-200">{description}</p>
      </CardContent>

      <Button className="-mt-5">
        Read more <MoveRight />
      </Button>
    </Card>
  );
}

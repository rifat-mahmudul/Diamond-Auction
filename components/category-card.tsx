import Image from "next/image";
import Link from "next/link";

interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
}
interface CategoryCardProps {
  category: Category;
  onDelete: (id: string) => Promise<void>;
  onUpdate?: () => void;
  icon: string;
  title: string;
  href: string;
}

export function CategoryCard({ icon, title, href }: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center gap-3 bg-[#645949] p-4 text-center transition-all hover:bg-[#645949]/90 h-[106px] w-[170px] relative mt-10"
    >
      {icon && (
        <div className=" absolute w-[80%] -top-10 rounded-md">
          <Image
            src={icon}
            alt={title}
            width={80}
            height={130}
            className="w-full rounded-md"
          />
        </div>
      )}

      <div className="mt-10">
        <h1 className="text-[16px] font-medium  text-white">{title}</h1>

        <h1 className="text-[16px] font-medium text-white">6 Items</h1>
      </div>
    </Link>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';

type CategoryCardProps = {
  category: {
    id: string;
    name: string;
    slug: string;
    imageUrl?: string;
  };
};

export default function CategoryCard({ category }: CategoryCardProps) {
  const imageUrl = category.imageUrl || `https://picsum.photos/seed/${category.name}/200/200`;

  return (
    <Link
      href={`/category/${category.slug}`}
      className="group block"
    >
      <div className="bg-dark-700 rounded-lg p-2 text-center shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-primary-200/20">
        <div className="relative w-full aspect-square mb-2 rounded-lg overflow-hidden bg-primary-100/10 mx-auto">
          <Image
            src={imageUrl}
            alt={category.name}
            fill
            sizes="(max-width: 768px) 33vw, 16vw"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <h3 className="text-xs md:text-sm font-medium text-primary-100 group-hover:text-primary-400 transition-colors truncate">
          {category.name}
        </h3>
      </div>
    </Link>
  );
}

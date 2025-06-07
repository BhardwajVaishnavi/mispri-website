import Link from 'next/link';

interface MobileCategorySectionProps {
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    imageUrl?: string;
    description?: string;
    isActive?: boolean;
  }>;
}

export default function MobileCategorySection({ categories }: MobileCategorySectionProps) {
  return (
    <>
      {/* Mobile Shop By Category - Dynamic Categories */}
      <section className="sm:hidden py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Shop By Category</h2>
            <Link href="/products" className="text-[#0D9488] text-sm">View All</Link>
          </div>
          {categories.length > 0 ? (
            <div className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar">
              {categories.slice(0, 6).map((category) => {
                return (
                  <div key={category.id} className="flex-shrink-0 w-20">
                    <Link href={`/category/${category.slug}`} className="block text-center">
                      <div className="w-20 h-20 rounded-full overflow-hidden mb-2 border border-gray-200 bg-gray-100">
                        <img
                          src={category.imageUrl || `/categories/${category.name.toLowerCase()}.svg`}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs text-center block leading-tight">{category.name}</span>
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-2">📂</div>
              <p className="text-gray-500 text-sm">No categories available</p>
            </div>
          )}
        </div>
      </section>

      {/* Mobile Shop By More Categories */}
      <section className="sm:hidden py-6 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold">More Categories</h2>
            <p className="text-gray-600 text-sm mt-1">Explore Our Full Collection</p>
          </div>

          {categories.length > 4 ? (
            <div className="grid grid-cols-2 gap-4">
              {categories.slice(4, 8).map((category) => {
                return (
                  <Link key={category.id} href={`/category/${category.slug}`} className="block">
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                      <div className="aspect-square">
                        <img
                          src={category.imageUrl || `/categories/${category.name.toLowerCase()}.svg`}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3 text-center">
                        <h3 className="font-medium text-sm">{category.name}</h3>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-2">🎁</div>
              <p className="text-gray-500 text-sm">More categories coming soon</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

import Link from 'next/link';

// Sitemap data structure
const sitemapData = [
  {
    title: 'Main Pages',
    links: [
      { name: 'Home', url: '/' },
      { name: 'About Us', url: '/about-us' },
      { name: 'Contact Us', url: '/contact-us' },
      { name: 'FAQ', url: '/faq' },
      { name: 'Blog', url: '/blog' },
    ]
  },
  {
    title: 'Shop',
    links: [
      { name: 'All Products', url: '/products' },
      { name: 'Cakes', url: '/category/cakes' },
      { name: 'Flowers', url: '/category/flowers' },
      { name: 'Gifts', url: '/category/gifts' },
      { name: 'Combos', url: '/category/combos' },
      { name: 'Plants', url: '/category/plants' },
      { name: 'Personalised Gifts', url: '/category/personalised' },
    ]
  },
  {
    title: 'Occasions',
    links: [
      { name: 'Birthday', url: '/occasion/birthday' },
      { name: 'Anniversary', url: '/occasion/anniversary' },
      { name: 'Wedding', url: '/occasion/wedding' },
      { name: 'Congratulations', url: '/occasion/congratulations' },
      { name: 'Get Well Soon', url: '/occasion/get-well-soon' },
      { name: 'Thank You', url: '/occasion/thank-you' },
      { name: 'Sympathy', url: '/occasion/sympathy' },
    ]
  },
  {
    title: 'Customer Service',
    links: [
      { name: 'My Account', url: '/account' },
      { name: 'Track Order', url: '/track-order' },
      { name: 'Wishlist', url: '/wishlist' },
      { name: 'Cart', url: '/cart' },
      { name: 'Checkout', url: '/checkout' },
    ]
  },
  {
    title: 'Information',
    links: [
      { name: 'Terms and Conditions', url: '/terms-conditions' },
      { name: 'Privacy Policy', url: '/privacy-policy' },
      { name: 'Cancellation & Refund', url: '/cancellation-refund' },
      { name: 'Shipping Policy', url: '/shipping-policy' },
      { name: 'Coupons & Deals', url: '/coupons-deals' },
    ]
  },
  {
    title: 'Corporate',
    links: [
      { name: 'Corporate Gifts', url: '/corporate-gifts' },
      { name: 'Bulk Orders', url: '/bulk-orders' },
      { name: 'Quotes', url: '/quotes' },
      { name: 'Media', url: '/media' },
      { name: 'Reviews', url: '/reviews' },
    ]
  },
];

export default function SitemapPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Sitemap</h1>
        
        <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Find all the pages on our website organized in a structured way. Use this sitemap to navigate through our site easily.
        </p>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sitemapData.map((section, index) => (
              <div key={index}>
                <h2 className="text-xl font-semibold mb-4 text-primary-600">{section.title}</h2>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link 
                        href={link.url} 
                        className="text-gray-700 hover:text-primary-600 hover:underline"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        {/* Special Categories */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">Product Categories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h3 className="font-medium mb-3 text-primary-600">Cakes</h3>
              <ul className="space-y-2">
                <li><Link href="/category/cakes/birthday-cakes" className="text-gray-700 hover:text-primary-600 hover:underline">Birthday Cakes</Link></li>
                <li><Link href="/category/cakes/anniversary-cakes" className="text-gray-700 hover:text-primary-600 hover:underline">Anniversary Cakes</Link></li>
                <li><Link href="/category/cakes/photo-cakes" className="text-gray-700 hover:text-primary-600 hover:underline">Photo Cakes</Link></li>
                <li><Link href="/category/cakes/designer-cakes" className="text-gray-700 hover:text-primary-600 hover:underline">Designer Cakes</Link></li>
                <li><Link href="/category/cakes/eggless-cakes" className="text-gray-700 hover:text-primary-600 hover:underline">Eggless Cakes</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-3 text-primary-600">Flowers</h3>
              <ul className="space-y-2">
                <li><Link href="/category/flowers/roses" className="text-gray-700 hover:text-primary-600 hover:underline">Roses</Link></li>
                <li><Link href="/category/flowers/lilies" className="text-gray-700 hover:text-primary-600 hover:underline">Lilies</Link></li>
                <li><Link href="/category/flowers/orchids" className="text-gray-700 hover:text-primary-600 hover:underline">Orchids</Link></li>
                <li><Link href="/category/flowers/bouquets" className="text-gray-700 hover:text-primary-600 hover:underline">Bouquets</Link></li>
                <li><Link href="/category/flowers/arrangements" className="text-gray-700 hover:text-primary-600 hover:underline">Arrangements</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-3 text-primary-600">Gifts</h3>
              <ul className="space-y-2">
                <li><Link href="/category/gifts/chocolates" className="text-gray-700 hover:text-primary-600 hover:underline">Chocolates</Link></li>
                <li><Link href="/category/gifts/teddy-bears" className="text-gray-700 hover:text-primary-600 hover:underline">Teddy Bears</Link></li>
                <li><Link href="/category/gifts/gift-baskets" className="text-gray-700 hover:text-primary-600 hover:underline">Gift Baskets</Link></li>
                <li><Link href="/category/gifts/personalized" className="text-gray-700 hover:text-primary-600 hover:underline">Personalized Gifts</Link></li>
                <li><Link href="/category/gifts/home-decor" className="text-gray-700 hover:text-primary-600 hover:underline">Home Decor</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-3 text-primary-600">Plants</h3>
              <ul className="space-y-2">
                <li><Link href="/category/plants/indoor-plants" className="text-gray-700 hover:text-primary-600 hover:underline">Indoor Plants</Link></li>
                <li><Link href="/category/plants/outdoor-plants" className="text-gray-700 hover:text-primary-600 hover:underline">Outdoor Plants</Link></li>
                <li><Link href="/category/plants/succulents" className="text-gray-700 hover:text-primary-600 hover:underline">Succulents</Link></li>
                <li><Link href="/category/plants/bonsai" className="text-gray-700 hover:text-primary-600 hover:underline">Bonsai</Link></li>
                <li><Link href="/category/plants/flowering-plants" className="text-gray-700 hover:text-primary-600 hover:underline">Flowering Plants</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Search Box */}
        <div className="mt-12 bg-primary-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Can't Find What You're Looking For?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Use our search feature to find exactly what you need.
          </p>
          <form className="max-w-md mx-auto">
            <div className="flex">
              <input
                type="text"
                placeholder="Search our website..."
                className="flex-grow border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-2 rounded-r-md transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

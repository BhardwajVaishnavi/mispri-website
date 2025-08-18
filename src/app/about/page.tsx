import Image from 'next/image';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import Link from 'next/link';

export const metadata = {
  title: 'About Us - Bakery Shop',
  description: 'Learn more about Bakery Shop and our story',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">About Us</h1>

      {/* Hero Section */}
      <div className="relative h-96 rounded-lg overflow-hidden mb-12">
        <Image
          src="https://picsum.photos/seed/bakeryshop/1200/600"
          alt="Bakery Shop"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h2 className="text-4xl font-bold mb-4">Our Story</h2>
            <p className="text-xl max-w-2xl">
              Crafting moments of joy through delicious treats and beautiful gifts since 2010.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="mb-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center">How It All Began</h2>
          <p className="text-gray-600 mb-4">
            Bakery Shop was founded in 2010 by a passionate baker with a dream to create not just delicious treats, but memorable experiences. What started as a small bakery in Mumbai has now grown into a beloved brand offering a wide range of products including cakes, flowers, and gifts.
          </p>
          <p className="text-gray-600 mb-4">
            Our journey began with a simple philosophy: use only the finest ingredients, craft each product with care, and deliver happiness to our customers. This philosophy continues to guide us as we grow and expand our offerings.
          </p>
          <p className="text-gray-600">
            Over the years, we've had the privilege of being part of countless celebrations - from birthdays and anniversaries to weddings and corporate events. Each occasion has strengthened our commitment to excellence and innovation.
          </p>
        </div>
      </div>

      {/* Our Mission & Values */}
      <div className="bg-gray-50 py-16 px-4 rounded-lg mb-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center">Our Mission & Values</h2>
          
          <div className="mb-8">
            <h3 className="text-xl font-medium mb-3">Our Mission</h3>
            <p className="text-gray-600">
              To create moments of joy and connection through thoughtfully crafted products that celebrate life's special occasions and everyday moments.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-3 text-primary-600">Quality</h3>
              <p className="text-gray-600">
                We use only premium ingredients and materials in all our products, ensuring that every item meets our high standards of excellence.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-3 text-primary-600">Creativity</h3>
              <p className="text-gray-600">
                We embrace innovation and artistic expression, constantly exploring new designs, flavors, and gift ideas to delight our customers.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-3 text-primary-600">Customer Focus</h3>
              <p className="text-gray-600">
                We put our customers at the heart of everything we do, striving to exceed expectations and create memorable experiences.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-3 text-primary-600">Sustainability</h3>
              <p className="text-gray-600">
                We are committed to responsible practices, from sourcing ingredients to packaging, minimizing our environmental impact.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Team */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-8 text-center">Meet Our Team</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[
            {
              name: 'Priya Sharma',
              role: 'Founder & Head Baker',
              image: 'https://picsum.photos/seed/team1/300/300',
            },
            {
              name: 'Rahul Patel',
              role: 'Executive Chef',
              image: 'https://picsum.photos/seed/team2/300/300',
            },
            {
              name: 'Ananya Gupta',
              role: 'Floral Designer',
              image: 'https://picsum.photos/seed/team3/300/300',
            },
            {
              name: 'Vikram Singh',
              role: 'Operations Manager',
              image: 'https://picsum.photos/seed/team4/300/300',
            },
          ].map((member, index) => (
            <div key={index} className="text-center">
              <div className="relative h-64 rounded-lg overflow-hidden mb-4">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-lg font-medium">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="mb-16">
        <TestimonialsCarousel limit={6} />
      </div>

      {/* CTA */}
      <div className="text-center mb-16">
        <h2 className="text-2xl font-semibold mb-4">Ready to Experience Our Products?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Browse our collection of cakes, flowers, and gifts for all occasions. We deliver joy to your doorstep!
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/products"
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-md transition-colors"
          >
            Shop Now
          </Link>
          <Link
            href="/contact"
            className="bg-white hover:bg-gray-100 text-primary-600 font-semibold py-3 px-6 border border-primary-600 rounded-md transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}

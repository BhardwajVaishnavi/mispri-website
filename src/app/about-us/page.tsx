import Image from 'next/image';

export default function AboutUsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">About Mispri</h1>
        
        <div className="mb-12 relative h-80 rounded-lg overflow-hidden shadow-md">
          <Image 
            src="/images/about/about-banner.jpg" 
            alt="Mispri Team" 
            fill
            className="object-cover"
          />
        </div>
        
        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="mb-6">
            Founded in 2018, Mispri began as a small bakery in Bhubaneswar with a simple mission: to spread joy through delicious cakes and beautiful flowers. What started as a passion project quickly blossomed into one of the region's most beloved gift and bakery brands.
          </p>
          
          <p className="mb-6">
            Our journey has been guided by our commitment to quality, creativity, and customer satisfaction. We believe that every celebration deserves something special, and we take pride in being part of our customers' most cherished moments.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
              <p>
                To create memorable experiences through exceptional products and service, making every celebration special and meaningful.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Our Vision</h3>
              <p>
                To be the most trusted and loved gifting brand, known for quality, innovation, and customer delight.
              </p>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold mb-4">What Sets Us Apart</h2>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Premium quality ingredients sourced from trusted suppliers</li>
            <li>Handcrafted products made with attention to detail</li>
            <li>Innovative designs that stay ahead of trends</li>
            <li>Personalized service that caters to your unique needs</li>
            <li>Reliable delivery across Bhubaneswar</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
          <p className="mb-6">
            Behind every Mispri creation is a team of passionate individuals who bring their expertise and creativity to the table. From our skilled bakers and florists to our dedicated delivery personnel, each member plays a crucial role in delivering the Mispri experience.
          </p>
          
          <div className="my-12">
            <h2 className="text-2xl font-semibold mb-6">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-primary-50 p-5 rounded-lg border border-primary-100">
                <h3 className="text-lg font-semibold mb-2 text-primary-700">Quality</h3>
                <p className="text-gray-700">We never compromise on the quality of our ingredients or products.</p>
              </div>
              <div className="bg-primary-50 p-5 rounded-lg border border-primary-100">
                <h3 className="text-lg font-semibold mb-2 text-primary-700">Creativity</h3>
                <p className="text-gray-700">We constantly innovate to create unique and memorable experiences.</p>
              </div>
              <div className="bg-primary-50 p-5 rounded-lg border border-primary-100">
                <h3 className="text-lg font-semibold mb-2 text-primary-700">Customer Focus</h3>
                <p className="text-gray-700">We put our customers at the heart of everything we do.</p>
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold mb-4">Join Our Journey</h2>
          <p className="mb-6">
            As we continue to grow, we remain committed to our core values and to bringing joy to our customers. We invite you to be a part of our journey and experience the Mispri difference.
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm my-8">
            <h3 className="text-xl font-semibold mb-3">Contact Us</h3>
            <p className="mb-4">
              Have questions or feedback? We'd love to hear from you!
            </p>
            <a 
              href="/contact-us" 
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

import Image from 'next/image';
import Link from 'next/link';

// Corporate gift categories
const giftCategories = [
  {
    id: 1,
    title: 'Festival Gifts',
    description: 'Celebrate festivals with our specially curated gift hampers for Diwali, Christmas, New Year, and more.',
    image: '/images/corporate/festival_gifts.jpg',
    link: '/corporate-gifts/festival'
  },
  {
    id: 2,
    title: 'Employee Recognition',
    description: 'Appreciate your employees with thoughtful gifts that show your recognition for their hard work and dedication.',
    image: '/images/corporate/employee_gifts.jpg',
    link: '/corporate-gifts/employee'
  },
  {
    id: 3,
    title: 'Client Appreciation',
    description: 'Strengthen your business relationships with premium gift hampers that leave a lasting impression on your clients.',
    image: '/images/corporate/client_gifts.jpg',
    link: '/corporate-gifts/client'
  },
  {
    id: 4,
    title: 'Branded Merchandise',
    description: 'Customize gifts with your company logo and colors to enhance brand visibility and create a professional image.',
    image: '/images/corporate/branded_gifts.jpg',
    link: '/corporate-gifts/branded'
  },
  {
    id: 5,
    title: 'Event Gifts',
    description: 'Make your corporate events memorable with customized gifts for conferences, seminars, and team-building activities.',
    image: '/images/corporate/event_gifts.jpg',
    link: '/corporate-gifts/event'
  },
  {
    id: 6,
    title: 'Wellness Hampers',
    description: 'Promote employee wellness with health-focused gift hampers that show you care about their well-being.',
    image: '/images/corporate/wellness_gifts.jpg',
    link: '/corporate-gifts/wellness'
  }
];

// Benefits of corporate gifting
const benefits = [
  {
    id: 1,
    title: 'Strengthen Relationships',
    description: 'Build stronger connections with clients, partners, and employees through thoughtful gifting.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  },
  {
    id: 2,
    title: 'Enhance Brand Image',
    description: 'Reinforce your brand identity and values through carefully selected corporate gifts.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  {
    id: 3,
    title: 'Boost Employee Morale',
    description: 'Increase motivation and job satisfaction by recognizing and appreciating your employees.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    id: 4,
    title: 'Stand Out from Competition',
    description: 'Differentiate your business with unique and memorable corporate gifts that leave a lasting impression.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  }
];

// Process steps
const processSteps = [
  {
    number: '01',
    title: 'Consultation',
    description: 'We discuss your requirements, budget, and preferences to understand your gifting needs.'
  },
  {
    number: '02',
    title: 'Proposal',
    description: 'Our team creates a customized proposal with gift options that align with your objectives.'
  },
  {
    number: '03',
    title: 'Customization',
    description: 'We personalize the selected gifts with your branding elements and packaging requirements.'
  },
  {
    number: '04',
    title: 'Delivery',
    description: 'We handle the logistics of delivering the gifts to your specified locations on time.'
  }
];

export default function CorporateGiftsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-16">
          <div className="md:flex">
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Corporate Gifting Solutions</h1>
              <p className="text-gray-600 mb-6">
                Elevate your corporate gifting experience with our premium, customizable gift solutions for every occasion. From employee appreciation to client relationships, we help you make a lasting impression.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/quotes"
                  className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-md transition-colors text-center"
                >
                  Request a Quote
                </Link>
                <Link
                  href="/contact-us"
                  className="bg-white border border-primary-600 text-primary-600 hover:bg-primary-50 font-medium py-2 px-6 rounded-md transition-colors text-center"
                >
                  Contact Us
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 relative h-64 md:h-auto">
              <Image
                src="/images/corporate/corporate_hero.jpg"
                alt="Corporate Gifting"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
        
        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Why Choose Corporate Gifting?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.id} className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="flex justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Gift Categories */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Our Corporate Gift Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {giftCategories.map((category) => (
              <div key={category.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <Link
                    href={category.link}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Explore Options →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Process Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Our Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step) => (
              <div key={step.number} className="relative">
                <div className="bg-primary-50 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                  <span className="text-primary-600 text-2xl font-bold">{step.number}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">{step.title}</h3>
                <p className="text-gray-600 text-center">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">What Our Clients Say</h2>
          <div className="bg-primary-50 rounded-lg p-8">
            <div className="max-w-3xl mx-auto text-center">
              <svg className="w-12 h-12 text-primary-300 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-lg text-gray-700 italic mb-6">
                "Mispri has been our trusted partner for corporate gifting for the past three years. Their attention to detail, quality of products, and timely delivery have consistently exceeded our expectations. The personalized touch they add to each gift has helped us strengthen our relationships with clients and boost employee morale."
              </p>
              <div>
                <p className="font-medium">Rajesh Kumar</p>
                <p className="text-sm text-gray-600">HR Director, Tech Solutions Ltd</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-primary-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Elevate Your Corporate Gifting?</h2>
          <p className="mb-8 max-w-2xl mx-auto">
            Contact our corporate gifting specialists today to discuss your requirements and receive a customized proposal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/quotes"
              className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-md transition-colors"
            >
              Request a Quote
            </Link>
            <Link
              href="/contact-us"
              className="bg-primary-700 hover:bg-primary-800 text-white font-medium py-3 px-8 rounded-md transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

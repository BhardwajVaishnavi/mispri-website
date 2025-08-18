import React from 'react';
import Image from 'next/image';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-dark-800">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1989&q=80"
          alt="About Mispri Foods - Beautiful bakery with fresh cakes and pastries"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-dark-800/60 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-100 mb-4">About Mispri Foods</h1>
            <p className="text-lg md:text-xl text-primary-200 max-w-2xl mx-auto px-4">
              Creating moments of joy with delightful cakes and unforgettable experiences
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
        

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold mb-4 text-primary-100">About Us</h2>
            <p className="mb-6 text-primary-200">
              Mispri Foods provide good food quality. Our Online businesses are booming in Odisha day by day. In the visibly customer-centric Bhubaneswar Odisha, Mispri Foods is creating the moments of your life unique and unforgettable with delightful cakes.
            </p>

            <p className="mb-6 text-primary-200">
              Life gives you many reasons to celebrate, sometimes, in the form of festivals or occasions that unites all to enjoy the spirit of the day together.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
              <div className="bg-dark-700 p-6 rounded-lg shadow-sm border border-primary-200/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
                  <Image
                    src="https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                    alt="Mission"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-primary-100">Our Mission</h3>
                <p className="text-primary-300">
                  To create memorable experiences through exceptional products and service, making every celebration special and meaningful.
                </p>
              </div>
              <div className="bg-dark-700 p-6 rounded-lg shadow-sm border border-primary-200/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
                  <Image
                    src="https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                    alt="Vision"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-primary-100">Our Vision</h3>
                <p className="text-primary-300">
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
    </div>
  );
}

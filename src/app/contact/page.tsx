import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';

// Metadata is moved to layout.tsx since this is a client component
// title: 'Contact Us - Bakery Shop',
// description: 'Get in touch with Bakery Shop'

export default function ContactPage() {

  return (
    <div className="min-h-screen bg-dark-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-primary-100">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-xl font-semibold mb-6 text-primary-100">Get in Touch</h2>
          <p className="text-primary-200 mb-8">
            Have questions about our products or services? We're here to help! Fill out the form and we'll get back to you as soon as possible.
          </p>

          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <FiMapPin className="h-6 w-6 text-primary-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-primary-100">Our Location</h3>
                <p className="text-primary-200">
                  Mangalpur, Pipili, Puri, Odisha
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <FiPhone className="h-6 w-6 text-primary-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-primary-100">Phone Number</h3>
                <p className="text-primary-200">+91-9938938780</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <FiMail className="h-6 w-6 text-primary-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-primary-100">Email Address</h3>
                <p className="text-primary-200">contactus@mispri.in</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <FiClock className="h-6 w-6 text-primary-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-primary-100">Business Hours</h3>
                <p className="text-primary-200">Monday - Sunday: 9:30 AM - 9:30 PM</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-dark-700 rounded-lg shadow-md p-6 border border-primary-200/20">
              <form action="https://formsubmit.co/contactus@mispri.in" method="POST" className="space-y-4">
                {/* Hidden fields for FormSubmit */}
                <input type="hidden" name="_subject" value="New Contact Form Submission from Mispri Website" />
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_template" value="table" />

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-primary-100 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full border border-primary-200/30 rounded-md px-3 py-2 bg-white text-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-400"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-primary-100 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full border border-primary-200/30 rounded-md px-3 py-2 bg-white text-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-400"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-primary-100 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full border border-primary-200/30 rounded-md px-3 py-2 bg-white text-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-400"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-primary-100 mb-1">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full border border-primary-200/30 rounded-md px-3 py-2 bg-white text-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-400"
                  >
                    <option value="">Select a subject</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Product Information">Product Information</option>
                    <option value="Order Status">Order Status</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-primary-100 mb-1">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="w-full border border-primary-200/30 rounded-md px-3 py-2 bg-white text-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-400"
                    required
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-md transition-colors"
                  >
                    Send Message
                  </button>
                </div>
              </form>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-6 text-center text-primary-100">Find Us on the Map</h2>
        <div className="h-96 bg-dark-700 border border-primary-200/20 rounded-lg overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3742.1234567890123!2d85.8245!3d20.2961!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1909d2d5170aa5%3A0xfc580e2b68b33fa8!2sMangalpur%2C%20Pipili%2C%20Puri%2C%20Odisha%2C%20India!5e0!3m2!1sen!2sin!4v1623825289123!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mispri Foods Location"
          ></iframe>
        </div>
      </div>
      </div>
    </div>
  );
}

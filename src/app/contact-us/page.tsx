'use client';

import { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      } else {
        const error = await response.json();
        setSubmitError(`Failed to send message: ${error.error || 'Please try again.'}`);
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitError('An error occurred while submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Contact Us</h1>
        
        <p className="text-center text-gray-600 mb-12">
          We'd love to hear from you! Please fill out the form below or use our contact information.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 h-full">
              <h2 className="text-xl font-semibold mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-primary-50 p-3 rounded-full mr-4">
                    <FiMapPin className="text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Our Location</h3>
                    <p className="text-gray-600">
                      123 Bakery Street, Bhubaneswar
                      <br />
                      Odisha, 751001, India
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary-50 p-3 rounded-full mr-4">
                    <FiPhone className="text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-gray-600">+91 9876543210</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary-50 p-3 rounded-full mr-4">
                    <FiMail className="text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-gray-600">contact@mispri.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary-50 p-3 rounded-full mr-4">
                    <FaWhatsapp className="text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">WhatsApp</h3>
                    <p className="text-gray-600">+91 9876543210</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary-50 p-3 rounded-full mr-4">
                    <FiClock className="text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Business Hours</h3>
                    <p className="text-gray-600">
                      Monday - Saturday: 9 AM - 8 PM
                      <br />
                      Sunday: 10 AM - 6 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Send Us a Message</h2>
              
              {submitSuccess ? (
                <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-4 mb-6">
                  <p className="font-medium">Thank you for contacting us!</p>
                  <p className="mt-1">We have received your message and will get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a subject</option>
                        <option value="Order Inquiry">Order Inquiry</option>
                        <option value="Product Information">Product Information</option>
                        <option value="Delivery Issue">Delivery Issue</option>
                        <option value="Return/Refund">Return/Refund</option>
                        <option value="Feedback">Feedback</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  {submitError && (
                    <div className="text-red-500 text-sm">{submitError}</div>
                  )}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-md transition-colors flex items-center"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        'Sending...'
                      ) : (
                        <>
                          <FiSend className="mr-2" />
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
        
        {/* Map */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Find Us</h2>
          <div className="aspect-video w-full rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119743.40927234368!2d85.75041001320085!3d20.300828072222!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1909d2d5170aa5%3A0xfc580e2b68b33fa8!2sBhubaneswar%2C%20Odisha!5e0!3m2!1sen!2sin!4v1734567890123!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

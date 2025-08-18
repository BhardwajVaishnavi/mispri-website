import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-dark-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-primary-100">Privacy Policy - Mispri Foods</h1>

        <div className="bg-dark-700 rounded-lg shadow-md p-6 border border-primary-200/20">
          <div className="prose prose-lg max-w-none">
            <p className="text-primary-200 mb-6">
              At Mispri Foods, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and protect your data when you visit our website www.mispri.in, make a purchase, or interact with us.
            </p>

            <h2 className="text-2xl font-semibold mb-4 text-primary-100">Information We Collect</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-primary-200">
              <li><strong className="text-primary-100">Personal Information:</strong> Name, phone number, email address, billing/shipping address, and payment details when you place an order.</li>
              <li><strong className="text-primary-100">Order Details:</strong> Purchase history, preferences, and special requests.</li>
              <li><strong className="text-primary-100">Technical Data:</strong> IP address, browser type, device information, and cookies for website analytics.</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4 text-primary-100">How We Use Your Information</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-primary-200">
              <li>Process and deliver your orders.</li>
              <li>Send order updates, promotional offers, and newsletters.</li>
              <li>Improve our services, website, and customer experience.</li>
              <li>Respond to customer inquiries and provide support.</li>
              <li>Comply with legal requirements and prevent fraud.</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4 text-primary-100">Data Protection & Security</h2>
            <p className="text-primary-200 mb-6">
              We implement strict security measures to protect your data from unauthorized access, alteration, or disclosure. However, no online transaction is 100% secure, and we encourage customers to take necessary precautions.
            </p>

            <h2 className="text-2xl font-semibold mb-4 text-primary-100">Cookies & Tracking</h2>
            <p className="text-primary-200 mb-6">
              We use cookies to enhance your browsing experience. You can choose to disable cookies in your browser settings, but some website features may not function properly.
            </p>

            <h2 className="text-2xl font-semibold mb-4 text-primary-100">Your Rights & Choices</h2>
            <p className="text-primary-200 mb-4">You have the right to:</p>
            <ul className="list-none pl-6 mb-6 space-y-2 text-primary-200">
              <li>✔ Request access to your personal data.</li>
              <li>✔ Opt-out of marketing emails and messages.</li>
              <li>✔ Request correction or deletion of your data.</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4 text-primary-100">Updates to This Policy</h2>
            <p className="text-primary-200 mb-6">
              We may update this Privacy Policy from time to time. Please review it periodically for changes.
            </p>

            <h2 className="text-2xl font-semibold mb-4 text-primary-100">Contact Us</h2>
            <p className="text-primary-200 mb-4">
              If you have any questions regarding this Privacy Policy, please contact us at:
            </p>
            <div className="mt-4 text-primary-300">
              <p><strong className="text-primary-100">Email:</strong> contactus@mispri.in</p>
              <p><strong className="text-primary-100">Phone:</strong> 9938938780</p>
              <p><strong className="text-primary-100">Address:</strong> Mangalpur, Pipili, Puri</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

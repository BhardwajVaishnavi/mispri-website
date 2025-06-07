'use client';

import { useState, useEffect } from 'react';
import { FiMapPin, FiClock, FiTruck, FiCheck } from 'react-icons/fi';

interface PincodeData {
  pincodes: string[];
  city: string;
  state: string;
  total: number;
  message: string;
}

export default function DeliveryAreasPage() {
  const [pincodeData, setPincodeData] = useState<PincodeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPincodes();
  }, []);

  const fetchPincodes = async () => {
    try {
      const response = await fetch('/api/pincode?action=list');
      if (response.ok) {
        const data = await response.json();
        setPincodeData(data);
      }
    } catch (error) {
      console.error('Error fetching pincodes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPincodes = pincodeData?.pincodes.filter(pincode =>
    pincode.includes(searchTerm)
  ) || [];

  const groupedPincodes = filteredPincodes.reduce((acc, pincode) => {
    const prefix = pincode.substring(0, 4);
    if (!acc[prefix]) {
      acc[prefix] = [];
    }
    acc[prefix].push(pincode);
    return acc;
  }, {} as Record<string, string[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading delivery areas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Delivery Areas</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We deliver to all areas in {pincodeData?.city}, {pincodeData?.state}. 
            Check if we deliver to your location below.
          </p>
        </div>

        {/* Delivery Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <FiMapPin className="text-blue-600 text-3xl mx-auto mb-3" />
            <h3 className="font-semibold text-blue-900 mb-2">Coverage Area</h3>
            <p className="text-blue-700">All of Bhubaneswar</p>
            <p className="text-sm text-blue-600 mt-1">{pincodeData?.total} pincodes supported</p>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg text-center">
            <FiTruck className="text-green-600 text-3xl mx-auto mb-3" />
            <h3 className="font-semibold text-green-900 mb-2">Free Delivery</h3>
            <p className="text-green-700">Orders above ₹500</p>
            <p className="text-sm text-green-600 mt-1">₹50 for orders below ₹500</p>
          </div>
          
          <div className="bg-orange-50 p-6 rounded-lg text-center">
            <FiClock className="text-orange-600 text-3xl mx-auto mb-3" />
            <h3 className="font-semibold text-orange-900 mb-2">Delivery Time</h3>
            <p className="text-orange-700">2-4 hours</p>
            <p className="text-sm text-orange-600 mt-1">Same day delivery available</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search pincode (e.g., 751001)"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Pincode Groups */}
        <div className="space-y-6">
          {Object.entries(groupedPincodes).map(([prefix, pincodes]) => (
            <div key={prefix} className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiCheck className="text-green-600 mr-2" />
                {prefix}xxx Series ({pincodes.length} pincodes)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {pincodes.map((pincode) => (
                  <div
                    key={pincode}
                    className="bg-white px-3 py-2 rounded border text-center text-sm font-mono"
                  >
                    {pincode}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredPincodes.length === 0 && searchTerm && (
          <div className="text-center py-8">
            <p className="text-gray-500">No pincodes found matching "{searchTerm}"</p>
          </div>
        )}

        {/* Contact Info */}
        <div className="mt-12 bg-primary-50 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-primary-900 mb-2">
            Don't see your pincode?
          </h3>
          <p className="text-primary-700 mb-4">
            We're constantly expanding our delivery areas. Contact us to check if we can deliver to your location.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+919876543210"
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md transition-colors"
            >
              Call Us
            </a>
            <a
              href="https://wa.me/919876543210"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

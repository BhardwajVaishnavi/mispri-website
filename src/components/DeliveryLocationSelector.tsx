'use client';

import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

interface DeliveryLocation {
  id: string;
  pincode: string;
  area: string;
  city: string;
  state: string;
  deliveryFee: number;
  isActive: boolean;
}

interface DeliveryLocationSelectorProps {
  onLocationChange?: (location: DeliveryLocation | null) => void;
  className?: string;
}

export default function DeliveryLocationSelector({
  onLocationChange,
  className = ''
}: DeliveryLocationSelectorProps) {
  const [pincode, setPincode] = useState('');
  const [location, setLocation] = useState<DeliveryLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkDelivery = async (pincodeValue: string) => {
    if (!pincodeValue || pincodeValue.length < 6) {
      setLocation(null);
      setError('');
      onLocationChange?.(null);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/delivery-locations/check?pincode=${pincodeValue}`);
      
      if (response.ok) {
        const locationData = await response.json();
        setLocation(locationData);
        setError('');
        onLocationChange?.(locationData);
      } else {
        setLocation(null);
        setError('Delivery not available to this location');
        onLocationChange?.(null);
      }
    } catch (err) {
      setLocation(null);
      setError('Unable to check delivery location');
      onLocationChange?.(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPincode(value);
    
    if (value.length === 6) {
      checkDelivery(value);
    } else {
      setLocation(null);
      setError('');
      onLocationChange?.(null);
    }
  };

  return (
    <div className={className}>
      <h3 className="text-sm font-medium text-gray-900 mb-3">Select Delivery Location</h3>
      
      <div className="relative">
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <div className="flex items-center px-3 py-2 bg-gray-50 border-r border-gray-300">
            <MapPin className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-600">Pincode</span>
          </div>
          <input
            type="text"
            value={pincode}
            onChange={handlePincodeChange}
            placeholder="Enter pincode"
            className="flex-1 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5F9EA0] focus:border-transparent"
            maxLength={6}
          />
          {loading && (
            <div className="px-3 py-2">
              <div className="animate-spin h-4 w-4 border-2 border-[#5F9EA0] border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>

        {error && (
          <p className="text-red-500 text-xs mt-2">{error}</p>
        )}

        {location && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center text-green-700">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Delivery Available</span>
            </div>
            <p className="text-sm text-green-600 mt-1">
              {location.area}, {location.city}, {location.state} - {location.pincode}
            </p>
            {location.deliveryFee > 0 && (
              <p className="text-sm text-green-600 mt-1">
                Delivery Fee: ₹{location.deliveryFee}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

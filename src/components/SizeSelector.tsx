'use client';

import React, { useState } from 'react';

interface SizeOption {
  id: string;
  name: string;
  description: string;
  price?: number; // Actual price for this size
  priceModifier?: number; // Additional price for this size
}

interface SizeSelectorProps {
  sizes: SizeOption[];
  selectedSize?: string;
  onSizeChange?: (size: SizeOption) => void;
  className?: string;
}

export default function SizeSelector({
  sizes,
  selectedSize,
  onSizeChange,
  className = ''
}: SizeSelectorProps) {
  const [selected, setSelected] = useState(selectedSize || sizes[0]?.id);

  // Update local state when selectedSize prop changes
  React.useEffect(() => {
    if (selectedSize) {
      setSelected(selectedSize);
    }
  }, [selectedSize]);

  const handleSizeChange = (size: SizeOption) => {
    setSelected(size.id);
    onSizeChange?.(size);
  };

  if (!sizes || sizes.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {sizes.map((size) => (
          <button
            key={size.id}
            onClick={() => handleSizeChange(size)}
            className={`
              border rounded-lg p-3 text-center transition-all duration-200 hover:shadow-md
              ${selected === size.id
                ? 'border-[#5F9EA0] bg-[#5F9EA0] text-white'
                : 'border-gray-300 hover:border-[#5F9EA0] bg-white text-gray-700'
              }
            `}
          >
            <div className={`text-sm font-medium ${selected === size.id ? 'text-white' : 'text-gray-900'}`}>
              {size.description}
            </div>
            {size.price && (
              <div className={`text-xs mt-1 ${selected === size.id ? 'text-white' : 'text-gray-600'}`}>
                ₹{size.price.toFixed(0)}
              </div>
            )}
            {!size.price && size.priceModifier && size.priceModifier > 0 && (
              <div className={`text-xs mt-1 ${selected === size.id ? 'text-white' : 'text-orange-600'}`}>
                +₹{size.priceModifier.toFixed(0)}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

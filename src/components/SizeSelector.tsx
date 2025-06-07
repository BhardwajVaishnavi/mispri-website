'use client';

import { useState } from 'react';

interface SizeOption {
  id: string;
  name: string;
  description: string;
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

  const handleSizeChange = (size: SizeOption) => {
    setSelected(size.id);
    onSizeChange?.(size);
  };

  if (!sizes || sizes.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <h3 className="text-sm font-medium text-gray-900 mb-3">Choose Size</h3>
      <div className="grid grid-cols-3 gap-2">
        {sizes.map((size) => (
          <button
            key={size.id}
            onClick={() => handleSizeChange(size)}
            className={`
              border rounded-lg p-2 text-center transition-all duration-200 text-xs
              ${selected === size.id
                ? 'border-orange-500 bg-orange-50 text-orange-700'
                : 'border-gray-200 hover:border-orange-300 hover:bg-orange-25'
              }
            `}
          >
            <div className="font-medium text-gray-900 text-xs">{size.name}</div>
            <div className="text-xs text-gray-600">{size.description}</div>
            {size.priceModifier && size.priceModifier > 0 && (
              <div className="text-xs text-orange-600 font-medium">
                +₹{size.priceModifier.toFixed(2)}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

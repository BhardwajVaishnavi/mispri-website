'use client';

import { useState } from 'react';

interface QuantitySelectorProps {
  initialQuantity?: number;
  min?: number;
  max?: number;
  unit?: string;
  onChange?: (quantity: number) => void;
  className?: string;
}

export default function QuantitySelector({
  initialQuantity = 1,
  min = 1,
  max = 99,
  unit = 'piece',
  onChange,
  className = ''
}: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleDecrease = () => {
    if (quantity > min) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onChange?.(newQuantity);
    }
  };

  const handleIncrease = () => {
    if (quantity < max) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      onChange?.(newQuantity);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || min;
    const clampedValue = Math.max(min, Math.min(max, value));
    setQuantity(clampedValue);
    onChange?.(clampedValue);
  };

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <div className="flex items-center border border-gray-300 rounded-lg bg-white shadow-sm">
        <button
          onClick={handleDecrease}
          disabled={quantity <= min}
          className="p-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg"
          aria-label="Decrease quantity"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        
        <input
          type="number"
          value={quantity}
          onChange={handleInputChange}
          min={min}
          max={max}
          className="w-16 px-3 py-3 text-center font-medium text-gray-900 border-0 focus:outline-none focus:ring-0"
          aria-label="Quantity"
        />
        
        <button
          onClick={handleIncrease}
          disabled={quantity >= max}
          className="p-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg"
          aria-label="Increase quantity"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
      
      <span className="text-sm text-gray-600">({unit})</span>
    </div>
  );
}

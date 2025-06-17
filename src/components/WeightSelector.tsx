'use client';

import { useState } from 'react';

interface WeightOption {
  id: string;
  weight: string;
  price: number;
  isDefault?: boolean;
}

interface WeightSelectorProps {
  weights: WeightOption[];
  selectedWeight?: string;
  onWeightChange?: (weight: WeightOption) => void;
  className?: string;
}

export default function WeightSelector({
  weights,
  selectedWeight,
  onWeightChange,
  className = ''
}: WeightSelectorProps) {
  const [selected, setSelected] = useState(
    selectedWeight || weights.find(w => w.isDefault)?.id || weights[0]?.id
  );

  const handleWeightChange = (weight: WeightOption) => {
    setSelected(weight.id);
    onWeightChange?.(weight);
  };

  if (!weights || weights.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <h3 className="text-sm font-medium text-gray-900 mb-3">Weight</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {weights.map((weight) => (
          <button
            key={weight.id}
            onClick={() => handleWeightChange(weight)}
            className={`
              border rounded-lg p-3 text-center transition-all duration-200 text-sm
              ${selected === weight.id
                ? 'border-[#5F9EA0] bg-[#5F9EA0] text-white'
                : 'border-gray-200 hover:border-[#5F9EA0] hover:bg-[#5F9EA0]/10'
              }
            `}
          >
            <div className="font-medium text-sm">{weight.weight}</div>
            <div className={`text-xs mt-1 ${
              selected === weight.id ? 'text-white' : 'text-[#5F9EA0]'
            }`}>
              ₹{weight.price.toFixed(0)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

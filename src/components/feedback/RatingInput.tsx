import React from 'react';
import { Star } from 'lucide-react';

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

export function RatingInput({ value, onChange, max = 5 }: RatingInputProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onChange(index + 1)}
          className="p-1"
        >
          <Star
            className={`h-6 w-6 ${
              index < value
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        </button>
      ))}
    </div>
  );
}
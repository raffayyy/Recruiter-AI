import React from 'react';
import { Percent } from 'lucide-react';

interface AlignmentScoreProps {
  score: number;
}

export function AlignmentScore({ score }: AlignmentScoreProps) {
  const getScoreColor = (value: number) => {
    if (value >= 80) return 'bg-green-100 text-green-800';
    if (value >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-medium ${getScoreColor(score)}`}>
      <Percent className="h-3.5 w-3.5" />
      <span>{score}% Match</span>
    </div>
  );
}
import React from 'react';

interface StatBarProps {
  label: string;
  value: number;
  max?: number;
  accentColor?: string;
}

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
};

export const StatBar: React.FC<StatBarProps> = ({
  label,
  value,
  max = 255,
  accentColor,
}) => {
  const displayLabel = STAT_LABELS[label.toLowerCase()] || label;
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const getStatColor = (val: number) => {
    if (accentColor) return accentColor;
    if (val < 50) return '#FF6B6B';
    if (val < 80) return '#FACC15';
    if (val < 110) return '#4ADE80';
    if (val < 140) return '#38BDF8';
    return '#C084FC';
  };

  const fillStyle = {
    width: `${percentage}%`,
    backgroundColor: getStatColor(value),
  };

  return (
    <div className="flex flex-col gap-1 my-2 font-['Space_Grotesk']">
      <div className="flex items-center justify-between text-xs sm:text-sm font-extrabold">
        <span className="text-black dark:text-white capitalize flex items-center gap-1">
          {displayLabel}
        </span>
        <span className="font-black text-black dark:text-white">
          {value} <span className="text-slate-500 text-xs font-bold">/ {max}</span>
        </span>
      </div>
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-4 rounded-full p-0.5 border-2 border-black shadow-[2px_2px_0px_0px_#000] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out border-r-2 border-black"
          style={fillStyle}
        />
      </div>
    </div>
  );
};

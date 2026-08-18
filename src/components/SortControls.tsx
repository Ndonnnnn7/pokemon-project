import React from 'react';
import type { SortOption } from '../types/pokemon';
import { ArrowUpDown } from 'lucide-react';

interface SortControlsProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const SortControls: React.FC<SortControlsProps> = ({
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="flex items-center gap-2 font-['Space_Grotesk']">
      <div className="p-2.5 rounded-xl bg-[#A3E635] text-black border-2 border-black shadow-[3px_3px_0px_0px_#000]">
        <ArrowUpDown className="w-4 h-4 stroke-[3]" />
      </div>
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        aria-label="Sort Pokémon"
        className="py-2.5 px-4 rounded-xl bg-white dark:bg-slate-900 border-2 border-black text-black dark:text-white text-xs sm:text-sm font-extrabold focus:outline-none cursor-pointer shadow-[3px_3px_0px_0px_#000]"
      >
        <option value="id-asc">Sort: Lowest ID (#1)</option>
        <option value="id-desc">Sort: Highest ID</option>
        <option value="name-asc">Sort: Name (A-Z)</option>
        <option value="hp-desc">Sort: Highest HP</option>
        <option value="attack-desc">Sort: Highest Attack</option>
        <option value="speed-desc">Sort: Highest Speed</option>
      </select>
    </div>
  );
};

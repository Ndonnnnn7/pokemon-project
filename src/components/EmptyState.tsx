import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  onReset?: () => void;
  resetLabel?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Pokémon Found',
  message = "We couldn't find any Pokémon matching your criteria. Try adjusting your search query or type filter.",
  onReset,
  resetLabel = 'Clear Filters',
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 my-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border-[3.5px] border-black max-w-md mx-auto shadow-[6px_6px_0px_0px_#000] font-['Space_Grotesk'] text-black dark:text-white">
      <div className="w-20 h-20 rounded-2xl bg-[#FEF08A] flex items-center justify-center mb-4 border-2 border-black shadow-[3px_3px_0px_0px_#000] text-black">
        <SearchX className="w-10 h-10 stroke-[2.5]" />
      </div>

      <h3 className="text-2xl font-black mb-2">
        {title}
      </h3>

      <p className="text-slate-600 dark:text-slate-400 text-sm font-extrabold max-w-sm mb-6 leading-relaxed">
        {message}
      </p>

      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-black text-sm bg-[#A3E635] text-black border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 stroke-[3]" />
          <span>{resetLabel}</span>
        </button>
      )}
    </div>
  );
};

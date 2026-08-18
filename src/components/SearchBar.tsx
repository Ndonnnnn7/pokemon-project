import React, { useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isSearching?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search Pokémon by name or ID...',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement !== inputRef.current &&
        !(document.activeElement instanceof HTMLInputElement) &&
        !(document.activeElement instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-full max-w-xl group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-800 dark:text-slate-200">
        <Search className="w-5 h-5 stroke-[2.5]" />
      </div>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search Pokémon"
        className="w-full pl-12 pr-20 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border-[3px] border-black text-black dark:text-white placeholder-slate-500 dark:placeholder-slate-400 font-['Space_Grotesk'] font-bold text-sm sm:text-base focus:outline-none focus:bg-[#FEF9C3] dark:focus:bg-slate-800 shadow-[4px_4px_0px_0px_#000] transition-all duration-150"
      />

      <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center gap-2">
        {value ? (
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-1.5 rounded-xl bg-[#FF6B6B] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-rose-400 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            aria-label="Clear search"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        ) : (
          <kbd className="hidden sm:inline-flex items-center px-2.5 py-1 text-xs font-mono font-black text-black bg-[#FACC15] border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] select-none pointer-events-none">
            /
          </kbd>
        )}
      </div>
    </div>
  );
};

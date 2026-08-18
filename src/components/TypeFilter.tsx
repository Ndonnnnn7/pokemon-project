import React, { useState } from 'react';
import { ALL_POKEMON_TYPES, getTypeColor } from '../styles/typeColors';
import { TypeIcon } from './TypeIcon';
import {
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  Layers,
  X,
  LayoutGrid,
  StretchHorizontal,
  Check,
} from 'lucide-react';
import type { SortOption } from '../types/pokemon';

interface FilterPokemonProps {
  selectedType: string;
  onSelectType: (type: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalCount: number;
  onResetFilters: () => void;
}

const ELEMENTAL_CLUSTERS = [
  { id: 'all', label: 'All Elements', types: [] },
  { id: 'starters', label: '🌱 Starters', types: ['grass', 'fire', 'water'] },
  { id: 'energy', label: '⚡ Energy', types: ['electric', 'psychic', 'dragon'] },
  { id: 'physical', label: '🛡️ Physical', types: ['fighting', 'rock', 'ground', 'steel'] },
  { id: 'mystic', label: '✨ Mystic', types: ['ghost', 'dark', 'fairy', 'ice'] },
];

export const TypeFilter: React.FC<FilterPokemonProps> = ({
  selectedType,
  onSelectType,
  sortBy,
  onSortChange,
  totalCount,
  onResetFilters,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'track'>('grid');
  const isAllType = selectedType.toLowerCase() === 'all' || !selectedType;

  const handleToggleSortDirection = () => {
    if (sortBy === 'id-asc') onSortChange('id-desc');
    else if (sortBy === 'id-desc') onSortChange('id-asc');
    else if (sortBy === 'name-asc') onSortChange('id-asc');
    else onSortChange('id-asc');
  };

  const activeColorInfo = !isAllType ? getTypeColor(selectedType) : null;

  return (
    <section className="w-full my-6 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-[2.5rem] border-[3.5px] border-black shadow-[6px_6px_0px_0px_#000] font-['Space_Grotesk'] text-black dark:text-white transition-colors duration-200">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b-2 border-black/10 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#A3E635] text-black border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000]">
            <SlidersHorizontal className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-black dark:text-white">
                FILTER POKÉMON
              </h2>
              {!isAllType && (
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-[#FF4757] text-white border border-black shadow-xs animate-fadeIn">
                  1 ACTIVE
                </span>
              )}
            </div>
            <p className="text-xs font-extrabold text-slate-600 dark:text-slate-400 mt-0.5">
              Refine by elemental type and sort to discover your favorites.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-black">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              title="Grid View (all types visible)"
              className={`p-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-black dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-black dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('track')}
              title="Track View (horizontal scroll)"
              className={`p-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                viewMode === 'track'
                  ? 'bg-white dark:bg-slate-700 text-black dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-black dark:hover:text-white'
              }`}
            >
              <StretchHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 hidden sm:inline">
              Sort by
            </span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                aria-label="Sort Pokémon"
                className="appearance-none bg-white dark:bg-slate-800 text-black dark:text-white text-xs font-black rounded-xl border-2 border-black py-2 pl-3 pr-8 shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-[#A3E635] cursor-pointer"
              >
                <option value="id-asc">Lowest ID (# 1 ↑)</option>
                <option value="id-desc">Highest ID (# 1025 ↓)</option>
                <option value="name-asc">Name (A → Z)</option>
                <option value="hp-desc">Highest HP 💚</option>
                <option value="attack-desc">Highest Attack ⚔️</option>
                <option value="speed-desc">Highest Speed ⚡</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black dark:text-white">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleSortDirection}
              title="Toggle sort direction"
              className="p-2 rounded-xl bg-[#A3E635] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              <ArrowUpDown className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      </div>

      <div className="pt-4 pb-2 flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-[11px] uppercase font-black tracking-wider text-slate-500 dark:text-slate-400 mr-1 hidden sm:inline">
          Clusters:
        </span>
        {ELEMENTAL_CLUSTERS.map((cluster) => {
          const isClusterActive =
            cluster.id === 'all'
              ? isAllType
              : cluster.types.includes(selectedType.toLowerCase());

          return (
            <button
              key={cluster.id}
              type="button"
              onClick={() => {
                if (cluster.id === 'all') {
                  onSelectType('all');
                } else if (cluster.types.length > 0) {
                  onSelectType(cluster.types[0]);
                }
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-black border-2 border-black transition-all cursor-pointer ${
                isClusterActive
                  ? 'bg-[#FEF08A] text-black shadow-[2px_2px_0px_0px_#000]'
                  : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-xs'
              }`}
            >
              {cluster.label}
            </button>
          );
        })}
      </div>

      <div className="pt-3 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#A3E635] border border-black inline-block shadow-xs" />
          <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
            ALL 18 ELEMENTAL TYPES
          </span>
        </div>

        {!isAllType && (
          <button
            type="button"
            onClick={() => onSelectType('all')}
            className="text-xs font-black text-rose-500 dark:text-rose-400 hover:text-rose-600 hover:underline cursor-pointer flex items-center gap-1 transition-colors"
          >
            <span>Clear selection</span>
            <X className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        )}
      </div>

      <div
        className={`pt-2 pb-3 px-1 custom-scrollbar ${
          viewMode === 'grid'
            ? 'flex flex-wrap items-center gap-2 sm:gap-2.5'
            : 'flex items-center gap-2 overflow-x-auto'
        }`}
      >
        <button
          type="button"
          onClick={() => onSelectType('all')}
          className={`group flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide transition-all duration-150 cursor-pointer whitespace-nowrap border-2 border-black ${
            isAllType
              ? 'bg-[#C084FC] text-black shadow-[3px_3px_0px_0px_#000] -translate-y-0.5'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-[2px_2px_0px_0px_#000] hover:bg-[#C084FC] hover:text-black dark:hover:bg-[#C084FC] dark:hover:text-black hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000]'
          }`}
        >
          <div className="w-4 h-4 rounded-full bg-white text-black border border-black flex items-center justify-center">
            <Layers className="w-2.5 h-2.5 stroke-[3]" />
          </div>
          <span>All Types</span>
          {isAllType && <Check className="w-3 h-3 stroke-[3]" />}
        </button>

        {ALL_POKEMON_TYPES.map((type) => {
          const isSelected = selectedType.toLowerCase() === type;
          const colorInfo = getTypeColor(type);

          return (
            <button
              key={type}
              type="button"
              onClick={() => onSelectType(type)}
              style={{
                backgroundColor: isSelected ? colorInfo.bg : undefined,
                color: isSelected ? colorInfo.text : undefined,
              }}
              className={`group flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black capitalize tracking-wide transition-all duration-150 cursor-pointer whitespace-nowrap border-2 border-black ${
                isSelected
                  ? 'shadow-[3px_3px_0px_0px_#000] -translate-y-0.5 scale-[1.02]'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-[2px_2px_0px_0px_#000] hover:border-black hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000]'
              }`}
            >
              <div
                style={{
                  backgroundColor: isSelected ? '#FFFFFF' : colorInfo.bg,
                  color: '#090D16',
                }}
                className="w-5 h-5 rounded-full border border-black flex items-center justify-center shrink-0 shadow-xs group-hover:rotate-12 transition-transform duration-200"
              >
                <TypeIcon type={type} className="w-3 h-3 stroke-[2.5]" />
              </div>

              <span>{colorInfo.name}</span>

              {isSelected && <Check className="w-3 h-3 stroke-[3] ml-0.5" />}
            </button>
          );
        })}
      </div>

      <div className="mt-4 pt-3.5 border-t-2 border-black/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 bg-[#A3E635] text-black px-3.5 py-1.5 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_#000] font-black">
            <Sparkles className="w-3.5 h-3.5 stroke-[3]" />
            <span>
              Showing <strong>{totalCount}</strong> Pokémon
            </span>
          </div>

          {!isAllType && activeColorInfo && (
            <div
              style={{ backgroundColor: activeColorInfo.bg, color: activeColorInfo.text }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_#000] font-black animate-scaleUp"
            >
              <TypeIcon type={selectedType} className="w-3 h-3 stroke-[3]" />
              <span>{activeColorInfo.name} Type</span>
              <button
                type="button"
                onClick={() => onSelectType('all')}
                className="p-0.5 rounded-full bg-white text-black hover:bg-rose-100 ml-1 cursor-pointer"
                title="Remove filter"
              >
                <X className="w-3 h-3 stroke-[3]" />
              </button>
            </div>
          )}

          {!isAllType && (
            <button
              type="button"
              onClick={onResetFilters}
              className="flex items-center gap-1.5 text-xs font-black text-black dark:text-white bg-[#FF6B6B] px-3 py-1 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-rose-400 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 stroke-[3]" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 italic hidden sm:inline">
          Click any elemental badge to filter live
        </span>
      </div>
    </section>
  );
};

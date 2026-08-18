import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ALL_POKEMON_TYPES, getTypeColor } from '../styles/typeColors';
import { TypeIcon } from './TypeIcon';
import {
  Search,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  Layers,
  LayoutGrid,
  StretchHorizontal,
  Check,
  Flame,
  ChevronDown,
} from 'lucide-react';
import type { SortOption } from '../types/pokemon';

interface PokemonSearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedType: string;
  onSelectType: (type: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalCount: number;
  onResetFilters: () => void;
}

const QUICK_SEARCH_POKEMON = [
  { name: 'Pikachu', id: 25, color: '#FEF08A' },
  { name: 'Charizard', id: 6, color: '#FF6B6B' },
  { name: 'Blastoise', id: 9, color: '#38BDF8' },
  { name: 'Gengar', id: 94, color: '#C084FC' },
  { name: 'Mewtwo', id: 150, color: '#F472B6' },
  { name: 'Lucario', id: 448, color: '#A3E635' },
];

const ELEMENTAL_CLUSTERS = [
  { id: 'all', label: 'All Elements', types: [] },
  { id: 'starters', label: 'Starters', types: ['grass', 'fire', 'water'] },
  { id: 'energy', label: 'Energy', types: ['electric', 'psychic', 'dragon'] },
  { id: 'physical', label: 'Physical', types: ['fighting', 'rock', 'ground', 'steel'] },
  { id: 'mystic', label: 'Mystic', types: ['ghost', 'dark', 'fairy', 'ice'] },
];

const popupVariants = {
  hidden: {
    opacity: 0,
    y: -14,
    scale: 0.96,
    filter: 'blur(4px)',
    transition: {
      duration: 0.15,
      ease: [0.4, 0, 1, 1] as const,
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring' as const,
      stiffness: 420,
      damping: 28,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.97,
    filter: 'blur(3px)',
    transition: {
      duration: 0.15,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
};

const badgeContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
      delayChildren: 0.04,
    },
  },
};

const badgeItemVariants = {
  hidden: { opacity: 0, scale: 0.75, y: 6 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 450,
      damping: 24,
    },
  },
};

export const PokemonSearchFilter: React.FC<PokemonSearchFilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedType,
  onSelectType,
  sortBy,
  onSortChange,
  totalCount,
  onResetFilters,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'track'>('grid');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isAllType = selectedType.toLowerCase() === 'all' || !selectedType;
  const activeColorInfo = !isAllType ? getTypeColor(selectedType) : null;

  const activeCluster = ELEMENTAL_CLUSTERS.find(
    (c) => c.id !== 'all' && c.types.includes(selectedType.toLowerCase())
  );

  let activeFiltersCount = 0;
  if (!isAllType) activeFiltersCount += 1;
  if (sortBy !== 'id-asc') activeFiltersCount += 1;

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
      } else if (e.key === 'Escape' && isFilterOpen) {
        setIsFilterOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFilterOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFilterOpen]);

  const handleToggleSortDirection = () => {
    if (sortBy === 'id-asc') onSortChange('id-desc');
    else if (sortBy === 'id-desc') onSortChange('id-asc');
    else if (sortBy === 'name-asc') onSortChange('id-asc');
    else onSortChange('id-asc');
  };

  const handleQuickPickClick = (pokemonName: string) => {
    if (searchQuery.toLowerCase() === pokemonName.toLowerCase()) {
      onSearchChange('');
    } else {
      onSearchChange(pokemonName);
      if (!isAllType) onSelectType('all');
    }
  };

  const handleTypeClick = (type: string) => {
    onSelectType(type);
    if (searchQuery) onSearchChange('');
  };

  const filterButtonSubtitle = isAllType
    ? 'All Types • All Clusters'
    : `${activeColorInfo?.name || selectedType} Type${activeCluster ? ` • ${activeCluster.label.replace(/^[^\s]+\s/, '')}` : ''}`;

  return (
    <div ref={containerRef} className="relative w-full max-w-5xl mx-auto my-3 font-['Space_Grotesk'] z-30">
      <motion.div
        layout
        className={`w-full bg-white dark:bg-slate-900 border-[3.5px] border-black rounded-3xl sm:rounded-full shadow-[5px_5px_0px_0px_#000] sm:shadow-[7px_7px_0px_0px_#000] transition-shadow duration-200 flex flex-col sm:flex-row items-stretch sm:items-center overflow-hidden ${
          isFilterOpen ? 'ring-4 ring-[#A3E635]/40 shadow-[7px_7px_0px_0px_#000]' : ''
        }`}
      >
        <div className="relative flex-1 flex items-center min-w-0 px-3 sm:px-5 py-2 sm:py-2.5">
          <div className="pl-1 sm:pl-2 pr-3 flex items-center pointer-events-none text-slate-800 dark:text-slate-200">
            <Search className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              if (e.target.value && !isAllType) {
                onSelectType('all');
              }
            }}
            placeholder="Search by Pokémon name or ID (e.g., Pikachu, 25)..."
            aria-label="Search Pokémon"
            className="w-full bg-transparent text-black dark:text-white placeholder-slate-500 dark:placeholder-slate-400 font-['Space_Grotesk'] font-bold text-sm sm:text-base focus:outline-none pr-10"
          />

          <div className="absolute right-3 sm:right-5 flex items-center gap-1.5">
            <AnimatePresence mode="wait">
              {searchQuery ? (
                <motion.button
                  key="clear-btn"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="p-1 rounded-xl bg-[#FF6B6B] text-black border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000] hover:bg-rose-400 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                  aria-label="Clear search"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5 stroke-[3]" />
                </motion.button>
              ) : (
                <motion.kbd
                  key="shortcut-kbd"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hidden md:inline-flex items-center px-2 py-0.5 text-xs font-mono font-black text-black bg-[#FACC15] border-2 border-black rounded-lg shadow-[1.5px_1.5px_0px_0px_#000] select-none pointer-events-none"
                >
                  /
                </motion.kbd>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="hidden sm:block w-[3px] h-9 bg-black shrink-0 mx-1" />
        <div className="sm:hidden w-full h-[2.5px] bg-black" />

        <motion.button
          type="button"
          onClick={() => setIsFilterOpen((prev) => !prev)}
          whileTap={{ scale: 0.985 }}
          className={`flex items-center justify-between sm:justify-start gap-3 px-4 sm:px-5 py-2.5 sm:py-3 transition-colors cursor-pointer shrink-0 select-none group ${
            isFilterOpen
              ? 'bg-[#FEF08A] dark:bg-slate-800 text-black dark:text-white'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800/90 active:bg-slate-200 dark:active:bg-slate-700'
          }`}
          aria-expanded={isFilterOpen}
          aria-label="Toggle filter and sort popup"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: isFilterOpen ? 15 : 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#000] transition-transform duration-200 group-hover:scale-105 ${
                activeFiltersCount > 0
                  ? 'bg-[#FF4757] text-white animate-pulse'
                  : 'bg-[#A3E635] text-black'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </motion.div>

            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-black dark:text-white">
                  FILTER & SORT
                </span>
                <AnimatePresence>
                  {activeFiltersCount > 0 && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="text-[10px] uppercase font-black px-1.5 py-0.2 rounded-full bg-[#FF4757] text-white border border-black shadow-xs"
                    >
                      {activeFiltersCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate max-w-[160px] sm:max-w-[180px]">
                {filterButtonSubtitle}
              </p>
            </div>
          </div>

          <div className="pl-2 text-black dark:text-white">
            <motion.div
              animate={{ rotate: isFilterOpen ? 180 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              className={`p-1 rounded-lg border-2 border-black ${
                isFilterOpen
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-none'
                  : 'bg-white dark:bg-slate-800 shadow-[1.5px_1.5px_0px_0px_#000] group-hover:bg-[#FEF08A] group-hover:text-black'
              }`}
            >
              <ChevronDown className="w-4 h-4 stroke-[3]" />
            </motion.div>
          </div>
        </motion.button>
      </motion.div>

      <motion.div
        layout
        className="flex flex-wrap items-center justify-center gap-2 mt-3.5 text-xs px-2"
      >
        <span className="font-black text-slate-600 dark:text-slate-400 flex items-center gap-1.5 py-1">
          <Flame className="w-3.5 h-3.5 text-[#FF6B6B] fill-current" />
          <span className="text-[11px] font-black uppercase tracking-wider">Quick Picks:</span>
        </span>

        {QUICK_SEARCH_POKEMON.map((pokemon) => {
          const isActive = searchQuery.toLowerCase() === pokemon.name.toLowerCase();

          return (
            <motion.button
              key={pokemon.name}
              type="button"
              onClick={() => handleQuickPickClick(pokemon.name)}
              whileHover={{ y: -3, scale: 1.05 }}
              whileTap={{ y: 1, scale: 0.95 }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black border-2 border-black transition-colors cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#A3E635] text-black shadow-[3px_3px_0px_0px_#000]'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-[2px_2px_0px_0px_#000] hover:bg-[#FEF08A] hover:text-black dark:hover:bg-[#FEF08A] dark:hover:text-black'
              }`}
            >
              <span>{pokemon.name}</span>
            </motion.button>
          );
        })}
      </motion.div>

      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            key="filter-popup"
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mt-4 w-full bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] border-[3.5px] border-black shadow-[8px_8px_0px_0px_#000] text-black dark:text-white"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b-2 border-black/10 dark:border-white/10">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ rotate: -15, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  className="p-2.5 rounded-2xl bg-[#A3E635] text-black border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000]"
                >
                  <SlidersHorizontal className="w-5 h-5 stroke-[2.5]" />
                </motion.div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm sm:text-lg font-black uppercase tracking-wider text-black dark:text-white">
                      FILTER & SORT POKÉMON
                    </h2>
                    <AnimatePresence>
                      {activeFiltersCount > 0 && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-[#FF4757] text-white border border-black shadow-xs"
                        >
                          {activeFiltersCount} ACTIVE
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  <p className="text-xs font-extrabold text-slate-600 dark:text-slate-400 mt-0.5">
                    Refine by elemental type and sort to discover your favorites.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
                <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-black">
                  <motion.button
                    whileTap={{ scale: 0.92 }}
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
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.92 }}
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
                  </motion.button>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 hidden sm:inline">
                    SORT BY
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

                  <motion.button
                    whileHover={{ y: -2, scale: 1.05 }}
                    whileTap={{ y: 1, scale: 0.95 }}
                    type="button"
                    onClick={handleToggleSortDirection}
                    title="Toggle sort direction"
                    className="p-2 rounded-xl bg-[#A3E635] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] active:shadow-none cursor-pointer"
                  >
                    <ArrowUpDown className="w-4 h-4 stroke-[3]" />
                  </motion.button>

                  <motion.button
                    whileHover={{ y: -2, scale: 1.05, backgroundColor: '#FF6B6B', color: '#000000' }}
                    whileTap={{ y: 1, scale: 0.95 }}
                    type="button"
                    onClick={() => setIsFilterOpen(false)}
                    title="Close popup"
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-black dark:text-white border-2 border-black shadow-[2px_2px_0px_0px_#000] active:shadow-none cursor-pointer ml-1"
                  >
                    <X className="w-4 h-4 stroke-[3]" />
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="pt-4 pb-2 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] uppercase font-black tracking-wider text-slate-500 dark:text-slate-400 mr-1 hidden sm:inline">
                CLUSTERS:
              </span>
              {ELEMENTAL_CLUSTERS.map((cluster) => {
                const isClusterActive =
                  cluster.id === 'all'
                    ? isAllType
                    : cluster.types.includes(selectedType.toLowerCase());

                return (
                  <motion.button
                    key={cluster.id}
                    whileHover={{ y: -2, scale: 1.04 }}
                    whileTap={{ y: 1, scale: 0.96 }}
                    type="button"
                    onClick={() => {
                      if (cluster.id === 'all') {
                        handleTypeClick('all');
                      } else if (cluster.types.length > 0) {
                        handleTypeClick(cluster.types[0]);
                      }
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-black border-2 border-black transition-colors cursor-pointer ${
                      isClusterActive
                        ? 'bg-[#FEF08A] text-black shadow-[2.5px_2.5px_0px_0px_#000]'
                        : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-xs'
                    }`}
                  >
                    {cluster.label}
                  </motion.button>
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

              <AnimatePresence>
                {!isAllType && (
                  <motion.button
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    type="button"
                    onClick={() => handleTypeClick('all')}
                    className="text-xs font-black text-rose-500 dark:text-rose-400 hover:text-rose-600 hover:underline cursor-pointer flex items-center gap-1 transition-colors"
                  >
                    <span>Clear selection</span>
                    <X className="w-3.5 h-3.5 stroke-[3]" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <motion.div
              variants={badgeContainerVariants}
              initial="hidden"
              animate="visible"
              className={`pt-1 pb-3 px-1 custom-scrollbar ${
                viewMode === 'grid'
                  ? 'flex flex-wrap items-center gap-2 sm:gap-2.5'
                  : 'flex items-center gap-2 overflow-x-auto pb-3'
              }`}
            >
              <motion.button
                variants={badgeItemVariants}
                whileHover={{ y: -3, scale: 1.05 }}
                whileTap={{ y: 1, scale: 0.95 }}
                type="button"
                onClick={() => handleTypeClick('all')}
                className={`group flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide transition-colors duration-150 cursor-pointer whitespace-nowrap border-2 border-black ${
                  isAllType
                    ? 'bg-[#C084FC] text-black shadow-[3px_3px_0px_0px_#000]'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-[2px_2px_0px_0px_#000] hover:bg-[#C084FC] hover:text-black dark:hover:bg-[#C084FC] dark:hover:text-black'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white text-black border border-black flex items-center justify-center">
                  <Layers className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>All Types</span>
                <AnimatePresence>
                  {isAllType && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {ALL_POKEMON_TYPES.map((type) => {
                const isSelected = selectedType.toLowerCase() === type;
                const colorInfo = getTypeColor(type);

                return (
                  <motion.button
                    key={type}
                    variants={badgeItemVariants}
                    whileHover={{ y: -3, scale: 1.05 }}
                    whileTap={{ y: 1, scale: 0.95 }}
                    type="button"
                    onClick={() => handleTypeClick(type)}
                    style={{
                      backgroundColor: isSelected ? colorInfo.bg : undefined,
                      color: isSelected ? colorInfo.text : undefined,
                    }}
                    className={`group flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black capitalize tracking-wide transition-colors duration-150 cursor-pointer whitespace-nowrap border-2 border-black ${
                      isSelected
                        ? 'shadow-[3px_3px_0px_0px_#000]'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-[2px_2px_0px_0px_#000] hover:border-black'
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

                    <AnimatePresence>
                      {isSelected && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="ml-0.5"
                        >
                          <Check className="w-3 h-3 stroke-[3]" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </motion.div>

            <motion.div
              layout
              className="mt-3 pt-3.5 border-t-2 border-black/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs"
            >
              <div className="flex flex-wrap items-center gap-2">
                <motion.div
                  layout
                  className="flex items-center gap-2 bg-[#A3E635] text-black px-3.5 py-1.5 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_#000] font-black"
                >
                  <span>
                    Showing <strong>{totalCount}</strong> Pokémon
                  </span>
                </motion.div>

                <AnimatePresence>
                  {!isAllType && activeColorInfo && (
                    <motion.div
                      layout
                      initial={{ scale: 0.7, opacity: 0, y: 5 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.7, opacity: 0, y: 5 }}
                      style={{ backgroundColor: activeColorInfo.bg, color: activeColorInfo.text }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_#000] font-black"
                    >
                      <TypeIcon type={selectedType} className="w-3 h-3 stroke-[3]" />
                      <span>{activeColorInfo.name} Type</span>
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.8 }}
                        type="button"
                        onClick={() => handleTypeClick('all')}
                        className="p-0.5 rounded-full bg-white text-black hover:bg-rose-100 ml-1 cursor-pointer"
                        title="Remove filter"
                      >
                        <X className="w-3 h-3 stroke-[3]" />
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {activeFiltersCount > 0 && (
                    <motion.button
                      layout
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      whileHover={{ y: -2, scale: 1.05 }}
                      whileTap={{ y: 1, scale: 0.95 }}
                      type="button"
                      onClick={onResetFilters}
                      className="flex items-center gap-1.5 text-xs font-black text-black bg-[#FF6B6B] px-3 py-1 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-rose-400 active:shadow-none transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3 stroke-[3]" />
                      <span>Reset Filters</span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 italic hidden sm:inline">
                Click any elemental badge to filter live
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

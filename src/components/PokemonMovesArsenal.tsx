import React, { useState, useMemo } from 'react';
import type { PokemonMove } from '../types/pokemon';
import { Search, X, Zap, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface PokemonMovesArsenalProps {
  moves: PokemonMove[];
  pokemonName: string;
}

type LearnMethod = 'all' | 'level-up' | 'machine' | 'egg' | 'tutor';

export const PokemonMovesArsenal: React.FC<PokemonMovesArsenalProps> = ({
  moves,
  pokemonName,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<LearnMethod>('all');
  const [displayCount, setDisplayCount] = useState<number>(36);

  const processedMoves = useMemo(() => {
    return moves.map((m) => {
      const details = m.version_group_details || [];
      const latestDetail = details.length > 0 ? details[details.length - 1] : null;
      const method = latestDetail?.move_learn_method?.name || 'level-up';
      const level = latestDetail?.level_learned_at || 0;

      return {
        name: m.move.name,
        displayName: m.move.name.replace(/-/g, ' '),
        method,
        level,
      };
    });
  }, [moves]);

  const levelUpCount = useMemo(
    () => processedMoves.filter((m) => m.method === 'level-up').length,
    [processedMoves]
  );
  const machineCount = useMemo(
    () => processedMoves.filter((m) => m.method === 'machine').length,
    [processedMoves]
  );
  const eggCount = useMemo(
    () => processedMoves.filter((m) => m.method === 'egg').length,
    [processedMoves]
  );
  const tutorCount = useMemo(
    () => processedMoves.filter((m) => m.method === 'tutor').length,
    [processedMoves]
  );

  const filteredMoves = useMemo(() => {
    return processedMoves.filter((m) => {
      const matchesSearch =
        !searchQuery ||
        m.displayName.toLowerCase().includes(searchQuery.trim().toLowerCase());

      const matchesMethod =
        selectedMethod === 'all' || m.method === selectedMethod;

      return matchesSearch && matchesMethod;
    });
  }, [processedMoves, searchQuery, selectedMethod]);

  const visibleMoves = filteredMoves.slice(0, displayCount);
  const hasMoreMoves = displayCount < filteredMoves.length;

  const getMethodBadge = (method: string, level: number) => {
    switch (method) {
      case 'level-up':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#A3E635] text-black border border-black text-[10px] font-black shadow-xs">
            <span>{level > 0 ? `Lv. ${level}` : 'Lv. 1'}</span>
          </span>
        );
      case 'machine':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#C084FC] text-black border border-black text-[10px] font-black shadow-xs">
            <span>TM/HM</span>
          </span>
        );
      case 'egg':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#F472B6] text-black border border-black text-[10px] font-black shadow-xs">
            <span>Egg</span>
          </span>
        );
      case 'tutor':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#38BDF8] text-black border border-black text-[10px] font-black shadow-xs">
            <span>Tutor</span>
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-black dark:text-white border border-black text-[10px] font-black shadow-xs">
            Special
          </span>
        );
    }
  };

  return (
    <div className="w-full space-y-4 font-['Space_Grotesk'] text-black dark:text-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b-2 border-black/10 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-black dark:text-white">
              BATTLE MOVE ARSENAL
            </h3>
          </div>
          <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-0.5">
            Full repertoire of combat and tactical moves for {pokemonName}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs font-black">
          <span className="px-2.5 py-1 rounded-xl bg-[#A3E635] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]">
            Total: {moves.length}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4 stroke-[2.5]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${pokemonName}'s moves (e.g. Solar Beam, Tackle)...`}
            className="w-full bg-slate-50 dark:bg-slate-800/80 text-black dark:text-white placeholder-slate-500 dark:placeholder-slate-400 text-xs sm:text-sm font-black rounded-2xl border-2 border-black py-2.5 pl-10 pr-9 shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-[#C084FC]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-black dark:text-white hover:text-rose-500 cursor-pointer"
            >
              <X className="w-4 h-4 stroke-[3]" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 p-1">
          <button
            type="button"
            onClick={() => setSelectedMethod('all')}
            className={`px-3.5 py-1.5 rounded-xl border-2 border-black text-xs font-black transition-all cursor-pointer ${
              selectedMethod === 'all'
                ? 'bg-[#C084FC] text-black shadow-[3px_3px_0px_0px_#000] -translate-y-0.5'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-[2px_2px_0px_0px_#000] hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            All ({processedMoves.length})
          </button>

          {levelUpCount > 0 && (
            <button
              type="button"
              onClick={() => setSelectedMethod('level-up')}
              className={`px-3.5 py-1.5 rounded-xl border-2 border-black text-xs font-black transition-all cursor-pointer ${
                selectedMethod === 'level-up'
                  ? 'bg-[#A3E635] text-black shadow-[3px_3px_0px_0px_#000] -translate-y-0.5'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-[2px_2px_0px_0px_#000] hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
            Level Up ({levelUpCount})
            </button>
          )}

          {machineCount > 0 && (
            <button
              type="button"
              onClick={() => setSelectedMethod('machine')}
              className={`px-3.5 py-1.5 rounded-xl border-2 border-black text-xs font-black transition-all cursor-pointer ${
                selectedMethod === 'machine'
                  ? 'bg-[#FEF08A] text-black shadow-[3px_3px_0px_0px_#000] -translate-y-0.5'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-[2px_2px_0px_0px_#000] hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
            TM / HM ({machineCount})
            </button>
          )}

          {eggCount > 0 && (
            <button
              type="button"
              onClick={() => setSelectedMethod('egg')}
              className={`px-3.5 py-1.5 rounded-xl border-2 border-black text-xs font-black transition-all cursor-pointer ${
                selectedMethod === 'egg'
                  ? 'bg-[#F472B6] text-black shadow-[3px_3px_0px_0px_#000] -translate-y-0.5'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-[2px_2px_0px_0px_#000] hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
            Egg ({eggCount})
            </button>
          )}

          {tutorCount > 0 && (
            <button
              type="button"
              onClick={() => setSelectedMethod('tutor')}
              className={`px-3.5 py-1.5 rounded-xl border-2 border-black text-xs font-black transition-all cursor-pointer ${
                selectedMethod === 'tutor'
                  ? 'bg-[#38BDF8] text-black shadow-[3px_3px_0px_0px_#000] -translate-y-0.5'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-[2px_2px_0px_0px_#000] hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
            Tutor ({tutorCount})
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs font-extrabold text-slate-500 dark:text-slate-400 px-1">
        <span>
          Showing <strong className="text-black dark:text-white">{filteredMoves.length}</strong> moves
        </span>
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-rose-500 hover:underline font-black cursor-pointer"
          >
            Clear Search
          </button>
        )}
      </div>

      {filteredMoves.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center p-6 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border-2 border-dashed border-black/40">
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border-2 border-black mb-2 shadow-xs">
            <Zap className="w-6 h-6 text-amber-500" />
          </div>
          <p className="font-black text-sm text-black dark:text-white">
            No moves matching "{searchQuery}"
          </p>
          <p className="text-xs font-extrabold text-slate-500 max-w-xs mt-0.5 mb-3">
            Try searching for another attack name or clear your filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedMethod('all');
            }}
            className="px-3.5 py-1.5 rounded-xl bg-[#A3E635] text-black text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#86efac] cursor-pointer"
          >
            Reset Move Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {visibleMoves.map((move, index) => (
              <motion.div
                key={`${move.name}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: Math.min(index * 0.015, 0.2) }}
                className="p-3 rounded-2xl bg-white dark:bg-slate-800 border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] hover:bg-[#FEF08A] hover:text-black dark:hover:bg-slate-700 dark:hover:text-white transition-all group flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-700 group-hover:bg-white dark:group-hover:bg-slate-600 text-black dark:text-white group-hover:text-black dark:group-hover:text-white border border-black flex items-center justify-center shrink-0 shadow-xs">
                    <Zap className="w-3.5 h-3.5 stroke-[2.5] text-amber-500 fill-amber-500" />
                  </div>
                  <span className="font-extrabold text-xs sm:text-sm capitalize truncate text-slate-900 dark:text-white group-hover:text-black dark:group-hover:text-white">
                    {move.displayName}
                  </span>
                </div>

                <div className="shrink-0">
                  {getMethodBadge(move.method, move.level)}
                </div>
              </motion.div>
            ))}
          </div>

          {hasMoreMoves && (
            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={() => setDisplayCount((prev) => prev + 36)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#A3E635] text-black text-xs font-black border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              >
                <span>Show More Moves (+{filteredMoves.length - displayCount} remaining)</span>
                <ArrowDown className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

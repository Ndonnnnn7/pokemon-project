import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PokemonDetail } from '../types/pokemon';
import { getPokemonImage } from '../services/pokemonApi';
import { X, Swords, Plus, Shuffle } from 'lucide-react';

interface CompareDockProps {
  compareList: PokemonDetail[];
  onOpenCompare: () => void;
  onRemovePokemon: (id: number) => void;
  onClearCompare: () => void;
  onRandomOpponent?: () => void;
}

export const CompareDock: React.FC<CompareDockProps> = ({
  compareList,
  onOpenCompare,
  onRemovePokemon,
  onClearCompare,
  onRandomOpponent,
}) => {
  if (compareList.length === 0) return null;

  const pokemon1 = compareList[0];
  const pokemon2 = compareList[1];
  const isReady = compareList.length === 2;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 80, opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
        className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl font-['Space_Grotesk']"
      >
        <div className="relative bg-white dark:bg-slate-900 border-[3.5px] border-black rounded-3xl p-3 sm:p-4 shadow-[8px_8px_0px_0px_#000] text-black dark:text-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center">
            {pokemon1 && (
              <div className="relative flex items-center gap-2 px-2.5 py-1.5 rounded-2xl bg-[#BAE6FD] dark:bg-slate-800 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                <img
                  src={getPokemonImage(pokemon1)}
                  alt={pokemon1.name}
                  className="w-9 h-9 sm:w-10 sm:h-10 object-contain drop-shadow-xs"
                />
                <div className="text-left pr-1">
                  <span className="block text-[9px] font-black text-slate-700 dark:text-slate-300 leading-none">
                    #{String(pokemon1.id).padStart(3, '0')}
                  </span>
                  <span className="text-xs sm:text-sm font-black capitalize truncate max-w-[80px] sm:max-w-[100px] block">
                    {pokemon1.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onRemovePokemon(pokemon1.id)}
                  className="p-1 rounded-lg bg-[#FF4757] text-white border border-black hover:bg-rose-600 cursor-pointer transition-colors"
                  title="Remove from compare"
                >
                  <X className="w-3 h-3 stroke-[3]" />
                </button>
              </div>
            )}

            <div className="relative z-10 shrink-0">
              <div className="w-8 h-8 rounded-full bg-[#FF4757] text-white border-2 border-black flex items-center justify-center font-black text-xs shadow-[2px_2px_0px_0px_#000] rotate-6 animate-pulse">
                VS
              </div>
            </div>

            {pokemon2 ? (
              <div className="relative flex items-center gap-2 px-2.5 py-1.5 rounded-2xl bg-[#FEF08A] dark:bg-slate-800 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                <img
                  src={getPokemonImage(pokemon2)}
                  alt={pokemon2.name}
                  className="w-9 h-9 sm:w-10 sm:h-10 object-contain drop-shadow-xs"
                />
                <div className="text-left pr-1">
                  <span className="block text-[9px] font-black text-slate-700 dark:text-slate-300 leading-none">
                    #{String(pokemon2.id).padStart(3, '0')}
                  </span>
                  <span className="text-xs sm:text-sm font-black capitalize truncate max-w-[80px] sm:max-w-[100px] block">
                    {pokemon2.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onRemovePokemon(pokemon2.id)}
                  className="p-1 rounded-lg bg-[#FF4757] text-white border border-black hover:bg-rose-600 cursor-pointer transition-colors"
                  title="Remove from compare"
                >
                  <X className="w-3 h-3 stroke-[3]" />
                </button>
              </div>
            ) : (
    
              <div
                onClick={onOpenCompare}
                className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border-2 border-dashed border-black/50 text-slate-500 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                title="Click to pick 2nd Pokémon"
              >
                <div className="w-6 h-6 rounded-full bg-white dark:bg-slate-700 border border-black flex items-center justify-center">
                  <Plus className="w-3.5 h-3.5 stroke-[3] text-[#FF4757]" />
                </div>
                <span className="text-xs font-black text-slate-700 dark:text-slate-300 hidden xs:inline">
                  + Select Rival
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {!isReady && onRandomOpponent && (
              <button
                type="button"
                onClick={onRandomOpponent}
                className="flex items-center gap-1 px-2.5 py-2 rounded-2xl bg-[#FEF08A] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] text-xs font-black hover:bg-yellow-300 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer shrink-0"
                title="Pick a random rival to compare"
              >
                <Shuffle className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="hidden md:inline">Random Rival</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenCompare}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 rounded-2xl border-2 border-black font-black text-xs sm:text-sm shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer ${
                isReady
                  ? 'bg-[#A3E635] text-black hover:bg-[#86efac] animate-bounce'
                  : 'bg-[#C084FC] text-black hover:bg-purple-300'
              }`}
            >
              <Swords className="w-4 h-4 stroke-[2.5]" />
              <span>{isReady ? 'Battle Matrix!' : 'Compare (1/2)'}</span>
            </button>

            <button
              type="button"
              onClick={onClearCompare}
              className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-black dark:text-white border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#FF6B6B] hover:text-black transition-colors cursor-pointer shrink-0"
              title="Clear comparison tray"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

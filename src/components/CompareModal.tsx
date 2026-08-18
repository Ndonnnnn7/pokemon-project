import React from 'react';
import type { PokemonDetail } from '../types/pokemon';
import { getPokemonImage } from '../services/pokemonApi';
import { TypeBadge } from './TypeBadge';
import { X, Scale, Trophy, Plus, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  compareList: PokemonDetail[];
  onRemovePokemon: (id: number) => void;
  suggestedRivals?: PokemonDetail[];
  onSelectRival?: (pokemon: PokemonDetail) => void;
  onRandomOpponent?: () => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  compareList,
  onRemovePokemon,
  suggestedRivals,
  onSelectRival,
  onRandomOpponent,
}) => {
  if (!isOpen) return null;

  const pokemon1 = compareList[0];
  const pokemon2 = compareList[1];

  const getStat = (p: PokemonDetail | undefined, statName: string) => {
    return p?.stats.find((s) => s.stat.name === statName)?.base_stat || 0;
  };

  const statKeys = [
    { key: 'hp', label: 'HP', color: '#FF4757' },
    { key: 'attack', label: 'Attack', color: '#FFA502' },
    { key: 'defense', label: 'Defense', color: '#2ED573' },
    { key: 'special-attack', label: 'Sp. Atk', color: '#9B51E0' },
    { key: 'special-defense', label: 'Sp. Def', color: '#1E90FF' },
    { key: 'speed', label: 'Speed', color: '#ECCC68' },
  ];

  const total1 = pokemon1 ? pokemon1.stats.reduce((sum, s) => sum + s.base_stat, 0) : 0;
  const total2 = pokemon2 ? pokemon2.stats.reduce((sum, s) => sum + s.base_stat, 0) : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs animate-fadeIn font-['Space_Grotesk']"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border-[4px] border-black rounded-[2.5rem] p-5 sm:p-7 shadow-[10px_10px_0px_0px_#000] overflow-hidden flex flex-col text-black dark:text-white animate-scaleUp"
      >
        <div className="flex items-center justify-between pb-4 border-b-[3px] border-black">
          <div className="flex items-center gap-3">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-[#C084FC] text-black border-2 border-black shadow-[3px_3px_0px_0px_#000]">
              <Scale className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-2xl font-black uppercase">Head-to-Head Compare</h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#A3E635] text-black border border-black shadow-xs">
                  {compareList.length} / 2 Selected
                </span>
              </div>
              <p className="text-xs font-extrabold text-slate-600 dark:text-slate-400">
                {compareList.length === 2
                  ? 'Battle stat matrix analysis & matchup verdict'
                  : compareList.length === 1
                  ? `Showing 1 Pokémon: ${pokemon1.name}. Select a second Pokémon to unlock comparison!`
                  : 'Select 2 Pokémon cards using the scale icon to compare stats'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 sm:p-2.5 rounded-2xl bg-[#FF4757] text-white border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:bg-rose-600 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
          </button>
        </div>

        {compareList.length === 0 ? (
          <div className="py-14 flex flex-col items-center justify-center text-center text-slate-500">
            <div className="p-4 rounded-3xl bg-slate-100 dark:bg-slate-800 border-[3px] border-black shadow-[4px_4px_0px_0px_#000] mb-3">
              <Scale className="w-12 h-12 text-black dark:text-white stroke-[2.5]" />
            </div>
            <p className="font-black text-lg text-black dark:text-white">No Pokémon in Compare Deck</p>
            <p className="text-xs font-extrabold text-slate-500 max-w-sm mt-1">
              Click the <span className="font-black text-black dark:text-white">⚖️ Scale icon</span> on any Pokémon card to add them to your head-to-head comparison.
            </p>
          </div>
        ) : (
          <div className="py-4 px-1 sm:px-2 pr-3.5 sm:pr-4.5 space-y-5 overflow-y-auto max-h-[65vh] custom-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pokemon1 && (
                <div className="relative flex flex-col items-center p-4 rounded-3xl bg-[#BAE6FD] dark:bg-slate-800 border-[3px] border-black shadow-[4px_4px_0px_0px_#000] text-center overflow-hidden">
                  <button
                    type="button"
                    onClick={() => onRemovePokemon(pokemon1.id)}
                    className="absolute top-3 right-3 p-1.5 rounded-xl bg-[#FF4757] text-white border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-rose-600 transition-all cursor-pointer z-10"
                    title={`Remove ${pokemon1.name}`}
                  >
                    <X className="w-3.5 h-3.5 stroke-[3]" />
                  </button>

                  <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-lg bg-white/90 dark:bg-slate-900/90 border border-black shadow-xs mb-1">
                    #{String(pokemon1.id).padStart(3, '0')}
                  </span>

                  <img
                    src={getPokemonImage(pokemon1)}
                    alt={pokemon1.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-md my-1 animate-float"
                  />

                  <h4 className="text-lg sm:text-xl font-black capitalize text-black dark:text-white">
                    {pokemon1.name}
                  </h4>

                  <div className="flex flex-wrap gap-1 mt-1.5 justify-center">
                    {pokemon1.types.map((t) => (
                      <TypeBadge key={t.type.name} type={t.type.name} size="sm" />
                    ))}
                  </div>

                  <div className="mt-3 w-full pt-2 border-t-2 border-black/15 flex justify-between items-center text-xs font-black">
                    <span className="text-slate-700 dark:text-slate-300">Total Stats:</span>
                    <span className="bg-[#A3E635] text-black px-2.5 py-0.5 rounded-lg border border-black shadow-xs">
                      {total1}
                    </span>
                  </div>
                </div>
              )}

              {pokemon2 ? (
                <div className="relative flex flex-col items-center p-4 rounded-3xl bg-[#FEF08A] dark:bg-slate-800 border-[3px] border-black shadow-[4px_4px_0px_0px_#000] text-center overflow-hidden">
                  <button
                    type="button"
                    onClick={() => onRemovePokemon(pokemon2.id)}
                    className="absolute top-3 right-3 p-1.5 rounded-xl bg-[#FF4757] text-white border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-rose-600 transition-all cursor-pointer z-10"
                    title={`Remove ${pokemon2.name}`}
                  >
                    <X className="w-3.5 h-3.5 stroke-[3]" />
                  </button>

                  <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-lg bg-white/90 dark:bg-slate-900/90 border border-black shadow-xs mb-1">
                    #{String(pokemon2.id).padStart(3, '0')}
                  </span>

                  <img
                    src={getPokemonImage(pokemon2)}
                    alt={pokemon2.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-md my-1 animate-float-reverse"
                  />

                  <h4 className="text-lg sm:text-xl font-black capitalize text-black dark:text-white">
                    {pokemon2.name}
                  </h4>

                  <div className="flex flex-wrap gap-1 mt-1.5 justify-center">
                    {pokemon2.types.map((t) => (
                      <TypeBadge key={t.type.name} type={t.type.name} size="sm" />
                    ))}
                  </div>

                  <div className="mt-3 w-full pt-2 border-t-2 border-black/15 flex justify-between items-center text-xs font-black">
                    <span className="text-slate-700 dark:text-slate-300">Total Stats:</span>
                    <span className="bg-[#A3E635] text-black px-2.5 py-0.5 rounded-lg border border-black shadow-xs">
                      {total2}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-between p-4 sm:p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border-[3px] border-dashed border-black/50 text-center min-h-[240px]">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] mb-1.5">
                      <Plus className="w-5 h-5 stroke-[3] text-[#FF4757] animate-pulse" />
                    </div>
                    <h4 className="text-sm sm:text-base font-black text-black dark:text-white uppercase">
                      Select 2nd Pokémon
                    </h4>
                    <p className="text-[11px] font-extrabold text-slate-500 max-w-[220px] mt-0.5 mb-2.5">
                      Choose a rival below or roll a random matchup!
                    </p>
                  </div>
                  {suggestedRivals && suggestedRivals.length > 0 && (
                    <div className="w-full my-1">
                      <span className="block text-[9px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        ⚡ Quick Rival Picks:
                      </span>
                      <div className="flex flex-wrap gap-1.5 justify-center">
                        {suggestedRivals.slice(0, 4).map((rival) => (
                          <button
                            key={rival.id}
                            type="button"
                            onClick={() => onSelectRival && onSelectRival(rival)}
                            className="flex items-center gap-1 px-2 py-1 rounded-xl bg-white dark:bg-slate-800 text-black dark:text-white border-2 border-black text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#FEF08A] hover:text-black transition-all cursor-pointer"
                          >
                            <img
                              src={getPokemonImage(rival)}
                              alt={rival.name}
                              className="w-4 h-4 object-contain"
                            />
                            <span className="capitalize text-[11px]">{rival.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-2 w-full justify-center">
                    {onRandomOpponent && (
                      <button
                        type="button"
                        onClick={onRandomOpponent}
                        className="px-3 py-1.5 rounded-xl bg-[#FEF08A] text-black text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-yellow-300 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                      >
                        🎲 Random Rival
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-black dark:text-white text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-slate-100 dark:hover:bg-slate-700 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                    >
                      Browse Cards
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2.5 bg-slate-50 dark:bg-slate-800/80 p-4 rounded-3xl border-[3px] border-black shadow-[4px_4px_0px_0px_#000]">
              <div className="flex items-center justify-between pb-2 border-b-2 border-black/10 text-xs font-black uppercase text-slate-700 dark:text-slate-300">
                <span className="w-2/5 text-left truncate">{pokemon1.name}</span>
                <span className="w-1/5 text-center text-[10px] text-slate-500">BATTLE STAT</span>
                <span className="w-2/5 text-right truncate">
                  {pokemon2 ? pokemon2.name : 'Opponent'}
                </span>
              </div>

              {statKeys.map((s) => {
                const val1 = getStat(pokemon1, s.key);
                const val2 = pokemon2 ? getStat(pokemon2, s.key) : 0;
                const isP1Higher = pokemon2 ? val1 > val2 : false;
                const isP2Higher = pokemon2 ? val2 > val1 : false;

                const percent1 = Math.min(Math.round((val1 / 255) * 100), 100);
                const percent2 = pokemon2 ? Math.min(Math.round((val2 / 255) * 100), 100) : 0;

                return (
                  <div key={s.key} className="space-y-1">
                    <div className="grid grid-cols-5 items-center gap-2 text-xs sm:text-sm">
                      <div
                        className={`col-span-2 text-left font-black px-3 py-1.5 rounded-xl border-2 border-black transition-all ${
                          isP1Higher
                            ? 'bg-[#A3E635] text-black shadow-[2px_2px_0px_0px_#000]'
                            : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <span className="font-extrabold text-sm">{val1}</span>
                        {isP1Higher && (
                          <Trophy className="inline w-3.5 h-3.5 ml-1 text-black fill-yellow-400 stroke-[2.5]" />
                        )}
                      </div>

                      <div className="text-center font-black text-black dark:text-white text-[11px] uppercase tracking-wider">
                        {s.label}
                      </div>

                      <div
                        className={`col-span-2 text-right font-black px-3 py-1.5 rounded-xl border-2 border-black transition-all ${
                          pokemon2
                            ? isP2Higher
                              ? 'bg-[#A3E635] text-black shadow-[2px_2px_0px_0px_#000]'
                              : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 text-center italic text-xs'
                        }`}
                      >
                        {pokemon2 ? (
                          <>
                            {isP2Higher && (
                              <Trophy className="inline w-3.5 h-3.5 mr-1 text-black fill-yellow-400 stroke-[2.5]" />
                            )}
                            <span className="font-extrabold text-sm">{val2}</span>
                          </>
                        ) : (
                          '--'
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 px-0.5">
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 border border-black overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percent1}%` }}
                          style={{ backgroundColor: s.color }}
                          className="h-full rounded-full"
                        />
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 border border-black overflow-hidden flex justify-end">
                        {pokemon2 ? (
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percent2}%` }}
                            style={{ backgroundColor: s.color }}
                            className="h-full rounded-full"
                          />
                        ) : (
                          <div className="w-0 h-full" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="pt-3 border-t-2 border-black flex items-center justify-between font-black text-xs sm:text-sm">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-yellow-500 stroke-[2.5]" />
                  <span>TOTAL BASE STAT:</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-[#BAE6FD] text-black px-3 py-0.5 rounded-full border border-black shadow-xs font-black">
                    {total1}
                  </span>
                  <span className="text-slate-400">vs</span>
                  <span
                    className={`px-3 py-0.5 rounded-full border border-black shadow-xs font-black ${
                      pokemon2
                        ? 'bg-[#FEF08A] text-black'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                    }`}
                  >
                    {pokemon2 ? total2 : '--'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

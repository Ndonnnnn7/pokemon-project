import React, { useState, useEffect } from 'react';
import type { PokemonDetail } from '../types/pokemon';
import { TypeBadge } from './TypeBadge';
import {
  Dumbbell,
  Ruler,
  Award,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PokemonAboutTabProps {
  pokemon: PokemonDetail;
}

const TYPE_DEFENSES: Record<string, { weakTo: string[]; resists: string[]; immuneTo: string[] }> = {
  normal: { weakTo: ['fighting'], resists: [], immuneTo: ['ghost'] },
  fire: { weakTo: ['water', 'ground', 'rock'], resists: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'], immuneTo: [] },
  water: { weakTo: ['electric', 'grass'], resists: ['fire', 'water', 'ice', 'steel'], immuneTo: [] },
  electric: { weakTo: ['ground'], resists: ['electric', 'flying', 'steel'], immuneTo: [] },
  grass: { weakTo: ['fire', 'ice', 'poison', 'flying', 'bug'], resists: ['water', 'electric', 'grass', 'ground'], immuneTo: [] },
  ice: { weakTo: ['fire', 'fighting', 'rock', 'steel'], resists: ['ice'], immuneTo: [] },
  fighting: { weakTo: ['flying', 'psychic', 'fairy'], resists: ['bug', 'rock', 'dark'], immuneTo: [] },
  poison: { weakTo: ['ground', 'psychic'], resists: ['grass', 'fighting', 'poison', 'bug', 'fairy'], immuneTo: [] },
  ground: { weakTo: ['water', 'grass', 'ice'], resists: ['poison', 'rock'], immuneTo: ['electric'] },
  flying: { weakTo: ['electric', 'ice', 'rock'], resists: ['grass', 'fighting', 'bug'], immuneTo: ['ground'] },
  psychic: { weakTo: ['bug', 'ghost', 'dark'], resists: ['fighting', 'psychic'], immuneTo: [] },
  bug: { weakTo: ['fire', 'flying', 'rock'], resists: ['grass', 'fighting', 'ground'], immuneTo: [] },
  rock: { weakTo: ['water', 'grass', 'fighting', 'ground', 'steel'], resists: ['normal', 'fire', 'poison', 'flying'], immuneTo: [] },
  ghost: { weakTo: ['ghost', 'dark'], resists: ['poison', 'bug'], immuneTo: ['normal', 'fighting'] },
  dragon: { weakTo: ['ice', 'dragon', 'fairy'], resists: ['fire', 'water', 'electric', 'grass'], immuneTo: [] },
  dark: { weakTo: ['fighting', 'bug', 'fairy'], resists: ['ghost', 'dark'], immuneTo: ['psychic'] },
  steel: { weakTo: ['fire', 'fighting', 'ground'], resists: ['normal', 'grass', 'ice', 'flying', 'psychic', 'bug', 'rock', 'dragon', 'steel', 'fairy'], immuneTo: ['poison'] },
  fairy: { weakTo: ['poison', 'steel'], resists: ['fighting', 'bug', 'dark'], immuneTo: ['dragon'] },
};

export const PokemonAboutTab: React.FC<PokemonAboutTabProps> = ({ pokemon }) => {
  const heightInM = (pokemon.height / 10).toFixed(1);
  const heightInFt = (pokemon.height * 0.328084).toFixed(1);
  const weightInKg = (pokemon.weight / 10).toFixed(1);
  const weightInLbs = ((pokemon.weight / 10) * 2.20462).toFixed(1);

  const artworkOfficial = pokemon.sprites.other?.['official-artwork']?.front_default;
  const artworkShiny = pokemon.sprites.other?.['official-artwork']?.front_shiny;
  const spriteFront = pokemon.sprites.front_default;
  const spriteShiny = pokemon.sprites.front_shiny;
  const spriteBack = pokemon.sprites.back_default;
  const spriteHome = pokemon.sprites.other?.home?.front_default;

  type ViewMode = 'official' | 'shiny' | 'pixel' | 'back' | 'home';
  const [activeSpriteView, setActiveSpriteView] = useState<ViewMode>('official');
  const [stageImageLoaded, setStageImageLoaded] = useState(false);

  useEffect(() => {
    setStageImageLoaded(false);
  }, [activeSpriteView, pokemon.id]);

  const currentPreviewImage = (() => {
    switch (activeSpriteView) {
      case 'shiny':
        return artworkShiny || spriteShiny || artworkOfficial;
      case 'pixel':
        return spriteFront || artworkOfficial;
      case 'back':
        return spriteBack || spriteFront || artworkOfficial;
      case 'home':
        return spriteHome || artworkOfficial;
      case 'official':
      default:
        return artworkOfficial || spriteFront;
    }
  })();

  const typeNames = pokemon.types.map((t) => t.type.name.toLowerCase());
  const weaknessesSet = new Set<string>();
  const resistancesSet = new Set<string>();
  const immunitiesSet = new Set<string>();

  typeNames.forEach((t) => {
    const defense = TYPE_DEFENSES[t];
    if (defense) {
      defense.weakTo.forEach((w) => weaknessesSet.add(w));
      defense.resists.forEach((r) => resistancesSet.add(r));
      defense.immuneTo.forEach((i) => immunitiesSet.add(i));
    }
  });

  immunitiesSet.forEach((i) => {
    weaknessesSet.delete(i);
    resistancesSet.delete(i);
  });

  const weaknesses = Array.from(weaknessesSet);
  const resistances = Array.from(resistancesSet);

  const weightVal = parseFloat(weightInKg);
  const weightClass =
    weightVal > 150 ? 'Super Heavyweight' : weightVal > 60 ? 'Heavyweight' : weightVal > 20 ? 'Standard Weight' : 'Lightweight';

  const heightVal = parseFloat(heightInM);
  const heightClass =
    heightVal > 2.2 ? 'Titan Sized' : heightVal > 1.4 ? 'Human Sized' : heightVal > 0.6 ? 'Standard' : 'Pocket Sized';

  return (
    <div className="w-full space-y-5 font-['Space_Grotesk'] text-black dark:text-white">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <motion.div
          whileHover={{ y: -2 }}
          className="p-4 rounded-3xl bg-[#FEF08A] text-black border-[3px] border-black shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-2xl bg-white border-2 border-black shadow-xs">
              <Dumbbell className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-wider">
              {weightClass}
            </span>
          </div>

          <div className="mt-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 block">
              Body Mass
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black">{weightInKg} kg</span>
              <span className="text-xs font-extrabold text-slate-800">({weightInLbs} lbs)</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="p-4 rounded-3xl bg-[#38BDF8] text-black border-[3px] border-black shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-2xl bg-white border-2 border-black shadow-xs">
              <Ruler className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-wider">
              {heightClass}
            </span>
          </div>

          <div className="mt-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 block">
              Body Height
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black">{heightInM} m</span>
              <span className="text-xs font-extrabold text-slate-900">({heightInFt} ft)</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="p-4 rounded-3xl bg-[#A3E635] text-black border-[3px] border-black shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-2xl bg-white border-2 border-black shadow-xs">
              <Award className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-wider">
              Combat Ready
            </span>
          </div>

          <div className="mt-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 block">
              Base Experience Yield
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black">{pokemon.base_experience || '64'}</span>
              <span className="text-xs font-extrabold text-slate-900">EXP points</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border-[3px] border-black shadow-[5px_5px_0px_0px_#000]">
        <div className="flex items-center justify-between mb-3.5 pb-2 border-b-2 border-black/10 dark:border-white/10">
          <div className="flex items-center gap-2">
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-black dark:text-white">
              SPECIAL ABILITIES
            </h4>
          </div>
          <span className="text-[10px] font-black text-slate-500 uppercase">
            {pokemon.abilities.length} {pokemon.abilities.length === 1 ? 'Ability' : 'Abilities'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {pokemon.abilities.map((a, idx) => (
            <motion.div
              key={a.ability.name}
              whileHover={{ y: -2 }}
              className={`p-3.5 rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_#000] flex items-center justify-between ${
                a.is_hidden
                  ? 'bg-purple-50 dark:bg-purple-950/30'
                  : 'bg-emerald-50 dark:bg-emerald-950/30'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-xl border-2 border-black flex items-center justify-center font-black text-xs shadow-xs ${
                    a.is_hidden ? 'bg-[#C084FC] text-black' : 'bg-[#A3E635] text-black'
                  }`}
                >
                  {idx + 1}
                </div>
                <div>
                  <span className="text-sm font-black capitalize text-black dark:text-white block">
                    {a.ability.name.replace('-', ' ')}
                  </span>
                  <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400">
                    {a.is_hidden ? 'Rare hidden innate trait' : 'Active battle passive trait'}
                  </span>
                </div>
              </div>

              <span
                className={`px-2.5 py-1 rounded-xl border border-black text-[10px] font-black uppercase shadow-xs ${
                  a.is_hidden
                    ? 'bg-[#C084FC] text-black'
                    : 'bg-[#A3E635] text-black'
                }`}
              >
                {a.is_hidden ? 'Hidden' : 'Standard'}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border-[3px] border-black shadow-[5px_5px_0px_0px_#000]">
        <div className="flex items-center gap-2 mb-3.5 pb-2 border-b-2 border-black/10 dark:border-white/10">
          <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-black dark:text-white">
            ELEMENTAL DEFENSES & BATTLE MATCHUPS
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-2xl bg-rose-50/80 dark:bg-rose-950/20 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
            <div className="flex items-center gap-1.5 mb-2.5">
              <ShieldAlert className="w-4 h-4 text-[#FF4757] stroke-[2.5]" />
              <span className="text-xs font-black uppercase tracking-wider text-[#FF4757]">
                Weak Against (Takes 2x Damage)
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {weaknesses.length > 0 ? (
                weaknesses.map((t) => <TypeBadge key={t} type={t} size="sm" />)
              ) : (
                <span className="text-xs font-bold text-slate-500">No elemental weaknesses!</span>
              )}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/20 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
            <div className="flex items-center gap-1.5 mb-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
              <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Resistant To (Takes 0.5x Damage)
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {resistances.length > 0 ? (
                resistances.map((t) => <TypeBadge key={t} type={t} size="sm" />)
              ) : (
                <span className="text-xs font-bold text-slate-500">Normal damage taken</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border-[3px] border-black shadow-[5px_5px_0px_0px_#000]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b-2 border-black/10 dark:border-white/10">
          <div className="flex items-center gap-2">
            <div>
              <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-black dark:text-white">
                SPRITE VARIATIONS & 3D ART STUDIO
              </h4>
              <p className="text-[11px] font-bold text-slate-500">
                Interactive Multi-Angle Renders & Shiny Variations
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 p-1">
            <button
              type="button"
              onClick={() => setActiveSpriteView('official')}
              className={`px-3 py-1.5 rounded-xl border-2 border-black text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeSpriteView === 'official'
                  ? 'bg-[#A3E635] text-black shadow-[2px_2px_0px_0px_#000] scale-105'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#A3E635] hover:text-black dark:hover:bg-slate-700 dark:hover:text-white'
              }`}
            >
            Official Art
            </button>

            {artworkShiny || spriteShiny ? (
              <button
                type="button"
                onClick={() => setActiveSpriteView('shiny')}
                className={`px-3 py-1.5 rounded-xl border-2 border-black text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  activeSpriteView === 'shiny'
                    ? 'bg-[#FACC15] text-black shadow-[2px_2px_0px_0px_#000] scale-105'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#FACC15] hover:text-black dark:hover:bg-slate-700 dark:hover:text-white'
                }`}
              >
                Shiny Form
              </button>
            ) : null}

            {spriteFront ? (
              <button
                type="button"
                onClick={() => setActiveSpriteView('pixel')}
                className={`px-3 py-1.5 rounded-xl border-2 border-black text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  activeSpriteView === 'pixel'
                    ? 'bg-[#38BDF8] text-black shadow-[2px_2px_0px_0px_#000] scale-105'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#38BDF8] hover:text-black dark:hover:bg-slate-700 dark:hover:text-white'
                }`}
              >
              Retro Pixel
              </button>
            ) : null}

            {spriteBack ? (
              <button
                type="button"
                onClick={() => setActiveSpriteView('back')}
                className={`px-3 py-1.5 rounded-xl border-2 border-black text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  activeSpriteView === 'back'
                    ? 'bg-[#C084FC] text-black shadow-[2px_2px_0px_0px_#000] scale-105'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#C084FC] hover:text-black dark:hover:bg-slate-700 dark:hover:text-white'
                }`}
              >
              Back Angle
              </button>
            ) : null}
          </div>
        </div>

        <div className="relative w-full h-64 sm:h-72 rounded-3xl bg-slate-100 dark:bg-slate-800/80 border-2 border-black p-4 flex flex-col items-center justify-center overflow-hidden shadow-[inset_0_2px_6px_rgba(0,0,0,0.1)]">
          <div className="absolute w-48 h-48 rounded-full bg-[#FFE600] opacity-25 blur-xl pointer-events-none" />

          {!stageImageLoaded && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 pointer-events-none bg-slate-100/70 dark:bg-slate-900/70 backdrop-blur-[1px] animate-fadeIn">
              <div className="relative w-11 h-11 rounded-full border-[3px] border-black bg-white animate-spin flex items-center justify-center shadow-[3px_3px_0px_0px_#000] overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-[#FF4757] border-b-2 border-black" />
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white" />
                <div className="relative z-10 w-3 h-3 rounded-full bg-white border-2 border-black" />
              </div>
              <span className="px-2.5 py-0.5 rounded-md bg-black text-white text-[10px] font-black tracking-wider uppercase shadow-[2px_2px_0px_0px_#FFF] animate-pulse">
                Loading...
              </span>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.img
              key={activeSpriteView}
              src={currentPreviewImage || ''}
              alt={`${pokemon.name} - ${activeSpriteView}`}
              onLoad={() => setStageImageLoaded(true)}
              onError={() => setStageImageLoaded(true)}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: stageImageLoaded ? 1 : 0, scale: stageImageLoaded ? 1 : 0.9, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              transition={{ duration: 0.25 }}
              className={`relative z-10 object-contain drop-shadow-[0_12px_16px_rgba(0,0,0,0.3)] animate-float ${
                activeSpriteView === 'pixel' || activeSpriteView === 'back' || (activeSpriteView === 'shiny' && !artworkShiny)
                  ? 'w-40 h-40 sm:w-48 sm:h-48 [image-rendering:pixelated] [image-rendering:crisp-edges]'
                  : 'max-h-48 max-w-48 sm:max-h-56 sm:max-w-56'
              }`}
            />
          </AnimatePresence>

          <div className="absolute bottom-2.5 left-4 right-4 flex items-center justify-between pointer-events-none">
            <span className="px-3 py-1 rounded-xl bg-black/80 text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-xs shadow-xs">
              Viewing: {activeSpriteView.toUpperCase()} MODE
            </span>
            {activeSpriteView === 'shiny' && (
              <span className="px-2.5 py-1 rounded-xl bg-[#FACC15] text-black text-[10px] font-black uppercase border border-black shadow-xs">
              Shiny
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
          {spriteFront && (
            <button
              type="button"
              onClick={() => setActiveSpriteView('pixel')}
              className={`p-3 rounded-2xl border-2 border-black flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group ${
                activeSpriteView === 'pixel'
                  ? 'bg-[#BAE6FD] text-black shadow-[3px_3px_0px_0px_#000] scale-102'
                  : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-[2px_2px_0px_0px_#000] hover:bg-[#BAE6FD] hover:text-black dark:hover:bg-slate-700 dark:hover:text-white'
              }`}
            >
              <img
                src={spriteFront}
                alt="Normal Pixel"
                className="w-20 h-20 object-contain [image-rendering:pixelated] [image-rendering:crisp-edges] transition-transform duration-200 group-hover:scale-110"
              />
              <span className="text-xs font-black tracking-wide">
              Pixel Normal
              </span>
            </button>
          )}

          {spriteShiny && (
            <button
              type="button"
              onClick={() => setActiveSpriteView('shiny')}
              className={`p-3 rounded-2xl border-2 border-black flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group ${
                activeSpriteView === 'shiny'
                  ? 'bg-[#FEF08A] text-black shadow-[3px_3px_0px_0px_#000] scale-102'
                  : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-[2px_2px_0px_0px_#000] hover:bg-[#FEF08A] hover:text-black dark:hover:bg-slate-700 dark:hover:text-white'
              }`}
            >
              <img
                src={spriteShiny}
                alt="Shiny Pixel"
                className="w-20 h-20 object-contain [image-rendering:pixelated] [image-rendering:crisp-edges] transition-transform duration-200 group-hover:scale-110"
              />
              <span className="text-xs font-black tracking-wide">
              Shiny Pixel
              </span>
            </button>
          )}

          {spriteBack && (
            <button
              type="button"
              onClick={() => setActiveSpriteView('back')}
              className={`p-3 rounded-2xl border-2 border-black flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group ${
                activeSpriteView === 'back'
                  ? 'bg-[#C084FC] text-black shadow-[3px_3px_0px_0px_#000] scale-102'
                  : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-[2px_2px_0px_0px_#000] hover:bg-[#C084FC] hover:text-black dark:hover:bg-slate-700 dark:hover:text-white'
              }`}
            >
              <img
                src={spriteBack}
                alt="Back Sprite"
                className="w-20 h-20 object-contain [image-rendering:pixelated] [image-rendering:crisp-edges] transition-transform duration-200 group-hover:scale-110"
              />
              <span className="text-xs font-black tracking-wide">
              Back Angle
              </span>
            </button>
          )}

          {artworkOfficial && (
            <button
              type="button"
              onClick={() => setActiveSpriteView('official')}
              className={`p-3 rounded-2xl border-2 border-black flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group ${
                activeSpriteView === 'official'
                  ? 'bg-[#A3E635] text-black shadow-[3px_3px_0px_0px_#000] scale-102'
                  : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-[2px_2px_0px_0px_#000] hover:bg-[#A3E635] hover:text-black dark:hover:bg-slate-700 dark:hover:text-white'
              }`}
            >
              <img
                src={artworkOfficial}
                alt="Official Art"
                className="w-20 h-20 object-contain transition-transform duration-200 group-hover:scale-110"
              />
              <span className="text-xs font-black tracking-wide">
              Official Art
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

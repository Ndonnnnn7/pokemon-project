import React, { useState } from 'react';
import type { PokemonDetail } from '../types/pokemon';
import { getPokemonImage } from '../services/pokemonApi';
import { TypeBadge } from './TypeBadge';
import { Heart, Swords } from 'lucide-react';

interface PokemonCardProps {
  pokemon: PokemonDetail;
  onSelect: (pokemon: PokemonDetail) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (pokemon: PokemonDetail, e: React.MouseEvent) => void;
  isInCompare?: boolean;
  onToggleCompare?: (pokemon: PokemonDetail, e: React.MouseEvent) => void;
  onTypeClick?: (type: string) => void;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  onSelect,
  isFavorite = false,
  onToggleFavorite,
  isInCompare = false,
  onToggleCompare,
  onTypeClick,
}) => {
  const formattedId = `#${String(pokemon.id).padStart(3, '0')}`;
  const imageUrl = getPokemonImage(pokemon);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [prevImage, setPrevImage] = useState(imageUrl);

  if (imageUrl !== prevImage) {
    setPrevImage(imageUrl);
    setImageLoaded(false);
  }

  const hp = pokemon.stats.find((s) => s.stat.name === 'hp')?.base_stat || 0;
  const attack = pokemon.stats.find((s) => s.stat.name === 'attack')?.base_stat || 0;

  return (
    <div
      onClick={() => onSelect(pokemon)}
      className={`group relative flex flex-col rounded-[2.5rem] bg-white dark:bg-slate-900 border-[3.5px] p-4.5 transition-all duration-200 cursor-pointer overflow-hidden font-['Space_Grotesk'] ${
        isInCompare
          ? 'border-black ring-4 ring-[#C084FC] shadow-[8px_8px_0px_0px_#000] -translate-y-1'
          : 'border-black shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 hover:shadow-[9px_9px_0px_0px_#000]'
      }`}
    >
      <div className="relative z-10 flex items-center justify-between w-full mb-3">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#FF4757] border-2 border-black shadow-xs" />
          <div className="w-3 h-3 rounded-full bg-[#38BDF8] border-2 border-black shadow-xs" />
          {isInCompare && (
            <span className="ml-1 px-1.5 py-0.2 rounded-md bg-[#C084FC] text-black border border-black text-[9px] font-black uppercase shadow-xs animate-pulse">
              ⚔️ In VS
            </span>
          )}
        </div>

        <div className="px-3 py-0.5 rounded-xl bg-white dark:bg-slate-800 text-black dark:text-white border-2 border-black shadow-[2px_2px_0px_0px_#000] font-black text-xs sm:text-sm">
          {formattedId}
        </div>
      </div>

      <div className="relative z-10 w-full rounded-2xl bg-[#BAE6FD] dark:bg-slate-800/90 border-[2.5px] border-black p-3 flex flex-col justify-center items-center h-44 overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-0 w-full h-full opacity-65 group-hover:rotate-12 transition-transform duration-500 ease-out pointer-events-none"
        >
          <path
            d="M 10,100 A 90,90 0 0,1 190,100 Z"
            fill="#FF4757"
            stroke="#000000"
            strokeWidth="8"
          />
          <path
            d="M 10,100 A 90,90 0 0,0 190,100 Z"
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="8"
          />
          <line x1="10" y1="100" x2="190" y2="100" stroke="#000000" strokeWidth="12" />
          <circle cx="100" cy="100" r="30" fill="#FFFFFF" stroke="#000000" strokeWidth="10" />
          <circle cx="100" cy="100" r="14" fill="#000000" />
        </svg>

        {!imageLoaded && (
          <div className="absolute inset-0 z-15 flex flex-col items-center justify-center gap-1.5 pointer-events-none bg-slate-100/70 dark:bg-slate-800/70 backdrop-blur-[1px] animate-fadeIn">
            <div className="relative w-9 h-9 rounded-full border-[2.5px] border-black bg-white animate-spin flex items-center justify-center shadow-[2px_2px_0px_0px_#000] overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-[#FF4757] border-b-2 border-black" />
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white" />
              <div className="relative z-10 w-2.5 h-2.5 rounded-full bg-white border-2 border-black" />
            </div>
            <span className="px-2 py-0.5 rounded-md bg-black text-white text-[9px] font-black tracking-wider uppercase shadow-[1.5px_1.5px_0px_0px_#FFF] animate-pulse">
              Loading...
            </span>
          </div>
        )}

        <div className="absolute top-2 right-2 z-20 flex items-center gap-1.5">
          {onToggleCompare && (
            <button
              type="button"
              title={isInCompare ? 'Remove from VS compare' : 'Add to VS compare'}
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare(pokemon, e);
              }}
              className={`flex items-center gap-1 px-2 py-1 rounded-xl border-2 border-black transition-all cursor-pointer font-black text-[10px] uppercase shadow-[2px_2px_0px_0px_#000] ${
                isInCompare
                  ? 'bg-[#C084FC] text-black scale-105 ring-2 ring-black'
                  : 'bg-white/95 dark:bg-slate-800/95 text-black dark:text-white hover:bg-[#C084FC] hover:text-black'
              }`}
            >
              <Swords className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{isInCompare ? 'VS ✓' : 'VS'}</span>
            </button>
          )}

          {onToggleFavorite && (
            <button
              type="button"
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(pokemon, e);
              }}
              className={`p-1.5 rounded-xl border-2 border-black transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-[#FF6B6B] text-black shadow-[2px_2px_0px_0px_#000] scale-105'
                  : 'bg-white/95 dark:bg-slate-800/95 text-black dark:text-white shadow-[2px_2px_0px_0px_#000] hover:bg-[#FF6B6B] hover:text-black dark:hover:bg-[#FF6B6B] dark:hover:text-black'
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 stroke-[2.5] ${
                  isFavorite ? 'fill-black' : ''
                }`}
              />
            </button>
          )}
        </div>

        <img
          src={imageUrl}
          alt={pokemon.name}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
          className={`relative z-10 h-32 w-32 object-contain drop-shadow-[0_8px_8px_rgba(0,0,0,0.3)] transition-all duration-300 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        />

        <div className="absolute bottom-2 right-2.5 z-20 flex flex-col gap-0.5 opacity-80">
          <div className="w-5 h-1 bg-black rounded-full" />
          <div className="w-5 h-1 bg-black rounded-full" />
        </div>
      </div>

      <div className="relative z-10 text-center my-2.5">
        <h3 className="text-xl font-black text-black dark:text-white capitalize truncate group-hover:text-[#FF4757] dark:group-hover:text-[#FACC15] transition-colors">
          {pokemon.name}
        </h3>
      </div>

      <div className="relative z-10 flex flex-wrap justify-center gap-1.5 mb-3.5">
        {pokemon.types.map((t) => (
          <TypeBadge
            key={t.type.name}
            type={t.type.name}
            size="sm"
            onClick={
              onTypeClick
                ? () => {
                    onTypeClick(t.type.name);
                  }
                : undefined
            }
          />
        ))}
      </div>

      <div className="relative z-10 mt-auto pt-2.5 border-t-2 border-black/10 dark:border-white/10 grid grid-cols-2 gap-2 text-center text-xs">
        <div className="bg-[#FEF08A] text-black border-2 border-black rounded-xl py-1 px-2 shadow-[2px_2px_0px_0px_#000]">
          <span className="block text-[9px] uppercase font-black tracking-wider text-slate-800">HP</span>
          <span className="font-extrabold text-sm">{hp}</span>
        </div>
        <div className="bg-[#A3E635] text-black border-2 border-black rounded-xl py-1 px-2 shadow-[2px_2px_0px_0px_#000]">
          <span className="block text-[9px] uppercase font-black tracking-wider text-slate-800">ATTACK</span>
          <span className="font-extrabold text-sm">{attack}</span>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import type { PokemonDetail } from '../types/pokemon';
import { getPokemonImage } from '../services/pokemonApi';
import { TypeBadge } from './TypeBadge';
import { StatRadarChart } from './StatRadarChart';
import { PokemonMovesArsenal } from './PokemonMovesArsenal';
import { PokemonAboutTab } from './PokemonAboutTab';
import { getTypeColor } from '../styles/typeColors';
import { X, Heart, Scale, Share2, Check } from 'lucide-react';

interface PokemonModalProps {
  pokemon: PokemonDetail | null;
  onClose: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (pokemon: PokemonDetail) => void;
  isInCompare?: boolean;
  onToggleCompare?: (pokemon: PokemonDetail) => void;
}

export const PokemonModal: React.FC<PokemonModalProps> = ({
  pokemon,
  onClose,
  isFavorite = false,
  onToggleFavorite,
  isInCompare = false,
  onToggleCompare,
}) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'about' | 'moves'>('stats');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShareLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!pokemon) return;
    const shareUrl = `${window.location.origin}/pokemon/${pokemon.name.toLowerCase()}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (pokemon) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [pokemon, onClose]);

  if (!pokemon) return null;

  const formattedId = `#${String(pokemon.id).padStart(3, '0')}`;
  const imageUrl = getPokemonImage(pokemon);

  const heightInM = (pokemon.height / 10).toFixed(1);
  const weightInKg = (pokemon.weight / 10).toFixed(1);

  const primaryType = pokemon.types[0]?.type.name || 'normal';
  const typeColor = getTypeColor(primaryType);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs animate-fadeIn font-['Space_Grotesk']"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl lg:max-w-4xl max-h-[92vh] bg-white dark:bg-slate-900 rounded-[2.5rem] border-[4px] border-black shadow-[10px_10px_0px_0px_#000] overflow-hidden flex flex-col animate-scaleUp"
      >
        <div className="relative z-20 flex items-center justify-between px-5 sm:px-6 pt-4 pb-2 bg-[#BAE6FD] dark:bg-slate-800 border-b-2 border-black/15 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded-full bg-[#FF4757] border-2 border-black shadow-xs" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#FACC15] border-2 border-black shadow-xs" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#4ADE80] border-2 border-black shadow-xs" />
            </div>

            <span className="font-black text-xs px-2.5 py-0.5 rounded-xl bg-white dark:bg-slate-900 text-black dark:text-white border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              {formattedId}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onToggleCompare && (
              <button
                type="button"
                onClick={() => onToggleCompare(pokemon)}
                title={isInCompare ? 'Remove from comparison' : 'Add to comparison'}
                className={`p-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer ${
                  isInCompare
                    ? 'bg-[#C084FC] text-black font-extrabold scale-105'
                    : 'bg-white dark:bg-slate-800 text-black dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Scale className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}

            {onToggleFavorite && (
              <button
                type="button"
                onClick={() => onToggleFavorite(pokemon)}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                className={`p-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer ${
                  isFavorite
                    ? 'bg-[#FF6B6B] text-black font-extrabold scale-105'
                    : 'bg-white dark:bg-slate-800 text-black dark:text-white hover:bg-[#FF6B6B] hover:text-black dark:hover:bg-[#FF6B6B] dark:hover:text-black'
                }`}
              >
                <Heart className={`w-4 h-4 stroke-[2.5] ${isFavorite ? 'fill-black' : ''}`} />
              </button>
            )}

            <button
              type="button"
              onClick={handleShareLink}
              title="Share Pokémon (Copy URL)"
              className={`p-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center gap-1.5 ${
                copied
                  ? 'bg-[#A3E635] text-black font-extrabold scale-105'
                  : 'bg-white dark:bg-slate-800 text-black dark:text-white hover:bg-[#FEF08A] hover:text-black dark:hover:bg-slate-700 dark:hover:text-white'
              }`}
            >
              {copied ? <Check className="w-4 h-4 stroke-[3]" /> : <Share2 className="w-4 h-4 stroke-[2.5]" />}
              {copied && <span className="text-[10px] font-black uppercase">Copied!</span>}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-[#FF4757] text-white border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-rose-600 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>

        <div className="relative min-h-[170px] sm:min-h-[190px] w-full flex items-center justify-between px-6 py-4 overflow-hidden bg-[#BAE6FD] dark:bg-slate-800 border-b-[3.5px] border-black">
          <svg
            viewBox="0 0 200 200"
            className="absolute right-4 -bottom-6 w-56 h-56 sm:w-64 sm:h-64 opacity-35 pointer-events-none"
          >
            <path d="M 10,100 A 90,90 0 0,1 190,100 Z" fill="#FF4757" stroke="#000000" strokeWidth="6" />
            <path d="M 10,100 A 90,90 0 0,0 190,100 Z" fill="#FFFFFF" stroke="#000000" strokeWidth="6" />
            <line x1="10" y1="100" x2="190" y2="100" stroke="#000000" strokeWidth="10" />
            <circle cx="100" cy="100" r="28" fill="#FFFFFF" stroke="#000000" strokeWidth="8" />
            <circle cx="100" cy="100" r="12" fill="#000000" />
          </svg>

          <div className="relative z-10 flex flex-col justify-center max-w-[55%]">
            <h2 className="text-2xl sm:text-4xl font-black text-black dark:text-white capitalize tracking-tight leading-none drop-shadow-xs">
              {pokemon.name}
            </h2>

            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {pokemon.types.map((t) => (
                <TypeBadge key={t.type.name} type={t.type.name} size="sm" />
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-1.5 mt-3 text-xs">
              <span className="px-2 py-0.5 rounded-lg bg-white/90 dark:bg-slate-900/90 text-black dark:text-white border border-black font-extrabold text-[11px] shadow-xs">
                📏 {heightInM} m
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-white/90 dark:bg-slate-900/90 text-black dark:text-white border border-black font-extrabold text-[11px] shadow-xs">
                ⚖️ {weightInKg} kg
              </span>
            </div>
          </div>

          <div className="relative z-10 w-36 h-36 sm:w-48 sm:h-48 flex items-center justify-center shrink-0">
            <div
              style={{ backgroundColor: typeColor.bg }}
              className="absolute inset-2 rounded-full opacity-30 blur-md pointer-events-none"
            />

            {!imageLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 z-20">
                <div className="relative w-9 h-9 rounded-full border-[2.5px] border-black bg-white animate-spin flex items-center justify-center shadow-[2px_2px_0px_0px_#000] overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-[#FF4757] border-b-2 border-black" />
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white" />
                  <div className="relative z-10 w-2.5 h-2.5 rounded-full bg-white border-2 border-black" />
                </div>
              </div>
            )}

            <img
              src={imageUrl}
              alt={pokemon.name}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
              className={`relative z-10 max-h-full max-w-full object-contain drop-shadow-[0_12px_16px_rgba(0,0,0,0.35)] animate-float transition-all duration-300 ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
              }`}
            />
          </div>
        </div>

        <div className="flex border-b-2 border-black bg-slate-100 dark:bg-slate-950 px-6 py-3 gap-2.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-1.5 rounded-full border-2 border-black font-extrabold text-xs sm:text-sm tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'stats'
                ? 'bg-[#A3E635] text-black shadow-[3px_3px_0px_0px_#000]'
                : 'bg-white dark:bg-slate-900 text-black dark:text-white shadow-[2px_2px_0px_0px_#000] hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <span>BASE STATS</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('about')}
            className={`px-4 py-1.5 rounded-full border-2 border-black font-extrabold text-xs sm:text-sm tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'about'
                ? 'bg-[#FACC15] text-black shadow-[3px_3px_0px_0px_#000]'
                : 'bg-white dark:bg-slate-900 text-black dark:text-white shadow-[2px_2px_0px_0px_#000] hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <span>ABOUT & SPRITES</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('moves')}
            className={`px-4 py-1.5 rounded-full border-2 border-black font-extrabold text-xs sm:text-sm tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'moves'
                ? 'bg-[#C084FC] text-black shadow-[3px_3px_0px_0px_#000]'
                : 'bg-white dark:bg-slate-900 text-black dark:text-white shadow-[2px_2px_0px_0px_#000] hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <span>MOVES ({pokemon.moves.length})</span>
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto max-h-[55vh] space-y-4 text-black dark:text-white custom-scrollbar">
          {activeTab === 'stats' && (
            <div className="animate-fadeIn">
              <StatRadarChart
                stats={pokemon.stats}
                primaryColor={typeColor.bg}
                pokemonName={pokemon.name}
              />
            </div>
          )}

          {activeTab === 'about' && (
            <div className="animate-fadeIn">
              <PokemonAboutTab pokemon={pokemon} />
            </div>
          )}

          {activeTab === 'moves' && (
            <div className="animate-fadeIn">
              <PokemonMovesArsenal
                moves={pokemon.moves}
                pokemonName={pokemon.name}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

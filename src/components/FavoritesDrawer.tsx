import React from 'react';
import type { PokemonDetail } from '../types/pokemon';
import { getPokemonImage } from '../services/pokemonApi';
import { TypeBadge } from './TypeBadge';
import { X, Heart, Trash2 } from 'lucide-react';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favoritePokemon: PokemonDetail[];
  onSelectPokemon: (pokemon: PokemonDetail) => void;
  onRemoveFavorite: (pokemon: PokemonDetail, e: React.MouseEvent) => void;
  onClearAllFavorites: () => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favoritePokemon,
  onSelectPokemon,
  onRemoveFavorite,
  onClearAllFavorites,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-['Space_Grotesk']">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l-[4px] border-black shadow-[-8px_0px_0px_0px_#000] flex flex-col">
          <div className="p-6 border-b-[3px] border-black flex items-center justify-between bg-[#FF6B6B] text-black">
            <div className="flex items-center gap-2.5">
              <Heart className="w-6 h-6 fill-black stroke-[2.5]" />
              <h3 className="text-xl font-black">
                Favorites ({favoritePokemon.length})
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {favoritePokemon.length > 0 && (
                <button
                  type="button"
                  onClick={onClearAllFavorites}
                  className="text-xs text-black font-extrabold px-3 py-1 rounded-full bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-rose-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                >
                  Clear All
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full bg-white text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5 stroke-[3]" />
              </button>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto space-y-3.5 custom-scrollbar text-black dark:text-white">
            {favoritePokemon.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-500">
                <Heart className="w-14 h-14 text-slate-400 mb-3 stroke-[2]" />
                <p className="font-extrabold text-base text-black dark:text-white">No favorite Pokémon yet</p>
                <p className="text-xs font-bold text-slate-500 mt-1 max-w-xs">
                  Click the heart icon on any Pokémon card to save your favorites here.
                </p>
              </div>
            ) : (
              favoritePokemon.map((pokemon) => {
                const formattedId = `#${String(pokemon.id).padStart(3, '0')}`;
                const imageUrl = getPokemonImage(pokemon);

                return (
                  <div
                    key={pokemon.id}
                    onClick={() => {
                      onSelectPokemon(pokemon);
                      onClose();
                    }}
                    className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#000] transition-all cursor-pointer group"
                  >
                    <div className="w-14 h-14 rounded-xl bg-[#BAE6FD] border-2 border-black p-1 flex items-center justify-center shrink-0">
                      <img
                        src={imageUrl}
                        alt={pokemon.name}
                        className="w-12 h-12 object-contain drop-shadow-md group-hover:scale-110 transition-transform"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-black text-slate-500 dark:text-slate-400">
                        {formattedId}
                      </span>
                      <h4 className="text-base font-black capitalize truncate group-hover:text-[#FF4757] transition-colors">
                        {pokemon.name}
                      </h4>
                      <div className="flex gap-1 mt-1">
                        {pokemon.types.map((t) => (
                          <TypeBadge key={t.type.name} type={t.type.name} size="sm" />
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFavorite(pokemon, e);
                      }}
                      title="Remove from favorites"
                      className="p-2 rounded-xl bg-[#FF4757] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-rose-500 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

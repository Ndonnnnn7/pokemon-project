import React from 'react';
import type { PokemonDetail } from '../types/pokemon';
import { PokemonCard } from './PokemonCard';
import { PokemonCardSkeleton } from './LoadingSkeleton';
import { ArrowDown } from 'lucide-react';

interface PokemonGridProps {
  pokemonList: PokemonDetail[];
  onSelectPokemon: (pokemon: PokemonDetail) => void;
  favorites: number[];
  onToggleFavorite: (pokemon: PokemonDetail, e: React.MouseEvent) => void;
  compareList: number[];
  onToggleCompare: (pokemon: PokemonDetail, e: React.MouseEvent) => void;
  onTypeClick?: (type: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

export const PokemonGrid: React.FC<PokemonGridProps> = ({
  pokemonList,
  onSelectPokemon,
  favorites,
  onToggleFavorite,
  compareList,
  onToggleCompare,
  onTypeClick,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
}) => {
  const isFav = (id: number) => favorites.includes(id);
  const isInComp = (id: number) => compareList.includes(id);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full my-6">
        {pokemonList.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            onSelect={onSelectPokemon}
            isFavorite={isFav(pokemon.id)}
            onToggleFavorite={onToggleFavorite}
            isInCompare={isInComp(pokemon.id)}
            onToggleCompare={onToggleCompare}
            onTypeClick={onTypeClick}
          />
        ))}

        {isLoadingMore && (
          <>
            <PokemonCardSkeleton />
            <PokemonCardSkeleton />
            <PokemonCardSkeleton />
            <PokemonCardSkeleton />
          </>
        )}
      </div>

      {hasMore && onLoadMore && (
        <div className="mt-8 mb-12 flex justify-center">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl font-black text-sm bg-[#A3E635] text-black border-[3px] border-black shadow-[4px_4px_0px_0px_#000] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer font-['Space_Grotesk']"
          >
            {isLoadingMore ? (
              <>
                <div className="relative w-5 h-5 rounded-full border-2 border-black bg-white animate-spin flex items-center justify-center overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-[#FF4757] border-b border-black" />
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white" />
                  <div className="relative z-10 w-1.5 h-1.5 rounded-full bg-white border border-black" />
                </div>
                <span>Loading More Pokémon...</span>
              </>
            ) : (
              <>
                <span>Load More Pokémon</span>
                <ArrowDown className="w-4 h-4 transition-transform duration-200 group-hover:translate-y-0.5 stroke-[3]" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

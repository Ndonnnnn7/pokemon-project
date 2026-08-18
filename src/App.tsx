import { useState, useEffect } from 'react';
import { usePokemon } from './hooks/usePokemon';
import { useFavorites } from './hooks/useFavorites';
import { useTheme } from './hooks/useTheme';
import type { PokemonDetail } from './types/pokemon';
import { fetchPokemonByNameOrId } from './services/pokemonApi';

import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { PokemonSearchFilter } from './components/PokemonSearchFilter';
import { PokemonGrid } from './components/PokemonGrid';
import { PokemonGridSkeleton } from './components/LoadingSkeleton';
import { ErrorState } from './components/ErrorState';
import { EmptyState } from './components/EmptyState';
import { PokemonModal } from './components/PokemonModal';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { CompareModal } from './components/CompareModal';
import { CompareDock } from './components/CompareDock';
import { Footer } from './components/Footer';

export function App() {
  const { theme, toggleTheme } = useTheme();

  const {
    pokemonList,
    totalCount,
    status,
    errorMessage,
    isOffline,
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    sortBy,
    setSortBy,
    loadMore,
    hasMore,
    isLoadingMore,
    retry,
    resetFilters,
  } = usePokemon();

  const {
    favoriteList,
    favoriteIds,
    toggleFavorite,
    removeFavorite,
    clearAllFavorites,
  } = useFavorites();

  const [selectedModalPokemon, setSelectedModalPokemon] = useState<PokemonDetail | null>(null);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [compareList, setCompareList] = useState<PokemonDetail[]>([]);

  const toggleCompare = (pokemon: PokemonDetail, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCompareList((prev) => {
      const exists = prev.some((p) => p.id === pokemon.id);
      if (exists) {
        return prev.filter((p) => p.id !== pokemon.id);
      }
      if (prev.length >= 2) {
        return [prev[0], pokemon];
      }
      return [...prev, pokemon];
    });
  };

  const removeComparePokemon = (id: number) => {
    setCompareList((prev) => prev.filter((p) => p.id !== id));
  };

  const handleClearCompare = () => {
    setCompareList([]);
  };

  const handleRandomCompareRival = async () => {
    if (pokemonList.length > 1) {
      const candidates = pokemonList.filter((p) => !compareList.some((cp) => cp.id === p.id));
      if (candidates.length > 0) {
        const randomChoice = candidates[Math.floor(Math.random() * candidates.length)];
        toggleCompare(randomChoice);
        return;
      }
    }
    const randomId = Math.floor(Math.random() * 151) + 1;
    try {
      const detail = await fetchPokemonByNameOrId(randomId);
      toggleCompare(detail);
    } catch (err) {
      console.error(err);
    }
  };

  const compareIds = compareList.map((p) => p.id);

  useEffect(() => {
    const checkUrlForPokemon = async () => {
      if (typeof window === 'undefined') return;
      const pathname = window.location.pathname;
      const match = pathname.match(/^\/pokemon\/([^/]+)/i);
      const queryPokemon = new URLSearchParams(window.location.search).get('pokemon');
      const targetNameOrId = match ? match[1] : queryPokemon;

      if (targetNameOrId) {
        try {
          const detail = await fetchPokemonByNameOrId(targetNameOrId);
          setSelectedModalPokemon(detail);
        } catch (err) {
          console.error('Failed to load Pokémon from URL route:', err);
        }
      } else {
        setSelectedModalPokemon(null);
      }
    };

    checkUrlForPokemon();

    window.addEventListener('popstate', checkUrlForPokemon);
    return () => window.removeEventListener('popstate', checkUrlForPokemon);
  }, []);

  const handleOpenModalPokemon = (pokemon: PokemonDetail) => {
    setSelectedModalPokemon(pokemon);
    const currentQuery = window.location.search;
    const newUrl = `/pokemon/${pokemon.name.toLowerCase()}${currentQuery}`;
    window.history.pushState({ pokemonName: pokemon.name }, '', newUrl);
  };

  const handleCloseModalPokemon = () => {
    setSelectedModalPokemon(null);
    const currentQuery = window.location.search;
    const newUrl = `/${currentQuery}`;
    window.history.pushState({}, '', newUrl);
  };

  const handleRandomPokemon = async () => {
    const randomId = Math.floor(Math.random() * 1025) + 1;
    try {
      const detail = await fetchPokemonByNameOrId(randomId);
      handleOpenModalPokemon(detail);
    } catch (err) {
      console.error('Failed to fetch random pokemon:', err);
    }
  };

  const activeNav = isFavoritesOpen ? 'favorites' : isCompareOpen ? 'compare' : 'explorer';

  const suggestedRivals = pokemonList.filter((p) => !compareList.some((cp) => cp.id === p.id)).slice(0, 6);

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0B1120] bg-dot-pattern text-black dark:text-white font-['Space_Grotesk'] antialiased flex flex-col selection:bg-[#FFE600] selection:text-black">
      <Header
        activeNav={activeNav}
        onOpenFavorites={() => {
          setIsCompareOpen(false);
          setIsFavoritesOpen(true);
        }}
        onOpenCompare={() => {
          setIsFavoritesOpen(false);
          setIsCompareOpen(true);
        }}
        onResetView={() => {
          setIsFavoritesOpen(false);
          setIsCompareOpen(false);
          resetFilters();
        }}
        theme={theme}
        onToggleTheme={toggleTheme}
        favoritesCount={favoriteList.length}
        compareCount={compareList.length}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col items-center">
        <HeroSection
          onSearchCompanion={(name) => {
            setSearchQuery(name);
            if (selectedType !== 'all') setSelectedType('all');
          }}
        />

        <PokemonSearchFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedType={selectedType}
          onSelectType={setSelectedType}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalCount={totalCount}
          onResetFilters={resetFilters}
        />

        <section className="w-full my-4">
          {status === 'loading' && (
            <PokemonGridSkeleton
              count={8}
              message={searchQuery ? `Searching for "${searchQuery}"...` : 'Scanning Pokédex Database...'}
            />
          )}

          {status === 'error' && (
            <ErrorState
              title={isOffline ? 'Network Disconnected' : 'Failed to Load Pokémon'}
              message={errorMessage || 'We encountered an error loading data from PokéAPI.'}
              onRetry={retry}
              isOffline={isOffline}
            />
          )}

          {status === 'empty' && (
            <EmptyState
              title={searchQuery ? `No Pokémon matching "${searchQuery}"` : 'No Pokémon Found'}
              message={
                searchQuery
                  ? 'Double check the spelling or search for a numeric ID like 25 (Pikachu).'
                  : 'No Pokémon belong to this type category.'
              }
              onReset={resetFilters}
              resetLabel="Clear Search & Filters"
            />
          )}

          {status === 'success' && (
            <div className="animate-fadeIn">
              <PokemonGrid
                pokemonList={pokemonList}
                onSelectPokemon={handleOpenModalPokemon}
                favorites={favoriteIds}
                onToggleFavorite={toggleFavorite}
                compareList={compareIds}
                onToggleCompare={toggleCompare}
                onTypeClick={(type) => {
                  setSelectedType(type);
                  if (searchQuery) setSearchQuery('');
                }}
                onLoadMore={loadMore}
                hasMore={hasMore}
                isLoadingMore={isLoadingMore}
              />
            </div>
          )}
        </section>
      </main>

      <Footer
        onSelectType={(type) => {
          setSelectedType(type);
          if (searchQuery) setSearchQuery('');
        }}
        onOpenFavorites={() => {
          setIsCompareOpen(false);
          setIsFavoritesOpen(true);
        }}
        onOpenCompare={() => {
          setIsFavoritesOpen(false);
          setIsCompareOpen(true);
        }}
        onRandomPokemon={handleRandomPokemon}
        favoritesCount={favoriteList.length}
        compareCount={compareList.length}
      />

      {!isCompareOpen && !isFavoritesOpen && (
        <CompareDock
          compareList={compareList}
          onOpenCompare={() => setIsCompareOpen(true)}
          onRemovePokemon={removeComparePokemon}
          onClearCompare={handleClearCompare}
          onRandomOpponent={handleRandomCompareRival}
        />
      )}

      <PokemonModal
        pokemon={selectedModalPokemon}
        onClose={handleCloseModalPokemon}
        isFavorite={selectedModalPokemon ? favoriteIds.includes(selectedModalPokemon.id) : false}
        onToggleFavorite={toggleFavorite}
        isInCompare={selectedModalPokemon ? compareIds.includes(selectedModalPokemon.id) : false}
        onToggleCompare={toggleCompare}
      />

      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favoritePokemon={favoriteList}
        onSelectPokemon={handleOpenModalPokemon}
        onRemoveFavorite={removeFavorite}
        onClearAllFavorites={clearAllFavorites}
      />

      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        compareList={compareList}
        onRemovePokemon={removeComparePokemon}
        suggestedRivals={suggestedRivals}
        onSelectRival={toggleCompare}
        onRandomOpponent={handleRandomCompareRival}
      />
    </div>
  );
}

export default App;

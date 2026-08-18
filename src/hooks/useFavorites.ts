import { useState, useEffect } from 'react';
import type { PokemonDetail } from '../types/pokemon';



const STORAGE_KEY = 'pokemon_explorer_favorites';

export function useFavorites() {
  const [favoriteList, setFavoriteList] = useState<PokemonDetail[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteList));
    } catch (e) {
      console.warn('Failed to save favorites to localStorage:', e);
    }
  }, [favoriteList]);

  const favoriteIds = favoriteList.map((p) => p.id);

  const toggleFavorite = (pokemon: PokemonDetail, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavoriteList((prev) => {
      const exists = prev.some((p) => p.id === pokemon.id);
      if (exists) {
        return prev.filter((p) => p.id !== pokemon.id);
      } else {
        return [...prev, pokemon];
      }
    });
  };

  const removeFavorite = (pokemon: PokemonDetail, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavoriteList((prev) => prev.filter((p) => p.id !== pokemon.id));
  };

  const clearAllFavorites = () => {
    setFavoriteList([]);
  };

  return {
    favoriteList,
    favoriteIds,
    toggleFavorite,
    removeFavorite,
    clearAllFavorites,
  };
}

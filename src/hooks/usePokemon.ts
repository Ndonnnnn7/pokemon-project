import { useState, useEffect, useCallback, useMemo } from 'react';
import type {
  PokemonDetail,
  ApiStatus,
  SortOption,
  GenerationOption,
  LegendaryOption,
  EvolutionOption,
} from '../types/pokemon';

import {
  fetchPokemonBatch,
  fetchPokemonByType,
  fetchPokemonByGeneration,
  searchPokemon,
  GENERATION_CONFIG,
  LEGENDARY_POKEMON_IDS,
  MYTHICAL_POKEMON_IDS,
  NO_EVOLUTION_POKEMON_IDS,
  PokemonNetworkError,
} from '../services/pokemonApi';

const PAGE_SIZE = 24;

function getInitialParams() {
  if (typeof window === 'undefined') {
    return {
      search: '',
      type: 'all',
      gen: 'all' as GenerationOption,
      sort: 'id-asc' as SortOption,
      legendary: 'all' as LegendaryOption,
      evolution: 'all' as EvolutionOption,
    };
  }
  const params = new URLSearchParams(window.location.search);
  return {
    search: params.get('search') || params.get('q') || '',
    type: params.get('type') || 'all',
    gen: (params.get('gen') as GenerationOption) || 'all',
    sort: (params.get('sort') as SortOption) || 'id-asc',
    legendary: (params.get('legendary') as LegendaryOption) || 'all',
    evolution: (params.get('evolution') as EvolutionOption) || 'all',
  };
}

export function usePokemon() {
  const initialParams = useMemo(() => getInitialParams(), []);

  const [pokemonList, setPokemonList] = useState<PokemonDetail[]>([]);
  const [status, setStatus] = useState<ApiStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  const [searchQuery, setSearchQuery] = useState(initialParams.search);
  const [debouncedSearch, setDebouncedSearch] = useState(initialParams.search.trim().toLowerCase());
  const [selectedType, setSelectedType] = useState(initialParams.type);
  const [selectedGen, setSelectedGen] = useState<GenerationOption>(initialParams.gen);
  const [legendaryStatus, setLegendaryStatus] = useState<LegendaryOption>(initialParams.legendary);
  const [hasEvolution, setHasEvolution] = useState<EvolutionOption>(initialParams.evolution);
  const [sortBy, setSortBy] = useState<SortOption>(initialParams.sort);

  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim().toLowerCase());
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (selectedType && selectedType !== 'all') params.set('type', selectedType);
    if (selectedGen && selectedGen !== 'all') params.set('gen', selectedGen);
    if (legendaryStatus && legendaryStatus !== 'all') params.set('legendary', legendaryStatus);
    if (hasEvolution && hasEvolution !== 'all') params.set('evolution', hasEvolution);
    if (sortBy && sortBy !== 'id-asc') params.set('sort', sortBy);

    const queryString = params.toString();
    const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;

    window.history.replaceState(null, '', newUrl);
  }, [debouncedSearch, selectedType, selectedGen, legendaryStatus, hasEvolution, sortBy]);

  const loadPokemonData = useCallback(async () => {
    setStatus('loading');
    setErrorMessage(null);
    setIsOffline(false);
    setOffset(0);

    try {
      if (debouncedSearch) {
        try {
          const res = await searchPokemon(debouncedSearch, PAGE_SIZE, 0);
          setPokemonList(res.details);
          setHasMore(res.hasMore);

          if (res.details.length === 0) {
            setStatus('empty');
          } else {
            setStatus('success');
          }
        } catch (err) {
          if (err instanceof PokemonNetworkError) {
            setIsOffline(true);
            setErrorMessage(err.message);
            setStatus('error');
          } else {
            setErrorMessage((err as Error).message || 'Failed to search Pokémon.');
            setStatus('error');
          }
        }
        return;
      }

      let details: PokemonDetail[] = [];
      let moreAvailable = false;

      if (selectedType !== 'all') {
        const res = await fetchPokemonByType(selectedType, PAGE_SIZE, 0);
        details = res.details;
        moreAvailable = res.hasMore;
      } else if (selectedGen !== 'all') {
        const res = await fetchPokemonByGeneration(selectedGen, PAGE_SIZE, 0);
        details = res.details;
        moreAvailable = res.hasMore;
      } else {
        const res = await fetchPokemonBatch(PAGE_SIZE, 0);
        details = res.details;
        moreAvailable = res.hasMore;
      }

      setPokemonList(details);
      setHasMore(moreAvailable);

      if (details.length === 0) {
        setStatus('empty');
      } else {
        setStatus('success');
      }
    } catch (err) {
      if (err instanceof PokemonNetworkError) {
        setIsOffline(true);
        setErrorMessage(err.message);
      } else {
        setErrorMessage((err as Error).message || 'Something went wrong while fetching Pokémon data.');
      }
      setStatus('error');
    }
  }, [debouncedSearch, selectedType, selectedGen]);

  useEffect(() => {
    loadPokemonData();
  }, [loadPokemonData]);

  const loadMore = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    const nextOffset = offset + PAGE_SIZE;

    try {
      let details: PokemonDetail[] = [];
      let moreAvailable = false;

      if (debouncedSearch) {
        const res = await searchPokemon(debouncedSearch, PAGE_SIZE, nextOffset);
        details = res.details;
        moreAvailable = res.hasMore;
      } else if (selectedType !== 'all') {
        const res = await fetchPokemonByType(selectedType, PAGE_SIZE, nextOffset);
        details = res.details;
        moreAvailable = res.hasMore;
      } else if (selectedGen !== 'all') {
        const res = await fetchPokemonByGeneration(selectedGen, PAGE_SIZE, nextOffset);
        details = res.details;
        moreAvailable = res.hasMore;
      } else {
        const res = await fetchPokemonBatch(PAGE_SIZE, nextOffset);
        details = res.details;
        moreAvailable = res.hasMore;
      }

      setPokemonList((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newUnique = details.filter((p) => !existingIds.has(p.id));
        return [...prev, ...newUnique];
      });

      setOffset(nextOffset);
      setHasMore(moreAvailable);
    } catch (err) {
      console.error('Failed to load more Pokémon:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const filteredAndSortedList = useMemo(() => {
    let list = [...pokemonList];

    if (selectedGen !== 'all') {
      const genConf = GENERATION_CONFIG[selectedGen];
      if (genConf) {
        list = list.filter((p) => p.id >= genConf.minId && p.id <= genConf.maxId);
      }
    }

    if (legendaryStatus === 'legendary') {
      list = list.filter((p) => LEGENDARY_POKEMON_IDS.has(p.id));
    } else if (legendaryStatus === 'mythical') {
      list = list.filter((p) => MYTHICAL_POKEMON_IDS.has(p.id));
    } else if (legendaryStatus === 'non-legendary') {
      list = list.filter((p) => !LEGENDARY_POKEMON_IDS.has(p.id) && !MYTHICAL_POKEMON_IDS.has(p.id));
    }

    if (hasEvolution === 'yes') {
      list = list.filter((p) => !NO_EVOLUTION_POKEMON_IDS.has(p.id));
    } else if (hasEvolution === 'no') {
      list = list.filter((p) => NO_EVOLUTION_POKEMON_IDS.has(p.id));
    }

    switch (sortBy) {
      case 'id-asc':
        return list.sort((a, b) => a.id - b.id);
      case 'id-desc':
        return list.sort((a, b) => b.id - a.id);
      case 'name-asc':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case 'hp-desc':
        return list.sort((a, b) => {
          const hpA = a.stats.find((s) => s.stat.name === 'hp')?.base_stat || 0;
          const hpB = b.stats.find((s) => s.stat.name === 'hp')?.base_stat || 0;
          return hpB - hpA;
        });
      case 'attack-desc':
        return list.sort((a, b) => {
          const atkA = a.stats.find((s) => s.stat.name === 'attack')?.base_stat || 0;
          const atkB = b.stats.find((s) => s.stat.name === 'attack')?.base_stat || 0;
          return atkB - atkA;
        });
      case 'speed-desc':
        return list.sort((a, b) => {
          const spdA = a.stats.find((s) => s.stat.name === 'speed')?.base_stat || 0;
          const spdB = b.stats.find((s) => s.stat.name === 'speed')?.base_stat || 0;
          return spdB - spdA;
        });
      default:
        return list;
    }
  }, [pokemonList, selectedGen, legendaryStatus, hasEvolution, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setDebouncedSearch('');
    setSelectedType('all');
    setSelectedGen('all');
    setLegendaryStatus('all');
    setHasEvolution('all');
    setSortBy('id-asc');
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  const isAnyFilterActive =
    Boolean(searchQuery) ||
    selectedType !== 'all' ||
    selectedGen !== 'all' ||
    legendaryStatus !== 'all' ||
    hasEvolution !== 'all' ||
    sortBy !== 'id-asc';

  return {
    pokemonList: filteredAndSortedList,
    totalCount: filteredAndSortedList.length,
    rawCount: pokemonList.length,
    status: status === 'success' && filteredAndSortedList.length === 0 ? 'empty' : status,
    errorMessage,
    isOffline,
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    selectedGen,
    setSelectedGen,
    legendaryStatus,
    setLegendaryStatus,
    hasEvolution,
    setHasEvolution,
    sortBy,
    setSortBy,
    hasMore,
    isLoadingMore,
    loadMore,
    retry: loadPokemonData,
    resetFilters,
    isAnyFilterActive,
  };
}

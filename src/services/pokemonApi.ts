import type {
  PokemonDetail,
  PokemonListResponse,
  PokemonTypeResponse,
} from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

const pokemonCache = new Map<string, PokemonDetail>();

export class PokemonNotFoundError extends Error {
  constructor(nameOrId: string | number) {
    super(`Pokémon "${nameOrId}" not found. Try searching for another Pokémon.`);
    this.name = 'PokemonNotFoundError';
  }
}

export class PokemonNetworkError extends Error {
  constructor(message?: string) {
    super(message || 'Network error occurred while fetching Pokémon data.');
    this.name = 'PokemonNetworkError';
  }
}

export interface PokemonDirectoryItem {
  id: number;
  name: string;
  url: string;
}

let pokemonDirectoryCache: PokemonDirectoryItem[] | null = null;

export async function getPokemonDirectory(): Promise<PokemonDirectoryItem[]> {
  if (pokemonDirectoryCache && pokemonDirectoryCache.length > 0) {
    return pokemonDirectoryCache;
  }

  try {
    const response = await fetch(`${BASE_URL}/pokemon?limit=1025&offset=0`);
    if (!response.ok) {
      throw new Error(`Failed to load directory (Status ${response.status})`);
    }

    const data: PokemonListResponse = await response.json();
    pokemonDirectoryCache = data.results.map((item, index) => {
      const parts = item.url.split('/').filter(Boolean);
      const lastPart = parts[parts.length - 1];
      const parsedId = parseInt(lastPart, 10);
      const id = !isNaN(parsedId) ? parsedId : index + 1;
      return {
        id,
        name: item.name,
        url: item.url,
      };
    });

    return pokemonDirectoryCache;
  } catch (error) {
    console.error('Failed to load master Pokémon directory:', error);
    return [];
  }
}

export async function searchPokemon(
  query: string,
  limit: number = 24,
  offset: number = 0
): Promise<{ details: PokemonDetail[]; hasMore: boolean; total: number }> {
  const cleanQuery = query.toLowerCase().trim();
  if (!cleanQuery) {
    return fetchPokemonBatch(limit, offset);
  }

  const isNumeric = /^\d+$/.test(cleanQuery);
  const targetId = isNumeric ? parseInt(cleanQuery, 10) : null;

  const directory = await getPokemonDirectory();

  let matches: PokemonDirectoryItem[] = [];

  if (directory.length > 0) {
    matches = directory.filter((item) => {
      if (targetId !== null && item.id === targetId) return true;
      const nameLower = item.name.toLowerCase();
      const idStr = String(item.id);
      return nameLower.includes(cleanQuery) || idStr === cleanQuery || idStr.startsWith(cleanQuery);
    });

    matches.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();

      if (aName === cleanQuery) return -1;
      if (bName === cleanQuery) return 1;

      if (targetId !== null) {
        if (a.id === targetId) return -1;
        if (b.id === targetId) return 1;
      }

      const aStarts = aName.startsWith(cleanQuery);
      const bStarts = bName.startsWith(cleanQuery);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      return a.id - b.id;
    });
  }

  if (matches.length === 0 && directory.length === 0) {
    try {
      const single = await fetchPokemonByNameOrId(cleanQuery);
      return { details: [single], hasMore: false, total: 1 };
    } catch {
      return { details: [], hasMore: false, total: 0 };
    }
  }

  const total = matches.length;
  const pageItems = matches.slice(offset, offset + limit);
  const hasMore = offset + limit < total;

  const detailPromises = pageItems.map((item) =>
    fetchPokemonByNameOrId(item.name).catch(() => null)
  );

  const results = await Promise.all(detailPromises);
  const validDetails = results.filter((item): item is PokemonDetail => item !== null);

  return {
    details: validDetails,
    hasMore,
    total,
  };
}

export async function fetchPokemonByNameOrId(
  nameOrId: string | number
): Promise<PokemonDetail> {
  const key = String(nameOrId).toLowerCase().trim();

  if (pokemonCache.has(key)) {
    return pokemonCache.get(key)!;
  }

  try {
    const response = await fetch(`${BASE_URL}/pokemon/${key}`);

    if (response.status === 404) {
      throw new PokemonNotFoundError(nameOrId);
    }

    if (!response.ok) {
      throw new Error(`PokéAPI request failed with status: ${response.status}`);
    }

    const data: PokemonDetail = await response.json();

    pokemonCache.set(data.name.toLowerCase(), data);
    pokemonCache.set(String(data.id), data);

    return data;
  } catch (error) {
    if (error instanceof PokemonNotFoundError) {
      throw error;
    }
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new PokemonNetworkError('Unable to connect to PokéAPI. Please check your network connection.');
    }
    throw error;
  }
}

export async function fetchPokemonList(
  limit: number = 20,
  offset: number = 0
): Promise<PokemonListResponse> {
  try {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch Pokémon list (Status ${response.status})`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new PokemonNetworkError('Unable to connect to PokéAPI. Please check your connection.');
    }
    throw error;
  }
}

export async function fetchPokemonBatch(
  limit: number = 20,
  offset: number = 0
): Promise<{ details: PokemonDetail[]; hasMore: boolean; total: number }> {
  const listData = await fetchPokemonList(limit, offset);
  
  const detailPromises = listData.results.map((item) =>
    fetchPokemonByNameOrId(item.name).catch((err) => {
      console.warn(`Failed to hydrate details for ${item.name}`, err);
      return null;
    })
  );

  const results = await Promise.all(detailPromises);
  const validDetails = results.filter((item): item is PokemonDetail => item !== null);

  const hasMore = Boolean(listData.next);

  return {
    details: validDetails,
    hasMore,
    total: listData.count,
  };
}

export async function fetchPokemonByType(
  type: string,
  limit: number = 20,
  offset: number = 0
): Promise<{ details: PokemonDetail[]; hasMore: boolean; total: number }> {
  const normalizedType = type.toLowerCase().trim();

  if (normalizedType === 'all' || !normalizedType) {
    return fetchPokemonBatch(limit, offset);
  }

  try {
    const response = await fetch(`${BASE_URL}/type/${normalizedType}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Type "${type}" not found.`);
      }
      throw new Error(`Failed to fetch type ${type} (Status ${response.status})`);
    }

    const data: PokemonTypeResponse = await response.json();
    const allTypeItems = data.pokemon.map((p) => p.pokemon);

    const total = allTypeItems.length;
    const pageItems = allTypeItems.slice(offset, offset + limit);
    const hasMore = offset + limit < total;

    const detailPromises = pageItems.map((item) =>
      fetchPokemonByNameOrId(item.name).catch(() => null)
    );

    const results = await Promise.all(detailPromises);
    const validDetails = results.filter((item): item is PokemonDetail => item !== null);

    return {
      details: validDetails,
      hasMore,
      total,
    };
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new PokemonNetworkError('Network error while fetching Pokémon by type.');
    }
    throw error;
  }
}

export function getPokemonImage(pokemon: PokemonDetail): string {
  return (
    pokemon.sprites.other?.['official-artwork']?.front_default ||
    pokemon.sprites.other?.dream_world?.front_default ||
    pokemon.sprites.other?.home?.front_default ||
    pokemon.sprites.front_default ||
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'
  );
}

export const GENERATION_CONFIG: Record<string, { name: string; region: string; minId: number; maxId: number; offset: number; limit: number }> = {
  '1': { name: 'Gen 1', region: 'Kanto', minId: 1, maxId: 151, offset: 0, limit: 151 },
  '2': { name: 'Gen 2', region: 'Johto', minId: 152, maxId: 251, offset: 151, limit: 100 },
  '3': { name: 'Gen 3', region: 'Hoenn', minId: 252, maxId: 386, offset: 251, limit: 135 },
  '4': { name: 'Gen 4', region: 'Sinnoh', minId: 387, maxId: 493, offset: 386, limit: 107 },
  '5': { name: 'Gen 5', region: 'Unova', minId: 494, maxId: 649, offset: 493, limit: 156 },
  '6': { name: 'Gen 6', region: 'Kalos', minId: 650, maxId: 721, offset: 649, limit: 72 },
  '7': { name: 'Gen 7', region: 'Alola', minId: 722, maxId: 809, offset: 721, limit: 88 },
  '8': { name: 'Gen 8', region: 'Galar', minId: 810, maxId: 905, offset: 809, limit: 96 },
  '9': { name: 'Gen 9', region: 'Paldea', minId: 906, maxId: 1025, offset: 905, limit: 120 },
};

export const LEGENDARY_POKEMON_IDS = new Set([
  144, 145, 146, 150, 243, 244, 245, 249, 250, 377, 378, 379, 380, 381, 382, 383, 384,
  480, 481, 482, 483, 484, 485, 486, 487, 488, 638, 639, 640, 641, 642, 643, 644, 645,
  646, 716, 717, 718, 772, 773, 785, 786, 787, 788, 789, 790, 791, 792, 800, 888, 889,
  890, 891, 892, 894, 895, 896, 897, 898, 1001, 1002, 1003, 1004, 1007, 1008
]);

export const MYTHICAL_POKEMON_IDS = new Set([
  151, 251, 385, 386, 489, 490, 491, 492, 493, 494, 647, 648, 649, 719, 720, 721, 801,
  802, 807, 808, 809, 893, 1025
]);

export const NO_EVOLUTION_POKEMON_IDS = new Set([
  83, 115, 127, 128, 131, 132, 142, 144, 145, 146, 150, 151, 201, 206, 211, 213, 214,
  222, 225, 227, 234, 235, 241, 243, 244, 245, 249, 250, 251, 302, 303, 311, 312, 313,
  314, 324, 327, 335, 336, 337, 338, 351, 352, 357, 358, 359, 369, 370, 380, 381, 382,
  383, 384, 385, 386, 417, 441, 442, 455, 479, 480, 481, 482, 483, 484, 485, 486, 487,
  488, 489, 490, 491, 492, 493, 494, 531, 538, 539, 556, 561, 587, 589, 594, 615, 618,
  621, 626, 631, 632, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649, 701,
  702, 703, 707, 716, 717, 718, 719, 720, 721, 741, 746, 764, 765, 766, 771, 774, 775,
  776, 777, 778, 779, 781, 785, 786, 787, 788, 789, 790, 791, 792, 793, 794, 795, 796,
  797, 798, 799, 800, 801, 802, 807, 845, 870, 871, 874, 875, 876, 877, 880, 881, 882,
  883, 884, 888, 889, 890, 893, 894, 895, 896, 897, 898, 931, 950, 962, 967, 968, 973,
  976, 977, 978, 984, 985, 986, 987, 988, 989, 990, 991, 992, 993, 994, 995, 1001, 1002,
  1003, 1004, 1007, 1008, 1009, 1010, 1014, 1015, 1016, 1017, 1020, 1021, 1022, 1023,
  1024, 1025
]);

export async function fetchPokemonByGeneration(
  gen: string,
  limit: number = 20,
  offset: number = 0
): Promise<{ details: PokemonDetail[]; hasMore: boolean; total: number }> {
  const config = GENERATION_CONFIG[gen];
  if (!config) {
    return fetchPokemonBatch(limit, offset);
  }

  const currentOffset = config.offset + offset;
  const remainingInGen = Math.max(0, config.limit - offset);
  const fetchLimit = Math.min(limit, remainingInGen);

  if (fetchLimit <= 0) {
    return { details: [], hasMore: false, total: config.limit };
  }

  const listData = await fetchPokemonList(fetchLimit, currentOffset);
  const detailPromises = listData.results.map((item) =>
    fetchPokemonByNameOrId(item.name).catch(() => null)
  );

  const results = await Promise.all(detailPromises);
  const validDetails = results.filter((item): item is PokemonDetail => item !== null);
  const hasMore = offset + fetchLimit < config.limit;

  return {
    details: validDetails,
    hasMore,
    total: config.limit,
  };
}

export function clearPokemonCache(): void {
  pokemonCache.clear();
}

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot?: number;
}

export interface PokemonStat {
  base_stat: number;
  effort?: number;
  stat: {
    name: string;
    url?: string;
  };
}

export interface PokemonMoveVersionDetail {
  level_learned_at: number;
  move_learn_method: {
    name: string;
    url: string;
  };
  version_group?: {
    name: string;
    url: string;
  };
}

export interface PokemonMove {
  move: {
    name: string;
    url: string;
  };
  version_group_details?: PokemonMoveVersionDetail[];
}

export interface PokemonSprites {
  front_default: string | null;
  back_default?: string | null;
  front_shiny?: string | null;
  other?: {
    'official-artwork'?: {
      front_default: string | null;
      front_shiny?: string | null;
    };
    dream_world?: {
      front_default: string | null;
    };
    home?: {
      front_default: string | null;
    };
  };
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: PokemonSprites;
  types: PokemonType[];
  abilities: PokemonAbility[];
  stats: PokemonStat[];
  moves: PokemonMove[];
  species?: {
    name: string;
    url: string;
  };
  base_experience?: number;
}

export type ApiStatus = 'idle' | 'loading' | 'success' | 'error' | 'empty';

export type SortOption =
  | 'id-asc'
  | 'id-desc'
  | 'name-asc'
  | 'hp-desc'
  | 'attack-desc'
  | 'speed-desc';

export type GenerationOption = 'all' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
export type LegendaryOption = 'all' | 'legendary' | 'mythical' | 'non-legendary';
export type EvolutionOption = 'all' | 'yes' | 'no';

export interface TypeFilterOption {
  name: string;
  url?: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonTypeResponse {
  pokemon: Array<{
    pokemon: PokemonListItem;
    slot: number;
  }>;
}

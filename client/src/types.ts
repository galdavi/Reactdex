export interface Pokemon {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  abilities: PokemonAbility[];
  moves: PokemonMove[];
  sprites: PokemonSprites;
  cries: {
    latest: string;
    legacy: string;
  };
  stats: PokemonStat[];
  types: PokemonType[];
  species: NamedAPIResource;
}

export interface PokemonSpecies {
  id: number;
  name: string;
  gender_rate: number;
  capture_rate: number;
  base_happiness: number;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  hatch_counter: number;
  has_gender_differences: boolean;
  flavor_text_entries: FlavorText[];
  growth_rate: NamedAPIResource;
  egg_groups: NamedAPIResource[];
  shape: NamedAPIResource;
  evolution_chain: APIResource;
  generation: NamedAPIResource;
  genera: Genus[];
  varieties: PokemonSpeciesVariety[];
}
export interface Pokedex {
  id: number;
  name: string;
  region: NamedAPIResource;
  pokemon_entries: PokemonEntry[];
}
export interface Generation {
  id: number;
  name: string;
  pokemon_species: NamedAPIResource[];
}
export interface PokemonEntry {
  entry_number: number;
  pokemon_species: NamedAPIResource;
}
export interface PokemonTypeData {
  name: string;
  damage_relations: TypeRelations;
}
export interface TypeRelations {
  no_damage_to: NamedAPIResource[];
  half_damage_to: NamedAPIResource[];
  double_damage_to: NamedAPIResource[];
  no_damage_from: NamedAPIResource[];
  half_damage_from: NamedAPIResource[];
  double_damage_from: NamedAPIResource[];
}
export type EvolutionChain = {
  id: number;
  chain: ChainLink;
};
export type ChainLink = {
  species: NamedAPIResource;
  evolution_details: EvolutionDetail[];
  evolves_to: ChainLink[];
};

export type Move = {
  id: number;
  name: string;
  accuracy: number | null;
  pp: number;
  power: number;
};

export interface PokemonType {
  slot: number;
  type: NamedAPIResource;
}
export interface PokemonMoveVersion {
  move_learn_method: NamedAPIResource;
  version_group: NamedAPIResource;
  level_learned_at: number;
}
export interface PokemonMove {
  move: NamedAPIResource;
  version_group_details: PokemonMoveVersion[];
}

export interface NamedAPIResource {
  name: string;
  url: string;
}
interface APIResource {
  url: string;
}
interface PokemonAbility {
  is_hidden: boolean;
  ability: NamedAPIResource;
}
interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  front_female: string | null;
  front_shiny_female: string | null;
  back_default: string | null;
  back_shiny: string | null;
  back_female: string | null;
  back_shiny_female: string | null;
  other: {
    dream_world: {
      front_default: string | null;
      front_female: string | null;
    };
    home: {
      front_default: string | null;
      front_female: string | null;
      front_shiny: string | null;
      front_shiny_female: string | null;
    };
    "official-artwork": {
      front_default: string | null;
      front_shiny: string | null;
    };
    showdown: {
      back_default: string | null;
      back_female: string | null;
      back_shiny: string | null;
      back_shiny_female: string | null;
      front_default: string | null;
      front_female: string | null;
      front_shiny: string | null;
      front_shiny_female: string | null;
    };
  };
}
interface FlavorText {
  flavor_text: string;
  language: NamedAPIResource;
  version: NamedAPIResource;
}
interface PokemonStat {
  stat: NamedAPIResource;
  effort: number;
  base_stat: number;
}
interface Genus {
  genus: string;
  language: NamedAPIResource;
}

export interface EvolutionDetail {
  base_form: NamedAPIResource | null;
  evolved_form: NamedAPIResource | null;

  gender: number | null;
  held_item: NamedAPIResource | null;
  item: NamedAPIResource | null;
  known_move: NamedAPIResource | null;
  known_move_type: NamedAPIResource | null;
  location: NamedAPIResource | null;

  min_affection: number | null;
  min_beauty: number | null;
  min_damage_taken: number | null;
  min_happiness: number | null;
  min_level: number | null;
  min_move_count: number | null;
  min_steps: number | null;

  near_special_rock: boolean;
  needs_multiplayer: boolean;
  needs_overworld_rain: boolean;

  party_species: NamedAPIResource | null;
  party_type: NamedAPIResource | null;
  region: NamedAPIResource | null;

  relative_physical_stats: number | null;
  time_of_day: string;

  trade_species: NamedAPIResource | null;
  trigger: NamedAPIResource;

  turn_upside_down: boolean;
  used_move: NamedAPIResource | null;
  version_group: NamedAPIResource;
}

export interface PokemonSpeciesVariety {
  is_default: boolean;
  pokemon: NamedAPIResource;
}

export interface ErrorState {
  title: string;
  message: string;
}
export type PokemonDataError = "not-found" | "error" | null;
export type Content = Array<{ label: string; value: React.ReactNode }>;

//The PokedexCardData type is a union because it allows us
//to handle the error state properly. 
export type PokedexCardData =
    | {
        isError: false;
        id: number;
        species: PokemonSpecies;
        pokemon: Pokemon;
    }
    | {
        isError: true;
        id: number;
        species: PokemonSpecies | null;
        pokemon: Pokemon | null;
    }; 
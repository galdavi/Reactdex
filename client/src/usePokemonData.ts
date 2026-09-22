import { useEffect, useState } from "react";
import { NATIONAL_POKEDEX_API_URL } from "./constants";
import type {
  EvolutionChain,
  Pokedex,
  Pokemon,
  PokemonDataError,
  PokemonSpecies,
} from "./types";

interface PokemonState {
  pokemonSpecies: PokemonSpecies | null;
  pokedex: Pokedex | null;
  pokemon: Pokemon | null;
  formURL: string | null;
  evolutionChain: EvolutionChain | null;
  error: PokemonDataError;
}
export default function usePokemonData(url: string) {
  console.log(url);
  const [state, setState] = useState<PokemonState>({
    pokemonSpecies: null,
    pokedex: null,
    pokemon: null,
    formURL: null,
    evolutionChain: null,
    error: null,
  });

  const isLoading =
    !state.pokemonSpecies ||
    !state.pokedex ||
    !state.pokemon ||
    !state.evolutionChain;

  function selectPokemonForm(newFormURL: string) {
    setState((prev) => ({
      ...prev,
      formURL: newFormURL,
    }));
  }

  //Pokedex
  useEffect(() => {
    const controller = new AbortController();

    const fetchPokedexData = async () => {
      setState((prev) => ({
        ...prev,
        pokedex: null,
        error: null,
      }));

      try {
        const response = await fetch(NATIONAL_POKEDEX_API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`${response.status}`);
        }

        const pokedexData = await response.json();
        setState((prev) => ({
          ...prev,
          pokedex: pokedexData,
        }));
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error(`Unexpected error occurred`);

        if (error.name === `AbortError`) {
          return;
        }

        console.error(error);

        setState((prev) => ({
          ...prev,
          error: "error",
        }));
      }
    };

    fetchPokedexData();

    return () => controller.abort();
  }, []);

  //Pokemon Species
  useEffect(() => {
    const controller = new AbortController();
    const fetchSpeciesData = async () => {
      setState((prev) => ({
        ...prev,
        pokemonSpecies: null,
        pokemon: null,
        formURL: null,
        evolutionChain: null,
        error: null,
      }));

      try {
        const response = await fetch(url, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`${response.status}`);
        }

        const speciesData = await response.json();
        setState((prev) => ({
          ...prev,
          pokemonSpecies: speciesData,
          formURL: speciesData.varieties[0].pokemon.url,
        }));
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Unexpected error occurred");
        if (error.name === `AbortError`) {
          return;
        }

        console.error(`Could not load Pokemon Species data. ${error}`);
        setState((prev) => ({
          ...prev,
          error: "not-found",
        }));
      }
    };

    fetchSpeciesData();

    return () => controller.abort();
  }, [url]);

  //Evolution Chain
  useEffect(() => {
    const controller = new AbortController();
    const fetchEvolutionData = async () => {
      const evolutionURL = state.pokemonSpecies?.evolution_chain.url;
      if (!evolutionURL) {
        return;
      }
      setState((prev) => ({
        ...prev,
        evolutionChain: null,
        error: null,
      }));

      try {
        const response = await fetch(evolutionURL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`${response.status}`);
        }

        const evolutionData = await response.json();

        setState((prev) => ({
          ...prev,
          evolutionChain: evolutionData,
        }));
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error(`Unexpected error occurred`);

        if (error.name === `AbortError`) {
          return;
        }

        console.error(`Could not load evolution data ${error}`);
        setState((prev) => ({
          ...prev,
          error: "error",
        }));
      }
    };

    fetchEvolutionData();

    return () => controller.abort();
  }, [state.pokemonSpecies]);

  //Pokemon Form
  useEffect(() => {
    const controller = new AbortController();

    const fetchFormData = async () => {
      if (!state.formURL) {
        return;
      }

      setState((prev) => ({
        ...prev,
        pokemon: null,
        error: null,
      }));

      try {
        const response = await fetch(state.formURL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`${response.status}`);
        }

        const pokemonData = await response.json();
        setState((prev) => ({
          ...prev,
          pokemon: pokemonData,
          error: null,
        }));
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error(`Unexpected error occurred`);

        if (error.name === `AbortError`) {
          return;
        }

        console.error(`Could not load Pokemon form data. ${error}`);
        setState((prev) => ({
          ...prev,
          error: "error",
        }));
      }
    };

    fetchFormData();
    return () => controller.abort();
  }, [state.formURL]);
  console.log(state.error);
  return { state, isLoading, selectPokemonForm };
}

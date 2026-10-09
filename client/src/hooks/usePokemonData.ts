import { useEffect, useState } from "react";
import { NATIONAL_POKEDEX_API_URL } from "../constants";
import type {
  EvolutionChain,
  Pokedex,
  Pokemon,
  PokemonDataError,
  PokemonSpecies,
} from "../types";

interface PokemonData {
  pokemonSpecies: PokemonSpecies | null;
  pokedex: Pokedex | null;
  pokemon: Pokemon | null;
  formURL: string | null;
  evolutionChain: EvolutionChain | null;
  error: PokemonDataError;
}
export default function usePokemonData(url: string) {
  const [data, setData] = useState<PokemonData>({
    pokemonSpecies: null,
    pokedex: null,
    pokemon: null,
    formURL: null,
    evolutionChain: null,
    error: null,
  });

  const isLoading =
    !data.pokemonSpecies ||
    !data.pokedex ||
    !data.pokemon ||
    !data.evolutionChain;

  function selectPokemonForm(newFormURL: string) {
    setData((prev) => ({
      ...prev,
      formURL: newFormURL,
    }));
  }

  //Pokedex needed to get the adjacent pokemon for the current pokemon being viewed.
  useEffect(() => {
    const controller = new AbortController();

    const fetchPokedexData = async () => {
      setData((prev) => ({
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
        setData((prev) => ({
          ...prev,
          pokedex: pokedexData,
        }));
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error(`Unexpected error occurred`);

        if (error.name === `AbortError`) {
          return;
        }

        setData((prev) => ({
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
      setData((prev) => ({
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
        setData((prev) => ({
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
        setData((prev) => ({
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
      const evolutionURL = data.pokemonSpecies?.evolution_chain.url;
      if (!evolutionURL) {
        return;
      }
      setData((prev) => ({
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

        setData((prev) => ({
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
        setData((prev) => ({
          ...prev,
          error: "error",
        }));
      }
    };

    fetchEvolutionData();

    return () => controller.abort();
  }, [data.pokemonSpecies]);

  //Pokemon Form
  useEffect(() => {
    const controller = new AbortController();

    const fetchFormData = async () => {
      if (!data.formURL) {
        return;
      }

      setData((prev) => ({
        ...prev,
        pokemon: null,
        error: null,
      }));

      try {
        const response = await fetch(data.formURL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`${response.status}`);
        }

        const pokemonData = await response.json();
        setData((prev) => ({
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
        setData((prev) => ({
          ...prev,
          error: "error",
        }));
      }
    };

    fetchFormData();
    return () => controller.abort();
  }, [data.formURL]);


  return { data: data, isLoading, selectPokemonForm };
}

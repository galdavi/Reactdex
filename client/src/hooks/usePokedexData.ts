import { useEffect, useState } from "react";
import type { Generation, Pokedex, PokedexData, Pokemon, PokemonSpecies } from "../types";
import { getPokemonID } from "../helpers/formatters";

function isPokedex(data: Generation | Pokedex): data is Pokedex {
  return (data as Pokedex).pokemon_entries !== undefined;
}

//Hook allows for us to fetch a large batch of pokemon data based on the API url provided.
export default function usePokedexData(url: string) {
  const [pokedex, setPokedex] = useState<PokedexData[]>([]); 
  const [speciesURL, setSpeciesURL] = useState<string[]>([]);
  const [pokedexError, setPokedexError] = useState<boolean>(false);
  const [isPokedexLoading, setIsPokedexLoading] = useState(false);
  
  //App should display an error if the fetch fails.
  useEffect(() => {
    if (url.length === 0) {
      return;
    }

    const controller = new AbortController();

    fetch(url, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }

        return response.json();
      })
      .then((generationData: Generation | Pokedex) => {
        const species = isPokedex(generationData)
          ? generationData.pokemon_entries.map((p) => p.pokemon_species.url)
          : generationData?.pokemon_species.map((p) => p.url);
        setSpeciesURL(species);
      })
      .catch((err) => {
        const error =
          err instanceof Error ? err : new Error(`Unexpected error`);
        if (error.name === `AbortError`) {
          return;
        }
        console.error(error);
        setPokedexError(true);
      });
    return () => controller.abort();
  }, [url]);

    //If a single fetch fails then the app should display 
    // the an error message on where the fetch failed
  useEffect(() => {
    if (speciesURL.length === 0) {
      return;
    }
    const controller = new AbortController();

    const fetchPokedexData = async () => {
      setPokedex([]);
      setIsPokedexLoading(true);
      const fetchPromises = speciesURL.map(
        async (url): Promise<PokedexData> => {
          const fallbackID = getPokemonID(url);

          try {
            const speciesResponse = await fetch(url, {
              signal: controller.signal,
            });

            if (!speciesResponse.ok) {
              console.error(
                `Failed to fetch species data: ${speciesResponse.status}`,
              );
              return {
                isError: true,
                id: fallbackID,
                species: null,
                pokemon: null,
              };
            }

            //Fetch Species Data
            const speciesData: PokemonSpecies = await speciesResponse.json();
            const defaultVariety = speciesData.varieties.find(
              (variety) => variety.is_default,
            );

            if (!defaultVariety) {
              console.error(
                `No default variety found for species ${speciesData.name}`,
              );
              return {
                isError: true,
                id: fallbackID,
                species: speciesData,
                pokemon: null,
              };
            }

            //Fetch Pokemon Data
            const pokemonResponse = await fetch(defaultVariety.pokemon.url, {
              signal: controller.signal,
            });

            if (!pokemonResponse.ok) {
              console.error(
                `Failed to fetch pokemon data: ${pokemonResponse.status}`,
              );
              return {
                isError: true,
                id: fallbackID,
                species: speciesData,
                pokemon: null,
              };
            }
            const pokemonData: Pokemon = await pokemonResponse.json();

            //If both request succeed
            return {
              isError: false,
              id: speciesData.id ?? fallbackID,
              species: speciesData,
              pokemon: pokemonData,
            };
          } catch (err) {
            const error =
              err instanceof Error
                ? err
                : new Error(`Unexpected error occurred`);
            console.error(`Error fetching data for species URL ${url}:`, error);

            return {
              isError: true,
              id: fallbackID,
              species: null,
              pokemon: null,
            };
          }
        },
      );

      const results: PokedexData[] = await Promise.all(fetchPromises);

      // Check if the fetch was aborted before updating the state
      if (controller.signal.aborted) {
        return;
      }
      const sortedSpecies = results.sort((a, b) => a.id - b.id);
      setPokedex(sortedSpecies);
      setIsPokedexLoading(false);
    };

    fetchPokedexData();

    return () => controller.abort();
  }, [speciesURL]);

  return {pokedex, isPokedexLoading, pokedexError};
}

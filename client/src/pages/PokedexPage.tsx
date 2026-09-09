import { useEffect, useId, useState } from "react";
import { GEN_API_URL } from "../constants";
import type {
    NamedAPIResource,
    Generation,
    PokemonSpecies,
    Pokemon,
    PokedexCardData,
} from "../types";
import PageLoader from "../components/PageLoader";
import { getPokemonID } from "../helpers/formatters";
import Pokedex from "../components/pokedex/Pokedex";
import NotFoundPage from "./NotFoundPage";


function getGenerationMap(data: NamedAPIResource[]) {
    const generation = new Map<string, string>();

    for (let i = 0; i < data.length; i++) {
        let genName = data[i].name.replace(/-/g, " ");
        genName = genName[0].toUpperCase() + genName.slice(1);
        genName = genName.slice(0, 11) + genName.slice(11).toUpperCase();
        generation.set(genName, data[i].url);
    }
    return generation;
}


export default function PokedexPage() {
    const [error, setError] = useState<boolean>(false);
    const [generation, setGenerations] = useState<Map<string, string> | null>(null);
    const [selectedGen, setSelectedGen] = useState<string>("");
    const [speciesURL, setSpeciesURL] = useState<string[]>([]);
    const [pokedex, setPokedex] = useState<PokedexCardData[]>([]);
    const [isPokedexLoading, setIsPokedexLoading] = useState(false);
    const isGenerationLoading = !generation;
    const pokedexURL = generation?.get(selectedGen) ?? "";
    const selectVersion = useId();

    //Web page should display an error if the fetch fails.
    useEffect(() => {
        const controller = new AbortController();
        fetch(GEN_API_URL, {
            signal: controller.signal
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error ${response.status} `);
                }
                return response.json();
            })
            .then((data) => {
                const generationMap = getGenerationMap(data.results);
                const currentGen = generationMap.keys().next().value ?? ""
                setGenerations(generationMap);
                setSelectedGen(currentGen);
            })
            .catch((err) => {
                const error = err instanceof Error ? err : new Error(`Unexpected error`);
                if (error.name === `AbortError`) {
                    return;
                }
                console.error(error)
                setError(true);
            })

        return () => controller.abort();
    }, []);

    //App should display an error if the fetch fails.
    useEffect(() => {
        if (pokedexURL === "") {
            return;
        }
        const controller = new AbortController();
        fetch(pokedexURL, {
            signal: controller.signal
        })
            .then((response) => {
                setSpeciesURL([])
                if (!response.ok) {
                    throw new Error(`${response.status}`);
                }
                return response.json();
            })
            .then((generationData: Generation) => {
                const species = generationData?.pokemon_species.map((p) => p.url)
                setSpeciesURL(species)
            }).catch((err) => {
                const error = err instanceof Error ? err : new Error(`Unexpected error`);
                if (error.name === `AbortError`) {
                    return;
                }
                console.error(error);
                setError(true);
            })

        return () => controller.abort();
    }, [pokedexURL])

    //If a single fetch fails then the app should display 
    // the card in which the fetch failed
    useEffect(() => {
        const controller = new AbortController();

        const fetchPokedexData = async () => {
            setPokedex([]);
            setIsPokedexLoading(true)
            const fetchPromises = speciesURL.map(
                async (url): Promise<PokedexCardData> => {
                    const fallbackID = getPokemonID(url);

                    try {
                        const speciesResponse = await fetch(url, {
                            signal: controller.signal
                        });

                        if (!speciesResponse.ok) {
                            console.error(`Failed to fetch species data: ${speciesResponse.status}`)
                            return {
                                isError: true,
                                id: fallbackID,
                                species: null,
                                pokemon: null
                            };
                        }

                        //Fetch Species Data
                        const speciesData: PokemonSpecies = await speciesResponse.json();
                        const defaultVariety = speciesData.varieties.find((variety) => variety.is_default);

                        if (!defaultVariety) {
                            console.error(`No default variety found for species ${speciesData.name}`);
                            return {
                                isError: true,
                                id: fallbackID,
                                species: speciesData,
                                pokemon: null
                            };
                        }

                        //Fetch Pokemon Data
                        const pokemonResponse = await fetch(defaultVariety.pokemon.url, {
                            signal: controller.signal
                        }
                        );

                        if (!pokemonResponse.ok) {
                            console.error(`Failed to fetch pokemon data: ${pokemonResponse.status}`)
                            return {
                                isError: true,
                                id: fallbackID,
                                species: speciesData,
                                pokemon: null
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

                        const error = err instanceof Error ? err : new Error(`Unexpected error occurred`);
                        console.error(`Error fetching data for species URL ${url}:`, error);
                        
                        return {
                            isError: true,
                            id: fallbackID,
                            species: null,
                            pokemon: null
                        };
                    }
                })

            const results: PokedexCardData[] = await Promise.all(fetchPromises);

            // Check if the fetch was aborted before updating the state
            if (controller.signal.aborted) {
                return;
            }


            const sortedSpecies = results.sort((a, b) => a.id - b.id);
            setPokedex(sortedSpecies);
            setIsPokedexLoading(false);
        }

        fetchPokedexData();

        return () => controller.abort();

    }, [speciesURL]);

    if (error) {
        return (
            <NotFoundPage />);
    }
    if (isGenerationLoading) {
        return (
            <PageLoader />
        );
    }

    return (

        <div className="flex flex-col items-center justify-center w-full pt-4 gap-4">
            <div className="flex gap-2 text-xs">
                <label htmlFor={selectVersion}>Select Generation: </label>
                <select id={selectVersion}
                    className="px-1 border rounded-sm"
                    name={selectedGen}
                    value={selectedGen}
                    onChange={(e) => { setSelectedGen(e.target.value); }}>
                    {Array.from(generation.keys(), (gen) => <option key={gen}>{gen}</option>)}
                </select>
            </div>
            {isPokedexLoading ? <PageLoader /> : <Pokedex pokedex={pokedex} />}
        </div>

    );
}
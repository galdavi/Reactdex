import { useEffect, useState } from "react";
import PageLoader from "../components/PageLoader";
import { NATIONAL_POKEDEX_API_URL } from "../constants";
import type { Pokedex } from "../types";
import NotFoundPage from "./NotFoundPage";


// function PokemonAlphabetGroup({ letter, pokemonNames }: { letter: string, pokemonNames: Set<string> }) {
//     return (
//         <div className="flex flex-col items-center w-full h-full gap-2 p-2 border border-gray-200 shadow-md">
//             <h2>{letter}</h2>
//             <ul>{Array.from(pokemonNames, (
//                 (name) => {
//                     return (
//                         <li key={name}>
//                             {name}</li>
//                     );
//                 }
//             ))
//             }</ul>
//         </div>
//     );
// }


function IndexDataRow(){
    return(
        <div className=" flex items-center w-full h-10 gap-4 p-2 border rounded-sm border-gray-200 shadow-md">
            <div>Pokemon Id</div>
            <div>Type</div>
            <div>Total</div>
            <div>HP</div>
            <div>Attack</div>
            <div>Defense</div>
            <div>Sp.Atk</div>
            <div>Sp. Def</div>
            <div>Speed</div>
        </div>
    );
};
export default function PokemonIndex() {
    const [pokemonByIntial, setPokemonByIntial] = useState<Map<string, Set<string>> | null>(null);
    const [testData, setTestDat] = useState();
    const [error, setError] = useState<boolean>(false);
    const isPokedexLoading = !pokemonByIntial;


    useEffect(() => {
        const controller = new AbortController();

        fetch(NATIONAL_POKEDEX_API_URL, {
            signal: controller.signal
        })
            .then((response) => {
                setError(false);
                if (!response.ok) {
                    throw new Error(`${response.status}`);
                }

                return response.json();
            })
            .then((pokedex) => {
                setTestDat(pokedex);
                // const pokemonList = pokedex.pokemon_entries.map((p) => p.pokemon_species.name);
                // const intialMap = new Map<string, Set<string>>()
                // pokemonList.sort().forEach(
                //     (pokemonName) => {
                //         const key = pokemonName[0].toLowerCase();
                //         if (!intialMap.has(key)) {
                //             intialMap.set(key, new Set<string>());
                //         }

                //         intialMap.get(key)!.add(pokemonName);
                //     }
                // )
                // setPokemonByIntial(intialMap);
                
            }).catch((err) => {
                const error = err instanceof Error ? err : new Error(`Unexpeceted error`);
                if (error.name === `AbortError`) {
                    return;
                }
                console.error(`Could not get list of name data. ${error}`);
                setError(true);
            })

        return () => controller.abort();
    }, [])

    console.log(testData);
    if (isPokedexLoading) {
        return (
            <PageLoader />
        );
    }
    if (error) {
        return (
            <NotFoundPage />
        );
    }

    return (
        <div className="flex flex-wrap items-center w-full h-2xl max-w-3xl py-4 px-10
            bg-white border border-gray-200 shadow-md">
            {/* <div className="grid grid-cols-[auto_2fr] items-center justify-center w-full h-full gap-4 p-2">
                {Array.from(pokemonByIntial, ([letter, pokemonNames]) => {
                    return (
                        <PokemonAlphabetGroup key={letter} letter={letter} pokemonNames={pokemonNames} />
                    );
                })}
            </div>
 */}
    <IndexDataRow />

        </div>
    );
}
import { useEffect, useId, useState } from "react";
import { GEN_API_URL, NATIONAL_POKEDEX_API_URL } from "../constants";
import type { NamedAPIResource } from "../types";
import PageLoader from "../components/PageLoader";
import PokedexViewer from "../components/pokedex/PokedexViewer";
import NotFoundPage from "./NotFoundPage";
import usePokedexData from "../hooks/usePokedexData";


function getGenerationMap(data: NamedAPIResource[]) {
    const generation = new Map<string, string>();

    for (let i = 0; i < data.length; i++) {
        let genName = data[i].name.replace(/-/g, " ");
        genName = genName[0].toUpperCase() + genName.slice(1);
        genName = genName.slice(0, 11) + genName.slice(11).toUpperCase();
        generation.set(genName, data[i].url);
    }
    generation.set("National", NATIONAL_POKEDEX_API_URL);
    return generation;
}


export default function PokedexPage() {
    const [error, setError] = useState<boolean>(false);
    const [generation, setGenerations] = useState<Map<string, string> | null>(null);
    const [selectedGen, setSelectedGen] = useState<string>("");
    const pokedexURL = generation?.get(selectedGen) ?? "";
    const { pokedex, isPokedexLoading, pokedexError } = usePokedexData(pokedexURL);
    const isGenerationLoading = !generation;
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

    console.log(pokedex);
    if (error || pokedexError) {
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
            {isPokedexLoading ? <PageLoader /> : <PokedexViewer pokedex={pokedex} />}
        </div>

    );
}
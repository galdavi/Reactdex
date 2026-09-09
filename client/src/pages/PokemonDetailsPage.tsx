import { useParams } from "react-router-dom";
import { POKEMON_SPECIES_API_URL } from "../constants";

import BaseStats from "../components/pokemon-details/BaseStats";
import TypeDefense from "../components/pokemon-details/TypeDefense";
import BasicData from "../components/pokemon-details/BasicData";
import TrainingData from "../components/pokemon-details/TrainingData";
import BreedingData from "../components/pokemon-details/BreedingData";
import Artwork from "../components/pokemon-details/Artwork";
import PokedexEntries from "../components/pokemon-details/PokedexEntries";
import Evolution from "../components/pokemon-details/Evolution";
import PageLoader from "../components/PageLoader";
import PageTitle from "../components/pokemon-details/PageTitle";
import usePokemonData from "../usePokemonData";
import NotFoundPage from "./NotFoundPage";


export default function PokemonDetails() {
    const param = useParams();
    console.log(param);
    const { state, isLoading, selectPokemonForm } = usePokemonData(POKEMON_SPECIES_API_URL + param.pokemon?.toLowerCase().replace(/^0+/, ''));

    const detailsSectionLayout = "flex flex-col lg:flex-row w-full items-center justify-evenly gap-8 pb-10";

    const { pokemon, pokemonSpecies, evolutionChain, pokedex, error } = state;
    function handleFormChange(newFormURL: string) {
        selectPokemonForm(newFormURL);
    }

    if (error) {
        return (
            <NotFoundPage/>
        );
    }
    if (isLoading || !pokemon || !pokemonSpecies || !evolutionChain || !pokedex) {
        return (
            <PageLoader />
        );
    }
    return (
        <div className="flex flex-col items-center w-full max-w-7xl py-4 px-10 
        bg-white border border-gray-200 shadow-md gap-10 divide-y 
        divide-gray-200 ">
            <PageTitle name={pokemon.name}
                id={pokemonSpecies.id} pokedex={pokedex.pokemon_entries}
                varieties={pokemonSpecies.varieties}
                onFormChange={handleFormChange} />

            <section className={detailsSectionLayout}>
                <div
                    className="flex flex-col items-center w-full max-w-sm h-auto pt-2 border 
                border-neutral-200 rounded-md gap-4 shadow-sm">
                    <Artwork pokemon={pokemon} />
                    <PokedexEntries pokedexEntry={pokemonSpecies} />
                </div>

                <div className="flex flex-col lg:flex-row gap-8 ">
                    <BasicData pokemon={pokemon} pokedexEntry={pokemonSpecies} />
                    <div className="flex flex-col gap-8">
                        <TrainingData pokemon={pokemon} pokedexEntry={pokemonSpecies} />
                        <BreedingData pokedexEntry={pokemonSpecies} />
                    </div>
                </div>
            </section>
            <section className={detailsSectionLayout}>
                <BaseStats data={pokemon.stats} />
                <TypeDefense pokemonTypes={pokemon.types} />
            </section>
            <section className={detailsSectionLayout}>
                <Evolution pokemonName={pokemon.name}
                    evolutionChain={evolutionChain.chain} />
            </section>
        </div>


    );
}
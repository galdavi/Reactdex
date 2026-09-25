import { Link } from "react-router-dom";
import type { PokemonEntry } from "../../types";
import SearchBar from "../layout/SearchBar";
import { toTitleCase } from "../../helpers/formatters";

interface PokemonNotFoundProps {
    query: string;
    pokedexData: PokemonEntry[];
}

function displayPokemonName(name: string, query: string) {
    const index = name.toLowerCase().indexOf(query);

    return (
        <span className="text-secondary">
            {name.slice(0, index)}
            <span className="font-bold">{name.slice(index, index + query.length)}</span>
            {name.slice(index + query.length)}
        </span>
    );

}

function filterPokemonByName(pokemonList: PokemonEntry[], query: string) {
    // If the query is a single letter, filter by the first letter of the name
    if (query.length === 1) {
        return pokemonList
            .filter((entry) => entry.pokemon_species.name.toLowerCase()[0] === query)
            .map((entry) => entry.pokemon_species.name)
            .sort();
    }
    // Otherwise, filter by the name containing the query
    return pokemonList
        .filter(
            (entry) => entry.pokemon_species.name.toLowerCase().includes(query))
        .map((entry) => entry.pokemon_species.name)
        .sort();

}

function PokemonMatches({ pokemons, query }: { pokemons: string[], query: string }) {
    return (
        <ul className="grid grid-cols-3 gap-2 mt-4">
            {pokemons.map((pokemon) => {
                return (
                    <li key={pokemon}
                        className="hover:bg-gray-200"
                    ><Link
                        to={`/pokemon-details/${pokemon}`}>
                            {displayPokemonName(toTitleCase(pokemon), query)}
                        </Link>
                    </li>
                );
            })}
        </ul>

    );
}
export default function PokemonNotFound({ query, pokedexData }: PokemonNotFoundProps) {

    const filteredPokemon = filterPokemonByName(pokedexData, query);
    return (
        <div className="flex justify-center w-full py-8 px-6">
            <div className="flex flex-col items-center  w-full max-w-4xl justify-center gap-2 px-2 py-4 bg-white border border-gray-500 rounded-md">
                <h1 className="text-4xl font-semibold">Pokemon not found!</h1>
                <p className="text-sm text-secondary">
                    You searched for the pokemon <span className="border rounded-sm px-2">{query}</span> and it could not be found. Please check the spelling and try again.
                </p>
                <SearchBar />
                {filteredPokemon.length > 0 &&
                    <div className="flex flex-col items-center justify-center gap-2 mt-4">
                        <h2 className="text-2xl font-semibold">Potential Pokemon Matches</h2>
                        <PokemonMatches pokemons={filteredPokemon} query={query} />
                    </div>
                }
            </div>

        </div>
    );
}
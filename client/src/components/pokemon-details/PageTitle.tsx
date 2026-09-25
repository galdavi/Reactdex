import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatPokemonID, toTitleCase } from "../../helpers/formatters";
import type { PokemonEntry, PokemonSpeciesVariety } from "../../types";
import { Link } from "react-router-dom";
import { useId } from "react";

function getPokemonForms(varieties: PokemonSpeciesVariety[]) {
    const pokemonForms = new Map<string, string>();
    varieties.forEach((variety) => {
        pokemonForms.set(variety.pokemon.name, variety.pokemon.url);
    })
    return pokemonForms;
}
interface AdjacentPokemonProps {
    id: number;
    name: string;
    position?: "left" | "right";
}

function AdjacentPokemon({ id, name, position }: AdjacentPokemonProps) {
    return (
        <Link to={`/pokemon-details/${id}`}
            className={`flex flex-1 h-20 px-4 py-4 bg-neutral-500 border-neutral-500
        hover:bg-neutral-600 hover:border-neutral-600 transition-all duration-300 
        [clip-path:polygon(0_0,100%_0,100%_100%,70%_100%,30%_60%,0_60%)]
        ${position === 'left' ? '-ml-10 rotate-y-180' : '-mr-10'}`}
        >
            <div className={`text-white font-normal gap-2 flex flex-1 ${position === 'left' ? 'rotate-y-180' : 'justify-end'}`}>
                {position === 'left' && <ChevronLeft />}
                <span >{`#${formatPokemonID(id)}`}</span>
                <span >{toTitleCase(name)}</span>
                {position === 'right' && <ChevronRight />}
            </div>
        </Link>
    );
}

interface PokemonVarietiesProps {
    varieties: PokemonSpeciesVariety[];
    selectedForm: string;
    onSelectForm: (formName: string) => void;
}

function PokemonVarieties({ varieties, selectedForm, onSelectForm }: PokemonVarietiesProps) {
    const selectVariety = useId();

    return (
        <div className="flex items-center justify-center gap-2 text-xs">
            <label htmlFor={selectVariety}> Forms:</label>

            <select id={selectVariety}
                className="w-32 px-1 border rounded-sm"
                value={selectedForm}
                onChange={(e) => {
                    onSelectForm(e.target.value);
                }}>
                {varieties.map(
                    (variety) =>
                        <option
                            key={variety.pokemon.name}
                            value={variety.pokemon.name}
                            className="font-light">
                            {toTitleCase(variety.pokemon.name)}
                        </option>)
                }
            </select>

        </div>
    );
}

interface PageTitleProps {
    name: string;
    id: number;
    pokedex: PokemonEntry[];
    varieties: PokemonSpeciesVariety[];
    onFormChange: (value: string) => void;
}

export default function PageTitle({ name, id, pokedex, varieties, onFormChange }: PageTitleProps) {    
    const pokemonForms = getPokemonForms(varieties);

    const prevPokemon = {
        id: pokedex[(id - 1 > 0 ? id - 1 : pokedex.length) - 1].entry_number,
        name: pokedex[(id - 1 > 0 ? id - 1 : pokedex.length) - 1].pokemon_species.name
    };
    const nextPokemon = {
        id: pokedex[(id + 1 < pokedex.length ? id + 1 : 1) - 1].entry_number,
        name: pokedex[(id + 1 < pokedex.length ? id + 1 : 1) - 1].pokemon_species.name
    };

    function handleFormChange(formName: string) {
        const newFormURL = pokemonForms.get(formName);
        if (newFormURL) {
            onFormChange(newFormURL);
        }
    }

    return (
        <div className="relative flex w-full items-end pb-8 lg:pb-10">
            <AdjacentPokemon id={prevPokemon.id} name={prevPokemon.name} position="left" />
            <AdjacentPokemon id={nextPokemon.id} name={nextPokemon.name} position="right" />
            <div className="absolute flex flex-col gap-1 bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap
            ">
                <div className="flex items-center justify-center gap-2 font-semibold">
                    <span className="flex items-end  text-sm sm:text-md md:text-lg text-secondary">{`#${formatPokemonID(id)}`}</span>
                    <h1 className="text-md sm:text-lg md:text-2xl">{toTitleCase(name)}</h1>
                </div>
                {varieties.length > 1 &&
                    <PokemonVarieties
                        varieties={varieties}
                        selectedForm={name}
                        onSelectForm={handleFormChange} />}
            </div>

        </div>
    );
}
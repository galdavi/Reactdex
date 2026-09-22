import type { PokedexCardData } from "../../types";
import PokedexCard from "./PokedexCard";
import FailedCard from "./FailedCard";

export default function Pokedex({ pokedex }: { pokedex: PokedexCardData[] }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {pokedex.map((p) =>
                !p.isError ?
                    <PokedexCard key={p.id} id={p.id} name={p.species.name} pokemon={p.pokemon!} />
                    : <FailedCard key={p.id} id={p.id}  />
            )}
        </div>
    );
}
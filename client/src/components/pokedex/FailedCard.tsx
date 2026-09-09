import { Link } from "react-router-dom";
import type { PokemonDataError } from "../../types";
import { ImageOff } from "lucide-react";
import { formatPokemonID } from "../../helpers/formatters";


export default function FailedCard({ id, error }: { id: number, error: PokemonDataError }) {


    return (
        <div className="flex flex-col items-center justify-center 
        w-full h-auto min-w-40 max-w-48 bg-card-background py-4 px-4 gap-3
        border border-gray-200 rounded-sm shadow-sm">
            <Link to={`/pokemon-details/${id}`}
                className="text-xs text-secondary font-medium
                hover:text-blue-800 transition-colors duration-200">
                #{formatPokemonID(id)}
            </Link>

            <div className="flex items-center justify-center 
             w-full h-40 max-w-38 min-w-36 py-4 px-2">
                <ImageOff className="flex items-center justify-center 
                w-full h-auto max-w-18 min-w-14 text-neutral-400"/>
            </div>

            <span className="block text-center text-sm">Could Not load pokemon data </span>

        </div>
    );
}
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
    const [pokemon, setPokemon] = useState('');
    const navigate = useNavigate();


    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                navigate(`/pokemon-details/${pokemon}`);
            }}
            className="flex items-center bg-white rounded-md px-2 outline-0 text-secondary">
            <input type="text"
                id="search-bar"
                placeholder="Search..."
                className="outline-none"
                value={pokemon}
                onChange={(e) => { setPokemon(e.target.value) }} />
            <SearchIcon className="w-4 h-4" />
        </form>);
}
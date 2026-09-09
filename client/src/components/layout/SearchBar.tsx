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
            className="flex items-center bg-white rounded-md pl-2 text-secondary">
            <input type="text"
                id="search-bar"
                placeholder="Search..."
                className="outline-none"
                value={pokemon}
                onChange={(e) => { setPokemon(e.target.value) }} />
            <button className="sm:flex items-center h-full px-1 rounded-r-md bg-red-700 hover:bg-red-800 hidden">
                <SearchIcon className=" text-white w-4 h-4" />
            </button>
        </form>);
}
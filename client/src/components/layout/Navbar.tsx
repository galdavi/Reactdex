import { Menu } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";


export default function Navbar() {
    const [openMenu, setOpenMenu] = useState(false);
    const [openSearch, setOpenSearch] = useState(false);
    const navBase = "flex items-center justify-between w-full h-12 px-4 bg-red-600 shadow-lg text-white";
    const mobileNav = "sm:hidden flex flex-col w-full items-center justify-center gap-2 bg-red-600 text-white pb-2";
    const mobileMenuButton = "flex items-center justify-center w-full py-2 text-white hover:bg-red-700";

    return (
        <>
            <nav className={navBase}>
                <div className="flex items-center">
                    <Link to="/" className="text-md">Reactdex</Link>
                    <img src="/src/assets/logo.png" alt="logo"
                        className="w-16 h-12" />
                </div>
                <button onClick={() => setOpenMenu(prev => !prev)}
                    className="sm:hidden flex items-center justify-center w-8 h-8  bg-red-500 rounded-sm hover:bg-red-700 hover:cursor-pointer">
                    <Menu className="w-5 h-5" />
                </button>
                <div className="hidden sm:flex gap-4    ">

                <Link to="/"  className="text-sm text-white" reloadDocument>Pokedex</Link>
                <Link to="/pokemon-details/bulbasaur"  className="text-sm" reloadDocument>Pokemon Details</Link>
                <SearchBar/>
                </div>
            </nav>

            {
                openMenu &&
                <nav className={mobileNav}>
                    <Link to="/"
                        className={mobileMenuButton}
                    >Pokedex</Link>
                    <Link to="/pokemon-details/bulbasaur"
                        className={mobileMenuButton}
                    >Pokemon Details</Link>
                    <button 
                        className={mobileMenuButton}
                    onClick={() => setOpenSearch(prev => !prev)}>Search </button>
                    {openSearch && 
                        <SearchBar/>
                    }
                </nav>
            }
        </>
    );
}
import { useState } from "react";
import type { Pokedex } from "./types";

export default function usePokedexData(pokedexUrl : string){
    const [pokedex, setPokedex] = useState<Pokedex| null>(null);

    return {pokedex};
}
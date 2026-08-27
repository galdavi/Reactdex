import { useState } from "react";
import { toTitleCase } from "../../helpers/formatters";
import type { Pokemon } from "../../types";
import imageNotFound from "../../assets/image-not-found.png";
import TabsLists from "../TabsLists";
import ImageWithLoader from "../ImageWithLoader";

function getArtwork(pokemon: Pokemon) {
    const artwork = new Map<string, string>();

    for (const [key, value] of Object.entries(pokemon.sprites.other)) {
        if (key !== "showdown" && key !== "dream_world") {


            if (key === "home") {
                artwork.set("Game", value.front_default ? value.front_default : imageNotFound)
            } else {
                artwork.set(toTitleCase(key), value.front_default ? value.front_default : imageNotFound);
            }
        }
    }
    return artwork
}

export default function Artwork({ pokemon }: { pokemon: Pokemon }) {
    const [current, setCurrent] = useState("Official Artwork");
    const artwork = getArtwork(pokemon);

    return (
        <>
            <TabsLists items={Array.from(artwork.keys())} current={current}
                handleClick={(e) => { setCurrent(e.currentTarget.value) }} />
            <div className="flex px-4 py-6 bg-white">
                <div className="flex items-center justify-center w-full min-w-64 h-auto p-8 bg-card-secondary-background rounded-md">
                    <ImageWithLoader imageSrc={artwork.get(current) ?? imageNotFound} alt="Pokemon Artwork" />
                </div>
            </div>


        </>
    );
}
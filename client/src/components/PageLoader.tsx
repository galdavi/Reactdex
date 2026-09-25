import { useEffect, useState } from "react";

const loaderMessages = [
    "Throwing a Poké Ball...",
    "Searching high grass...",
    "Running from a wild Zubat...",
    "Surfing across Route 19...",
    "Battling the Elite Four...",
    "Fishing with an Old Rod...",
    "Talking to an old man blocking the path...",
    "Digging out of Diglett's Cave...",
    "Grinding for a Master Ball...",
    "Trading with a friend...",

]

// Add the inner button circle right now it just looks flat
export default function PageLoader() {
    const [index, setIndex] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((index) => index + 1 < loaderMessages.length ? index + 1 : 0);
        }, 2000)

        return () => clearInterval(interval)
    }, []);
    return (
        <div className="flex flex-col relative w-full shrink-0 aspect-square items-center pt-24 ">
            <div className="flex items-center justify-center w-full min-w-24 max-w-38 h-full min-h-24 max-h-38
        rounded-full bg-linear-to-b from-red-500 from-50% to-neutral-100 to-50%
        shadow-lg border-4 border-neutral-800 animate-wiggle-bounce shrink-0">
                <div className="w-full  absolute top-1/2 h-0.5 bg-black -z-1"/>
                <div className="flex items-center justify-center w-full min-w-8 max-w-10 h-full min-h-8 max-h-10
                    rounded-full bg-neutral-100 shadow-md border-2" >
                        <div className="w-full min-w-3 max-w-4 h-full min-h-3 max-h-4
                        rounded-full bg-neutral-100 shadow-md border border-neutral-700
                        "/>
                </div>
                            
            </div>
            <span className="text-sm text-secondary">{loaderMessages[index]}</span>

        </div>
    );
}
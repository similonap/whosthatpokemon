import React, { createContext, useEffect, useState } from "react";
import { Pokemon } from "./types";

interface Generations {
    [key: number]: Pokemon[]
}

interface GameContext {
    generations: Generations;
    loading: boolean;
    progress: number;
    setProgress: (number: number) => void;
    score: number;
    setScore: (number: number) => void;
    hearts: number;
    setHearts: (number: number) => void;
}

export const GameContext = createContext<GameContext>({
    generations: {},
    loading: false,
    score: 0,
    setScore: () => { },
    progress: 0,
    setProgress: () => { },
    hearts: 3,
    setHearts: () => { }
});

function useApiEffect(cb: () => void, deps: any[]) {
    let ignore = false;

    useEffect(() => {
        if (ignore) return;
        cb();

        return () => {
            ignore = true;
        }
    }, deps);
}

export const GameProvider = ({ children }: { children: React.ReactElement }) => {
    const [generations, setGenerations] = React.useState<Generations>({});
    const [loading, setLoading] = React.useState<boolean>(true);
    const [score, setScore] = useState<number>(0);
    const [progress, setProgress] = useState<number>(0);
    const [hearts, setHearts] = useState(3);

    const loadAllGenerations = async () => {
        setLoading(true);
        let generations: Generations = {};
        for (let i = 1; i <= 9; i++) {
            const response = await fetch("https://sampleapis.assimilate.be/pokemon/pokemon?generation=" + i)
            let json: Pokemon[] = (await response.json()).filter((p: Pokemon) => p.id < 1026);
            generations[i] = json;
        }
        setGenerations(generations);
        setLoading(false);
    }

    useApiEffect(() => {
        loadAllGenerations();
    }, []);

    return (
        <GameContext.Provider value={{ generations: generations, loading: loading, score, setScore, progress, setProgress, hearts, setHearts }}>
            {loading ? <div>Loading Data...</div> : null}
            {!loading ? children : null}
        </GameContext.Provider>
    );
}

export default GameProvider;
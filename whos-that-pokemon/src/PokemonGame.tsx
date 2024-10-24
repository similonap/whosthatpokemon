import { useContext, useEffect, useRef, useState } from 'react';
import './PokemonGame.css'
import { Pokemon } from "./types";
import { GameContext } from './GameProvider';
import { useNavigate } from "react-router-dom";

const QUESTIONS_GENERATION: number = 10;

function getGeneration(generation: number): string {
    switch (generation) {
        case 1:
            return "I";
        case 2:
            return "II";
        case 3:
            return "III";
        case 4:
            return "IV";
        case 5:
            return "V";
        case 6:
            return "VI";
        case 7:
            return "VII";
        case 8:
            return "VIII";
        case 9:
            return "IX";
        default:
            return "ALL";
    }
}

const App = () => {
    const { generations, score, setScore, progress, setProgress, hearts, setHearts } = useContext(GameContext);
    const [currentPokemon, setCurrentPokemon] = useState<Pokemon | null>(null);
    const [filter, setFilter] = useState<string>("");
    const [endGameMode, setEndGameMode] = useState<boolean>(false);
    const navigate = useNavigate();

    const filterRef = useRef<HTMLInputElement>(null);

    // calculate generation from progress
    const generation = Math.floor(progress / QUESTIONS_GENERATION) + 1;
    const generationProgress = progress % QUESTIONS_GENERATION;

    useEffect(() => {
        setCurrentPokemon(generations[generation][Math.floor(Math.random() * QUESTIONS_GENERATION)]);
    }, [generation]);

    const pokemon = generations[generation];
    const filteredPokemon = pokemon.filter(p => p.name.toLowerCase().includes(filter.toLowerCase())).slice(0, 4);

    const guessPokemon = (name: string) => {
        const index = filteredPokemon.findIndex(p => p.name.toUpperCase() === name.toUpperCase());

        if (index === -1) {
            return;
        }

        let newProgress = progress;
        if (filteredPokemon[index].name === currentPokemon?.name) {
            newProgress = progress + 1;
            setScore(score + 10);
        } else {
            // reset to base 0 progress for generation
            newProgress = progress - generationProgress;
            if (hearts > 1) {
                setHearts(Math.max(hearts - 1, 0));
            } else {
                setHearts(0);
                navigate("/game-over");
            }
        }

        setCurrentPokemon(pokemon[Math.floor(Math.random() * pokemon.length)]);
        setFilter("");
        setProgress(endGameMode ? 0 : Math.max(newProgress, 0));
        filterRef.current?.focus();
    }

    return (
        <div className="container-sm gx-5 game-container">
            <div className="row">
                <div className="col">
                    <h1>WHO'S THAT POKéMON?</h1>
                </div>
            </div>
            <div className="row justify-content-between">
                <p className="col-sm-5 score text-center">SCORE: {score}</p>
                <p className="col-sm-5 generation text-center">GEN: {getGeneration(generation)}</p>
            </div>
            <div className="row justify-content-between mb-3">
                {!endGameMode && (
                    <div className="col gx-0 my-0 progress-container">
                        <div className="progress-bar" style={{ width: `${generationProgress / QUESTIONS_GENERATION * 100}%` }}></div>
                    </div>
                )}
                <div className="col-2">
                    {Array.from({ length: hearts }, (_, k) => <img key={k} src="/heart.png" alt="Heart" className="heart" />)}
                    {Array.from({ length: Math.max(3 - hearts, 0) }, (_, k) => <img key={k} src="/heart.png" alt="Heart" className="heart grayscale" />)}
                </div>
            </div>
            <div className="row justify-content-center mb-4">
                <div className="col-6 pokemon-image-container">
                    <img src={currentPokemon?.image}
                        alt="Pokemon" className="pokemon-image" style={{ filter: "brightness(0) contrast(100%)" }} />
                </div>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); guessPokemon(filter); }}>
                <div className="row">
                    <input ref={filterRef} type="text" className="col m-0" id="filter-input" placeholder="FILTER POKéMON..." value={filter} onChange={(e) => setFilter(e.target.value)} />
                </div>
            </form>
            <div className="row">
                {filteredPokemon.map((p, i) => (
                    <div key={p.id} className="col-sm-6 g-0 gy-2 pe-sm-1">
                        <button className="pokemon-option w-100" onClick={() => guessPokemon(p.name)}>{p.name.toUpperCase()}</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default App
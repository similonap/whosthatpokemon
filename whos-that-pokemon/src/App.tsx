
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import './App.css'
import PokemonGame from './PokemonGame';
import { GameProvider } from './GameProvider';
import GameOver from './GameOver';

const Root = () => {
    return (
        <Outlet />
    );
}

const App = () => {

    const router = createBrowserRouter([
        {
            path: "/",
            element: <Root />,
            children: [

                {
                    path: "",
                    element: <PokemonGame />
                },
                {
                    path: "game-over",
                    element: <GameOver />
                }
            ]
        }
    ]);

    return (
        <GameProvider>
            <RouterProvider router={router} />
        </GameProvider>
    );
}

export default App
import { Routes, Route } from "react-router-dom"
import PokedexPage from "./pages/PokedexPage"
import PokemonDetails from "./pages/PokemonDetailsPage"
import MainLayout from "./layouts/MainLayout"
import NotFoundPage from "./pages/NotFoundPage"



function App() {

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<PokedexPage />} />
          <Route path="pokemon-details/:pokemon" element={<PokemonDetails />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App

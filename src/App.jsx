import './App.css'
import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import PokedexLayout from './components/templates/PokedexLayout.jsx'
import Home from './pages/Home.jsx'

const PokeDetails = lazy(() => import('./pages/PokeDetails.jsx'))
const AnciensTp = lazy(() => import('./pages/AnciensTp.jsx'))

function App() {
  return (
    <PokedexLayout>
      <Suspense
        fallback={
          <p className="state-message" role="status">
            Chargement de la page...
          </p>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/poke/:id" element={<PokeDetails />} />
          <Route path="/anciens-tp" element={<AnciensTp />} />
        </Routes>
      </Suspense>
    </PokedexLayout>
  )
}

export default App

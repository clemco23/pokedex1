import './App.css'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { motion, MotionConfig, useReducedMotion } from 'motion/react'
import Home from './pages/Home.jsx'
import PokeDetails from './pages/PokeDetails.jsx'
import AnciensTp from './pages/AnciensTp.jsx'

function App() {
  const location = useLocation()
  const reduceMotion = useReducedMotion()

  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.25 }}>
      <a className="skip-link" href="#contenu">Aller au contenu</a>
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" to="/" aria-label="Pokédex, accueil">
            <span className="pokeball" aria-hidden="true" />
            Pokédex<span className="brand-dot">.</span>
          </Link>
          <nav className="main-nav" aria-label="Navigation principale">
            <NavLink to="/" end>Explorer</NavLink>
            <NavLink to="/anciens-tp">TP 1 &amp; 2</NavLink>
          </nav>
        </div>
      </header>
      <motion.main
        id="contenu"
        className="main-content"
        key={location.pathname}
        initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.25 }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/poke/:id" element={<PokeDetails />} />
          <Route path="/anciens-tp" element={<AnciensTp />} />
        </Routes>
      </motion.main>
      <footer className="site-footer">
        <span>Un petit monde à explorer.</span>
        <span>Données : PokéAPI</span>
      </footer>
    </MotionConfig>
  )
}

export default App

import { useEffect, useState } from 'react'
import api from '../services/api.js'
import PokeCard from '../components/PokeCard.jsx'
import Pagination from '../components/Pagination.jsx'

function Home() {
  const [pokemons, setPokemons] = useState([])
  const [page, setPage] = useState(1)
  const [hasNext, setHasNext] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [erreur, setErreur] = useState('')
  const limit = 20

  useEffect(() => {
    api.get('/pokemon/', {
      params: { limit, offset: (page - 1) * limit },
    })
      .then((response) => {
        setHasNext(response.data.next !== null)
        return Promise.all(
          response.data.results.map((pokemon) =>
            api.get(pokemon.url).then((details) => details.data)
          )
        )
      })
      .then((data) => setPokemons(data))
      .catch(() => setErreur('Impossible de récupérer les pokémons.'))
      .finally(() => setIsLoading(false))
  }, [page])

  function changerPage(nouvellePage) {
    setIsLoading(true)
    setErreur('')
    setPage(nouvellePage)
  }

  return (
    <div>
      <header className="page-header">
        <p className="eyebrow">La collection</p>
        <h1>Mon Pokédex<span className="title-dot">.</span></h1>
        <p className="page-description">Chaque Pokémon a son histoire. Découvrez la sienne.</p>
      </header>
      <div className="collection-heading">
        <h2>Tous les Pokémon</h2>
        <span className="page-indicator">Page {String(page).padStart(2, '0')}</span>
      </div>
      {isLoading ? (
        <p className="state-message" role="status">Chargement des pokémons...</p>
      ) : erreur ? (
        <p className="state-message state-error" role="alert">{erreur}</p>
      ) : pokemons.length === 0 ? (
        <p className="state-message" role="status">Aucun pokemon disponible.</p>
      ) : (
        <div className="pokemon-grid">
          {pokemons.map((pokemon, index) => (
            <PokeCard
              key={pokemon.id}
              index={index}
              id={pokemon.id}
              nom={pokemon.name}
              element={pokemon.types.map((type) => type.type.name).join(', ')}
              image={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
            />
          ))}
        </div>
      )}
      <Pagination
        page={page}
        onPrev={() => changerPage(page - 1)}
        onNext={() => changerPage(page + 1)}
        disablePrev={page === 1 || isLoading}
        disableNext={!hasNext || isLoading || Boolean(erreur)}
      />
    </div>
  )
}

export default Home

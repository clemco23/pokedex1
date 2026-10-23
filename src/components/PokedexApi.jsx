import { useEffect, useState } from 'react'
import Pokemon from './PokemonApi.jsx'

function PokedexApi() {
  const [pokemons, setPokemons] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [erreur, setErreur] = useState('')

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon/')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Impossible de récupérer les pokémons.')
        }
        return response.json()
      })
      .then((data) => {
        return Promise.all(
          data.results.map((pokemon) =>
            fetch(pokemon.url).then((response) => {
              if (!response.ok) {
                throw new Error('Impossible de récupérer les détails des pokémons.')
              }
              return response.json()
            })
          )
        )
      })
      .then((data) => setPokemons(data))
      .catch((error) => {
        setErreur(error.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  return (
    <section className="archive-section pokedex-api pokemon-grid" aria-labelledby="api-pokedex-title">
      <h2 id="api-pokedex-title" className="section-header">TP 2 · PokéAPI</h2>
      {isLoading ? (
        <p className="state-message" role="status">Chargement des pokémons...</p>
      ) : erreur ? (
        <p className="state-message" role="alert">Erreur : {erreur}</p>
      ) : pokemons.length === 0 ? (
        <p className="state-message" role="status">Aucun pokemon disponible.</p>
      ) : (
        pokemons.map((pokemon) => (
          <Pokemon
            key={pokemon.id}
            nom={pokemon.name}
            element={pokemon.types.map((type) => type.type.name).join(', ')}
            image={pokemon.sprites.front_default}
          />
        ))
      )}
    </section>
  )
}

export default PokedexApi

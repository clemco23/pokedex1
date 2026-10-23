
import Pokemon from '../components/Pokemon.jsx'
import PokedexApi from '../components/PokedexApi.jsx'

function AnciensTp() {
  const pokemons = [
    { id: 1, nom: 'pikachu', element: 'electrique' },
    { id: 2, nom: 'bulbizar', element: 'plante' },
    { id: 3, nom: 'carapuce', element: 'eau' },
  ]

  return (
    <div>
      <header className="page-header">
        <p className="eyebrow">TP 1 & 2</p>
        <h1>Les premiers Pokédex</h1>
        <p className="page-description">Retrouve les collections des deux premiers TP.</p>
      </header>
      <section className="archive-section" aria-labelledby="local-pokedex-title">
        <div className="section-header">
          <h2 id="local-pokedex-title">TP 1 · Données locales</h2>
        </div>
        <div className="pokemon-grid">
          {pokemons.length === 0 ? (
            <p className="state-message" role="status">Aucun pokemon disponible.</p>
          ) : (
            pokemons.map((pokemon) => (
              <Pokemon
                key={pokemon.id}
                nom={pokemon.nom}
                element={pokemon.element}
              />
            ))
          )}
        </div>
      </section>
      <PokedexApi />
    </div>
  )
}

export default AnciensTp


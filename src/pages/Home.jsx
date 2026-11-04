import PokeCard from '../components/PokeCard.jsx'
import PokeGridSkeleton from '../components/PokeGridSkeleton.jsx'
import Pagination from '../components/Pagination.jsx'
import usePokemonPage from '../hooks/usePokemonPage.js'

function Home() {
  const { pokemons, page, hasNext, isLoading, erreur, changerPage } = usePokemonPage()

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
        <PokeGridSkeleton />
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

import PokeCard from '../molecules/PokeCard.jsx'

export default function PokemonGrid({ pokemons }) {
  return (
    <div className="pokemon-grid">
      {pokemons.map((pokemon, index) => (
        <PokeCard
          key={pokemon.id}
          index={index}
          id={pokemon.id}
          nom={pokemon.name}
          element={pokemon.types.map((type) => type.type.name).join(', ')}
          image={
            pokemon.sprites.other['official-artwork'].front_default ||
            pokemon.sprites.front_default
          }
        />
      ))}
    </div>
  )
}

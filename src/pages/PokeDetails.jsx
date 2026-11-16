import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { getPokemon, readPokemon } from '../services/pokemonCache.js'
import PokemonImage from '../components/PokemonImage.jsx'
import PokeDetailsSkeleton from '../components/PokeDetailsSkeleton.jsx'

function PokeDetails() {
  const { id } = useParams()
  const { search } = useLocation()
  const [result, setResult] = useState(null)
  const cachedPokemon = readPokemon(id)
  const currentResult = result?.id === id ? result : null
  const pokemon = cachedPokemon ?? currentResult?.pokemon
  const isLoading = !cachedPokemon && !currentResult
  const erreur = cachedPokemon ? '' : currentResult?.erreur

  useEffect(() => {
    let active = true

    getPokemon(id)
      .then((data) => {
        if (active) setResult({ id, pokemon: data, erreur: '' })
      })
      .catch(() => {
        if (active) setResult({ id, pokemon: null, erreur: 'Impossible de récupérer ce Pokémon.' })
      })

    return () => {
      active = false
    }
  }, [id])

  return (
    <div className="details-page">
      <Link className="back-link" to={`/${search}`}>
        <span aria-hidden="true">←</span> Retour à la collection
      </Link>
      <header className="page-header details-header">
        <p className="eyebrow">À la loupe</p>
        <h1>
          Détails du Pokémon<span className="title-dot">.</span>
        </h1>
      </header>
      {isLoading ? (
        <PokeDetailsSkeleton />
      ) : erreur ? (
        <p className="state-message state-error" role="alert">
          {erreur}
        </p>
      ) : pokemon ? (
        <article className="detail-card" data-type={pokemon.types[0].type.name}>
          <div className="detail-art pokemon-art">
            <span className="pokemon-number">N° {String(pokemon.id).padStart(3, '0')}</span>
            <PokemonImage
              variant="detail"
              src={
                pokemon.sprites.other['official-artwork'].front_default ||
                pokemon.sprites.front_default
              }
              alt={pokemon.name}
              width="360"
              height="360"
              loading="eager"
              fetchPriority="high"
            />
          </div>
          <div className="detail-content">
            <p className="eyebrow">Fiche Pokémon</p>
            <h2 className="detail-name">{pokemon.name}</h2>
            <div className="type-badges" aria-label="Éléments">
              {pokemon.types.map(({ type }) => (
                <span className="type-badge" data-type={type.name} key={type.name}>
                  {type.name}
                </span>
              ))}
            </div>
            <dl className="detail-measures">
              <div>
                <dt>Poids</dt>
                <dd>
                  {pokemon.weight / 10} <span>kg</span>
                </dd>
              </div>
              <div>
                <dt>Taille</dt>
                <dd>
                  {pokemon.height / 10} <span>m</span>
                </dd>
              </div>
            </dl>
          </div>
        </article>
      ) : null}
    </div>
  )
}

export default PokeDetails

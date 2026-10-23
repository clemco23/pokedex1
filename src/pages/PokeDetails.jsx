import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../services/api.js'

function PokeDetails() {
  const { id } = useParams()
  const [pokemon, setPokemon] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [erreur, setErreur] = useState('')

  useEffect(() => {
    api.get(`/pokemon/${id}/`)
      .then((response) => {
        setPokemon(response.data)
        setErreur('')
      })
      .catch(() => setErreur('Impossible de récupérer ce Pokémon.'))
      .finally(() => setIsLoading(false))
  }, [id])

  return (
    <div className="details-page">
      <Link className="back-link" to="/"><span aria-hidden="true">←</span> Retour à la collection</Link>
      <header className="page-header details-header">
        <p className="eyebrow">À la loupe</p>
        <h1>Détails du Pokémon<span className="title-dot">.</span></h1>
      </header>
      {isLoading ? (
        <p className="state-message" role="status">Chargement...</p>
      ) : erreur ? (
        <p className="state-message state-error" role="alert">{erreur}</p>
      ) : pokemon ? (
        <article className="detail-card" data-type={pokemon.types[0].type.name}>
          <div className="detail-art pokemon-art">
            <span className="pokemon-number">N° {String(pokemon.id).padStart(3, '0')}</span>
            <img
              src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
              alt={pokemon.name}
              width="360"
              height="360"
            />
          </div>
          <div className="detail-content">
            <p className="eyebrow">Fiche Pokémon</p>
            <h2 className="detail-name">{pokemon.name}</h2>
            <div className="type-badges" aria-label="Éléments">
              {pokemon.types.map(({ type }) => (
                <span className="type-badge" data-type={type.name} key={type.name}>{type.name}</span>
              ))}
            </div>
            <dl className="detail-measures">
              <div><dt>Poids</dt><dd>{pokemon.weight / 10} <span>kg</span></dd></div>
              <div><dt>Taille</dt><dd>{pokemon.height / 10} <span>m</span></dd></div>
            </dl>
          </div>
        </article>
      ) : null}
    </div>
  )
}

export default PokeDetails

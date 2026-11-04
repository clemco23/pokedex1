import { Link, useLocation } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import PokemonImage from './PokemonImage.jsx'

function PokeCard({ id, nom, element, image, index = 0 }) {
  const { search } = useLocation()
  const reduceMotion = useReducedMotion()
  const isAboveFold = index < 4

  return (
    <motion.article
      className="pokemon-card"
      data-type={element.split(', ')[0]}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.3, delay: reduceMotion ? 0 : Math.min(index * 0.025, 0.25) }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
    >
      <Link className="card-link" to={`/poke/${id}${search}`} aria-label={`Voir les détails de ${nom}`}>
        <div className="pokemon-art">
          <span className="pokemon-number">N° {String(id).padStart(3, '0')}</span>
          <PokemonImage
            src={image}
            alt={nom}
            width={180}
            height={180}
            loading={isAboveFold ? 'eager' : 'lazy'}
            fetchPriority={index === 0 ? 'high' : 'auto'}
          />
        </div>
        <div className="card-content">
          <div className="card-title-row">
            <h3 className="pokemon-name">{nom}</h3>
            <span className="card-arrow" aria-hidden="true">↗</span>
          </div>
          <div className="type-badges">
            {element.split(', ').map((type) => (
              <span className="type-badge" data-type={type} key={type}>{type}</span>
            ))}
          </div>
          <span className="card-action">Voir détails <span aria-hidden="true">→</span></span>
        </div>
      </Link>
    </motion.article>
  )
}

export default PokeCard

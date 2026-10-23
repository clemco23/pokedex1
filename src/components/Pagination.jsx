import { motion } from 'motion/react'

function Pagination({ page, onPrev, onNext, disablePrev, disableNext }) {
  return (
    <nav className="pagination" aria-label="Pagination des Pokémon">
      <motion.button className="button button-secondary" onClick={onPrev} disabled={disablePrev} whileTap={disablePrev ? undefined : { scale: 0.97 }}>
        <span aria-hidden="true">←</span> Précédente
      </motion.button>
      <span className="pagination-label" aria-live="polite">Page {page}</span>
      <motion.button className="button button-primary" onClick={onNext} disabled={disableNext} whileTap={disableNext ? undefined : { scale: 0.97 }}>
        Suivante <span aria-hidden="true">→</span>
      </motion.button>
    </nav>
  )
}

export default Pagination

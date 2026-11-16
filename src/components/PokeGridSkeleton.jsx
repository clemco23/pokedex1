const SKELETON_COUNT = 20

function PokeGridSkeleton() {
  return (
    <div role="status" aria-busy="true">
      <span className="visually-hidden">Chargement des pokémons...</span>
      <div className="pokemon-grid" aria-hidden="true">
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <article className="pokemon-card pokemon-card-skeleton" key={index}>
            <div className="pokemon-art skeleton-block" />
            <div className="card-content">
              <span className="skeleton-block skeleton-line skeleton-title" />
              <span className="skeleton-block skeleton-line skeleton-badge" />
              <span className="skeleton-block skeleton-line skeleton-action" />
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default PokeGridSkeleton

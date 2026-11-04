function PokeDetailsSkeleton() {
  return (
    <div role="status" aria-busy="true">
      <span className="visually-hidden">Chargement de la fiche Pokémon...</span>
      <div className="detail-card" aria-hidden="true">
        <div className="detail-art pokemon-art skeleton-block" />
        <div className="detail-content">
          <span className="eyebrow skeleton-block detail-skeleton-label" />
          <span className="detail-name skeleton-block detail-skeleton-name" />
          <div className="type-badges">
            <span className="type-badge skeleton-block detail-skeleton-type" />
            <span className="type-badge skeleton-block detail-skeleton-type" />
          </div>
          <dl className="detail-measures">
            <div>
              <dt>Poids</dt>
              <dd className="skeleton-block detail-skeleton-value" />
            </div>
            <div>
              <dt>Taille</dt>
              <dd className="skeleton-block detail-skeleton-value" />
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}

export default PokeDetailsSkeleton

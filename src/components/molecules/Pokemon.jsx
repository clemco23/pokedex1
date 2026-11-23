function Pokemon({ nom, element }) {
  return (
    <article className="pokemon-card archive-card">
      <h3 className="pokemon-name">{nom}</h3>
      <p className="pokemon-element">{element}</p>
    </article>
  )
}

export default Pokemon

function Pokemon({ nom, element, image }) {
  return (
    <article className="pokemon-card archive-card">
      <div className="pokemon-art">
        <img src={image} alt={nom} width="96" height="96" />
      </div>
      <h3 className="pokemon-name">{nom}</h3>
      <p className="pokemon-element">{element}</p>
    </article>
  )
}

export default Pokemon

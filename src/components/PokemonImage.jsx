import { useState } from 'react'
import { getPokemonImageProps } from '../services/pokemonImages.js'

function PokemonImage({ src, alt, variant = 'card', ...props }) {
  const [failedSource, setFailedSource] = useState(null)
  const imageProps =
    import.meta.env.PROD && failedSource !== src ? getPokemonImageProps(src, variant) : { src }

  return (
    <img
      {...props}
      {...imageProps}
      alt={alt}
      decoding="async"
      onError={imageProps.src !== src ? () => setFailedSource(src) : undefined}
    />
  )
}

export default PokemonImage

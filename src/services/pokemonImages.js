const ARTWORK_URL = /^https:\/\/raw\.githubusercontent\.com\/PokeAPI\/sprites\/master\/sprites\/pokemon\/other\/official-artwork\/\d+\.png$/

export const CARD_IMAGE_SIZES = '(max-width: 340px) 165px, (max-width: 420px) 125px, 165px'
export const DETAIL_IMAGE_SIZES = '(max-width: 340px) 165px, (max-width: 420px) 125px, (max-width: 720px) 250px, 320px'

export function getPokemonImageProps(src, variant = 'card') {
  // Small fallback sprites do not benefit from resizing or recompression.
  if (!ARTWORK_URL.test(src ?? '')) return { src }

  const widths = variant === 'detail' ? [256, 384, 512] : [128, 192, 256, 384, 512]
  const imageUrl = (width) => `/_vercel/image?url=${encodeURIComponent(src)}&w=${width}&q=75`

  return {
    src: imageUrl(variant === 'detail' ? 384 : 192),
    srcSet: widths.map((width) => `${imageUrl(width)} ${width}w`).join(', '),
    sizes: variant === 'detail' ? DETAIL_IMAGE_SIZES : CARD_IMAGE_SIZES,
  }
}

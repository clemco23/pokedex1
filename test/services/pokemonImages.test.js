import { expect, test } from '@jest/globals'
import { getPokemonImageProps } from '../../src/services/pokemonImages.js'

test('la fiche demande une illustration plus grande que celle de la carte', () => {
  const artwork = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'
  const card = new URL(getPokemonImageProps(artwork).src, 'https://example.org')
  const detail = new URL(getPokemonImageProps(artwork, 'detail').src, card.origin)
  expect(detail.pathname).toBe('/_vercel/image')
  expect(detail.searchParams.get('url')).toBe(artwork)
  expect(Number(detail.searchParams.get('w'))).toBeGreaterThan(Number(card.searchParams.get('w')))
})

test('un sprite de secours conserve son URL sans variantes redimensionnées', () => {
  const sprite = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'
  expect(getPokemonImageProps(sprite)).toEqual({ src: sprite })
})

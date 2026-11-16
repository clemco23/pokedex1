import { describe, expect, it, vi } from 'vitest'
import api from '../../src/services/api.js'

describe('Client PokéAPI', () => {
  it('récupère un Pokémon depuis la bonne adresse et retourne ses données', async () => {
    const pokemon = { id: 25, name: 'pikachu' }
    // L'adaptateur simule la réponse HTTP : aucun appel réseau n'est effectué.
    const adapter = vi.fn(async (config) => ({
      data: pokemon,
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    }))

    const response = await api.get('/pokemon/25', { adapter })

    expect(adapter).toHaveBeenCalledOnce()
    expect(api.getUri(adapter.mock.calls[0][0])).toBe(
      'https://pokeapi.co/api/v2/pokemon/25',
    )
    expect(response.data).toEqual(pokemon)
  })
})

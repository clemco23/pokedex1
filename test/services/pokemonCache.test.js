import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals'
const api = { get: jest.fn() }

jest.unstable_mockModule('../../src/services/api.js', () => ({ default: api }))

let cache
const pikachu = { id: 25, name: 'pikachu' }

beforeEach(async () => {
  // Recharge les deux caches pour que chaque test parte d'un état vide.
  jest.resetModules()
  api.get.mockReset()
  jest.useFakeTimers()
  jest.setSystemTime(new Date('2026-01-01T12:00:00Z'))
  cache = await import('../../src/services/pokemonCache.js')
})

afterEach(() => {
  jest.useRealTimers()
})

describe('Cache des Pokémon', () => {
  it('retourne undefined pour un Pokémon absent sans requête HTTP', () => {
    expect(cache.readPokemon(25)).toBeUndefined()
    expect(api.get).not.toHaveBeenCalled()
  })

  it('réutilise les données déjà chargées', async () => {
    api.get.mockResolvedValue({ data: pikachu })

    expect(await cache.getPokemon(25)).toEqual(pikachu)
    expect(cache.readPokemon(25)).toEqual(pikachu)
    expect(await cache.getPokemon(25)).toEqual(pikachu)
    expect(api.get).toHaveBeenCalledTimes(1)
    expect(api.get).toHaveBeenCalledWith('/pokemon/25/')
  })

  it('partage le cache entre un identifiant et une URL, avec ou sans slash final', async () => {
    api.get.mockResolvedValue({ data: pikachu })

    await cache.getPokemon('https://pokeapi.co/api/v2/pokemon/25/')

    expect(await cache.getPokemon(25)).toEqual(pikachu)
    expect(cache.readPokemon('https://pokeapi.co/api/v2/pokemon/25')).toEqual(pikachu)
    expect(api.get).toHaveBeenCalledTimes(1)
  })

  it('normalise les noms en minuscules', async () => {
    api.get.mockResolvedValue({ data: pikachu })

    await cache.getPokemon('PIKACHU')

    expect(cache.readPokemon('pikachu')).toEqual(pikachu)
    expect(api.get).toHaveBeenCalledTimes(1)
    expect(api.get).toHaveBeenCalledWith('/pokemon/pikachu/')
  })

  it('expire exactement après cinq minutes, puis recharge les données', async () => {
    api.get.mockResolvedValue({ data: pikachu })
    await cache.getPokemon(25)

    jest.advanceTimersByTime(5 * 60 * 1000 - 1)
    expect(cache.readPokemon(25)).toEqual(pikachu)

    jest.advanceTimersByTime(1)
    expect(cache.readPokemon(25)).toBeUndefined()
    await cache.getPokemon(25)
    expect(api.get).toHaveBeenCalledTimes(2)
  })

  it('partage une seule requête entre deux appels simultanés', async () => {
    let resolveRequest
    api.get.mockReturnValue(new Promise((resolve) => { resolveRequest = resolve }))

    const first = cache.getPokemon(25)
    const second = cache.getPokemon(25)
    expect(first).toBe(second)
    await Promise.resolve()
    expect(api.get).toHaveBeenCalledTimes(1)

    resolveRequest({ data: pikachu })
    expect(await Promise.all([first, second])).toEqual([pikachu, pikachu])
  })

  it('propage une erreur et permet une nouvelle tentative', async () => {
    api.get.mockRejectedValueOnce(new Error('API indisponible'))
      .mockResolvedValueOnce({ data: pikachu })

    await expect(cache.getPokemon(25)).rejects.toThrow('API indisponible')
    expect(cache.readPokemon(25)).toBeUndefined()
    expect(await cache.getPokemon(25)).toEqual(pikachu)
    expect(api.get).toHaveBeenCalledTimes(2)
  })

  it('évince le Pokémon le moins récemment consulté au-delà de 400 entrées', async () => {
    api.get.mockImplementation(async (url) => ({ data: { id: Number(url.split('/')[2]) } }))
    for (let id = 1; id <= 400; id += 1) await cache.getPokemon(id)

    cache.readPokemon(1)
    await cache.getPokemon(401)

    expect(cache.readPokemon(1)).toEqual({ id: 1 })
    expect(cache.readPokemon(2)).toBeUndefined()
    expect(cache.readPokemon(401)).toEqual({ id: 401 })
  })
})

describe('Cache des pages', () => {
  it('charge les détails dans l’ordre et calcule le décalage de la page 2', async () => {
    const raichu = { id: 26, name: 'raichu' }
    api.get.mockResolvedValueOnce({ data: {
      results: [{ url: '/pokemon/25/' }, { url: '/pokemon/26/' }],
      next: '/pokemon/?offset=40&limit=20',
    } }).mockResolvedValueOnce({ data: pikachu }).mockResolvedValueOnce({ data: raichu })

    expect(cache.readPokemonPage(2)).toBeUndefined()
    const page = await cache.getPokemonPage(2)

    expect(api.get).toHaveBeenNthCalledWith(1, '/pokemon/', {
      params: { limit: 20, offset: 20 },
    })
    expect(page).toEqual({ pokemons: [pikachu, raichu], hasNext: true })
    expect(cache.readPokemonPage(2)).toEqual(page)
    expect(await cache.getPokemonPage(2)).toEqual(page)
    expect(api.get).toHaveBeenCalledTimes(3)
  })

  it('distingue les tailles de page et gère une dernière page vide', async () => {
    api.get.mockResolvedValue({ data: { results: [], next: null } })

    expect(await cache.getPokemonPage(3, 10)).toEqual({ pokemons: [], hasNext: false })
    expect(api.get).toHaveBeenCalledWith('/pokemon/', { params: { limit: 10, offset: 20 } })
    expect(cache.readPokemonPage(3, 10)).toEqual({ pokemons: [], hasNext: false })
    expect(cache.readPokemonPage(3, 20)).toBeUndefined()
    await cache.getPokemonPage(3, 20)
    expect(api.get).toHaveBeenCalledTimes(2)
  })

  it('permet de recharger une page après un échec de chargement des détails', async () => {
    const response = { data: { results: [{ url: '/pokemon/25/' }], next: null } }
    api.get.mockResolvedValueOnce(response).mockRejectedValueOnce(new Error('Erreur détails'))

    await expect(cache.getPokemonPage(1)).rejects.toThrow('Erreur détails')
    expect(cache.readPokemonPage(1)).toBeUndefined()

    api.get.mockResolvedValueOnce(response).mockResolvedValueOnce({ data: pikachu })
    expect(await cache.getPokemonPage(1)).toEqual({ pokemons: [pikachu], hasNext: false })
  })

  it('expire les pages après cinq minutes', async () => {
    api.get.mockResolvedValue({ data: { results: [], next: null } })
    await cache.getPokemonPage(1)

    jest.advanceTimersByTime(5 * 60 * 1000)

    expect(cache.readPokemonPage(1)).toBeUndefined()
    await cache.getPokemonPage(1)
    expect(api.get).toHaveBeenCalledTimes(2)
  })

  it('évince la page la moins récemment consultée au-delà de 20 entrées', async () => {
    api.get.mockResolvedValue({ data: { results: [], next: null } })
    for (let page = 1; page <= 20; page += 1) await cache.getPokemonPage(page)

    cache.readPokemonPage(1)
    await cache.getPokemonPage(21)

    expect(cache.readPokemonPage(1)).toEqual({ pokemons: [], hasNext: false })
    expect(cache.readPokemonPage(2)).toBeUndefined()
    expect(cache.readPokemonPage(21)).toEqual({ pokemons: [], hasNext: false })
  })
})

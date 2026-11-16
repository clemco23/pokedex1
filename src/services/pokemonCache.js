import api from './api.js'

const CACHE_TTL = 5 * 60 * 1000

function createCache(maxEntries) {
  const entries = new Map()
  const pending = new Map()

  function read(key) {
    const entry = entries.get(key)
    if (!entry) return undefined
    if (entry.expiresAt <= Date.now()) {
      entries.delete(key)
      return undefined
    }

    // Refresh insertion order so the least recently used entry is evicted first.
    entries.delete(key)
    entries.set(key, entry)
    return entry.data
  }

  function load(key, fetchData) {
    const cached = read(key)
    if (cached !== undefined) return Promise.resolve(cached)
    if (pending.has(key)) return pending.get(key)

    const request = Promise.resolve()
      .then(fetchData)
      .then((data) => {
        entries.set(key, { data, expiresAt: Date.now() + CACHE_TTL })
        while (entries.size > maxEntries) {
          entries.delete(entries.keys().next().value)
        }
        return data
      })
      .finally(() => pending.delete(key))

    pending.set(key, request)
    return request
  }

  return { read, load }
}

const pokemonCache = createCache(400)
const pageCache = createCache(20)

function pokemonKey(idOrUrl) {
  return String(idOrUrl).replace(/\/$/, '').split('/').pop().toLowerCase()
}

export function readPokemon(idOrUrl) {
  return pokemonCache.read(pokemonKey(idOrUrl))
}

export function getPokemon(idOrUrl) {
  const key = pokemonKey(idOrUrl)
  return pokemonCache.load(key, async () => {
    const response = await api.get(`/pokemon/${encodeURIComponent(key)}/`)
    return response.data
  })
}

export function readPokemonPage(page, limit = 20) {
  return pageCache.read(`${page}:${limit}`)
}

export function getPokemonPage(page, limit = 20) {
  return pageCache.load(`${page}:${limit}`, async () => {
    const response = await api.get('/pokemon/', {
      params: { limit, offset: (page - 1) * limit },
    })
    const pokemons = await Promise.all(response.data.results.map(({ url }) => getPokemon(url)))
    return { pokemons, hasNext: response.data.next !== null }
  })
}

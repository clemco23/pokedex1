import assert from 'node:assert/strict'
import test from 'node:test'
import api from '../src/services/api.js'
import {
  getPokemon,
  getPokemonPage,
  readPokemon,
  readPokemonPage,
} from '../src/services/pokemonCache.js'

test('collection and details share cached data and returning to a page makes no request', async (t) => {
  const calls = []
  t.mock.method(api, 'get', async (url, options) => {
    calls.push({ url, options })
    if (url === '/pokemon/') {
      return {
        data: {
          next: 'next-page',
          results: [910001, 910002].map((id) => ({
            url: `https://pokeapi.co/api/v2/pokemon/${id}/`,
          })),
        },
      }
    }
    return { data: { id: Number(url.split('/')[2]) } }
  })

  const page = await getPokemonPage(1, 2)
  assert.equal(calls.length, 3)
  assert.deepEqual(calls[0].options.params, { limit: 2, offset: 0 })
  assert.equal(page.hasNext, true)
  assert.equal(await getPokemon('910001'), page.pokemons[0])
  assert.equal(readPokemon(910001), page.pokemons[0])
  assert.equal(await getPokemonPage(1, 2), page)
  assert.equal(readPokemonPage(1, 2), page)
  assert.equal(calls.length, 3)
})

test('simultaneous requests for an ID and an API URL share one network call', async (t) => {
  let release
  const response = new Promise((resolve) => {
    release = resolve
  })
  const get = t.mock.method(api, 'get', () => response)
  const first = getPokemon(920001)
  const second = getPokemon('https://pokeapi.co/api/v2/pokemon/920001/')
  assert.equal(first, second)
  await Promise.resolve()
  assert.equal(get.mock.callCount(), 1)
  release({ data: { id: 920001 } })
  assert.equal(await first, await second)
})

test('failed requests are not cached and can be retried', async (t) => {
  const get = t.mock.method(api, 'get', async () => {
    throw new Error('offline')
  })
  await assert.rejects(getPokemon(930001), /offline/)
  assert.equal(readPokemon(930001), undefined)
  get.mock.mockImplementation(async () => ({ data: { id: 930001 } }))
  assert.deepEqual(await getPokemon(930001), { id: 930001 })
  assert.equal(get.mock.callCount(), 2)
})

test('data expires after five minutes and is fetched again', async (t) => {
  let now = Date.now()
  t.mock.method(Date, 'now', () => now)
  const get = t.mock.method(api, 'get', async () => ({ data: { id: 940001 } }))
  await getPokemon(940001)
  now += 5 * 60 * 1000 - 1
  await getPokemon(940001)
  assert.equal(get.mock.callCount(), 1)
  now += 1
  assert.equal(readPokemon(940001), undefined)
  await getPokemon(940001)
  assert.equal(get.mock.callCount(), 2)
})

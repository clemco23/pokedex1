import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getPokemonPage, readPokemonPage } from '../services/pokemonCache.js'

const DEFAULT_LIMIT = 20

function usePokemonPage(limit = DEFAULT_LIMIT) {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedPage = searchParams.get('page')
  const pageNumber = /^\d+$/.test(requestedPage ?? '') ? Number(requestedPage) : 1
  const page = Number.isSafeInteger(pageNumber) && pageNumber > 0 ? pageNumber : 1
  const requestKey = `${page}:${limit}`
  const [pokemons, setPokemons] = useState([])
  const [hasNext, setHasNext] = useState(false)
  const [loadedRequest, setLoadedRequest] = useState(null)
  const cachedPage = readPokemonPage(page, limit)
  const isLoading = !cachedPage && loadedRequest !== requestKey
  const [erreur, setErreur] = useState('')

  useEffect(() => {
    let active = true

    async function chargerPokemons() {
      try {
        const data = await getPokemonPage(page, limit)
        if (!active) return
        setPokemons(data.pokemons)
        setHasNext(data.hasNext)
        setErreur('')
      } catch {
        if (active) {
          setErreur('Impossible de récupérer les pokémons.')
        }
      } finally {
        if (active) {
          setLoadedRequest(requestKey)
        }
      }
    }

    chargerPokemons()

    // Shared requests keep filling the cache; obsolete views ignore their results.
    return () => {
      active = false
    }
  }, [limit, page, requestKey])

  function changerPage(nouvellePage) {
    if (!Number.isSafeInteger(nouvellePage) || nouvellePage < 1 || nouvellePage === page) {
      return
    }

    setErreur('')
    setSearchParams((previousParams) => {
      const nextParams = new URLSearchParams(previousParams)
      if (nouvellePage === 1) {
        nextParams.delete('page')
      } else {
        nextParams.set('page', String(nouvellePage))
      }
      return nextParams
    })
  }

  return {
    pokemons: cachedPage?.pokemons ?? pokemons,
    page,
    hasNext: cachedPage?.hasNext ?? hasNext,
    isLoading,
    erreur: cachedPage ? '' : erreur,
    changerPage,
  }
}

export default usePokemonPage

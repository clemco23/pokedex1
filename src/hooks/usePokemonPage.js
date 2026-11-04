import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../services/api.js'

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
  const isLoading = loadedRequest !== requestKey
  const [erreur, setErreur] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function chargerPokemons() {
      try {
        const response = await api.get('/pokemon/', {
          params: { limit, offset: (page - 1) * limit },
          signal: controller.signal,
        })

        const details = await Promise.all(
          response.data.results.map((pokemon) =>
            api.get(pokemon.url, { signal: controller.signal })
              .then((detailResponse) => detailResponse.data)
          )
        )

        setPokemons(details)
        setHasNext(response.data.next !== null)
        setErreur('')
      } catch {
        if (!controller.signal.aborted) {
          setErreur('Impossible de récupérer les pokémons.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadedRequest(requestKey)
        }
      }
    }

    chargerPokemons()

    return () => controller.abort()
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
    pokemons,
    page,
    hasNext,
    isLoading,
    erreur,
    changerPage,
  }
}

export default usePokemonPage

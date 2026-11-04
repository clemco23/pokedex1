import { useEffect, useState } from 'react'
import api from '../services/api.js'

const DEFAULT_LIMIT = 20

function usePokemonPage(limit = DEFAULT_LIMIT) {
  const [pokemons, setPokemons] = useState([])
  const [page, setPage] = useState(1)
  const [hasNext, setHasNext] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
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
      } catch {
        if (!controller.signal.aborted) {
          setErreur('Impossible de récupérer les pokémons.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    chargerPokemons()

    return () => controller.abort()
  }, [limit, page])

  function changerPage(nouvellePage) {
    if (nouvellePage < 1 || nouvellePage === page) {
      return
    }

    setIsLoading(true)
    setErreur('')
    setPage(nouvellePage)
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

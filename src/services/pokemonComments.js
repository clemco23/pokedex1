const keyFor = (pokemonId) => `pokedex:comments:${pokemonId}`

export function readComments(pokemonId, storage = localStorage) {
  const raw = storage.getItem(keyFor(pokemonId))
  if (!raw) return []
  const comments = JSON.parse(raw)
  if (!Array.isArray(comments) || !comments.every((comment) =>
    comment && typeof comment.id === 'string' &&
    typeof comment.author === 'string' && typeof comment.message === 'string'
  )) {
    throw new Error('Commentaires enregistrés illisibles.')
  }
  return comments
}

export function addComment(pokemonId, author, message, storage = localStorage) {
  const cleanAuthor = author.trim()
  const cleanMessage = message.trim()
  if (!cleanAuthor || cleanAuthor.length > 40 || !cleanMessage || cleanMessage.length > 1000) {
    throw new Error('Renseigne un pseudo et un commentaire valides.')
  }
  // Relire avant chaque ajout conserve les commentaires ajoutés dans un autre onglet.
  const comments = [
    { id: crypto.randomUUID(), author: cleanAuthor, message: cleanMessage },
    ...readComments(pokemonId, storage),
  ]
  storage.setItem(keyFor(pokemonId), JSON.stringify(comments))
  return comments
}

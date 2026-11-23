import { useState } from 'react'
import { addComment, readComments } from '../../services/pokemonComments.js'

function PokemonComments({ pokemonId }) {
  const [initial] = useState(() => {
    try {
      return { comments: readComments(pokemonId), error: '' }
    } catch {
      return { comments: [], error: 'Impossible de lire les commentaires enregistrés dans ce navigateur.' }
    }
  })
  const [comments, setComments] = useState(initial.comments)
  const [author, setAuthor] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState(initial.error)
  const [success, setSuccess] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const authorError = submitted && !author.trim()
  const messageError = submitted && !message.trim()

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
    setSuccess('')
    setError('')
    if (!author.trim() || !message.trim()) return

    try {
      setComments(addComment(pokemonId, author, message))
      setMessage('')
      setSubmitted(false)
      setSuccess('Commentaire ajouté et enregistré dans ce navigateur.')
    } catch {
      setError('Impossible d’enregistrer le commentaire. Vérifie que le stockage du navigateur est disponible. Ton texte est conservé dans le formulaire.')
    }
  }

  return (
    <section className="comments-section" aria-labelledby="comments-title">
      <h2 id="comments-title">Mes commentaires</h2>
      <p id="comments-help" className="comments-help">
        Note tes impressions sur ce Pokémon. Tes commentaires restent dans ce navigateur et ne sont pas partagés avec les autres visiteurs.
      </p>
      <form className="comment-form" onSubmit={handleSubmit} aria-describedby="comments-help">
        <div className="comment-field">
          <label htmlFor="comment-author">Pseudo (obligatoire)</label>
          <input
            id="comment-author" name="author" autoComplete="nickname" required maxLength={40}
            value={author} onChange={(event) => { setAuthor(event.target.value); setSuccess('') }}
            aria-invalid={authorError || undefined}
            aria-describedby={authorError ? 'author-error' : undefined}
          />
          {authorError && <p id="author-error" className="comment-error" role="alert">Saisis un pseudo, pas seulement des espaces.</p>}
        </div>
        <div className="comment-field">
          <label htmlFor="comment-message">Commentaire (obligatoire)</label>
          <textarea
            id="comment-message" name="message" required maxLength={1000} rows={4}
            value={message} onChange={(event) => { setMessage(event.target.value); setSuccess('') }}
            aria-invalid={messageError || undefined}
            aria-describedby={messageError ? 'message-count message-error' : 'message-count'}
          />
          <p id="message-count" className="comments-help">{message.length} / 1 000 caractères</p>
          {messageError && <p id="message-error" className="comment-error" role="alert">Saisis un commentaire, pas seulement des espaces.</p>}
        </div>
        <button className="button button-primary" type="submit">Ajouter le commentaire</button>
        {error && <p className="comment-error" role="alert">{error}</p>}
        <p role="status">{success}</p>
      </form>
      {comments.length === 0 ? (
        <p className="comments-help">Aucun commentaire enregistré pour ce Pokémon.</p>
      ) : (
        <ul className="comment-list" aria-label="Commentaires enregistrés">
          {comments.map((comment) => (
            <li key={comment.id}>
              <h3>{comment.author}</h3>
              <p>{comment.message}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default PokemonComments

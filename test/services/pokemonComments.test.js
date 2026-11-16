import { describe, expect, it, vi } from 'vitest'
import { addComment, readComments } from '../../src/services/pokemonComments.js'

function createStorage() {
  const entries = new Map()
  return {
    getItem: (key) => entries.get(key) ?? null,
    setItem: (key, value) => entries.set(key, value),
  }
}

describe('Commentaires par Pokémon', () => {
  it('enregistre les commentaires et les retrouve sans mélanger les fiches', () => {
    const storage = createStorage()
    addComment(25, ' Sacha ', ' Très rapide ! ', storage)
    addComment(25, 'Ondine', 'Mon préféré.', storage)
    expect(readComments(25, storage).map(({ author, message }) => ({ author, message }))).toEqual([
      { author: 'Ondine', message: 'Mon préféré.' },
      { author: 'Sacha', message: 'Très rapide !' },
    ])
    expect(readComments(1, storage)).toEqual([])
  })

  it('refuse les champs blancs et les textes trop longs sans enregistrer', () => {
    const storage = createStorage()
    for (const [author, message] of [[' ', 'test'], ['Sacha', ' '], ['a'.repeat(41), 'test'], ['Sacha', 'a'.repeat(1001)]]) {
      expect(() => addComment(25, author, message, storage)).toThrow()
    }
    expect(readComments(25, storage)).toEqual([])
  })

  it('ne remplace pas des données illisibles', () => {
    const storage = { getItem: () => '{invalid', setItem: vi.fn() }
    expect(() => addComment(25, 'Sacha', 'Test', storage)).toThrow()
    expect(storage.setItem).not.toHaveBeenCalled()
  })

  it('signale un échec de stockage pour éviter un faux succès', () => {
    const storage = { getItem: () => null, setItem: () => { throw new Error('Quota') } }
    expect(() => addComment(25, 'Sacha', 'Test', storage)).toThrow('Quota')
  })
})

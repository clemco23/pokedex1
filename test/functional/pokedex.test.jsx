/**
 * @jest-environment jsdom
 */
import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'
import { TextEncoder, TextDecoder } from 'node:util'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// React Router utilise les encodeurs Web fournis par Node.
Object.assign(globalThis, { TextEncoder, TextDecoder })
const { BrowserRouter } = await import('react-router-dom')
const { default: api } = await import('../../src/services/api.js')
const { default: App } = await import('../../src/App.jsx')

const pikachu = {
  id: 25, name: 'pikachu', weight: 60, height: 4,
  types: [{ type: { name: 'electric' } }],
  sprites: { other: { 'official-artwork': { front_default: '/pikachu.png' } } },
}

beforeEach(() => {
  localStorage.clear()
  jest.spyOn(api, 'get').mockImplementation(async (url, options) => {
    if (url === '/pokemon/' && options.params.offset === 20) {
      return { data: { results: [{ url: '/pokemon/25/' }], next: null } }
    }
    if (url === '/pokemon/25/') return { data: pikachu }
    throw new Error('Requête inattendue : ' + url)
  })
})

afterEach(cleanup)

function openApp(path) {
  window.history.replaceState(null, '', path)
  return render(<BrowserRouter><App /></BrowserRouter>)
}

test('ouvrir une fiche depuis la page 2 puis revenir à la même page', async () => {
  const user = userEvent.setup()
  openApp('/?page=2')
  const card = { name: /voir les détails de pikachu/i }
  await user.click(await screen.findByRole('link', card))
  await screen.findByRole('heading', { name: 'pikachu', level: 2 })
  expect(window.location.pathname).toBe('/poke/25')
  await user.click(screen.getByRole('link', { name: /retour à la collection/i }))
  await screen.findByRole('link', card)
  expect(window.location.pathname + window.location.search).toBe('/?page=2')
})

test('ajouter un commentaire et le retrouver à la réouverture de la fiche', async () => {
  const user = userEvent.setup()
  const view = openApp('/poke/25')
  await user.type(await screen.findByRole('textbox', { name: /pseudo/i }), 'Sacha')
  await user.type(screen.getByRole('textbox', { name: /commentaire/i }), 'Très rapide !')
  await user.click(screen.getByRole('button', { name: /ajouter le commentaire/i }))
  const list = { name: /commentaires enregistrés/i }
  expect(within(screen.getByRole('list', list)).getByText('Très rapide !')).toBeTruthy()
  view.unmount()
  openApp('/poke/25')
  const entry = within(await screen.findByRole('list', list)).getByRole('listitem')
  expect(within(entry).getByRole('heading', { name: 'Sacha' })).toBeTruthy()
  expect(within(entry).getByText('Très rapide !')).toBeTruthy()
})

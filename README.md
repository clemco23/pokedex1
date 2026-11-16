# Pokédex

Application React avec Vite, React Router et PokéAPI.

- [Dépôt GitHub](https://github.com/clemco23/pokedex1)
- [Application en ligne](https://pokedex-navy-chi-13.vercel.app)

## Fonctionnalités et routes

| URL | Page et comportement |
| --- | --- |
| `/` | Collection paginée, 20 Pokémon par page, avec nom, image et types. |
| `/?page=2` | Accès direct à une page de la collection ; la page est conservée dans l'historique du navigateur. |
| `/poke/:id` | Fiche avec nom, image, types, poids, taille et formulaire de commentaire. |
| `/poke/25?page=2` | Exemple de fiche conservant la page d'origine pour le lien de retour. |
| `/anciens-tp` | Exemples des TP 1 et 2 : liste locale et liste chargée avec `fetch`. |

Les pages principales utilisent le client Axios de `src/services/api.js`, dont
l'adresse de base est `https://pokeapi.co/api/v2`. Le service de cache charge la
liste avec `GET /pokemon/`, puis les détails avec `GET /pokemon/:id/`.
Les états de chargement, d'erreur et de liste vide ont des affichages dédiés.

## Stratégie de rendu : CSR

L'application utilise le **Client-Side Rendering**, ou rendu côté client.
Vercel sert le HTML, le JavaScript et le CSS produits par Vite. Dans le navigateur,
`src/main.jsx` monte React avec `createRoot`, puis les composants récupèrent les
données de PokéAPI et affichent les Pokémon. Le HTML initial contient un indicateur
de chargement, pas les fiches Pokémon préconstruites.

React Router gère les changements de page dans l'application. La réécriture de
`vercel.json` vers `index.html` permet aussi d'ouvrir directement une URL de fiche.
Il n'y a pas de rendu serveur (SSR) ni de génération statique des fiches (SSG).
La consultation nécessite JavaScript ; les données non mises en cache nécessitent
un accès à PokéAPI.

## Organisation du code

```text
src/
  main.jsx                  # Montage React et BrowserRouter
  App.jsx                   # Navigation globale, routes et Suspense
  pages/                    # Accueil, fiche Pokémon et anciens TP
  components/               # Cartes, pagination, images, commentaires et squelettes
  hooks/usePokemonPage.js   # Chargement et état de la pagination
  services/
    api.js                  # Client HTTP Axios
    pokemonCache.js         # Cache partagé de Pokémon et de pages
    pokemonImages.js        # Construction des URLs d'images optimisées
    pokemonComments.js      # Validation et stockage des commentaires
  index.css                 # Styles globaux et variables de couleur
  App.css                   # Styles des composants et adaptation aux écrans
test/services/              # Tests unitaires Jest
tests/pokemonCache.test.js   # Tests supplémentaires du cache avec Jest
jest.config.js              # Configuration des tests et de la couverture
.github/workflows/ci.yml     # Vérifications GitHub Actions
vercel.json                 # Compilation, images et réécriture des routes
```

Cette organisation sépare les responsabilités techniques. Les pages assemblent les
composants, le hook gère la pagination et les services isolent l'accès aux données.
Les composants partagés, comme `PokemonImage` et `Pagination`, regroupent les
éléments réutilisables de l'interface.

## Optimisation des performances

- **Cache des données** : `pokemonCache.js` conserve les résultats en mémoire
  pendant cinq minutes. La liste et les fiches partagent les données déjà chargées.
  Le cache est limité à 400 Pokémon et 20 pages ; les entrées les moins récemment
  consultées sont retirées lorsque la limite est dépassée. Il est perdu à l'actualisation.
- **Partage des requêtes simultanées** : plusieurs demandes pour la même clé
  réutilisent la même promesse en cours, ce qui évite des appels HTTP identiques.
  Les erreurs ne sont pas mises en cache, permettant une nouvelle tentative.
- **Chargement parallèle** : les détails d'une page sont récupérés avec `Promise.all`.
- **Chargement différé du code** : `App.jsx` utilise `lazy` et `Suspense` pour
  charger les pages Détail et Anciens TP lorsqu'elles sont nécessaires.
- **Images** : les premières cartes chargent leurs images immédiatement, les
  suivantes utilisent `loading="lazy"`. `PokemonImage.jsx` utilise en production
  les URLs `/_vercel/image`, `srcSet` et `sizes` pour les illustrations compatibles.
  `vercel.json` configure les tailles, la qualité et le format WebP. Si l'URL
  optimisée échoue, le composant revient à l'image originale ; en développement,
  il utilise directement cette image originale.
- **Chargement visible** : les composants `PokeGridSkeleton` et `PokeDetailsSkeleton`
  affichent des squelettes pendant l'attente. Cela améliore le retour visuel sans
  accélérer l'API elle-même.

## KISS et qualité du code

Le principe **KISS (Keep It Simple)** est appliqué en donnant des responsabilités
limitées aux fichiers. `Home.jsx` décrit l'affichage et délègue la pagination au hook
`usePokemonPage`. Le client HTTP, le cache et le stockage des commentaires sont
isolés dans des services, ce qui permet de tester leur logique indépendamment du DOM.
Les cartes, images et boutons de pagination sont regroupés dans des composants dédiés.

`eslint.config.js` active les règles JavaScript, React Hooks et React Refresh.
`npm ci` utilise le verrou de dépendances `package-lock.json`, et la CI vérifie le
lint et la compilation.

## Gestion d'état

| Type d'état | Implémentation | Durée de conservation |
| --- | --- | --- |
| Champs, erreurs et messages du formulaire | `useState` dans `PokemonComments.jsx` | Pendant la vie du composant. |
| Page de la collection | `useSearchParams` dans `usePokemonPage.js` | Dans l'URL, y compris après actualisation et navigation précédent/suivant. |
| Données et état de chargement | Hook `usePokemonPage` et état local de `PokeDetails` | Pendant la vie des composants, avec réutilisation du cache. |
| Réponses PokéAPI | Cache partagé en mémoire dans `pokemonCache.js` | Cinq minutes maximum par entrée, jusqu'à éviction ou actualisation. |
| Commentaires | `localStorage`, une clé par Pokémon | Entre les visites dans le même navigateur, jusqu'à effacement des données. |

Les effets de chargement ignorent les réponses devenues obsolètes après un changement
de page ou un démontage du composant. Le hook personnalisé rassemble la logique de
pagination et expose les données nécessaires à la page.

## Accessibilité et affichage

Les styles adaptent la grille et les fiches aux petits écrans. Les préférences système
pour le thème sombre, le contraste renforcé et la réduction des animations sont prises
en compte. Motion anime les cartes et transitions avec prise en compte du mouvement réduit.

Le site propose un lien « Aller au contenu », des styles de focus visibles, des textes
alternatifs pour les images et des libellés associés aux champs. Les chargements et
messages de succès utilisent `role="status"`, les erreurs `role="alert"`, et les champs
invalides du formulaire sont signalés avec `aria-invalid`.

## Formulaire de commentaire

Chaque fiche Pokémon propose un formulaire avec pseudo (40 caractères maximum)
et commentaire (1 000 caractères maximum). Les champs sont obligatoires et les
saisies constituées uniquement d'espaces sont refusées.

`PokemonComments.jsx` utilise `useState` pour les champs, la liste et les messages
de validation. `pokemonComments.js` enregistre les commentaires dans `localStorage`,
avec une clé par identifiant de Pokémon. Ils restent disponibles après actualisation
dans le même navigateur. Une erreur de stockage conserve le texte saisi et affiche
un message sans annoncer de faux succès.

Les commentaires sont personnels à ce navigateur, sans compte ni synchronisation.
Effacer les données du site les supprime. Leur enregistrement est local et
ne déclenche aucune requête HTTP.

## Application en ligne

Production : https://pokedex-navy-chi-13.vercel.app

Le projet Vercel `pokedex` est connecté au dépôt `clemco23/pokedex1`.
Le premier déploiement a été réalisé depuis le dossier local le 23 octobre 2026.
La configuration GitHub Actions est publiée dans le dépôt.

## Développement

Prérequis : Node.js 22.14 ou version compatible plus récente, npm.

```sh
npm ci
npm run dev
```

## Vérifications

Avant un commit, lancer les contrôles suivants depuis la racine du projet :

```sh
npm run lint
npm test
npm run build
```

Pour vérifier ensuite le résultat compilé dans le navigateur :

```sh
npm run preview
```

La compilation de production est générée dans `dist/`.

## Tests

Les tests utilisent **Jest**, configuré dans `jest.config.js`. Les dossiers `test/`
et `tests/` sont exécutés par la même commande. L'environnement Node est adapté aux
services et à la logique JavaScript ; les tests de composants nécessitant un DOM
demanderont un environnement tel que jsdom.

Le projet utilise les modules ES (`import` / `export`). Les scripts lancent donc
Jest avec l'option Node `--experimental-vm-modules`, conformément à la
[documentation Jest](https://jestjs.io/docs/ecmascript-modules). Node peut afficher
un avertissement sur cette fonctionnalité expérimentale. `babel-jest` et le preset
React transforment le JSX pour l'analyse de couverture et les futurs tests de composants.
Les fonctions de test et les mocks sont importés depuis `@jest/globals`.

```sh
npm test
npm run test:watch
```

`npm test` exécute les tests une fois ; `npm run test:watch` les relance à chaque
modification. Le premier test, `test/services/api.test.js`, vérifie l'adresse utilisée
par le client PokéAPI et les données retournées, avec une réponse HTTP simulée.

Les fichiers Jest présents couvrent :

| Fichier | Cas vérifiés |
| --- | --- |
| `test/services/api.test.js` | Adresse de l'appel Axios et données retournées. |
| `test/services/pokemonCache.test.js` | Réutilisation, normalisation des clés, expiration, requêtes simultanées, erreurs, pagination et éviction des caches. |
| `test/services/pokemonComments.test.js` | Persistance et isolation par Pokémon, validation des champs, données illisibles et échec du stockage. |
| `tests/pokemonCache.test.js` | Partage liste/détail, requêtes simultanées, nouvelle tentative après erreur et expiration du cache. |

Ces tests simulent les réponses HTTP ou le stockage ; ils ne dépendent pas du réseau.
Pour lancer uniquement la suite supplémentaire du cache :

```sh
npm test -- --runTestsByPath tests/pokemonCache.test.js
```

### Couverture des tests

```sh
npm run coverage
```

La couverture de tous les fichiers JavaScript et JSX de `src/` est affichée dans
le terminal. Ouvrir `coverage/index.html` dans un navigateur pour consulter le
rapport détaillé par fichier et les lignes non couvertes. Le dossier `coverage/`
est généré automatiquement et ignoré par Git.

## Pipeline CI/CD

- **CI — GitHub Actions** : `.github/workflows/ci.yml` installe les dépendances avec `npm ci`, exécute ESLint puis compile l’application. Déclenchement sur les push vers `main`, les pull requests et manuellement depuis l’onglet Actions.
- **CD — intégration Git de Vercel** : une fois le dépôt connecté, chaque push vers `main` déclenche une mise en production et les autres branches génèrent des prévisualisations.
- Vercel exécute également `npm run lint && npm run build` : un échec empêche la publication du nouveau déploiement. Les vérifications GitHub Actions et Vercel s’exécutent indépendamment.
- Aucun token Vercel n’est nécessaire dans GitHub Actions avec cette intégration.

Les tests unitaires et la couverture se lancent localement avec les commandes de
la section Tests. Le workflow automatise le lint et la compilation ; GitHub Actions
et Vercel exécutent chacun leurs propres vérifications.

## Mise en ligne sur Vercel

1. Publier les modifications sur GitHub avec `git push` depuis la branche `main`.
2. Pour recréer le projet, dans [Vercel](https://vercel.com/new), importer le dépôt `clemco23/pokedex1`.
3. Sélectionner **Vite**, la racine du projet (`./`) et Node.js **22.x**. `vercel.json` définit l’installation (`npm ci`), la compilation et le dossier de sortie (`dist`).
4. Lancer **Deploy**, puis vérifier dans les paramètres Git que la branche de production est `main`.
5. Ouvrir l’URL attribuée et vérifier `/`, `/poke/1` et `/anciens-tp`, y compris après actualisation. La réécriture vers `index.html` permet à React Router de gérer ces URLs.

L’application utilise directement l’API publique PokéAPI et ne nécessite aucune variable d’environnement.

Pour imposer les contrôles avant fusion, configurer une règle de protection de `main` sur GitHub avec le contrôle requis **Lint et build** et les pull requests obligatoires.

Documentation : [Vite sur Vercel](https://vercel.com/docs/frameworks/frontend/vite), [intégration GitHub](https://vercel.com/docs/git/vercel-for-github).

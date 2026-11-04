# Pokédex

Application React avec Vite, React Router et PokéAPI.

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

```sh
npm run lint
npm run build
npm run preview
```

La compilation de production est générée dans `dist/`.

## Cache des données Pokémon

La collection et les fiches partagent un cache en mémoire valable cinq minutes,
limité à 20 pages et 400 fiches. Ouvrir une fiche depuis une collection déjà chargée
ou revenir sur une page en cache ne relance pas ses appels à PokéAPI.
Les requêtes simultanées identiques sont regroupées et les erreurs ne sont pas
conservées. Une navigation ne coupe pas une requête partagée, mais ses résultats
ne mettent plus à jour la vue quittée. Le cache disparaît lors d’une actualisation
ou de la fermeture de l’onglet. Les anciens exercices de la route `/anciens-tp`
gardent leur fonctionnement indépendant.

Pour vérifier : dans Réseau → Fetch/XHR, charger la collection, ouvrir une fiche,
puis revenir à la collection. Aucun nouvel appel PokéAPI n’est attendu pour ces
données pendant cinq minutes. Une actualisation permet de tester un cache vide.

## Images Pokémon

Les illustrations officielles des cartes et des fiches utilisent l’API native
d’optimisation d’images de Vercel en production : variantes de 128 à 512 pixels,
format WebP selon le navigateur, qualité 75 et cache d’au moins 24 heures.
Les attributs `srcSet` et `sizes` permettent au navigateur de choisir la taille
selon l’affichage et la densité de l’écran. Seules les illustrations officielles
du dépôt PokéAPI sont autorisées ; les petits sprites restent inchangés.

Avec `npm run dev`, les images d’origine sont utilisées. Avec `npm run preview`
ou si l’optimiseur échoue, le composant revient automatiquement à l’image d’origine.
La conversion et le gain de poids devront être vérifiés après déploiement sur
Vercel, dans l’onglet Réseau du navigateur. Les transformations utilisent les
quotas Image Optimization du projet Vercel.

## Pipeline CI/CD

- **CI — GitHub Actions** : `.github/workflows/ci.yml` installe les dépendances avec `npm ci`, exécute ESLint puis compile l’application. Déclenchement sur les push vers `main`, les pull requests et manuellement depuis l’onglet Actions.
- **CD — intégration Git de Vercel** : une fois le dépôt connecté, chaque push vers `main` déclenche une mise en production et les autres branches génèrent des prévisualisations.
- Vercel exécute également `npm run lint && npm run build` : un échec empêche la publication du nouveau déploiement. Les vérifications GitHub Actions et Vercel s’exécutent indépendamment.
- Aucun token Vercel n’est nécessaire dans GitHub Actions avec cette intégration.

## Mise en ligne sur Vercel

1. Publier les modifications sur GitHub avec `git push` depuis la branche `main`.
2. Pour recréer le projet, dans [Vercel](https://vercel.com/new), importer le dépôt `clemco23/pokedex1`.
3. Sélectionner **Vite**, la racine du projet (`./`) et Node.js **22.x**. `vercel.json` définit l’installation (`npm ci`), la compilation et le dossier de sortie (`dist`).
4. Lancer **Deploy**, puis vérifier dans les paramètres Git que la branche de production est `main`.
5. Ouvrir l’URL attribuée et vérifier `/`, `/poke/1` et `/anciens-tp`, y compris après actualisation. La réécriture vers `index.html` permet à React Router de gérer ces URLs.

L’application utilise directement l’API publique PokéAPI et ne nécessite aucune variable d’environnement.

Pour imposer les contrôles avant fusion, configurer une règle de protection de `main` sur GitHub avec le contrôle requis **Lint et build** et les pull requests obligatoires.

Documentation : [Vite sur Vercel](https://vercel.com/docs/frameworks/frontend/vite), [intégration GitHub](https://vercel.com/docs/git/vercel-for-github).

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

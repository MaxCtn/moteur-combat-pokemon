# Rendu 2 — API Pokémon & tests d'intégration (Supertest)

**Auteur : Maxime CONTINO**

Ce rendu ajoute une petite API Express au-dessus du moteur de combat et teste ses
routes avec Supertest. On garde les tests unitaires Jest existants et on ajoute un
niveau au-dessus : les tests d'intégration, qui vérifient le code de statut HTTP et
le corps de chaque réponse.

## Lancer les tests

```bash
npm install     # installe Jest, Supertest, Express
npm test        # lance tous les tests (unitaires + intégration API)
npm run dev     # lance l'API en local sur le port 3000
```

## L'API (`src/app.js`)

Un store Pokémon en mémoire (remis à zéro entre chaque test via `resetPokedex`).

| Méthode | Route | Réponse |
|---|---|---|
| GET  | `/pokemons`      | `200` + tableau des Pokémon |
| GET  | `/pokemons/:id`  | `200` + le Pokémon, ou `404` `{ erreur: "Pokemon introuvable" }` |
| POST | `/pokemons`      | `201` si `{ id, nom, type }` valide, sinon `400` |
| POST | `/combat/degats` | `200` + `{ degats }` si `{ type, cible, base }` valide, sinon `400` |

`/combat/degats` réutilise `multiplicateurDeType` + `calculerDegats` de `src/combat.js`.
Exemple : `{ type: "feu", cible: "plante", base: 20 }` → `{ degats: 40 }` (feu bat plante ×2).

`src/app.js` exporte `{ app, resetPokedex }` sans `listen`. Le `listen` est isolé dans
`src/server.js`, ce qui permet à Supertest d'importer l'app sans démarrer de serveur.

Les tests d'intégration sont dans `tests/api.test.js`.

---

# Moteur de combat Pokémon — Tests unitaires Jest

Petit moteur de combat type Pokémon (Node.js, CommonJS) testé avec Jest. Le code et
les tests reprennent nos user stories (US-01 à US-10), organisés à la manière de la
démo du cours : un thème Jest par fichier de test. Que des tests unitaires.

## Démarrage

```bash
npm install          # installe Jest
npm test             # lance les tests
npm run test:watch   # relance à chaque modification (mode dev)
npm run test:cov     # avec le rapport de couverture
```

## La démarche : test d'abord, code après (TDD)

On écrit le test avant le code.

1. **RED** — on écrit le test, on le lance : il échoue (le code n'existe pas encore).
2. **GREEN** — on écrit le minimum de code pour le faire passer.
3. **REFACTOR** — on nettoie, les tests garantissent qu'on ne casse rien.

Pour le montrer en live : commente le contenu d'une fonction de `src/`, lance
`npm test` (rouge), puis réécris le code (vert).

## Les notions Jest de la démo

| Fichier de test | Notion Jest | Code testé | User stories |
|---|---|---|---|
| `tests/matchers.test.js` | `toBe`, `toEqual`, `toContain`, `not` | `src/combat.js`, `src/pokemon.js` | US-01, US-02, US-03, US-05, US-06 |
| `tests/exceptions.test.js` | `toThrow` (règle `expect(() => ...)`) | `src/combat.js` | robustesse (attaque invalide) |
| `tests/hooks.test.js` | `beforeEach`, `afterEach` (indépendance) | `src/pokemon.js` | US-04, US-08, US-09, US-10 |
| `tests/mocks.test.js` | `jest.fn()` (contrôler le hasard) | `src/attaque.js` | US-07 |
| `tests/sac.test.js` | test d'une classe à état + `toThrow` | `src/sac.js` | sac de dresseur |

`sac.js` est notre classe « à état » : un **sac de dresseur** où l'on range des objets
empilables (Hyper Potion, Rappel, Pokeball...) avec une **capacité limitée**. Il sert à
montrer les hooks, le test d'une classe et plusieurs renvois d'erreur (`Quantite
invalide`, `Sac plein`, `Objet absent du sac`).

## Les règles du moteur

Calcul des dégâts :

```
dégâts = arrondi_inférieur( base x multType x multSTAB x multCritique )
```

- STAB (même type que l'attaquant) : x1.5 — sinon x1
- Critique : x1.5 — sinon x1
- Type : faiblesse x2, résistance x0.5, immunité x0, neutre x1
- Double type : produit des deux multiplicateurs (x2 * x2 = x4)
- Pas d'immunité : minimum 1 dégât. Immunité (x0) : exactement 0.

PV et KO :

- Les PV restent dans `[0 ; PV_max]`, jamais négatifs.
- À 0 PV le Pokémon est KO et ne peut plus être ciblé.

## Correspondance user stories

| US    | Règle                                   | Vérifiée dans            |
|-------|-----------------------------------------|--------------------------|
| US-01 | Dégâts de base (neutre)                 | `matchers.test.js`       |
| US-02 | Super efficace (faiblesse x2)           | `matchers.test.js`       |
| US-03 | Peu efficace (résistance x0.5)          | `matchers.test.js`       |
| US-04 | Sans effet (immunité x0)                | `hooks.test.js`          |
| US-05 | Cumul des types (double faiblesse x4)   | `matchers.test.js`       |
| US-06 | Bonus de même type (STAB)               | `matchers.test.js`       |
| US-07 | Coup critique                           | `mocks.test.js`          |
| US-08 | Application des dégâts aux PV            | `hooks.test.js`          |
| US-09 | Mise KO à 0 PV                          | `hooks.test.js`          |
| US-10 | Les PV ne deviennent jamais négatifs    | `hooks.test.js`          |

## Structure des fichiers

```
.
├── package.json        scripts + dépendance jest
├── jest.config.js      config (testEnvironment, clearMocks, verbose)
├── src/                le code à tester
│   ├── combat.js       calculerDegats + table des types (matchers, exceptions)
│   ├── pokemon.js      classe à état : pv, pvMax, estKO, subirDegats (hooks)
│   ├── attaque.js      coup critique au hasard, rng injectable (mocks)
│   └── sac.js          classe à état : sac de dresseur (test de classe + erreurs)
└── tests/              les tests (un thème par fichier)
    ├── matchers.test.js
    ├── exceptions.test.js
    ├── hooks.test.js
    ├── mocks.test.js
    └── sac.test.js
```

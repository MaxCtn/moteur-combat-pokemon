# Moteur de combat Pokémon

[![tests](https://github.com/MaxCtn/moteur-combat-pokemon/actions/workflows/tests.yml/badge.svg)](https://github.com/MaxCtn/moteur-combat-pokemon/actions/workflows/tests.yml)

Un petit moteur de combat façon Pokémon en Node.js, construit pour le cours de tests de Ynov avec Léo Veysseyre. Le projet a été rendu en trois étapes qui montent la pyramide des tests : tests unitaires avec Jest, tests d'intégration d'une API Express avec Supertest, puis tests de bout en bout d'une interface avec Cypress.

## Lancer le projet

```bash
npm install        # Express, Jest, Supertest, Cypress
npm start          # l'app sur http://localhost:3000, le HUD est servi à la racine
npm test           # tests unitaires et d'intégration
npm run test:cov   # avec le rapport de couverture
npm run test:e2e   # démarre le serveur, joue les tests Cypress sans fenêtre, puis arrête tout
npm run cy:open    # ouvre l'interface de Cypress
```

## Les règles du moteur

Calcul des dégâts :

```
dégâts = arrondi_inférieur( base x multType x multSTAB x multCritique )
```

- **STAB** (attaque du même type que l'attaquant) : x1.5, sinon x1
- **Critique** : x1.5, sinon x1
- **Type** : faiblesse x2, résistance x0.5, immunité x0, neutre x1
- **Double type** : produit des deux multiplicateurs (x2 * x2 = x4)
- **Minimum** : 1 dégât sans immunité, exactement 0 avec une immunité

Les PV restent dans `[0 ; PV_max]` et ne deviennent jamais négatifs. À 0 PV, le Pokémon est KO et ne peut plus être ciblé.

## Rendu 1 : tests unitaires avec Jest

Le code et les tests reprennent nos user stories (US-01 à US-10). Chaque fichier de test couvre une notion de Jest, comme dans la démo du cours.

Le code a été écrit en TDD, le test d'abord :

1. **Rouge** : on écrit le test, on le lance, il échoue parce que le code n'existe pas encore
2. **Vert** : on écrit le minimum de code pour le faire passer
3. **Refactor** : on nettoie, les tests garantissent qu'on ne casse rien

Pour le voir, vide le contenu d'une fonction de `src/`, lance `npm test` (rouge), puis remets le code (vert).

| Fichier de test | Notion Jest | Code testé | User stories |
|---|---|---|---|
| `tests/matchers.test.js` | `toBe`, `toEqual`, `toContain`, `not` | `src/combat.js`, `src/pokemon.js` | US-01, US-02, US-03, US-05, US-06 |
| `tests/exceptions.test.js` | `toThrow` (règle `expect(() => ...)`) | `src/combat.js` | robustesse (attaque invalide) |
| `tests/hooks.test.js` | `beforeEach`, `afterEach` | `src/pokemon.js` | US-04, US-08, US-09, US-10 |
| `tests/mocks.test.js` | `jest.fn()` pour contrôler le hasard | `src/attaque.js` | US-07 |
| `tests/sac.test.js` | test d'une classe à état, `toThrow` | `src/sac.js` | sac de dresseur |

`src/sac.js` est la classe à état : un sac de dresseur où l'on range des objets empilables (Hyper Potion, Rappel, Pokéball…) avec une capacité limitée. Elle sert à montrer les hooks, le test d'une classe et plusieurs erreurs (`Quantite invalide`, `Sac plein`, `Objet absent du sac`).

| US | Règle | Vérifiée dans |
|---|---|---|
| US-01 | Dégâts de base (neutre) | `matchers.test.js` |
| US-02 | Super efficace (faiblesse x2) | `matchers.test.js` |
| US-03 | Peu efficace (résistance x0.5) | `matchers.test.js` |
| US-04 | Sans effet (immunité x0) | `hooks.test.js` |
| US-05 | Cumul des types (double faiblesse x4) | `matchers.test.js` |
| US-06 | Bonus de même type (STAB) | `matchers.test.js` |
| US-07 | Coup critique | `mocks.test.js` |
| US-08 | Application des dégâts aux PV | `hooks.test.js` |
| US-09 | Mise KO à 0 PV | `hooks.test.js` |
| US-10 | Les PV ne deviennent jamais négatifs | `hooks.test.js` |

## Rendu 2 : API Express et tests d'intégration avec Supertest

Une petite API Express ajoutée au-dessus du moteur. Les tests d'intégration vérifient le code HTTP et le corps de chaque réponse. Les Pokémon sont gardés en mémoire et remis à zéro entre chaque test par `resetPokedex`.

| Méthode | Route | Réponse |
|---|---|---|
| GET | `/pokemons` | `200` et la liste des Pokémon |
| GET | `/pokemons/:id` | `200` et le Pokémon, ou `404` `{ erreur: "Pokemon introuvable" }` |
| POST | `/pokemons` | `201` si `{ id, nom, type }` est valide, sinon `400` |
| POST | `/combat/degats` | `200` et `{ degats }` si `{ type, cible, base }` est valide, sinon `400` |

`/combat/degats` réutilise `multiplicateurDeType` et `calculerDegats` de `src/combat.js`. Par exemple, `{ type: "feu", cible: "plante", base: 20 }` renvoie `{ degats: 40 }`, parce que le feu bat la plante (x2).

`src/app.js` exporte `{ app, resetPokedex }` sans démarrer de serveur. Le `listen` est isolé dans `src/server.js`, ce qui permet à Supertest d'importer l'app directement. Les tests sont dans `tests/api.test.js`.

## Rendu 3 : HUD de combat et tests de bout en bout avec Cypress

Une page en JavaScript sans framework, servie par l'API depuis `public/`. Salamèche (feu) affronte Bulbizarre (plante), 100 PV chacun. Le bouton « Attaquer » envoie `POST /combat/degats`, retire les dégâts aux PV de la cible, passe au tour suivant et écrit dans le journal (« Super efficace », « Efficace » ou « Pas très efficace »). À 0 PV, la bannière « KO » apparaît. Une erreur 400 ne change rien à l'écran.

Cypress ouvre un vrai navigateur et joue cinq scénarios dans `cypress/e2e/hud.cy.js` :

- **État initial** : PV, tour et journal au démarrage
- **Attaque normale** : en observant la vraie requête envoyée à l'API
- **Mise KO** : avec une réponse simulée
- **Erreur 400** : l'écran ne bouge pas
- **Contrat d'API** : le corps exact envoyé au serveur

La commande `cy.attaquer(base)` est définie dans `cypress/support/e2e.js`.

## Structure des fichiers

```
.
├── src/
│   ├── combat.js       calcul des dégâts et table des types
│   ├── pokemon.js      classe à état : PV, PV max, KO, dégâts subis
│   ├── attaque.js      coup critique au hasard, générateur injectable
│   ├── sac.js          classe à état : sac de dresseur
│   ├── app.js          l'API Express, sans listen
│   └── server.js       démarre l'API sur le port 3000
├── public/             le HUD de combat (index.html, hud.js)
├── tests/              tests Jest et Supertest, une notion par fichier
├── cypress/            tests de bout en bout et commande cy.attaquer
└── .github/workflows/  lance les tests à chaque push sur main
```

## Licence

MIT, voir [LICENSE](LICENSE).

# Moteur de combat (type Pokémon) - Tests unitaires Jest

[![tests](https://github.com/MaxCtn/moteur-combat-pokemon/actions/workflows/tests.yml/badge.svg)](https://github.com/MaxCtn/moteur-combat-pokemon/actions/workflows/tests.yml)

Petit moteur de combat inspiré de Pokémon, écrit en Node.js (CommonJS), avec une suite de tests unitaires Jest. Chaque test correspond à une fiche de test (Test 01 à Test 10), elle-même reliée à une user story (US-01 à US-10).

Projet réalisé dans le cadre du cours "Tests et tests unitaires" (Ynov), par Contino et Veysseyre.

## Installation

```bash
npm install
```

La seule dépendance est Jest, en devDependency. Le moteur n'a aucune dépendance d'exécution.

## Lancer les tests

```bash
npm test
```

Résultat attendu :

```text
PASS  tests/combat.test.js
  Fiches de test - Moteur de combat
    ok Test 01 - Degats de base (efficacite neutre)
    ok Test 02 - Attaque super efficace (faiblesse)
    ok Test 03 - Attaque peu efficace (resistance)
    ok Test 04 - Attaque sans effet (immunite)
    ok Test 05 - Cumul des types (double faiblesse)
    ok Test 06 - Bonus de meme type (STAB)
    ok Test 07 - Coup critique
    ok Test 08 - Application des degats aux PV
    ok Test 09 - Mise KO a 0 PV
    ok Test 10 - Les PV ne deviennent jamais negatifs

Test Suites: 1 passed, 1 total
Tests:       10 passed, 10 total
```

Les tests sont aussi rejoués automatiquement à chaque push via GitHub Actions (voir `.github/workflows/tests.yml`).

## Structure du projet

```
.
├── package.json            config npm + script "test": "jest"
├── README.md
├── .github/workflows/
│   └── tests.yml           CI : npm ci puis npm test à chaque push / PR
├── src/
│   ├── degats.js           calculerDegats(...) : formule + bornes (min 1, immunité = 0)
│   ├── pokemon.js          classe Pokemon : pv, pvMax, estKO, subirDegats(...)
│   └── typeChart.js        TABLE_DES_TYPES + multiplicateurDeType(...)  (bonus)
└── tests/
    └── combat.test.js      les 10 tests (un par fiche de test)
```

## Règles métier

Calcul des dégâts :

```
dégâts = arrondi_inférieur( dégâtsBase x multType x multSTAB x multCritique )
```

- multSTAB = 1.5 si l'attaque est du même type que l'attaquant, sinon 1
- multCritique = 1.5 s'il y a coup critique, sinon 1
- Multiplicateurs de type : faiblesse = x2, résistance = x0.5, immunité = x0, neutre = x1
- Double type : produit des deux multiplicateurs (ex : x2 * x2 = x4)
- Si multType > 0 (pas d'immunité) : les dégâts sont au minimum de 1
- Si multType = 0 (immunité) : les dégâts valent exactement 0 (le minimum ne s'applique pas)
- Arrondi inférieur (Math.floor)

PV et KO :

- Les PV restent dans l'intervalle [0 ; PV_max] et ne deviennent jamais négatifs
- PV = 0 : le Pokémon est KO
- Un Pokémon KO ne peut plus être ciblé

## Correspondance fiches de test / user stories

| Fiche   | US     | Intitulé                              | Entrée                                | Résultat attendu        |
| ------- | ------ | ------------------------------------- | ------------------------------------- | ----------------------- |
| Test 01 | US-01  | Dégâts de base (efficacité neutre)    | base 50, multType 1                   | 50 dégâts               |
| Test 02 | US-02  | Attaque super efficace (faiblesse)    | base 50, multType 2                   | 100 dégâts              |
| Test 03 | US-03  | Attaque peu efficace (résistance)     | base 50, multType 0.5                 | 25 dégâts               |
| Test 04 | US-04  | Attaque sans effet (immunité)         | base 50, multType 0, défenseur 100 PV | 0 dégât, reste à 100 PV |
| Test 05 | US-05  | Cumul des types (double faiblesse)    | base 50, multType 4                   | 200 dégâts              |
| Test 06 | US-06  | Bonus de même type (STAB)             | base 50, multType 1, STAB actif       | 75 dégâts               |
| Test 07 | US-07  | Coup critique                         | base 50, multType 1, critique         | 75 dégâts               |
| Test 08 | US-08  | Application des dégâts aux PV         | défenseur 100 PV, 30 dégâts           | 70 PV                   |
| Test 09 | US-09  | Mise KO à 0 PV                        | défenseur 50 PV, 50 dégâts            | 0 PV et estKO = true    |
| Test 10 | US-10  | Les PV ne deviennent jamais négatifs  | défenseur 20 PV, 999 dégâts           | 0 PV (pas négatif) + KO |

## API

```js
const { calculerDegats } = require("./src/degats");
const { Pokemon } = require("./src/pokemon");
const { multiplicateurDeType, TABLE_DES_TYPES } = require("./src/typeChart");

// Dégâts d'une attaque
calculerDegats({ degatsBase: 50, multType: 2 });               // 100  (faiblesse)
calculerDegats({ degatsBase: 50, multType: 1, stab: true });   // 75   (STAB)
calculerDegats({ degatsBase: 50, multType: 0 });               // 0    (immunité)

// Multiplicateur de type via la table (bonus)
multiplicateurDeType("eau", ["roche", "sol"], TABLE_DES_TYPES); // 4   (double faiblesse)

// PV et KO
const pikachu = new Pokemon({ nom: "Pikachu", pvMax: 100, types: ["electrik"] });
pikachu.subirDegats(30);
pikachu.pv;    // 70
pikachu.estKO; // false
```

## Démarche

Le projet a été construit en TDD : on écrit d'abord les 10 tests à partir des fiches, on les exécute pour les voir échouer (le moteur n'existe pas encore), puis on implémente le moteur jusqu'à ce que tous les tests passent.

## Licence

MIT, voir le fichier LICENSE.

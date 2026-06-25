# ⚔️ Moteur de combat (type Pokémon) — Tests unitaires Jest

[![tests](https://github.com/MaxCtn/moteur-combat-pokemon/actions/workflows/tests.yml/badge.svg)](https://github.com/MaxCtn/moteur-combat-pokemon/actions/workflows/tests.yml)
[![tested with Jest](https://img.shields.io/badge/tested_with-Jest-99424f.svg?logo=jest&logoColor=white)](https://jestjs.io/)
[![Node.js](https://img.shields.io/badge/Node.js-%E2%89%A518-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](#-licence)

Petit moteur de combat inspiré de Pokémon, écrit en **Node.js** (CommonJS), accompagné d'une suite de **tests unitaires Jest**. Chaque test reproduit une **fiche de test** (`Test 01` → `Test 10`), elle-même reliée à une **user story** (`US-01` → `US-10`).

> Projet réalisé dans le cadre du cours **« Tests et tests unitaires »** (Ynov) — Contino / Veysseyre.

---

## ✨ Ce que fait le moteur

- **Calcul de dégâts** complet : dégâts de base, multiplicateur de type, bonus STAB, coup critique, arrondi inférieur.
- **Efficacité des types** : faiblesse (×2), résistance (×0.5), immunité (×0), neutre (×1), et **cumul sur les doubles types** (×2·×2 = ×4).
- **Gestion des PV / KO** : application des dégâts, bornage à `[0 ; PV_max]` (jamais de PV négatif), passage automatique à l'état **KO** à 0 PV.
- **Bonus** : une vraie **table des types** pour dériver les multiplicateurs depuis de vrais affrontements (`feu → plante = ×2`, `électrik → sol = ×0`, …).

---

## 🚀 Installation

```bash
npm install
```

La seule dépendance est **Jest** (en `devDependency`). Aucune dépendance d'exécution.

## 🧪 Lancer les tests

```bash
npm test
```

```text
PASS  tests/combat.test.js
  Fiches de test - Moteur de combat
    ✓ Test 01 - Degats de base (efficacite neutre)
    ✓ Test 02 - Attaque super efficace (faiblesse)
    ✓ Test 03 - Attaque peu efficace (resistance)
    ✓ Test 04 - Attaque sans effet (immunite)
    ✓ Test 05 - Cumul des types (double faiblesse)
    ✓ Test 06 - Bonus de meme type (STAB)
    ✓ Test 07 - Coup critique
    ✓ Test 08 - Application des degats aux PV
    ✓ Test 09 - Mise KO a 0 PV
    ✓ Test 10 - Les PV ne deviennent jamais negatifs

Test Suites: 1 passed, 1 total
Tests:       10 passed, 10 total
```

Les tests tournent aussi automatiquement en **CI** (GitHub Actions) à chaque push — voir [`.github/workflows/tests.yml`](.github/workflows/tests.yml).

---

## 📂 Structure du projet

```
.
├── package.json            # config npm + script "test": "jest"
├── README.md
├── .github/workflows/
│   └── tests.yml           # CI : npm ci && npm test sur chaque push / PR
├── src/
│   ├── degats.js           # calculerDegats(...)        -> formule + bornes (min 1 / immunité = 0)
│   ├── pokemon.js          # classe Pokemon             -> pv, pvMax, estKO, subirDegats(...)
│   └── typeChart.js        # TABLE_DES_TYPES + multiplicateurDeType(...)  (bonus)
└── tests/
    └── combat.test.js      # les 10 tests (un par fiche de test)
```

---

## 📐 Règles métier

**Calcul des dégâts :**

```
dégâts = arrondi_inférieur( dégâtsBase × multType × multSTAB × multCritique )
```

| Élément          | Valeur                                                             |
| ---------------- | ----------------------------------------------------------------- |
| `multSTAB`       | `1.5` si l'attaque est du même type que l'attaquant, sinon `1`    |
| `multCritique`   | `1.5` s'il y a coup critique, sinon `1`                           |
| Faiblesse        | `×2`                                                              |
| Résistance       | `×0.5`                                                            |
| Immunité         | `×0`                                                             |
| Neutre           | `×1`                                                             |
| Double type      | produit des deux multiplicateurs (ex : `×2 · ×2 = ×4`)            |

**Bornes importantes :**

- Si `multType > 0` (pas d'immunité) → les dégâts sont **au minimum de 1**.
- Si `multType = 0` (immunité) → les dégâts valent **exactement 0** (la règle du minimum ne s'applique pas).
- Arrondi : **inférieur** (`Math.floor`).

**PV et KO :**

- Les PV restent dans `[0 ; PV_max]` et ne deviennent **jamais négatifs**.
- `PV = 0` ⇒ le Pokémon est **KO**.
- Un Pokémon KO ne peut plus être ciblé.

---

## 🗺️ Correspondance fiches de test ↔ user stories

| Fiche       | US        | Intitulé                              | Entrée                                  | Résultat attendu          |
| ----------- | --------- | ------------------------------------- | --------------------------------------- | ------------------------- |
| **Test 01** | US-01     | Dégâts de base (efficacité neutre)    | base 50, multType 1                     | 50 dégâts                 |
| **Test 02** | US-02     | Attaque super efficace (faiblesse)    | base 50, multType 2                     | 100 dégâts                |
| **Test 03** | US-03     | Attaque peu efficace (résistance)     | base 50, multType 0.5                   | 25 dégâts                 |
| **Test 04** | US-04     | Attaque sans effet (immunité)         | base 50, multType 0, défenseur 100 PV   | 0 dégât, reste à 100 PV   |
| **Test 05** | US-05     | Cumul des types (double faiblesse)    | base 50, multType 4                     | 200 dégâts                |
| **Test 06** | US-06     | Bonus de même type (STAB)             | base 50, multType 1, STAB actif         | 75 dégâts                 |
| **Test 07** | US-07     | Coup critique                         | base 50, multType 1, critique           | 75 dégâts                 |
| **Test 08** | US-08     | Application des dégâts aux PV         | défenseur 100 PV, 30 dégâts             | 70 PV                     |
| **Test 09** | US-09     | Mise KO à 0 PV                        | défenseur 50 PV, 50 dégâts              | 0 PV et `estKO = true`    |
| **Test 10** | US-10     | Les PV ne deviennent jamais négatifs  | défenseur 20 PV, 999 dégâts             | 0 PV (pas négatif) et KO  |

---

## 🧩 API

```js
const { calculerDegats } = require("./src/degats");
const { Pokemon } = require("./src/pokemon");
const { multiplicateurDeType, TABLE_DES_TYPES } = require("./src/typeChart");

// Dégâts d'une attaque
calculerDegats({ degatsBase: 50, multType: 2 });               // => 100  (faiblesse)
calculerDegats({ degatsBase: 50, multType: 1, stab: true });   // => 75   (STAB)
calculerDegats({ degatsBase: 50, multType: 0 });               // => 0    (immunité)

// Multiplicateur de type via la table (bonus)
multiplicateurDeType("eau", ["roche", "sol"], TABLE_DES_TYPES); // => 4   (double faiblesse)

// PV et KO
const pikachu = new Pokemon({ nom: "Pikachu", pvMax: 100, types: ["electrik"] });
pikachu.subirDegats(30);
pikachu.pv;    // => 70
pikachu.estKO; // => false
```

---

## 🛠️ Démarche (TDD)

Le projet a été construit en **Test-Driven Development**, cohérent avec l'objectif du cours :

1. Écriture des **10 tests** d'après les fiches (la spec).
2. Exécution → **échec attendu** (le moteur n'existe pas encore).
3. Implémentation **minimale** pour faire passer les tests.
4. Exécution → **tout au vert**, code nettoyé.

---

## 📜 Licence

Distribué sous licence **MIT**. Voir le champ `license` du `package.json`.

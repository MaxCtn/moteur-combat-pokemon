// Suite de tests unitaires du moteur de combat (type Pokemon).
// Chaque test correspond a UNE fiche de test (Test 01 -> Test 10),
// elle-meme reliee a une user story (US-01 -> US-10).
// Les valeurs utilisees sont exactement celles des fiches de test.

const { calculerDegats } = require("../src/degats");
const { Pokemon } = require("../src/pokemon");
const { multiplicateurDeType, TABLE_DES_TYPES } = require("../src/typeChart");

describe("Fiches de test - Moteur de combat", () => {
  // Test 01 / US-01 : attaque neutre, on lit les degats de base tels quels.
  test("Test 01 - Degats de base (efficacite neutre)", () => {
    const degats = calculerDegats({ degatsBase: 50, multType: 1 });
    expect(degats).toBe(50);
  });

  // Test 02 / US-02 : le defenseur est faible au type de l'attaque -> x2.
  test("Test 02 - Attaque super efficace (faiblesse)", () => {
    // Le feu est super efficace contre la plante : multiplicateur x2.
    const multType = multiplicateurDeType("feu", ["plante"], TABLE_DES_TYPES);
    expect(multType).toBe(2);

    const degats = calculerDegats({ degatsBase: 50, multType });
    expect(degats).toBe(100);
  });

  // Test 03 / US-03 : le defenseur resiste au type de l'attaque -> x0.5.
  test("Test 03 - Attaque peu efficace (resistance)", () => {
    // Le feu est peu efficace contre l'eau : multiplicateur x0.5.
    const multType = multiplicateurDeType("feu", ["eau"], TABLE_DES_TYPES);
    expect(multType).toBe(0.5);

    const degats = calculerDegats({ degatsBase: 50, multType });
    expect(degats).toBe(25);
  });

  // Test 04 / US-04 : le defenseur est immunise -> x0, 0 degat, PV inchanges.
  test("Test 04 - Attaque sans effet (immunite)", () => {
    // Le sol est immunise a l'electrik : multiplicateur x0.
    const multType = multiplicateurDeType("electrik", ["sol"], TABLE_DES_TYPES);
    expect(multType).toBe(0);

    const degats = calculerDegats({ degatsBase: 50, multType });
    expect(degats).toBe(0);

    // Un defenseur a 100 PV ne perd aucun PV.
    const defenseur = new Pokemon({ nom: "Defenseur", pvMax: 100, types: ["sol"] });
    defenseur.subirDegats(degats);
    expect(defenseur.pv).toBe(100);
  });

  // Test 05 / US-05 : double type tous deux faibles -> x2 * x2 = x4.
  test("Test 05 - Cumul des types (double faiblesse)", () => {
    // L'eau est super efficace contre roche ET sol : x2 * x2 = x4.
    const multType = multiplicateurDeType("eau", ["roche", "sol"], TABLE_DES_TYPES);
    expect(multType).toBe(4);

    const degats = calculerDegats({ degatsBase: 50, multType });
    expect(degats).toBe(200);
  });

  // Test 06 / US-06 : bonus STAB (meme type que l'attaquant) -> x1.5.
  test("Test 06 - Bonus de meme type (STAB)", () => {
    const degats = calculerDegats({ degatsBase: 50, multType: 1, stab: true });
    expect(degats).toBe(75);
  });

  // Test 07 / US-07 : coup critique -> x1.5.
  test("Test 07 - Coup critique", () => {
    const degats = calculerDegats({ degatsBase: 50, multType: 1, critique: true });
    expect(degats).toBe(75);
  });

  // Test 08 / US-08 : application des degats aux PV (100 - 30 = 70).
  test("Test 08 - Application des degats aux PV", () => {
    const defenseur = new Pokemon({ nom: "Defenseur", pvMax: 100 });
    defenseur.subirDegats(30);
    expect(defenseur.pv).toBe(70);
  });

  // Test 09 / US-09 : PV a 0 => KO (50 - 50 = 0).
  test("Test 09 - Mise KO a 0 PV", () => {
    const defenseur = new Pokemon({ nom: "Defenseur", pvMax: 50 });
    defenseur.subirDegats(50);
    expect(defenseur.pv).toBe(0);
    expect(defenseur.estKO).toBe(true);
  });

  // Test 10 / US-10 : les PV ne deviennent jamais negatifs (borne a 0) + KO.
  test("Test 10 - Les PV ne deviennent jamais negatifs", () => {
    const defenseur = new Pokemon({ nom: "Defenseur", pvMax: 20 });
    defenseur.subirDegats(999);
    expect(defenseur.pv).toBe(0);
    expect(defenseur.estKO).toBe(true);
  });
});

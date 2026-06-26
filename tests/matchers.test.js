const { calculerDegats, multiplicateurDeType, TABLE_DES_TYPES } = require("../src/combat");
const { Pokemon } = require("../src/pokemon");

describe("Matchers - calcul des degats", () => {
  test("US-01 attaque neutre : 50 de base reste a 50", () => {
    expect(calculerDegats({ degatsBase: 50, multType: 1 })).toBe(50);
  });

  test("US-02 faiblesse : feu contre plante double les degats (50 -> 100)", () => {
    const multType = multiplicateurDeType("feu", ["plante"], TABLE_DES_TYPES);
    expect(multType).toBe(2);
    expect(calculerDegats({ degatsBase: 50, multType })).toBe(100);
  });

  test("US-03 resistance : feu contre eau divise les degats (50 -> 25)", () => {
    const multType = multiplicateurDeType("feu", ["eau"], TABLE_DES_TYPES);
    expect(multType).toBe(0.5);
    expect(calculerDegats({ degatsBase: 50, multType })).toBe(25);
  });

  test("US-05 double faiblesse : eau contre roche/sol cumule (50 -> 200)", () => {
    const multType = multiplicateurDeType("eau", ["roche", "sol"], TABLE_DES_TYPES);
    expect(multType).toBe(4);
    expect(calculerDegats({ degatsBase: 50, multType })).toBe(200);
  });

  test("US-06 bonus STAB : meme type que l'attaquant (50 -> 75)", () => {
    expect(calculerDegats({ degatsBase: 50, multType: 1, stab: true })).toBe(75);
  });

  test("toContain : les types d'un Pokemon", () => {
    const pikachu = new Pokemon({ nom: "Pikachu", pvMax: 100, types: ["electrik"] });
    expect(pikachu.types).toContain("electrik");
    expect(pikachu.types).not.toContain("feu");
  });

  test("toEqual : l'etat d'un Pokemon a la creation", () => {
    const salameche = new Pokemon({ nom: "Salameche", pvMax: 78, types: ["feu"] });
    expect(salameche).toEqual({ nom: "Salameche", pvMax: 78, pv: 78, types: ["feu"] });
  });
});

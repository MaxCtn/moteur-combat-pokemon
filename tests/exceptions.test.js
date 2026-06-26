const { calculerDegats } = require("../src/combat");

describe("Exceptions - attaque invalide", () => {
  test("toThrow : une attaque sans degats de base leve une erreur", () => {
    expect(() => calculerDegats({ multType: 1 })).toThrow("Attaque invalide");
  });

  test("toThrow : une attaque sans multiplicateur de type leve une erreur", () => {
    expect(() => calculerDegats({ degatsBase: 50 })).toThrow("Attaque invalide");
  });
});

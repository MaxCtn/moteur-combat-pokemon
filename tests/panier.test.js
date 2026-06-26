const { Panier } = require("../src/panier");

describe("Panier - test d'une classe a etat", () => {
  let panier;

  beforeEach(() => {
    panier = new Panier();
  });

  afterEach(() => {
    panier.vider();
  });

  test("un panier commence vide", () => {
    expect(panier.nbArticles).toBe(0);
  });

  test("ajouter des articles met a jour le total et le contenu", () => {
    panier.ajouter("Potion", 200, 2);
    panier.ajouter("Pokeball", 100);
    expect(panier.nbArticles).toBe(2);
    expect(panier.total()).toBe(500);
    expect(panier.contient("Potion")).toBe(true);
    expect(panier.contient("Master Ball")).toBe(false);
  });

  test("retirer un article", () => {
    panier.ajouter("Potion", 200);
    panier.retirer("Potion");
    expect(panier.contient("Potion")).toBe(false);
    expect(panier.nbArticles).toBe(0);
  });

  test("toThrow : un prix negatif est interdit", () => {
    expect(() => panier.ajouter("Article casse", -10)).toThrow("Prix negatif interdit");
  });
});

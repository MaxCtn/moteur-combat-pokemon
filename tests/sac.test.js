const { SacDresseur } = require("../src/sac");

describe("SacDresseur - test d'une classe a etat", () => {
  let sac;

  beforeEach(() => {
    sac = new SacDresseur(5);
  });

  afterEach(() => {
    sac.vider();
  });

  test("un sac neuf est vide", () => {
    expect(sac.nombreObjets).toBe(0);
    expect(sac.estPlein).toBe(false);
  });

  test("ranger des objets empile les quantites", () => {
    sac.rangerObjet("Hyper Potion", 2);
    sac.rangerObjet("Rappel");
    sac.rangerObjet("Hyper Potion");
    expect(sac.quantite("Hyper Potion")).toBe(3);
    expect(sac.nombreObjets).toBe(4);
    expect(sac.listerObjets()).toEqual(["Hyper Potion", "Rappel"]);
  });

  test("utiliser un objet le decremente puis le retire a zero", () => {
    sac.rangerObjet("Rappel", 2);
    expect(sac.utiliserObjet("Rappel")).toBe("Rappel");
    expect(sac.quantite("Rappel")).toBe(1);
    sac.utiliserObjet("Rappel");
    expect(sac.aObjet("Rappel")).toBe(false);
  });

  test("toThrow : ranger une quantite invalide est refuse", () => {
    expect(() => sac.rangerObjet("Super Bonbon", 0)).toThrow("Quantite invalide");
  });

  test("toThrow : depasser la capacite du sac est refuse", () => {
    sac.rangerObjet("Pokeball", 5);
    expect(sac.estPlein).toBe(true);
    expect(() => sac.rangerObjet("Super Ball")).toThrow("Sac plein");
  });

  test("toThrow : utiliser un objet absent est refuse", () => {
    expect(() => sac.utiliserObjet("Master Ball")).toThrow("Objet absent du sac");
  });
});

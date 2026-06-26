const { calculerDegats, multiplicateurDeType, TABLE_DES_TYPES } = require("../src/combat");
const { Pokemon } = require("../src/pokemon");

describe("Hooks - PV et KO d'un defenseur", () => {
  let defenseur;

  beforeEach(() => {
    defenseur = new Pokemon({ nom: "Defenseur", pvMax: 100, types: ["plante"] });
  });

  afterEach(() => {
    defenseur = null;
  });

  test("US-08 application des degats : 100 PV - 30 = 70", () => {
    defenseur.subirDegats(30);
    expect(defenseur.pv).toBe(70);
  });

  test("US-04 immunite : 0 degat, le defenseur garde ses 100 PV", () => {
    const multType = multiplicateurDeType("electrik", ["sol"], TABLE_DES_TYPES);
    const degats = calculerDegats({ degatsBase: 50, multType });
    defenseur.subirDegats(degats);
    expect(degats).toBe(0);
    expect(defenseur.pv).toBe(100);
  });

  test("US-09 mise KO : 50 PV - 50 degats = 0 PV et KO", () => {
    const cible = new Pokemon({ nom: "Roucool", pvMax: 50, types: ["normal", "vol"] });
    cible.subirDegats(50);
    expect(cible.pv).toBe(0);
    expect(cible.estKO).toBe(true);
  });

  test("US-10 PV jamais negatifs : 20 PV - 999 degats = 0 PV et KO", () => {
    const cible = new Pokemon({ nom: "Chenipan", pvMax: 20, types: ["insecte"] });
    cible.subirDegats(999);
    expect(cible.pv).toBe(0);
    expect(cible.estKO).toBe(true);
  });
});

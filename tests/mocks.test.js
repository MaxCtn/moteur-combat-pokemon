const { attaquer } = require("../src/attaque");

describe("Mocks - coup critique aleatoire", () => {
  test("US-07 critique force : rng sous le seuil, 50 -> 75", () => {
    const rng = jest.fn().mockReturnValue(0.05);
    expect(attaquer({ degatsBase: 50, multType: 1, rng })).toBe(75);
    expect(rng).toHaveBeenCalled();
  });

  test("sans critique : rng au-dessus du seuil, 50 reste a 50", () => {
    const rng = jest.fn().mockReturnValue(0.9);
    expect(attaquer({ degatsBase: 50, multType: 1, rng })).toBe(50);
  });
});

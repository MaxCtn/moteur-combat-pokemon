const request = require("supertest");
const { app, resetPokedex } = require("../src/app");

describe("API Pokemon - tests d'integration", () => {
  beforeEach(() => {
    resetPokedex();
  });

  describe("GET /pokemons", () => {
    test("renvoie 200 et un tableau non vide", async () => {
      const res = await request(app).get("/pokemons");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /pokemons/:id", () => {
    test("renvoie 200 et le Pokemon pour un id connu", async () => {
      const res = await request(app).get("/pokemons/25");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ id: 25, nom: "Pikachu", type: "electrik" });
    });

    test("renvoie 404 pour un id inconnu", async () => {
      const res = await request(app).get("/pokemons/999");
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ erreur: "Pokemon introuvable" });
    });
  });

  describe("POST /pokemons", () => {
    test("renvoie 201 avec un corps valide", async () => {
      const nouveau = { id: 7, nom: "Carapuce", type: "eau" };
      const res = await request(app).post("/pokemons").send(nouveau);
      expect(res.status).toBe(201);
      expect(res.body).toEqual(nouveau);
    });

    test("renvoie 400 avec un corps invalide", async () => {
      const res = await request(app).post("/pokemons").send({ nom: "Sans identifiant" });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ erreur: "Pokemon invalide" });
    });
  });

  describe("POST /combat/degats", () => {
    test("renvoie 200 et double les degats quand la cible est faible (feu contre plante)", async () => {
      const res = await request(app)
        .post("/combat/degats")
        .send({ type: "feu", cible: "plante", base: 20 });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ degats: 40 });
    });

    test("renvoie 200 et reduit les degats quand la cible resiste (feu contre eau)", async () => {
      const res = await request(app)
        .post("/combat/degats")
        .send({ type: "feu", cible: "eau", base: 20 });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ degats: 10 });
    });

    test("renvoie 400 si le corps est incomplet", async () => {
      const res = await request(app)
        .post("/combat/degats")
        .send({ type: "feu", cible: "plante" });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ erreur: "Requete de combat invalide" });
    });
  });
});

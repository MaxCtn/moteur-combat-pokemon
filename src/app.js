const express = require("express");
const { multiplicateurDeType, calculerDegats } = require("./combat");

const POKEDEX_INITIAL = [
  { id: 1, nom: "Bulbizarre", type: "plante" },
  { id: 4, nom: "Salameche", type: "feu" },
  { id: 25, nom: "Pikachu", type: "electrik" },
];

let pokedex = [];

function resetPokedex() {
  pokedex = POKEDEX_INITIAL.map((pokemon) => ({ ...pokemon }));
}

resetPokedex();

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.get("/pokemons", (req, res) => {
  res.status(200).json(pokedex);
});

app.get("/pokemons/:id", (req, res) => {
  const id = Number(req.params.id);
  const pokemon = pokedex.find((element) => element.id === id);
  if (!pokemon) {
    return res.status(404).json({ erreur: "Pokemon introuvable" });
  }
  res.status(200).json(pokemon);
});

app.post("/pokemons", (req, res) => {
  const { id, nom, type } = req.body;
  if (typeof id !== "number" || typeof nom !== "string" || typeof type !== "string") {
    return res.status(400).json({ erreur: "Pokemon invalide" });
  }
  const pokemon = { id, nom, type };
  pokedex.push(pokemon);
  res.status(201).json(pokemon);
});

app.post("/combat/degats", (req, res) => {
  const { type, cible, base } = req.body;
  if (typeof type !== "string" || typeof cible !== "string" || typeof base !== "number") {
    return res.status(400).json({ erreur: "Requete de combat invalide" });
  }
  const multType = multiplicateurDeType(type, [cible]);
  const degats = calculerDegats({ degatsBase: base, multType });
  res.status(200).json({ degats });
});

module.exports = { app, resetPokedex };

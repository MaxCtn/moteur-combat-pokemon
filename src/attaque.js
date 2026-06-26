const { calculerDegats } = require("./combat");

function attaquer({ degatsBase, multType = 1, stab = false, seuilCritique = 0.1, rng = Math.random }) {
  const critique = rng() < seuilCritique;
  return calculerDegats({ degatsBase, multType, stab, critique });
}

module.exports = { attaquer };

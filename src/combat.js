const TABLE_DES_TYPES = {
  feu: { plante: 2, eau: 0.5, feu: 0.5, roche: 0.5 },
  eau: { feu: 2, roche: 2, sol: 2, plante: 0.5, eau: 0.5 },
  plante: { eau: 2, roche: 2, sol: 2, feu: 0.5, plante: 0.5, vol: 0.5 },
  electrik: { eau: 2, vol: 2, sol: 0, plante: 0.5, electrik: 0.5 },
  normal: { roche: 0.5, acier: 0.5, spectre: 0 },
};

function multiplicateurDeType(typeAttaque, typesDefenseur, table = TABLE_DES_TYPES) {
  const ligne = table[typeAttaque] || {};
  return typesDefenseur.reduce((mult, type) => mult * (type in ligne ? ligne[type] : 1), 1);
}

function calculerDegats({ degatsBase, multType, stab = false, critique = false }) {
  if (degatsBase == null || multType == null) {
    throw new Error("Attaque invalide");
  }
  const multStab = stab ? 1.5 : 1;
  const multCritique = critique ? 1.5 : 1;
  const degatsBruts = degatsBase * multType * multStab * multCritique;
  if (multType === 0) return 0;
  return Math.max(1, Math.floor(degatsBruts));
}

module.exports = { calculerDegats, multiplicateurDeType, TABLE_DES_TYPES };

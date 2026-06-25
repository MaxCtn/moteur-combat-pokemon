// Table des types et calcul du multiplicateur de type.
//
// La table se lit : TABLE_DES_TYPES[typeAttaque][typeDefenseur] = multiplicateur.
//   - Faiblesse  = x2
//   - Resistance = x0.5
//   - Immunite   = x0
//   - Neutre     = x1 (valeur par defaut quand le couple n'est pas liste)
//
// Sur un double type, on multiplie les deux multiplicateurs
// (ex : x2 * x2 = x4, x2 * x0.5 = x1, x0 * x2 = x0).

const TABLE_DES_TYPES = {
  feu: { plante: 2, eau: 0.5, feu: 0.5, roche: 0.5 },
  eau: { feu: 2, roche: 2, sol: 2, plante: 0.5, eau: 0.5 },
  plante: { eau: 2, roche: 2, sol: 2, feu: 0.5, plante: 0.5, vol: 0.5 },
  electrik: { eau: 2, vol: 2, sol: 0, plante: 0.5, electrik: 0.5 },
  normal: { roche: 0.5, acier: 0.5, spectre: 0 },
};

/**
 * Calcule le multiplicateur de type d'une attaque contre un defenseur,
 * en cumulant le multiplicateur de chacun des types du defenseur.
 *
 * @param {string} typeAttaque       - Type de l'attaque (ex: "feu").
 * @param {string[]} typesDefenseur  - Type(s) du defenseur (ex: ["roche", "sol"]).
 * @param {object} [table]           - Table des types a utiliser.
 * @returns {number} Le multiplicateur de type cumule.
 */
function multiplicateurDeType(typeAttaque, typesDefenseur, table = TABLE_DES_TYPES) {
  const ligne = table[typeAttaque] || {};

  return typesDefenseur.reduce((multiplicateur, typeDefenseur) => {
    // Couple non liste = neutre (x1).
    const m = typeDefenseur in ligne ? ligne[typeDefenseur] : 1;
    return multiplicateur * m;
  }, 1);
}

module.exports = { multiplicateurDeType, TABLE_DES_TYPES };

// Calcul des degats d'une attaque.
//
// Formule (cf. regles metier) :
//   degats = floor( degatsBase * multType * multStab * multCritique )
//   - multStab     = 1.5 si l'attaque est du meme type que l'attaquant, sinon 1
//   - multCritique = 1.5 s'il y a coup critique, sinon 1
//
// Deux regles de bornage importantes :
//   - Immunite (multType === 0) : les degats valent EXACTEMENT 0.
//   - Sinon (multType > 0)      : les degats sont AU MINIMUM de 1.

const MULT_STAB = 1.5;
const MULT_CRITIQUE = 1.5;

/**
 * Calcule les degats infliges par une attaque.
 *
 * @param {object} params
 * @param {number} params.degatsBase - Puissance de base de l'attaque (entier positif).
 * @param {number} params.multType   - Multiplicateur de type (0, 0.5, 1, 2, 4...).
 * @param {boolean} [params.stab]     - true si bonus de meme type (STAB).
 * @param {boolean} [params.critique] - true si coup critique.
 * @returns {number} Les degats, sous forme d'entier (arrondi inferieur).
 */
function calculerDegats({ degatsBase, multType, stab = false, critique = false }) {
  const multStab = stab ? MULT_STAB : 1;
  const multCritique = critique ? MULT_CRITIQUE : 1;

  const degatsBruts = degatsBase * multType * multStab * multCritique;

  // Immunite : aucun degat, la regle du minimum a 1 ne s'applique pas.
  if (multType === 0) {
    return 0;
  }

  // Pas d'immunite : arrondi inferieur, mais jamais en dessous de 1.
  return Math.max(1, Math.floor(degatsBruts));
}

module.exports = { calculerDegats };

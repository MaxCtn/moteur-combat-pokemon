// Representation d'un Pokemon en combat : ses PV, son etat KO,
// et la facon dont il encaisse des degats.

class Pokemon {
  /**
   * @param {object} params
   * @param {string} [params.nom]   - Nom du Pokemon (pour l'affichage).
   * @param {number} params.pvMax   - PV maximum (et PV de depart).
   * @param {string[]} [params.types] - Types du Pokemon (ex: ["feu"]).
   */
  constructor({ nom = "Pokemon", pvMax, types = [] }) {
    this.nom = nom;
    this.pvMax = pvMax;
    this.pv = pvMax; // au depart, le Pokemon est au maximum de ses PV
    this.types = types;
  }

  /**
   * Un Pokemon est KO des que ses PV atteignent 0.
   * @returns {boolean}
   */
  get estKO() {
    return this.pv <= 0;
  }

  /**
   * Applique des degats au Pokemon.
   * Les PV restent bornes dans l'intervalle [0 ; pvMax] : ils ne deviennent
   * jamais negatifs. Un Pokemon deja KO ne peut plus etre cible.
   *
   * @param {number} degats - Degats a retrancher (entier >= 0).
   */
  subirDegats(degats) {
    if (this.estKO) {
      return; // un Pokemon KO ne peut plus etre cible
    }
    this.pv = Math.max(0, this.pv - degats);
  }
}

module.exports = { Pokemon };

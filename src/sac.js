const CAPACITE_PAR_DEFAUT = 5;

class SacDresseur {
  constructor(capaciteMax = CAPACITE_PAR_DEFAUT) {
    this.capaciteMax = capaciteMax;
    this.objets = new Map();
  }

  get nombreObjets() {
    let total = 0;
    for (const quantite of this.objets.values()) {
      total += quantite;
    }
    return total;
  }

  get estPlein() {
    return this.nombreObjets >= this.capaciteMax;
  }

  quantite(nom) {
    return this.objets.get(nom) || 0;
  }

  aObjet(nom) {
    return this.quantite(nom) > 0;
  }

  rangerObjet(nom, quantite = 1) {
    if (quantite <= 0) {
      throw new Error("Quantite invalide");
    }
    if (this.nombreObjets + quantite > this.capaciteMax) {
      throw new Error("Sac plein");
    }
    this.objets.set(nom, this.quantite(nom) + quantite);
  }

  utiliserObjet(nom) {
    if (!this.aObjet(nom)) {
      throw new Error("Objet absent du sac");
    }
    const reste = this.quantite(nom) - 1;
    if (reste === 0) {
      this.objets.delete(nom);
    } else {
      this.objets.set(nom, reste);
    }
    return nom;
  }

  listerObjets() {
    return [...this.objets.keys()];
  }

  vider() {
    this.objets.clear();
  }
}

module.exports = { SacDresseur };

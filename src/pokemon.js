class Pokemon {
  constructor({ nom = "Pokemon", pvMax, types = [] }) {
    this.nom = nom;
    this.pvMax = pvMax;
    this.pv = pvMax;
    this.types = types;
  }

  get estKO() {
    return this.pv <= 0;
  }

  subirDegats(degats) {
    if (this.estKO) return;
    this.pv = Math.max(0, this.pv - degats);
  }
}

module.exports = { Pokemon };

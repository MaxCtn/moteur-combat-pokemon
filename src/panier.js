class Panier {
  constructor() {
    this.articles = [];
  }

  ajouter(nom, prix, qte = 1) {
    if (prix < 0) {
      throw new Error("Prix negatif interdit");
    }
    this.articles.push({ nom, prix, qte });
  }

  retirer(nom) {
    this.articles = this.articles.filter((a) => a.nom !== nom);
  }

  total() {
    return this.articles.reduce((somme, a) => somme + a.prix * a.qte, 0);
  }

  vider() {
    this.articles = [];
  }

  contient(nom) {
    return this.articles.some((a) => a.nom === nom);
  }

  get nbArticles() {
    return this.articles.length;
  }
}

module.exports = { Panier };

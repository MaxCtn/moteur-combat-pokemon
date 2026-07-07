describe("HUD de combat Pokémon - tests E2E", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("affiche l'état initial du combat", () => {
    cy.get('[data-cy="attaquant-hp"]').should("have.text", "100");
    cy.get('[data-cy="cible-hp"]').should("have.text", "100");
    cy.get('[data-cy="tour"]').should("have.text", "Tour 1");
    cy.get('[data-cy="btn-attaque"]').should("be.enabled");
  });

  it("applique une attaque nominale et met à jour le HUD", () => {
    cy.intercept("POST", "**/combat/degats").as("attaque");

    cy.get('[data-cy="base-input"]').clear().type("20");
    cy.get('[data-cy="btn-attaque"]').click();

    cy.wait("@attaque").its("response.statusCode").should("eq", 200);
    cy.get('[data-cy="cible-hp"]').should("have.text", "60");
    cy.get('[data-cy="tour"]').should("have.text", "Tour 2");
    cy.get('[data-cy="log-entry"]').first().should("contain", "Super efficace");
  });

  it("affiche la bannière KO quand la cible tombe à zéro", () => {
    cy.intercept("POST", "**/combat/degats", {
      statusCode: 200,
      body: { degats: 100 },
    }).as("attaque");

    cy.get('[data-cy="btn-attaque"]').click();

    cy.wait("@attaque");
    cy.get('[data-cy="banniere"]').should("contain", "KO");
  });

  it("ne modifie rien quand l'API répond 400", () => {
    cy.intercept("POST", "**/combat/degats", {
      statusCode: 400,
      body: { erreur: "Requete de combat invalide" },
    }).as("attaque");

    cy.get('[data-cy="btn-attaque"]').click();

    cy.wait("@attaque");
    cy.get('[data-cy="cible-hp"]').should("have.text", "100");
  });

  it("envoie le contrat d'API attendu au serveur", () => {
    cy.intercept("POST", "**/combat/degats").as("attaque");

    cy.attaquer(20);

    cy.wait("@attaque").then(({ request }) => {
      expect(request.body).to.deep.equal({ type: "feu", cible: "plante", base: 20 });
    });
  });
});

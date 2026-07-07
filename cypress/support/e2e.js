Cypress.Commands.add("attaquer", (base) => {
  cy.get('[data-cy="base-input"]').clear().type(String(base));
  cy.get('[data-cy="btn-attaque"]').click();
});

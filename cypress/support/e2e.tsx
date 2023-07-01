// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
before(() => {
  cy.intercept(
    {
      method: 'GET',
      url: 'https://app.ngahuha-map-dev.com:8080/plant',
    },
    { fixture: 'plants.json' },
  ).as('getPlants');
  cy.intercept(
    {
      method: 'GET',
      url: 'https://app.ngahuha-map-dev.com:8080/garden-area',
    },
    { fixture: 'garden-areas.json' },
  ).as('getGardenAreas');
});

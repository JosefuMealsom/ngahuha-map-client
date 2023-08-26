import { mapViewPage } from '../support/pages/map-view.page';

describe('Map view', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('can filter the plant sites via a search', () => {
    cy.wait(['@getPlants', '@getGardenAreas', '@getPlantSites']);

    mapViewPage.mapFilterInput().type('Cool spec');

    mapViewPage.mapMarkers().should('have.length', 1);
  });
});

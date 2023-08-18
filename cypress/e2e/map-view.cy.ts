import { mapViewPage } from '../support/pages/map-view.page';

describe('Map view', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('can see markers for plant sites on the map', () => {
    cy.wait(['@getPlants', '@getGardenAreas', '@getPlantSites']);

    mapViewPage.locationMarker().should('exist');
    mapViewPage.mapMarkers().should('have.length', 3);
  });

  it('can filter the plant sites via a search', () => {
    cy.wait(['@getPlants', '@getGardenAreas', '@getPlantSites']);

    mapViewPage.mapFilterInput().type('Cool spec');

    mapViewPage.mapMarkers().should('have.length', 1);
  });
});

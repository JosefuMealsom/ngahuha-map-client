import { mapViewPage } from '../support/pages/map-view.page';

describe('Map view', () => {
  describe('user not logged in', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('can filter the plant sites via a search', () => {
      cy.wait(['@getPlants', '@getGardenAreas', '@getPlantSites']);

      mapViewPage.mapFilterInput().type('Cool spec');

      mapViewPage.mapMarkers().should('have.length', 1);
    });

    it('does not show functionality only a logged in user has access to', () => {
      mapViewPage.addNewModelButton().should('not.exist');
      mapViewPage.pendingUploadsButton().should('not.exist');
      mapViewPage.createPlantButton().should('not.exist');
    });
  });

  describe('user logged in', () => {
    beforeEach(() => {
      cy.login();
      cy.visit('/');
    });

    it('shows functionality only a logged in user has access to ', () => {
      mapViewPage.addNewModelButton().should('exist');
    });
  });
});

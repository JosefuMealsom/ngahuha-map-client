import { newPlantSitePage } from '../support/pages/new-plant-site.page';
import { stubGeolocation } from '../support/stubs/geolocation';

describe('Add new plant site for upload', () => {
  before(() => {
    stubGeolocation();
  });

  it('adds a plant site with a photo to be uploaded later', () => {
    cy.wait(['@getPlants', '@getGardenAreas']);

    //required for the live query hooks to populate the data correctly in the form
    cy.wait(300);

    //@ts-ignore https://docs.cypress.io/api/commands/selectfile?ref=cypress.io#From-a-fixture
    cy.fixture('ngahuha.png', { encoding: null }).as('plantSitePhoto');

    newPlantSitePage.openFormButton().click();
    cy.contains('Add a new location');
    newPlantSitePage.plantSearchAutocomplete().type('Cool spec');

    cy.contains('Cool species');
    newPlantSitePage.autoCompleteEntry('Cool species').click();
    newPlantSitePage.takePhotoButton().selectFile('@plantSitePhoto');
    newPlantSitePage.saveButton().click();

    cy.contains('Add a new location').should('not.be.visible');
  });
});

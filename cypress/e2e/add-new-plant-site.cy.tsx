import { newPlantSitePage } from '../support/pages/new-plant-site.page';
import { pendingUploadPage } from '../support/pages/pending-upload.page';
import { stubWatchPosition } from '../support/stubs/geolocation';

describe('Add new plant site for upload', () => {
  beforeEach(() => {
    cy.visit('/', {
      onBeforeLoad(window) {
        stubWatchPosition(window, 123, 456, 888);
      },
    });
  });

  it('adds a plant site with a photo to be uploaded later', () => {
    cy.wait(['@getPlants', '@getGardenAreas']);

    //required for the live query hooks to populate the data correctly in the form
    cy.wait(300);

    //@ts-ignore https://docs.cypress.io/api/commands/selectfile?ref=cypress.io#From-a-fixture
    cy.fixture('images/ngahuha.png', { encoding: null }).as('plantSitePhoto1');
    cy.fixture('images/lemons.jpeg', { encoding: null }).as('plantSitePhoto2');

    newPlantSitePage.openFormButton().click();
    cy.contains('Add a new location');
    newPlantSitePage.plantSearchInput().type('Cool spec');

    cy.contains('Cool species');
    newPlantSitePage.autoCompleteEntry('Cool species').click();
    newPlantSitePage.takePhotoButton().selectFile('@plantSitePhoto1');
    newPlantSitePage.takePhotoButton().selectFile('@plantSitePhoto2');

    newPlantSitePage.plantFormPhotos().should('have.length', 2);

    cy.contains('123');
    cy.contains('456');
    cy.contains('Accurate to within 888.00m');
    newPlantSitePage.saveButton().click();

    pendingUploadPage.pendingUploadsButton().click();
    cy.contains('Pending changes');
    cy.contains('Cool species');
  });

  it('can remove a taken photo on the photo form', () => {
    cy.wait(['@getPlants', '@getGardenAreas']);

    //required for the live query hooks to populate the data correctly in the form
    cy.wait(300);

    //@ts-ignore https://docs.cypress.io/api/commands/selectfile?ref=cypress.io#From-a-fixture
    cy.fixture('images/ngahuha.png', { encoding: null }).as('plantSitePhoto1');
    cy.fixture('images/lemons.jpeg', { encoding: null }).as('plantSitePhoto2');

    newPlantSitePage.openFormButton().click();
    cy.contains('Add a new location');
    newPlantSitePage.plantSearchInput().type('Cool spec');

    cy.contains('Cool species');
    newPlantSitePage.autoCompleteEntry('Cool species').click();
    newPlantSitePage.takePhotoButton().selectFile('@plantSitePhoto1');
    newPlantSitePage.takePhotoButton().selectFile('@plantSitePhoto2');

    newPlantSitePage.removePhotoButtons().should('have.length', 2);
    newPlantSitePage.removePhotoButtons().first().click();

    newPlantSitePage.plantFormPhotos().should('have.length', 1);
  });

  it('can add a plant site without a name', () => {
    cy.wait(['@getPlants', '@getGardenAreas']);

    //required for the live query hooks to populate the data correctly in the form
    cy.wait(300);

    //@ts-ignore https://docs.cypress.io/api/commands/selectfile?ref=cypress.io#From-a-fixture
    cy.fixture('images/ngahuha.png', { encoding: null }).as('plantSitePhoto1');

    newPlantSitePage.openFormButton().click();
    newPlantSitePage.takePhotoButton().selectFile('@plantSitePhoto1');

    cy.contains(
      'Note: You can save the plant site now, but you will need to identify it',
    );
    cy.contains('Accurate to within 888.00m');
    newPlantSitePage.saveButton().click();

    pendingUploadPage.pendingUploadsButton().click();
    cy.contains('Pending changes');
    cy.contains('Requires identification');
    cy.contains('Missing information');
  });
});

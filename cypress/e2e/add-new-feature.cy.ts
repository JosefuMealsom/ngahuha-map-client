import { createFeaturePage } from '../support/pages/create-feature.page';
import { pendingUploadPage } from '../support/pages/pending-upload.page';
import { stubWatchPosition } from '../support/stubs/geolocation';

describe('Add new feature for upload', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/feature/new', {
      onBeforeLoad(window) {
        stubWatchPosition(window, 123, 456, 888);
      },
    });
  });

  it('adds a feature with a photo to be uploaded later', () => {
    cy.fixture('images/ngahuha.png', null).as('plantSitePhoto1');
    cy.fixture('images/lemons.jpeg', null).as('plantSitePhoto2');

    cy.contains('Create a new feature');
    createFeaturePage.nameInput().type('My cool feature');
    createFeaturePage
      .descriptionInput()
      .type('### Wow this is so interesting!');

    createFeaturePage.takePhotoButton().selectFile('@plantSitePhoto1');
    createFeaturePage.takePhotoButton().selectFile('@plantSitePhoto2');

    createFeaturePage.featurePhotos().should('have.length', 2);

    createFeaturePage.lockOnLocationButton().click();
    createFeaturePage.finishLockOnButton().click();

    cy.contains('123');
    cy.contains('456');
    cy.contains('Accurate to within 888.00m');
    createFeaturePage.createFeatureButton().click();

    pendingUploadPage.pendingUploadsButton().click();
    cy.contains('Upload changes');
    cy.contains('My cool feature');
  });
});

import { pendingUploadPage } from '../support/pages/pending-upload.page';
import { plantFormPage as editPlantSitePage } from '../support/pages/plant-form.page';
import { seed } from '../support/indexed-db-seeder';
import { stubWatchPosition } from '../support/stubs/geolocation';

function seedOfflineDatabase() {
  seed({
    plants: [
      { id: 'abcdef', species: 'The best species', cultivar: 'radical' },
    ],
    plantSiteUploads: [
      { id: 1, plantId: undefined, photos: [{ data: new ArrayBuffer(8) }] },
    ],
    gardenAreas: [{ name: 'Other' }],
  });
}

describe('Editing a plant site before upload', () => {
  beforeEach(() => {
    cy.login();
    seedOfflineDatabase();

    cy.visit('/', {
      onBeforeLoad(window) {
        stubWatchPosition(window, 123, 456, 888);
      },
    });
  });

  it('can edit the information on a plant site', () => {
    pendingUploadPage.pendingUploadsButton().click();

    cy.contains('Missing information');

    pendingUploadPage.editButtonForPlantSiteId('1').click();
    cy.contains('Edit plant site 1');
    editPlantSitePage.plantSearchInput().type('The best');

    cy.contains("The best species 'radical'");

    editPlantSitePage.autoCompleteEntry("The best species 'radical'").click();
    editPlantSitePage.saveButton().click();

    cy.contains('Upload changes');
    cy.contains('Plant sites ready for upload');
    cy.contains("The best species 'radical'");
  });
});

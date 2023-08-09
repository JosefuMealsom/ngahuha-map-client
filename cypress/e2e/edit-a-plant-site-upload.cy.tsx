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
    cy.contains('Edit an plant site upload');
    editPlantSitePage.plantSearchInput().type('The best');

    cy.contains("The best species 'radical'");

    editPlantSitePage.autoCompleteEntry("The best species 'radical'").click();
    editPlantSitePage.saveButton().click();

    cy.contains('Pending changes');
    cy.contains('Ready for upload');
    cy.contains("The best species 'radical'");
  });
});

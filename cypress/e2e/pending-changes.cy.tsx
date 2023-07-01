import { pendingUploadPage } from '../support/pages/pending-upload.page';
import { stubLastModifiedQueries } from '../support/stubs/server';
import { seed } from '../support/indexed-db-seeder';

function seedOfflineDatabase() {
  seed({
    plants: [
      {
        id: '12345',
        species: 'The best species',
        cultivar: 'radical',
      },
    ],
    plantSiteUploads: [{ id: 1, plantId: '12345' }],
    plantSitePhotoUploads: [{ plantSiteId: 1 }],
  });
}

describe('View changes on plant sites', () => {
  before(() => {
    seedOfflineDatabase();
    stubLastModifiedQueries();
    cy.visit('/');
  });
  it('deletes a plant site from the list', () => {
    pendingUploadPage.pendingUploadsButton().click();

    pendingUploadPage.deleteButtonFor("The best species 'radical'").click();

    cy.contains("The best species 'radical'").should('not.exist');
  });
});

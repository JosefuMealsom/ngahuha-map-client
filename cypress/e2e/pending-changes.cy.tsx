import { pendingUploadPage } from '../support/pages/pending-upload.page';
import { stubLastModifiedQueries } from '../support/stubs/server';
import offlineDatabase from '../../src/services/offline.database';
import PlantSiteUploadFactory from '../../src/test-helpers/factories/plant-site-upload';
import PlantFactory from '../../src/test-helpers/factories/plant';

function seedOfflineDatabase() {
  offlineDatabase.plant.add(
    PlantFactory.create({
      id: '12345',
      species: 'The best species',
      cultivar: 'radical',
    }),
  );

  offlineDatabase.plantSiteUpload.add(
    PlantSiteUploadFactory.create({ id: 1, plantId: '12345' }),
  );

  offlineDatabase.plantSitePhotoUpload.add({
    data: new Blob(),
    plantSiteId: 1,
  });
}

describe('View changes on plant sites', () => {
  before(() => {
    stubLastModifiedQueries();
    seedOfflineDatabase();
    cy.visit('/');
  });
  it('deletes a plant site from the list', () => {
    pendingUploadPage.pendingUploadsButton().click();

    pendingUploadPage.deleteButtonFor("The best species 'radical'").click();

    cy.contains("The best species 'radical'").should('not.exist');
  });
});

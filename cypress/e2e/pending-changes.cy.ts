import { pendingUploadPage } from '../support/pages/pending-upload.page';
import { seed } from '../support/indexed-db-seeder';
import {
  stubBlobUpload,
  stubPresignedUrlsAndReturn,
} from '../support/stubs/plant-site-api';

function seedOfflineDatabase() {
  seed({
    plants: [
      { id: 'abcdef', species: 'The best species', cultivar: 'radical' },
      { id: '12345', species: 'The worst species', cultivar: 'lame' },
    ],
    plantSiteUploads: [
      { id: 1, plantId: 'abcdef', photos: [{ data: new ArrayBuffer(8) }] },
      { id: 2, plantId: undefined, photos: [{ data: new ArrayBuffer(8) }] },
    ],
    gardenAreas: [{ name: 'Other' }],
  });
}

describe('Plant sites waiting to be uploaded', () => {
  beforeEach(() => {
    cy.login();
    seedOfflineDatabase();
    stubPresignedUrlsAndReturn({
      blobKey: 'mr blobby',
      url: 'https://coolupload.com',
    });
    stubBlobUpload();

    cy.visit('/');
  });

  describe('Uploading plant sites', () => {
    beforeEach(() => {
      const expectedJSON = {
        accuracy: 30,
        latitude: 10,
        longitude: 20,
        plantId: 'abcdef',
        plantSitePhotos: [{ blobKey: 'mr blobby' }],
        gardenAreaId: 'my garden area id',
      };
      cy.intercept(
        {
          url: 'https://app.ngahuha-map-dev.com:8080/plant-site',
          method: 'POST',
        },
        (req) => {
          expect(req.body).to.eql(expectedJSON);
          req.reply([]);
        },
      ).as('uploadPlantSites');
    });

    it('uploads the plant sites that are ready to upload to the server', () => {
      pendingUploadPage.pendingUploadsButton().click();
      pendingUploadPage.uploadToServerButton().click();

      cy.wait('@uploadPlantSites');

      cy.contains("The best species 'radical'").should('not.exist');
    });
  });

  it('deletes a plant site from the list', () => {
    pendingUploadPage.pendingUploadsButton().click();
    pendingUploadPage.deleteButtonForPlantSiteId('1').click();
    cy.contains("The best species 'radical'").should('not.exist');
  });

  it('does not delete plant site uploads when the upload fails and shows a message', () => {
    cy.intercept('POST', 'https://app.ngahuha-map-dev.com:8080/plant-site', {
      statusCode: 500,
    }).as('uploadPlantSites');

    pendingUploadPage.pendingUploadsButton().click();
    pendingUploadPage.uploadToServerButton().click();

    cy.wait('@uploadPlantSites');

    cy.wait(500);

    cy.contains('An error occured when uploading to the server');
    cy.contains("The best species 'radical'");
  });
});

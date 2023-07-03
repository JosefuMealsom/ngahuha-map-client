import { pendingUploadPage } from '../support/pages/pending-upload.page';
import { seed } from '../support/indexed-db-seeder';

function seedOfflineDatabase() {
  seed({
    plants: [
      { id: 'abcdef', species: 'The worst species', cultivar: 'lame' },
      { id: '12345', species: 'The best species', cultivar: 'radical' },
    ],
    plantSiteUploads: [
      { id: 1, plantId: 'abcdef' },
      { id: 2, plantId: '12345' },
    ],
    plantSitePhotoUploads: [{ plantSiteUploadId: 1 }, { plantSiteUploadId: 2 }],
    gardenAreas: [{ name: 'Other' }],
  });
}

describe('Plant sites waiting to be uploaded', () => {
  const expectedJSON = [
    {
      accuracy: 30,
      latitude: 10,
      longitude: 20,
      plantId: 'abcdef',
      plantSitePhotos: [{ blobKey: 'mr blobby' }],
      gardenAreaId: 'my garden area id',
    },
    {
      accuracy: 30,
      latitude: 10,
      longitude: 20,
      plantId: '12345',
      plantSitePhotos: [{ blobKey: 'mr blobby' }],
      gardenAreaId: 'my garden area id',
    },
  ];
  beforeEach(() => {
    seedOfflineDatabase();
    cy.intercept(
      'https://app.ngahuha-map-dev.com:8080/blob/presigned-upload-url',
      {
        statusCode: 200,
        body: { blobKey: 'mr blobby', url: 'https://coolupload.com' },
      },
    );
    cy.intercept(
      { method: 'PUT', url: 'https://coolupload.com' },
      { statusCode: 200 },
    );

    cy.visit('/');
  });

  it('uploads the plant sites to the server', () => {
    cy.intercept(
      {
        url: 'https://app.ngahuha-map-dev.com:8080/plant-site/bulk',
        method: 'POST',
      },
      (req) => {
        expect(req.body).to.eql(expectedJSON);
        req.reply([]);
      },
    ).as('uploadPlantSites');
    pendingUploadPage.pendingUploadsButton().click();
    pendingUploadPage.uploadToServerButton().click();

    cy.wait('@uploadPlantSites');

    cy.contains("The worst species 'lame'").should('not.exist');
    cy.contains("The best species 'radical'").should('not.exist');
  });

  it('deletes a plant site from the list', () => {
    pendingUploadPage.pendingUploadsButton().click();
    pendingUploadPage.deleteButtonFor("The worst species 'lame'").click();
    cy.contains("The worst species 'lame'").should('not.exist');
  });
});

import { pendingUploadPage } from '../support/pages/pending-upload.page';
import { seed } from '../support/indexed-db-seeder';
import {
  stubBlobUpload,
  stubPresignedUrlsAndReturn,
} from '../support/stubs/plant-site-api';

function seedOfflinePlantSites() {
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

function seedOfflineFeatures() {
  seed({
    featureUploads: [
      { id: 1, name: 'Wonderful feature', description: 'Cool description' },
    ],
    featurePhotoUploads: [{ id: 1, featureUploadId: 1 }],
  });
}

describe('Plant sites waiting to be uploaded', () => {
  beforeEach(() => {
    cy.login();
    seedOfflinePlantSites();
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

describe.only('Features waiting to be uploaded', () => {
  beforeEach(() => {
    cy.login();
    seedOfflineFeatures();
    stubPresignedUrlsAndReturn({
      blobKey: 'mr blobby',
      url: 'https://coolupload.com',
    });
    stubBlobUpload();

    cy.visit('/');
  });

  describe('Uploading features', () => {
    beforeEach(() => {
      const expectedJSON = {
        name: 'Wonderful feature',
        description: 'Cool description',
        latitude: 10,
        longitude: 20,
        accuracy: 30,
        featurePhotos: [{ blobKey: 'mr blobby' }],
      };
      cy.intercept(
        {
          url: 'https://app.ngahuha-map-dev.com:8080/feature',
          method: 'POST',
        },
        (req) => {
          expect(req.body).to.eql(expectedJSON);
          req.reply([]);
        },
      ).as('uploadFeatures');
    });

    it('uploads the features to the server', () => {
      pendingUploadPage.pendingUploadsButton().click();
      pendingUploadPage.uploadToServerButton().click();

      cy.wait('@uploadFeatures');

      cy.wait(500);

      cy.contains('Wonderful feature').should('not.exist');
    });
  });

  it('deletes a feature from the list', () => {
    pendingUploadPage.pendingUploadsButton().click();
    pendingUploadPage.deleteButtonForFeatureId('1').click();
    cy.contains('Wonderful feature').should('not.exist');
  });

  it('does not delete feature when the upload fails and shows a message', () => {
    cy.intercept('POST', 'https://app.ngahuha-map-dev.com:8080/feature', {
      statusCode: 500,
    }).as('uploadFeatures');

    pendingUploadPage.pendingUploadsButton().click();
    pendingUploadPage.uploadToServerButton().click();

    cy.wait('@uploadFeatures');

    cy.contains('An error occured when uploading to the server');
    cy.contains('Wonderful feature');
  });
});

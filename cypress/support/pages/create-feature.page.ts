export const createFeaturePage = {
  nameInput: () => {
    return cy.get('[data-cy="feature-name-input"]');
  },

  descriptionInput: () => {
    return cy.dataCy('markdown-content-input');
  },

  takePhotoButton: () => {
    return cy.get('[data-cy="add-photo"]');
  },

  featurePhotos: () => {
    return cy.get('[data-cy="photo-form-photo"]');
  },

  lockOnLocationButton: () => {
    return cy.get('[data-cy="lock-on-location-button"]');
  },

  finishLockOnButton: () => {
    return cy.get('[data-cy="finish-lock-on-button"]');
  },

  createFeatureButton: () => {
    return cy.get('[data-cy="create-feature"]');
  },
};

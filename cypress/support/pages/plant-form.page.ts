const plantSearchAutocompleteContainer = () => {
  return cy.get('[data-cy="plant-form-autocomplete-container"]');
};

const plantSearchInput = () => {
  return plantSearchAutocompleteContainer().find('input');
};

const autoCompleteEntry = (entryText: string) => {
  return plantSearchAutocompleteContainer()
    .find('[data-cy="autocomplete-entry"]')
    .contains(entryText);
};

const takePhotoButton = () => {
  return cy.get('[data-cy="add-photo"]');
};

const saveButton = () => {
  return cy.get('[data-cy="save-plant-site"]');
};

const plantFormPhotos = () => {
  return cy.get('[data-cy="photo-form-photo"]');
};

const removePhotoButtons = () => {
  return cy.get('[data-cy="remove-photo-button"]');
};

const lockOnLocationButton = () => {
  return cy.get('[data-cy="lock-on-location-button"]');
};

const finishLockOnButton = () => {
  return cy.get('[data-cy="finish-lock-on-button"]');
};

export const plantFormPage = {
  plantSearchInput,
  autoCompleteEntry,
  takePhotoButton,
  saveButton,
  plantFormPhotos,
  removePhotoButtons,
  lockOnLocationButton,
  finishLockOnButton,
};

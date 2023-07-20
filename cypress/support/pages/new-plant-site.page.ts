export const newPlantSitePage = {
  openFormButton: () => {
    return cy.contains('.border-solid.border-black.bg-white', 'New plant site');
  },

  plantSearchAutocomplete: () => {
    return cy.get('.w-full.py-2.px-2.border.border-gray-400.rounded-md');
  },

  autoCompleteEntry: (entryText: string) => {
    return cy.contains('.absolute.top-0.bg-white.drop-shadow-lg', entryText);
  },

  takePhotoButton: () => {
    return cy.get('[data-cy="add-photo"]');
  },

  saveButton: () => {
    return cy.get('[data-cy="save-plant-site"]');
  },

  plantFormImageContainer: () => {
    return cy.get('[data-cy="plant-form-images"]');
  },
};

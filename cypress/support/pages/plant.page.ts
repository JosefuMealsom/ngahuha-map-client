export const plantPage = {
  toggleEditButton: () => {
    return cy.dataCy('plant-toggle-edit');
  },

  markdownInput: () => {
    return cy.dataCy('markdown-content-input');
  },

  speciesInput: () => {
    return cy.dataCy('species-input');
  },

  subSpeciesInput: () => {
    return cy.dataCy('subspecies-input');
  },

  typesInput: () => {
    return cy.dataCy('types-input');
  },

  tagsInput: () => {
    return cy.dataCy('tags-input');
  },

  commonNamesInput: () => {
    return cy.dataCy('common-names-input');
  },

  updatePlant: () => {
    return cy.dataCy('save-plant');
  },
};

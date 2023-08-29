export const createNewPlant = {
  speciesInput: () => {
    return cy.get('[data-cy="species-input"]');
  },

  subSpeciesInput() {
    return cy.get(`[data-cy="subspecies-input"]`);
  },

  descriptionInput: () => {
    return cy.dataCy('markdown-content-input');
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

  createPlantButton: () => {
    return cy.get('[data-cy="create-plant"]');
  },
};

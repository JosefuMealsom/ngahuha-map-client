export const createNewPlant = {
  speciesInput: () => {
    return cy.get('[data-cy="species-input"]');
  },

  subSpeciesInput() {
    return cy.get(`[data-cy="subspecies-input"]`);
  },

  descriptionInput() {
    return cy.get(`[data-cy="description-input"]`);
  },

  craetePlantButton: () => {
    return cy.get('[data-cy="create-plant"]');
  },
};

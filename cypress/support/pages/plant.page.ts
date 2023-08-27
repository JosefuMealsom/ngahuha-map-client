export const plantPage = {
  toggleEditButton: () => {
    return cy.dataCy('plant-toggle-edit');
  },

  saveDescriptionButton: () => {
    return cy.dataCy('markdown-save-button');
  },

  markdownInput: () => {
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

  updateExtendedInfoInput: () => {
    return cy.dataCy('save-extended-info');
  },
};

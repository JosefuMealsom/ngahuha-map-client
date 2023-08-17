export const plantPage = {
  toggleDescriptionButton: () => {
    return cy.get('[data-cy="markdown-toggle-edit"]');
  },

  saveDescriptionButton: () => {
    return cy.get('[data-cy="markdown-save-button"]');
  },

  markdownInput: () => {
    return cy.get('[data-cy="markdown-content-input"]');
  },

  typesInput: () => {
    return cy.get('[data-cy="types-input"]');
  },

  tagsInput: () => {
    return cy.get('[data-cy="tags-input"]');
  },

  commonNamesInput: () => {
    return cy.get('[data-cy="common-names-input"]');
  },

  updateExtendedInfoInput: () => {
    return cy.get('[data-cy="save-extended-info"]');
  },
};

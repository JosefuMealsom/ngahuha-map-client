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
};

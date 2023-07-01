export const pendingUploadPage = {
  pendingUploadsButton: () => {
    return cy.contains(
      '.border-solid.border-black.bg-white',
      'Pending changes',
    );
  },

  deleteButtonFor(species: string) {
    return cy.contains('p', species).parent().contains('button', 'Delete');
  },
};

export const pendingUploadPage = {
  pendingUploadsButton: () => {
    return cy.contains(
      '.border-solid.border-black.bg-white',
      'Pending changes',
    );
  },
};

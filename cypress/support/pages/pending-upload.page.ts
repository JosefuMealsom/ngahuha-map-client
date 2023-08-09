export const pendingUploadPage = {
  pendingUploadsButton: () => {
    return cy.get('[data-cy="open-upload-form"]');
  },

  deleteButtonForPlantSiteId(plantSiteId: string) {
    return cy.get(`[data-cy="delete-plant-${plantSiteId}"]`);
  },

  editButtonForPlantSiteId(plantSiteId: string) {
    return cy.get(`[data-cy="edit-plant-${plantSiteId}"]`);
  },

  uploadToServerButton: () => {
    return cy.get('[data-cy="upload-plants"]');
  },
};

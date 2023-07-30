export const closestPlantsPage = {
  closestPlantsButton: () => {
    return cy.get('[data-cy="open-closest-plants"]');
  },

  closestPlantSiteItem: (plantSiteId: string) => {
    return cy.get(`[data-cy="closest-plant-site-${plantSiteId}"]`);
  },
};

export const plantListPage = {
  showClosestPlantsButton: () => {
    return cy.get('[data-cy="show-closest-plants"]');
  },

  showAllPlantsButton: () => {
    return cy.get('[data-cy="show-all-plants"]');
  },

  plantItem: (itemId: string) => {
    return cy.get(`[data-cy="plant-item-${itemId}"]`);
  },

  closestPlantSiteItem: (plantSiteId: string) => {
    return cy.get(`[data-cy="closest-plant-site-${plantSiteId}"]`);
  },

  searchBox: () => {
    return cy.get(`[data-cy="plant-list-search"]`).find('input');
  },
};

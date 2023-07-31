export const plantListPage = {
  plantListButton: () => {
    return cy.get('[data-cy="open-plant-list"]');
  },

  plantItem: (itemId: string) => {
    return cy.get(`[data-cy="plant-item-${itemId}"]`);
  },
};

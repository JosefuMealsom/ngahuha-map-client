describe('Error page', () => {
  beforeEach(() => {
    cy.visit('/a-non-existent-route');
  });

  it('shows a page with the error', () => {
    cy.contains('Oops!');
    cy.contains('Sorry, an unexpected error has occurred.');
    cy.contains('404: Not Found');
  });
});

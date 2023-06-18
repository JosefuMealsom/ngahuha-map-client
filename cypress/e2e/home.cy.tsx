describe('Home page', () => {
  beforeEach(() => {
    cy.stub(navigator.geolocation.getCurrentPosition);
    cy.visit('/');
  });

  it('displays the connection status', function () {
    cy.contains('Connection status');
  });
});

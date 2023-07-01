export const stubGeolocation = () => {
  cy.fixture('location.json').as('fakeLocation');
  cy.get('@fakeLocation').then((fakeLocation) => {
    cy.visit('/', {
      onBeforeLoad(win) {
        cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake(
          (cb) => {
            return cb(fakeLocation);
          },
        );
      },
    });
  });
};

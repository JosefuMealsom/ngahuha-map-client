Cypress.Commands.add('dataCy', (value) => {
  return cy.get(`[data-cy=${value}]`);
});

Cypress.Commands.add(
  'login',
  (user = { email: 'joe@joe.com', password: 'password' }) => {
    cy.session(user, () => {
      cy.intercept(
        {
          method: 'POST',
          url: 'https://app.ngahuha-map-dev.com:8080/auth/login',
        },
        { statusCode: 200 },
      ).as('login');

      cy.visit('/login');
      cy.dataCy('login-email-input').type(user.email);
      cy.dataCy('login-password-input').type(user.password);
      cy.dataCy('login-button').click();
      cy.wait('@login');

      // Can't figure out how to get cypress to set the token
      // via set-cookie, potentially its an origin issue?
      cy.setCookie('accessToken', 'wowthistokenisrad!');
    });
  },
);

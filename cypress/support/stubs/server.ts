export const stubServerData = () => {
  cy.intercept(
    {
      method: 'GET',
      url: 'https://app.ngahuha-map-dev.com:8080/plant',
    },
    { fixture: 'plants.json' },
  ).as('getPlants');
  cy.intercept(
    {
      method: 'GET',
      url: 'https://app.ngahuha-map-dev.com:8080/garden-area',
    },
    { fixture: 'garden-areas.json' },
  ).as('getGardenAreas');
};

export const stubLastModifiedQueries = () => {
  cy.intercept(
    {
      method: 'GET',
      url: 'https://app.ngahuha-map-dev.com:8080/plant?lastModified=*',
    },
    [],
  );
  cy.intercept(
    {
      method: 'GET',
      url: 'https://app.ngahuha-map-dev.com:8080/garden-area?lastModified=*',
    },
    [],
  );
};

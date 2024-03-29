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
  cy.intercept(
    {
      method: 'GET',
      url: 'https://app.ngahuha-map-dev.com:8080/plant-site',
    },
    { fixture: 'plant-sites.json' },
  ).as('getPlantSites');
  cy.intercept(
    {
      method: 'GET',
      url: 'https://app.ngahuha-map-dev.com:8080/plant-site-photo',
    },
    [],
  );
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
      url: 'https://app.ngahuha-map-dev.com:8080/plant-site?lastModified=*',
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
  cy.intercept(
    {
      method: 'GET',
      url: 'https://app.ngahuha-map-dev.com:8080/plant-site-photo?lastModified=*',
    },
    [],
  );
};

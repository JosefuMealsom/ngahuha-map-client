import { createNewPlant } from '../support/pages/create-plant.page';
import { plantListPage } from '../support/pages/plant-list.page';

describe('Create new plant page', () => {
  beforeEach(() => {
    cy.visit('/plants/new');
  });

  it('can create a new plant', () => {
    cy.intercept('POST', 'https://app.ngahuha-map-dev.com:8080/plant', {
      statusCode: 200,
      body: {
        id: 'abcdef',
        species: 'Cool species',
        cultivar: 'lame',
        description: '### Wow! This is so cool!',
      },
    }).as('createPlant');

    createNewPlant.speciesInput().type('Cool species');
    createNewPlant.subSpeciesInput().type('lame');
    createNewPlant.descriptionInput().type('### Wow! This is so cool!');
    createNewPlant.craetePlantButton().click();

    cy.wait('@createPlant');

    plantListPage.plantListButton().click();
    cy.contains("Cool species 'lame'");
  });
});

import { createNewPlant } from '../support/pages/create-plant.page';
import { mapViewPage } from '../support/pages/map-view.page';

describe('Create new plant page', () => {
  beforeEach(() => {
    cy.login();
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
        extendedInfo: {
          types: ['cool', 'type'],
          tags: ['lovely', 'tag'],
          commonNames: ['Bobbys busherino'],
        },
      },
    }).as('createPlant');

    createNewPlant.speciesInput().type('Cool species');
    createNewPlant.subSpeciesInput().type('lame');
    createNewPlant.descriptionInput().type('### Wow! This is so cool!');
    createNewPlant.typesInput().type('cool,  type');
    createNewPlant.tagsInput().type('lovely,  tag');
    createNewPlant.commonNamesInput().type('Bobbys busherino');
    createNewPlant.createPlantButton().click();

    cy.wait('@createPlant');

    cy.contains('Plant created successfully');
  });

  it('shows an error toast on failure', () => {
    cy.intercept('POST', 'https://app.ngahuha-map-dev.com:8080/plant', {
      statusCode: 500,
    }).as('createPlant');

    createNewPlant.createPlantButton().click();

    cy.wait('@createPlant');

    cy.contains('An error occured when creating the plant');
  });
});

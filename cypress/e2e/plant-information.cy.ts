import { plantPage } from '../support/pages/plant.page';
import { seed } from '../support/indexed-db-seeder';

function seedOfflineDatabase() {
  seed({
    plants: [
      {
        id: 'abcdef',
        species: 'The worst species',
        cultivar: 'lame',
        description: '### Description\n\nVery interesting!',
        extendedInfo: undefined,
      },
    ],
    plantSites: [{ plantId: 'abcdef' }],
  });
}

describe('Plant information page', () => {
  beforeEach(() => {
    seedOfflineDatabase();
    cy.login();
    cy.visit('/plants/abcdef');
  });

  it('shows information about the plant', () => {
    cy.contains("The worst species 'lame'");
    cy.contains('Description');
    cy.contains('Very interesting!');
  });

  it('can edit the plant information', () => {
    cy.intercept('PATCH', 'https://app.ngahuha-map-dev.com:8080/plant/abcdef', {
      statusCode: 200,
      body: {
        id: 'abcdef',
        species: 'The new and improved worst species',
        cultivar: 'A bit less lame',
        description: '### Wow! This is so cool!',
        extendedInfo: {
          tags: ['yummy', 'german'],
          types: ['sausage plant'],
          commonNames: ['totally sie wurst'],
        },
      },
    }).as('updatePlant');

    plantPage.toggleEditButton().click();

    plantPage.speciesInput().type('The new and improved worst species');
    plantPage.subSpeciesInput().type('A bit less lame');
    plantPage.markdownInput().clear();
    plantPage.markdownInput().type('### Wow! This is so cool!');
    plantPage.typesInput().type('  sausage plant  ');
    plantPage.tagsInput().type(' yummy, german ');
    plantPage.commonNamesInput().type('  totally sie wurst');
    plantPage.updatePlant().click();

    cy.wait('@updatePlant');

    cy.contains('Plant successfully updated');

    cy.reload().then(() => {
      plantPage.toggleEditButton().click();

      plantPage
        .speciesInput()
        .should('have.value', 'The new and improved worst species');
      plantPage.subSpeciesInput().should('have.value', 'A bit less lame');
      plantPage
        .markdownInput()
        .should('have.value', '### Wow! This is so cool!');
      plantPage.typesInput().should('have.value', 'sausage plant');
      plantPage.tagsInput().should('have.value', 'yummy,german');
      plantPage.commonNamesInput().should('have.value', 'totally sie wurst');
    });
  });
});

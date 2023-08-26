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

  it('can edit the plants description in markdown', () => {
    cy.intercept('PATCH', 'https://app.ngahuha-map-dev.com:8080/plant/abcdef', {
      statusCode: 200,
      body: {
        id: 'abcdef',
        species: 'The worst species',
        cultivar: 'lame',
        description: '### Wow! This is so cool!',
      },
    }).as('updateDescription');

    plantPage.toggleDescriptionButton().click();
    plantPage.markdownInput().clear();
    plantPage.markdownInput().type('### Wow! This is so cool!');
    plantPage.saveDescriptionButton().click();

    cy.wait('@updateDescription');

    cy.contains('### Wow! This is so cool!');
    cy.contains('Description successfully updated');
  });

  it('can edit the plants extended info', () => {
    cy.intercept('PATCH', 'https://app.ngahuha-map-dev.com:8080/plant/abcdef', {
      statusCode: 200,
      body: {
        id: 'abcdef',
        species: 'The worst species',
        cultivar: 'lame',
        description: '',
        extendedInfo: {
          tags: ['yummy', 'german'],
          types: ['sausage plant'],
          commonNames: ['totally sie wurst'],
        },
      },
    }).as('updateExtendedInfo');

    plantPage.typesInput().type('  sausage plant  ');
    plantPage.tagsInput().type(' yummy, german ');
    plantPage.commonNamesInput().type('  totally sie wurst');
    plantPage.updateExtendedInfoInput().click();

    cy.wait('@updateExtendedInfo');

    cy.contains('Extended info successfully updated');

    cy.reload().then(() => {
      plantPage.typesInput().should('have.value', 'sausage plant');
      plantPage.tagsInput().should('have.value', 'yummy,german');
      plantPage.commonNamesInput().should('have.value', 'totally sie wurst');
    });
  });
});

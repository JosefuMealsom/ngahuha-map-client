import { plantListPage } from '../support/pages/plant-list.page';
import { seed } from '../support/indexed-db-seeder';
import { stubWatchPosition } from '../support/stubs/geolocation';

function seedOfflineDatabase() {
  seed({
    plants: [
      { id: 'abcdef', species: 'The worst species', cultivar: 'lame' },
      { id: '12345', species: 'The best species', cultivar: 'radical' },
    ],
    plantSites: [
      { plantId: 'abcdef', latitude: -35.375563, longitude: 173.965043 },
    ],
  });
}

describe('Listing all plants in the app', () => {
  beforeEach(() => {
    seedOfflineDatabase();
    cy.visit('/', {
      onBeforeLoad(window) {
        stubWatchPosition(window, -35.375587, 173.964963);
      },
    });
  });

  it('lists all the downloaded plants', () => {
    plantListPage.plantListButton().click();

    cy.contains("The worst species 'lame'");
    cy.contains("The best species 'radical'");
  });

  it('can click on a plant item and be taken to a page with information about it', () => {
    plantListPage.plantListButton().click();

    plantListPage.plantItem('abcdef').click();

    cy.contains("The worst species 'lame'");
    cy.contains('Number of sites');
    cy.contains('1');
    cy.contains('Lorem ipsum');
  });
});
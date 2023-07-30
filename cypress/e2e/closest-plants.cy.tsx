import { closestPlantsPage } from '../support/pages/closest-plants.page';
import { seed } from '../support/indexed-db-seeder';
import { stubWatchPosition } from '../support/stubs/geolocation';

function seedOfflineDatabase() {
  seed({
    plants: [
      { id: 'abcdef', species: 'The worst species', cultivar: 'lame' },
      { id: '12345', species: 'The best species', cultivar: 'radical' },
      {
        id: 'qqqqq',
        species: 'Some far far away plant',
        cultivar: 'very remote',
      },
    ],
    plantSites: [
      { plantId: 'abcdef', latitude: -35.375563, longitude: 173.965043 },
      {
        id: 'best plant site id',
        plantId: '12345',
        latitude: -35.375506,
        longitude: 173.965156,
      },
      { plantId: 'qqqqq', latitude: -35.375204, longitude: 173.966025 },
    ],
  });
}

describe('Showing plant sites closest to the user', () => {
  beforeEach(() => {
    seedOfflineDatabase();
    cy.visit('/', {
      onBeforeLoad(window) {
        stubWatchPosition(window, -35.375587, 173.964963);
      },
    });
  });

  it('lists the plants closest to the user', () => {
    closestPlantsPage.closestPlantsButton().click();

    cy.contains("The worst species 'lame'");
    cy.contains("The best species 'radical'");
    cy.contains("Some far far away plant 'very remote'").should('not.exist');
  });

  it('can click on a plant site item and be taken to a page with information about it', () => {
    closestPlantsPage.closestPlantsButton().click();

    closestPlantsPage.closestPlantSiteItem('best plant site id').click();

    cy.contains("The best species 'radical'");
    cy.contains('Lorem ipsum');
  });
});

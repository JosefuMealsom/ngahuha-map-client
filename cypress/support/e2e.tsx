// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration

import offlineDatabase from '../../src/services/offline.database';
import { stubLastModifiedQueries, stubServerData } from './stubs/server';

// ***********************************************************
beforeEach(() => {
  cy.wrap(Promise.all(offlineDatabase.tables.map((table) => table.clear())));

  stubServerData();
  stubLastModifiedQueries();
});

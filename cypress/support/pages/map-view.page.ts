const mapFilterContainer = () => {
  return cy.dataCy('map-view-filter-container');
};
const mapFilterInput = () => {
  return mapFilterContainer().find('input');
};

const mapFilterEntry = (entryText: string) => {
  return mapFilterContainer()
    .find('[data-cy="autocomplete-entry"]')
    .contains(entryText);
};

const mapMarkers = () => {
  return cy.dataCy('map-marker');
};

const locationMarker = () => {
  return cy.dataCy('location-marker');
};

const addNewModelButton = () => {
  return cy.dataCy('open-add-page');
};

const plantListButton = () => {
  return cy.dataCy('open-plant-list');
};

const pendingUploadsButton = () => {
  return cy.dataCy('open-upload-form');
};

const createPlantButton = () => {
  return cy.dataCy('new-plant-form');
};

export const mapViewPage = {
  addNewModelButton,
  mapFilterInput,
  mapFilterContainer,
  mapFilterEntry,
  mapMarkers,
  locationMarker,
  plantListButton,
  pendingUploadsButton,
  createPlantButton,
};

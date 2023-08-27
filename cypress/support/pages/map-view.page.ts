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

const addNewPlantSiteButton = () => {
  return cy.dataCy('open-plant-form');
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
  addNewPlantSiteButton,
  mapFilterInput,
  mapFilterContainer,
  mapFilterEntry,
  mapMarkers,
  locationMarker,
  plantListButton,
  pendingUploadsButton,
  createPlantButton,
};

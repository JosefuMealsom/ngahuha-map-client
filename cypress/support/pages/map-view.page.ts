const mapFilterContainer = () => {
  return cy.get('[data-cy="map-view-filter-container"]');
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
  return cy.get('[data-cy="map-marker"]');
};

const locationMarker = () => {
  return cy.get('[data-cy="location-marker"]');
};

const addNewPlantSiteButton = () => {
  return cy.get('[data-cy="open-plant-form"]');
};

const plantListButton = () => {
  return cy.get('[data-cy="open-plant-list"]');
};

export const mapViewPage = {
  addNewPlantSiteButton,
  mapFilterInput,
  mapFilterContainer,
  mapFilterEntry,
  mapMarkers,
  locationMarker,
  plantListButton,
};

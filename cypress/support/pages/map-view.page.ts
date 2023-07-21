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

export const mapViewPage = {
  mapFilterInput,
  mapFilterContainer,
  mapFilterEntry,
  mapMarkers,
  locationMarker,
};

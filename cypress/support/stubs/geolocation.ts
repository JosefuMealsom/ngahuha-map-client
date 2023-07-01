export const stubGeolocation = (
  window,
  latitude = 20,
  longitude = 20,
  accuracy = 10,
) => {
  cy.stub(window.navigator.geolocation, 'getCurrentPosition').callsFake(
    (cb) => {
      return cb({
        coords: {
          latitude: latitude,
          longitude: longitude,
          accuracy: accuracy,
        },
      });
    },
  );
};

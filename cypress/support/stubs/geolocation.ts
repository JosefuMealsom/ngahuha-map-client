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

export const stubWatchPosition = (
  window,
  latitude = 20,
  longitude = 20,
  accuracy = 10,
) => {
  cy.stub(window.navigator.geolocation, 'watchPosition').callsFake((cb) => {
    setInterval(() => {
      cb({
        coords: {
          latitude: latitude,
          longitude: longitude,
          accuracy: accuracy,
        },
      });
    }, 200);
  });
};

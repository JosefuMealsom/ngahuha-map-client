// jsdom has many browser apis that are not implemented, so have
// to define them manually if we want to use them in tests
// Important note: using this stub will stub all calls to geolocation position
// on a per file basis. Therefore it is important to clear or restub the values.
// Can also add to a TestContext in the future.
const dummyCoords: GeolocationCoordinates = {
  accuracy: 123,
  altitude: 123,
  altitudeAccuracy: 123,
  heading: 123,
  latitude: 123,
  longitude: 123,
  speed: 123,
};

const dummyPosition: GeolocationPosition = {
  coords: dummyCoords,
  timestamp: 123,
};

const originalNavigator = { ...window.navigator };
const overrideGeolocationCoordinates = (
  position: Partial<GeolocationCoordinates>,
) => {
  Object.assign(dummyCoords, position);
};

const stubGeolocationCoordinates = {
  stub: (coords?: Partial<GeolocationCoordinates>) => {
    if (coords) {
      overrideGeolocationCoordinates(coords);
    }

    Object.assign(window.navigator, {
      geolocation: {
        getCurrentPosition: (success: PositionCallback) => {
          success(dummyPosition);
        },
      },
    });
  },

  clearStub: () => {
    window.navigator = originalNavigator;
  },
};

export default stubGeolocationCoordinates;

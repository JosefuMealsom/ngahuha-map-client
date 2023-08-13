import { GeolocationLockOnComponent } from './GeolocationLockOnComponent';

describe('<GeolocationLockOnComponent />', () => {
  function stubWatchPosition(coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
  }) {
    cy.window().then((win) => {
      cy.stub(win.navigator.geolocation, 'watchPosition').callsFake((cb) => {
        cb({ coords: coords });
      });
    });
  }

  it('locks on and returns the location if the accuracy is better that 5 metres', () => {
    stubWatchPosition({ latitude: 123, longitude: 456, accuracy: 4 });
    const onLockingOnSpy = cy.spy();
    const onGeolocationLockedSpy = cy.spy();

    cy.mount(
      <GeolocationLockOnComponent
        onGeolocationLocked={onGeolocationLockedSpy}
        onLockingOn={onLockingOnSpy}
      />,
    );

    cy.get('[data-cy="lock-on-location-button"]')
      .click()
      .then(() => {
        expect(onLockingOnSpy).to.have.been.called;
      })
      .then(() => {
        expect(onGeolocationLockedSpy).to.have.been.calledWith({
          latitude: 123,
          longitude: 456,
          accuracy: 4,
        });
      });
  });

  it('returns the position when the finish locking on button is clicked', () => {
    stubWatchPosition({ latitude: 123, longitude: 456, accuracy: 10 });
    const onGeolocationLockedSpy = cy.spy();

    cy.mount(
      <GeolocationLockOnComponent
        onGeolocationLocked={onGeolocationLockedSpy}
        onLockingOn={cy.spy()}
      />,
    );

    cy.get('[data-cy="lock-on-location-button"]')
      .click()
      .get('[data-cy="finish-lock-on-button"]')
      .click()
      .then(() => {
        expect(onGeolocationLockedSpy).to.have.been.calledWith({
          latitude: 123,
          longitude: 456,
          accuracy: 10,
        });
      });
  });
});

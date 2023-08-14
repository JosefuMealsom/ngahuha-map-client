import { useEffect, useState } from 'react';

export function GeolocationLockOnComponent(props: {
  onGeolocationLocked: (coords: GeolocationCoordinates) => void;
  onLockingOn?: () => void;
  targetAccuracy?: number;
}) {
  const [geolocationHandlerId, setGeolocationHandlerId] = useState<number>();
  const [livePosition, setLivePosition] = useState<GeolocationCoordinates>();
  const [lockedOnPosition, setLockedOnPosition] =
    useState<GeolocationCoordinates>();
  const [isLockingOn, setIsLockingOn] = useState(false);

  function lockOnLocation() {
    setLivePosition(undefined);
    setLockedOnPosition(undefined);
    setupGelocationWatchHandler();

    if (props.onLockingOn) {
      props.onLockingOn();
    }
  }

  function setupGelocationWatchHandler() {
    const handlerId = navigator.geolocation.watchPosition(
      (position) => {
        setLivePosition(position.coords);
      },
      null,
      {
        enableHighAccuracy: true,
      },
    );

    setGeolocationHandlerId(handlerId);
    setIsLockingOn(true);
  }

  useEffect(() => {
    if (!livePosition) return;

    checkLocationAccuracy(livePosition);
  }, [livePosition]);

  function onGeolocationLockingOnComplete(coords: GeolocationCoordinates) {
    if (geolocationHandlerId) {
      navigator.geolocation.clearWatch(geolocationHandlerId);
    }
    setIsLockingOn(false);
    props.onGeolocationLocked(coords);
  }

  function checkLocationAccuracy(coords: GeolocationCoordinates) {
    if (!lockedOnPosition) {
      setLockedOnPosition(coords);
    }

    if (lockedOnPosition && coords.accuracy < lockedOnPosition.accuracy) {
      setLockedOnPosition(coords);
    }

    if (coords.accuracy < (props.targetAccuracy || 5)) {
      onGeolocationLockingOnComplete(coords);
    }
  }

  function renderLockOnButton() {
    if (isLockingOn) return;

    return (
      <button
        className="bg-red-400 border p-2 text-white hover:bg-gray-300 cursor-pointer rounded-md"
        onClick={lockOnLocation}
        data-cy="lock-on-location-button"
      >
        Lock on location
      </button>
    );
  }

  function renderLockingOnStatus() {
    if (!isLockingOn || !lockedOnPosition) return;

    return (
      <div>
        <p>Locking on location, don't move!</p>
        <p>Current accuracy: {lockedOnPosition?.accuracy.toFixed(0)}</p>
        <button
          className="bg-sky-500 border p-2 hover:bg-gray-300 cursor-pointer mb-2 rounded-md"
          onClick={() => onGeolocationLockingOnComplete(lockedOnPosition)}
          data-cy="finish-lock-on-button"
        >
          Finish locking on
        </button>
      </div>
    );
  }

  return (
    <div>
      {renderLockOnButton()}
      {renderLockingOnStatus()}
    </div>
  );
}

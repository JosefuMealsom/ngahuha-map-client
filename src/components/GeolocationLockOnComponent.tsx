import { useEffect, useState } from 'react';

export function GeolocationLockOnComponent(props: {
  onGeolocationLocked: (coords: GeolocationCoordinates) => void;
  onLockingOn?: () => void;
  triggerOnView?: boolean;
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

    return handlerId;
  }

  useEffect(() => {
    if (props.triggerOnView) {
      const handlerId = setupGelocationWatchHandler();

      return () => {
        navigator.geolocation.clearWatch(handlerId);
      };
    }
  }, []);

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
        className="bg-red-400 border-red-400 border py-2 px-4 text-xs font-semibold text-white cursor-pointer rounded-full"
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
        <button
          className="bg-sky-500 border-sky-500 border py-2 px-4 text-xs font-semibold text-white cursor-pointer rounded-full"
          onClick={() => onGeolocationLockingOnComplete(lockedOnPosition)}
          data-cy="finish-lock-on-button"
        >
          Locking on: accuracy {lockedOnPosition?.accuracy.toFixed(0)}m
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

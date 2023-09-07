import { useEffect, useState } from 'react';
import { useAppStore } from '../store/app.store';
import { LatLong } from '../types/lat-long.type';
import { LoaderSpinnerComponent } from './LoaderSpinnerComponent';

export function GeolocationLockOnComponent(props: {
  onGeolocationLocked: (coords: LatLong) => void;
  onLockingOn?: () => void;
  triggerOnView?: boolean;
  targetAccuracy?: number;
  text?: string;
  lockingOnText?: string;
}) {
  const [isLockingOn, setIsLockingOn] = useState(false);
  const { position } = useAppStore();
  const [livePosition, setLivePosition] = useState(position);
  const [lockedOnPosition, setLockedOnPosition] = useState(position);

  useEffect(() => {
    if (props.triggerOnView) {
      lockOnLocation();
    }
  }, []);

  useEffect(() => {
    setLivePosition(position);
  }, [position]);

  function lockOnLocation() {
    setLivePosition(position);
    setLockedOnPosition(position);
    setIsLockingOn(true);

    if (props.onLockingOn) {
      props.onLockingOn();
    }

    if (position) {
      checkLocationAccuracy(position);
    }
  }

  useEffect(() => {
    if (!livePosition || !isLockingOn) return;
    checkLocationAccuracy(livePosition);
  }, [livePosition]);

  function onGeolocationLockingOnComplete(coords: LatLong) {
    setIsLockingOn(false);
    props.onGeolocationLocked(coords);
  }

  function checkLocationAccuracy(coords: LatLong) {
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
        {props.text || 'Lock on location'}
      </button>
    );
  }

  function renderLockingOnStatus() {
    if (!isLockingOn || !lockedOnPosition) return;

    return (
      <div className="relative inline-block">
        <button
          className="bg-sky-500 border-sky-500 border py-2 px-4 text-xs font-semibold text-white cursor-pointer rounded-full"
          onClick={() => onGeolocationLockingOnComplete(lockedOnPosition)}
          data-cy="finish-lock-on-button"
        >
          <div className="relative pr-5">
            {props.lockingOnText || 'Locking on'}: acc{' '}
            {lockedOnPosition?.accuracy.toFixed(0)}m
          </div>
        </button>
        <span className="absolute right-3 top-1/2 -translate-y-1/2">
          <LoaderSpinnerComponent />
        </span>
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

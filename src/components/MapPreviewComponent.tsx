import { useEffect, useState } from 'react';
import { LocationMarker } from '../pages/MapView/LocationMarker';
import { MapMarker } from '../pages/MapView/MapMarker';
import { MapSvg } from '../pages/MapView/MapSvg';
import { LatLong } from '../types/lat-long.type';
import { PanZoomComponent } from './PanZoomComponent';
import { interpolateToCanvasPosition } from '../services/map-position-interpolator.service';
import { useMapStore } from '../store/map.store';

export const MapPreviewComponent = (props: {
  className?: string;
  locations?: LatLong[];
}) => {
  const [pan, setPan] = useState({ x: -250, y: -600 });

  useEffect(() => {
    if (props.locations && props.locations.length > 0) {
      const newPosition = interpolateToCanvasPosition(
        props.locations[0],
        useMapStore.getState(),
      );

      if (newPosition) {
        // This is currently a number I have randomly chosen to centre the map,
        // which will work visually for now need to figure out the way to do the
        // panning and zoom correctly here.
        setPan({ x: -newPosition.x, y: -newPosition.y - 225 });
      }
    }
  }, []);

  return (
    <div
      className={`${props.className} sm:hidden p-1 rounded-lg overflow-hidden pb-10 select-none`}
    >
      <div className="relative w-full overflow-hidden bg-white h-96">
        <PanZoomComponent
          className="w-full bg-[#96AF98]"
          zoom={1}
          pan={pan}
          minZoom={0.7}
          panBounds={{ x: { min: -600, max: 50 }, y: { min: -910, max: -100 } }}
        >
          <MapSvg>
            <LocationMarker />
            {props.locations?.map((location, index) => (
              // Using index as key bad practice, but in this case its fine.
              <MapMarker key={index} {...location} active={false} />
            ))}
          </MapSvg>
        </PanZoomComponent>
      </div>
    </div>
  );
};

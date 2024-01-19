import { LocationMarker } from '../pages/MapView/LocationMarker';
import { MapMarker } from '../pages/MapView/MapMarker';
import { MapSvg } from '../pages/MapView/MapSvg';
import { LatLong } from '../types/lat-long.type';
import { PanZoomComponent } from './PanZoomComponent';

export const MapPreviewComponent = (props: {
  className?: string;
  locations?: LatLong[];
}) => {
  return (
    <div
      className={`${props.className} sm:hidden p-1 rounded-lg overflow-hidden select-none`}
    >
      <div className="relative w-full overflow-hidden pb-10 bg-white h-96">
        <PanZoomComponent
          className="w-full bg-[#96AF98]"
          zoom={0.7}
          pan={{ x: -250, y: -600 }}
          minZoom={0.7}
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

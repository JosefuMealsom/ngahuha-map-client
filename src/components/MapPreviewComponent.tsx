import { LocationMarker } from '../pages/MapView/LocationMarker';
import { MapMarker } from '../pages/MapView/MapMarker';
import { MapSvg } from '../pages/MapView/MapSvg';
import { PlantSite } from '../types/api/plant-site.type';
import { PanZoomComponent } from './PanZoomComponent';

export const MapPreviewComponent = (props: { plantSites: PlantSite[] }) => {
  return (
    <div className="sm:hidden p-1 rounded-lg overflow-hidden">
      <div className="relative w-full overflow-hidden pb-10 bg-white h-96">
        <PanZoomComponent
          className="w-full bg-[#96AF98]"
          zoom={0.7}
          pan={{ x: -250, y: -600 }}
          minZoom={0.7}
        >
          <MapSvg>
            <LocationMarker />
            {props.plantSites.map((plantSite) => (
              <MapMarker key={plantSite.id} {...plantSite} active={false} />
            ))}
          </MapSvg>
        </PanZoomComponent>
      </div>
    </div>
  );
};

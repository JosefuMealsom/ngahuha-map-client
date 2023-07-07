import { ButtonComponent } from './ButtonComponent';
import { useLiveQuery } from 'dexie-react-hooks';
import { plantSiteTable } from '../services/offline.database';
import { useAppStore } from '../store/app.store';
import { usePosition } from '../hooks/use-position.hook';
import { useState } from 'react';
import { LatLong } from '../types/lat-long.type';
import { PlantSite } from '../types/api/plant-site.type';
import { getPlantSitesWithinDistance } from '../services/closest-plants.service';
import { ClosestPlantInfoComponent } from './ClosestPlantInfoComponent';

export function ClosestPlantsToUser() {
  const currentView = useAppStore((state) => state.activeView);
  const setActiveView = useAppStore((state) => state.setActiveView);
  const [position, setPosition] = useState<LatLong>();
  const [closestPlants, setClosestPlants] = useState<PlantSite[]>();
  const plantSites = useLiveQuery(() => plantSiteTable.toArray());

  usePosition((position) => {
    setPosition(position.coords);
  });

  function toggleView() {
    if (isViewActive()) {
      setActiveView('ViewMap');
    } else {
      setActiveView('ClosestPlantsToUser');
      getClosestPlants();
    }
  }

  function getClosestPlants() {
    if (!position || !plantSites) return;

    setClosestPlants(getPlantSitesWithinDistance(30, position, plantSites));
  }

  function isViewActive() {
    return currentView == 'ClosestPlantsToUser';
  }

  function renderModalButton() {
    const buttonVisible =
      currentView === 'ClosestPlantsToUser' || currentView === 'ViewMap';

    if (!buttonVisible) return;

    return (
      <div className="fixed bottom-2 left-3" data-cy="open-closest-plants">
        <ButtonComponent
          onClickHandler={toggleView}
          className="bg-white"
          text={isViewActive() ? 'Close' : 'Closest Plants'}
        ></ButtonComponent>
      </div>
    );
  }

  return (
    <div>
      <div
        className={`${
          isViewActive() ? '' : 'hidden'
        } mb-4 pt-14 w-full h-full absolute top-0 left-0 bg-white p-6`}
      >
        <h1 className="font-bold mt-5 relative mb-3"> Closest plants</h1>
        {closestPlants?.map((plantSite) => (
          <ClosestPlantInfoComponent
            key={plantSite.id}
            {...plantSite}
          ></ClosestPlantInfoComponent>
        ))}
      </div>
      {renderModalButton()}
    </div>
  );
}

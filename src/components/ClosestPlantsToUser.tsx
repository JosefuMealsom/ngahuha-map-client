import { ButtonComponent } from './ButtonComponent';
import { useLiveQuery } from 'dexie-react-hooks';
import { plantSiteTable } from '../services/offline.database';
import { useAppStore } from '../store/app.store';
import { usePosition } from '../hooks/use-position.hook';
import { useState } from 'react';
import { PlantSite } from '../types/api/plant-site.type';
import { getPlantSitesWithinDistance } from '../services/closest-plants.service';
import { ClosestPlantInfoComponent } from './ClosestPlantInfoComponent';

export function ClosestPlantsToUser() {
  const currentView = useAppStore((state) => state.activeView);
  const setActiveView = useAppStore((state) => state.setActiveView);
  const [closestPlants, setClosestPlants] =
    useState<(PlantSite & { distance: number })[]>();
  const plantSites = useLiveQuery(() => plantSiteTable.toArray());
  const position = usePosition();

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
        } mb-4 w-full h-full overflow-scroll absolute top-0 left-0 bg-white`}
      >
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

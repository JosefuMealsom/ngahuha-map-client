import { ButtonComponent } from '../../components/ButtonComponent';
import { useLiveQuery } from 'dexie-react-hooks';
import { plantSiteTable } from '../../services/offline.database';
import { useAppStore } from '../../store/app.store';
import { usePosition } from '../../hooks/use-position.hook';
import { useEffect, useRef, useState } from 'react';
import { PlantSite } from '../../types/api/plant-site.type';
import { getPlantSitesWithinDistance } from '../../services/closest-plants.service';
import { ClosestPlantInfoComponent } from './ClosestPlantInfoComponent';

export function ClosestPlantsToUser() {
  const currentView = useAppStore((state) => state.activeView);
  const setActiveView = useAppStore((state) => state.setActiveView);
  const [closestPlants, setClosestPlants] =
    useState<(PlantSite & { distance: number })[]>();
  const plantSites = useLiveQuery(() => plantSiteTable.toArray());
  const position = usePosition();
  const pageRef = useRef<HTMLDivElement>(null);

  function toggleView() {
    if (isViewActive()) {
      setActiveView('ViewMap');
      pageRef.current?.scrollTo(0, 0);
    } else {
      setActiveView('ClosestPlantsToUser');
      getClosestPlants();
    }
  }

  useEffect(() => {
    if (!isViewActive) return;

    getClosestPlants();
  }, [position]);

  function getClosestPlants() {
    if (!position || !plantSites) return;

    setClosestPlants(getPlantSitesWithinDistance(20, position, plantSites));
  }

  function isViewActive() {
    return currentView == 'ClosestPlantsToUser';
  }

  function renderModalButton() {
    const buttonVisible =
      currentView === 'ClosestPlantsToUser' || currentView === 'ViewMap';

    if (!buttonVisible) return;

    return (
      <div className="fixed bottom-5 left-5" data-cy="open-closest-plants">
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
        } mb-4 w-full h-full overflow-scroll absolute top-0 left-0 pt-safe bg-white`}
        ref={pageRef}
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

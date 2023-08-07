import { useLiveQuery } from 'dexie-react-hooks';
import { plantSiteUploadTable } from '../services/offline.database';
import { PlantSiteUpload } from '../types/api/upload/plant-site-upload.type';
import { useEffect, useState } from 'react';

export const useFilteredPlantSiteUploads = (): [
  readyForUpload: PlantSiteUpload[],
  requiresId: PlantSiteUpload[],
] => {
  const plantSiteUploads = useLiveQuery(() => plantSiteUploadTable.toArray());
  const [readyForUpload, setReadyForUpload] = useState<PlantSiteUpload[]>([]);
  const [requiresId, setRequiresId] = useState<PlantSiteUpload[]>([]);

  useEffect(() => {
    if (!plantSiteUploads) return;

    setRequiresId(
      plantSiteUploads.filter(
        (plantSiteUpload) => plantSiteUpload.plantId === undefined,
      ),
    );

    setReadyForUpload(
      plantSiteUploads.filter(
        (plantSiteUpload) => plantSiteUpload.plantId !== undefined,
      ),
    );
  }, [plantSiteUploads]);

  return [readyForUpload, requiresId];
};

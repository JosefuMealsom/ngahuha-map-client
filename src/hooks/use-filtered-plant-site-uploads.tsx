import { useLiveQuery } from 'dexie-react-hooks';
import { plantSiteUploadTable } from '../services/offline.database';
import { PlantSiteUpload } from '../types/api/upload/plant-site-upload.type';
import { useEffect, useState } from 'react';

export const useFilteredPlantSiteUploads = (): [
  readyForUpload: PlantSiteUpload[],
  requiresId: PlantSiteUpload[],
] => {
  const plantUploadCount = useLiveQuery(() => plantSiteUploadTable.count());
  const [readyForUpload, setReadyForUpload] = useState<PlantSiteUpload[]>([]);
  const [requiresId, setRequiresId] = useState<PlantSiteUpload[]>([]);

  useEffect(() => {
    const setData = async () => {
      const plantSiteUploads: PlantSiteUpload[] = [];

      await plantSiteUploadTable.toCollection().each((upload) => {
        if (upload.plantId) {
          plantSiteUploads.push(upload);
          return;
        }

        plantSiteUploads.push({ ...upload, photos: [] });
      });

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
    };

    setData();
  }, [plantUploadCount]);

  return [readyForUpload, requiresId];
};

import { useEffect, useState } from 'react';
import photoDatabaseService from '../services/plant-site-photo-database.service';
import { PlantPhoto } from './PlantPhoto';
import type { PlantSitePhoto } from '../types/plant-site-photo.type';

export function PhotoViewer() {
  const [data, setData] = useState<PlantSitePhoto[]>();

  useEffect(() => {
    const fetchData = async () => {
      setData(await photoDatabaseService.all());
    };

    fetchData();
  });

  return (
    <div className="mb-4 w-full">
      <h1 className="mt-1">Photo list</h1>
      <div className="flex justify-evenly w-full">
        {data?.map((plantSitePhoto) => (
          <PlantPhoto {...plantSitePhoto} />
        ))}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import type { Plant } from '../../types/api/plant.type';
import type { PlantSiteUpload } from '../../types/api/upload/plant-site-upload.type';
import { plantTable } from '../../services/offline.database';
import { getFullPlantName } from '../../utils/plant-name-decorator.util';
import { deletePlantSite } from '../../services/api/plant-site-upload.service';
import trashSvg from '../../assets/svg/trash-2.svg';
import { usePlant } from '../../hooks/use-plant.hook';

export function PlantSiteComponent(
  props: PlantSiteUpload & { isUploading: boolean },
) {
  const plant = usePlant(props.plantId);

  function deletePhoto() {
    if (props.id) deletePlantSite(props.id);
  }

  function renderDelete() {
    if (props.isUploading) return;

    return (
      <img
        src={trashSvg}
        className="h-6 inline-block ml-6 cursor-pointer"
        onClick={deletePhoto}
        data-cy={`delete-plant-${props.id}`}
      />
    );
  }

  function renderPlantInfo() {
    if (!plant) return;

    return (
      <div className="flex">
        <div className="w-3/4 inline-block align-top">
          <h1 className="font-bold">Plant Species</h1>
          <p className="inline-block">{getFullPlantName(plant)}</p>
          {renderDelete()}
        </div>
      </div>
    );
  }

  return <div className="w-full mb-5">{renderPlantInfo()}</div>;
}

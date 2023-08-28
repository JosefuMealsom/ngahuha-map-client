import type { PlantSiteUpload } from '../../types/api/upload/plant-site-upload.type';
import { getFullPlantName } from '../../utils/plant-name-decorator.util';
import { deletePlantSite } from '../../services/api/plant-site-upload.service';
import trashSvg from '../../assets/svg/trash-2.svg';
import { usePlant } from '../../hooks/use-plant.hook';
import { Link } from 'react-router-dom';
import React from 'react';

export function PlantSiteComponent(
  props: PlantSiteUpload & { isUploading: boolean },
) {
  const plant = usePlant(props.plantId);

  function deleteUpload(evt: React.MouseEvent) {
    evt.preventDefault();

    if (props.id) deletePlantSite(props.id);
  }

  function renderDelete() {
    if (props.isUploading) return;

    return (
      <img
        src={trashSvg}
        className="w-9 h-9 p-2 rounded-full bg-red-600 fill hover:opacity-60 ml-6 cursor-pointer"
        onClick={deleteUpload}
        data-cy={`delete-plant-${props.id}`}
      />
    );
  }

  function renderPlantInfo() {
    if (!plant) {
      return (
        <Link
          to={`/plant-site/${props.id}/edit`}
          data-cy={`edit-plant-${props.id}`}
        >
          <div className="flex justify-between items-center">
            <p>Missing information</p>
            {renderDelete()}
          </div>
        </Link>
      );
    }
    return (
      <Link
        to={`/plant-site/${props.id}/edit`}
        data-cy={`edit-plant-${props.id}`}
      >
        <h1 className="font-bold text-sm">Plant Species</h1>
        <div className="flex justify-between items-center">
          <p>{getFullPlantName(plant)}</p>
          {renderDelete()}
        </div>
      </Link>
    );
  }

  return <div className="w-full mb-5">{renderPlantInfo()}</div>;
}

import type { PlantSiteUpload } from '../../types/api/upload/plant-site-upload.type';
import { getFullPlantName } from '../../utils/plant-name-decorator.util';
import { deletePlantSite } from '../../services/api/plant-site/plant-site-upload.service';
import trashSvg from '../../assets/svg/trash-2.svg';
import { usePlant } from '../../hooks/use-plant.hook';
import { Link } from 'react-router-dom';
import React from 'react';
import { FeatureUpload } from '../../types/api/upload/feature-upload.type';
import { deleteFeatureUpload } from '../../services/api/feature/feature-upload.service';

export function FeatureComponent(
  props: FeatureUpload & { isUploading: boolean },
) {
  function deleteUpload(evt: React.MouseEvent) {
    evt.preventDefault();

    if (props.id) deleteFeatureUpload(props.id);
  }

  function renderDelete() {
    if (props.isUploading) return;

    return (
      <img
        src={trashSvg}
        className="w-9 h-9 p-2 rounded-full bg-red-600 fill hover:opacity-60 ml-6 cursor-pointer"
        onClick={deleteUpload}
        data-cy={`delete-feature-${props.id}`}
      />
    );
  }

  function renderFeatureInfo() {
    return (
      <Link
        to={`/feature/${props.id}/edit`}
        data-cy={`edit-feature-${props.id}`}
      >
        <h3 className="font-bold mt-5 text-sm relative mb-1">
          Feature {props.id}
        </h3>
        <div className="flex justify-between items-center">
          <p>{props.name}</p>
          {renderDelete()}
        </div>
      </Link>
    );
  }

  return <div className="w-full mb-5">{renderFeatureInfo()}</div>;
}

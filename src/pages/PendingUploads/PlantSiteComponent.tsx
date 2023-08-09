import type { PlantSiteUpload } from '../../types/api/upload/plant-site-upload.type';
import { getFullPlantName } from '../../utils/plant-name-decorator.util';
import { deletePlantSite } from '../../services/api/plant-site-upload.service';
import trashSvg from '../../assets/svg/trash-2.svg';
import editSvg from '../../assets/svg/edit.svg';
import { usePlant } from '../../hooks/use-plant.hook';
import { Link } from 'react-router-dom';

export function PlantSiteComponent(
  props: PlantSiteUpload & { isUploading: boolean },
) {
  const plant = usePlant(props.plantId);

  function deleteUpload() {
    if (props.id) deletePlantSite(props.id);
  }

  function renderDelete() {
    if (props.isUploading) return;

    return (
      <img
        src={trashSvg}
        className="h-6 inline-block ml-6 cursor-pointer"
        onClick={deleteUpload}
        data-cy={`delete-plant-${props.id}`}
      />
    );
  }

  function renderEdit() {
    return (
      <Link to={`/plant-site/${props.id}/edit`}>
        <img
          src={editSvg}
          className="h-6 inline-block ml-6 cursor-pointer"
          data-cy={`edit-plant-${props.id}`}
        />
      </Link>
    );
  }

  function renderPlantInfo() {
    if (!plant) {
      return (
        <div className="flex">
          <p>Missing information</p>
          {renderEdit()}
          {renderDelete()}
        </div>
      );
    }
    return (
      <div className="flex">
        <div className="w-3/4 inline-block align-top">
          <h1 className="font-bold text-sm">Plant Species</h1>
          <p className="inline-block">{getFullPlantName(plant)}</p>
          {renderEdit()}
          {renderDelete()}
        </div>
      </div>
    );
  }

  return <div className="w-full mb-5">{renderPlantInfo()}</div>;
}

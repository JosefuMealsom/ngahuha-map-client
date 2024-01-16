import { Plant } from '../types/api/plant.type';
import { getFullPlantName } from '../utils/plant-name-decorator.util';

export function PlantTitleComponent(props: Plant) {
  function renderCommonNames() {
    if (
      !props.extendedInfo?.commonNames ||
      props.extendedInfo?.commonNames.length === 0
    ) {
      return;
    }

    return (
      <p className="text-white font-semibold text-xs">
        Also known as: {props.extendedInfo.commonNames.join(', ')}
      </p>
    );
  }
  return (
    <div className="p-3 rounded-br-lg bg-black bg-opacity-50 max-w-fit">
      <p className="text-white font-semibold text-xl">
        {getFullPlantName(props)}
      </p>
      {renderCommonNames()}
    </div>
  );
}

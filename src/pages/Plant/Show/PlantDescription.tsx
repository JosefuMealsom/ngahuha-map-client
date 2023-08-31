import { updatePlant } from '../../../services/api/plant.service';
import { toast } from 'react-toastify';

import { ProtectedLayout } from '../../ProtectedLayout';
import { parseMarkdown } from '../../../utils/markdown-parser.util';
import { useState } from 'react';
import { PlantForm } from '../PlantForm';
import { plantTable } from '../../../services/offline.database';
import { useLiveQuery } from 'dexie-react-hooks';

export function PlantDescription(props: { plantId: string }) {
  const { plantId } = props;
  const [isEditing, setIsEditing] = useState(false);
  const plant = useLiveQuery(() => plantTable.get(plantId));

  function renderDescription() {
    if (isEditing) return;

    return (
      <div className="pb-3">
        <article
          className="prose max-width-character"
          dangerouslySetInnerHTML={{
            __html: parseMarkdown(
              plant?.description || '*No description available*',
            ),
          }}
        ></article>
      </div>
    );
  }

  function renderPlantInfo() {
    if (!plant) return;

    return (
      <div>
        {renderDescription()}
        <ProtectedLayout>{renderEditor()}</ProtectedLayout>
      </div>
    );
  }

  async function onPlantSave(data: CreatePlantData) {
    if (!plant) return;

    try {
      await updatePlant(plant.id, data);
      toast('Plant successfully updated');
    } catch (error) {
      toast(
        `There was an error updating the plant: ${(error as Error).message}`,
      );
    }
  }

  function renderEditor() {
    if (!isEditing || !plant) return;

    return (
      <div className="pb-3">
        <PlantForm onSubmitHandler={onPlantSave} plant={plant} />
      </div>
    );
  }

  function renderEditButton() {
    const editButtonText = isEditing ? 'Cancel' : 'Edit Plant information';

    return (
      <ProtectedLayout>
        <button
          className="border inline-block py-2 text-sm px-4 font-bold cursor-pointer
           rounded-full mb-2 bg-[#002D04] text-white border-[#002D04]"
          onClick={() => setIsEditing(!isEditing)}
          data-cy="plant-toggle-edit"
        >
          {editButtonText}
        </button>
      </ProtectedLayout>
    );
  }

  return (
    <div className="relative h-full w-full overflow-scroll">
      <div className="pt-4 sm:h-screen bg-white w-full">
        <div className="w-full mb-5 px-10">
          {renderPlantInfo()}
          {renderEditButton()}
        </div>
      </div>
    </div>
  );
}

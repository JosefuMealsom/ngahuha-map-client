import { MarkDownEditorComponent } from '../../../components/MarkdownEditorComponent';
import { updateDescription } from '../../../services/api/plant.service';
import { toast } from 'react-toastify';
import { usePlant } from '../../../hooks/use-plant.hook';
import { ExtendedInfoEditor } from './ExtendedInfoEditor';
import { ProtectedLayout } from '../../ProtectedLayout';
import { parseMarkdown } from '../../../utils/markdown-parser.util';
import { useState } from 'react';

export function PlantDescription(props: { plantId: string }) {
  const { plantId } = props;
  const [isEditing, setIsEditing] = useState(false);
  const plant = usePlant(plantId);

  async function onDescriptionSave(description: string) {
    if (!plant) return;

    try {
      await updateDescription(plant.id, description);
      toast('Description successfully updated');
    } catch (error) {
      toast(`There was an error updating: ${(error as Error).message}`);
    }
  }

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
        <ProtectedLayout>{renderEditors()}</ProtectedLayout>
      </div>
    );
  }

  function renderEditors() {
    if (!isEditing || !plant) return;

    return (
      <div className="pb-3">
        <MarkDownEditorComponent
          onSaveHandler={onDescriptionSave}
          className="sm:overflow-scroll py-6"
          value={plant?.description}
        />
        <ExtendedInfoEditor plant={plant} />
      </div>
    );
  }

  function renderEditButton() {
    const editButtonText = isEditing ? 'Cancel' : 'Edit';

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
    <div className="relative h-full overflow-scroll">
      <div className="pt-4 sm:absolute top-0 left-0 bg-white w-full h-full">
        <div className="w-full mb-5 px-10">
          {renderPlantInfo()}
          {renderEditButton()}
        </div>
      </div>
    </div>
  );
}

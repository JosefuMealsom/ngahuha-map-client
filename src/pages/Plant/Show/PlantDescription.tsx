import { getFullPlantName } from '../../../utils/plant-name-decorator.util';
import { MarkDownEditorComponent } from '../../../components/MarkdownEditorComponent';
import { updateDescription } from '../../../services/api/plant.service';
import { toast } from 'react-toastify';
import { CarouselComponent } from '../../../components/CarouselComponent';
import { usePlant } from '../../../hooks/use-plant.hook';
import { ExtendedInfoEditor } from './ExtendedInfoEditor';
import { ProtectedLayout } from '../../ProtectedLayout';
import { parseMarkdown } from '../../../utils/markdown-parser.util';
import { useState } from 'react';

export function PlantDescription(props: {
  plantId: string;
  photos: { id: string; dataUrl: string }[];
}) {
  const { photos, plantId } = props;
  const [editMarkdown, setEditMarkdown] = useState(false);
  const plant = usePlant(plantId);

  function renderCarousel() {
    if (!photos || photos.length === 0) return;

    const elements = photos.map((photo) => (
      <img
        className="w-full sm:h-screen object-cover"
        key={photo.id}
        src={photo.dataUrl}
      />
    ));

    return <CarouselComponent elements={elements} />;
  }

  async function onDescriptionSave(description: string) {
    if (!plant) return;

    try {
      await updateDescription(plant.id, description);
      toast('Description successfully updated');
    } catch (error) {
      toast(`There was an error updating: ${(error as Error).message}`);
    }
  }

  function renderMarkdownEditor() {
    if (!editMarkdown) return;

    return (
      <MarkDownEditorComponent
        onSaveHandler={onDescriptionSave}
        className="sm:overflow-scroll px-10 py-6"
        value={plant?.description}
      />
    );
  }

  function renderDescription() {
    if (editMarkdown) return;

    return (
      <div>
        <article
          className="prose max-width-character"
          dangerouslySetInnerHTML={{
            __html: parseMarkdown(plant?.description || ''),
          }}
        ></article>
        <ProtectedLayout>
          <button
            className="border inline-block py-1.5 text-xs px-4 font-bold cursor-pointer
                 rounded-full mb-2 bg-[#002D04] text-white border-[#002D04]"
            onClick={() => setEditMarkdown(true)}
            data-cy="markdown-toggle-edit"
          >
            Edit description
          </button>
        </ProtectedLayout>
      </div>
    );
  }

  function renderPlantInfo() {
    if (!plant) return;

    return (
      <div className="h-full w-full bg-white">
        <div className="sm:flex h-full">
          <div className="relative sm:w-1/2">
            {renderCarousel()}
            <p className="text-3xl absolute top-0 left-0 p-2 font-bold text-white bg-black bg-opacity-50 pt-safe w-full sm:max-w-fit">
              {getFullPlantName(plant)}
            </p>
          </div>
          <div className="sm:w-1/2">
            <div className="px-10">
              {renderDescription()}
              <ProtectedLayout>
                {renderMarkdownEditor()}
                <ExtendedInfoEditor plant={plant} />
              </ProtectedLayout>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-0 left-0 bg-white w-full h-full">
      <div className="w-full mb-5">{renderPlantInfo()}</div>
    </div>
  );
}

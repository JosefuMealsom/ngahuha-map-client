import { Plant } from '../../types/api/plant.type';
import { getFullPlantName } from '../../utils/plant-name-decorator.util';
import { useLoaderData } from 'react-router-dom';
import { MarkDownEditorComponent } from '../../components/MarkdownEditorComponent';
import { updateDescription } from '../../services/api/plant.service';
import { toast } from 'react-toastify';
import { CarouselComponent } from '../../components/CarouselComponent';
import { usePlantPhotos } from '../../hooks/use-plant-photos.hook';

export function PlantInformation() {
  const plant: Plant = useLoaderData() as Plant;
  const photos = usePlantPhotos(plant.id);

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
    await updateDescription(plant.id, description);

    toast('Description successfully saved');
  }

  function renderPlantInfo() {
    if (!plant) return;

    return (
      <div className="h-full w-full bg-white sm:fixed">
        <div className="sm:flex h-full">
          <div className="relative sm:w-1/2">
            {renderCarousel()}
            <p className="text-3xl absolute top-0 left-0 p-2 font-bold text-white bg-black bg-opacity-50">
              {getFullPlantName(plant)}
            </p>
          </div>
          <div className="sm:w-1/2">
            <MarkDownEditorComponent
              onSaveHandler={onDescriptionSave}
              className="sm:h-screen sm:overflow-scroll pl-10 pr-10 py-6"
              value={plant.description}
            />
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

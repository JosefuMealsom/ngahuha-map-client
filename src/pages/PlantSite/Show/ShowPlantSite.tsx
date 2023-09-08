import { usePlantSitePhotos } from '../../../hooks/use-plant-site-photos.hook';
import { useLoaderData } from 'react-router-dom';
import { PlantDescription } from '../../Plant/Show/PlantDescription';
import { CarouselComponent } from '../../../components/CarouselComponent';
import { Plant } from '../../../types/api/plant.type';
import { PlantSite } from '../../../types/api/plant-site.type';
import { PlantTitleComponent } from '../../../components/PlantTitleComponent';
import { ProtectedLayout } from '../../ProtectedLayout';
import { ImageEditorComponent } from '../../../components/ImageEditorComponent';
import { useState } from 'react';
import {
  deletePlantPhoto,
  updatePlantPrimaryPhoto,
} from '../../../services/api/plant-site/plant-site-photo.service';
import { toast } from 'react-toastify';

type LoaderData = { plant: Plant; plantSite: PlantSite };

export function PlantSiteInformation() {
  const { plantSite, plant } = useLoaderData() as LoaderData;
  const photos = usePlantSitePhotos(plantSite.id);
  const [imageMetadataEditorOpen, setImageMetadataEditorOpen] = useState(false);

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

  async function onUpdatePrimaryPhotoClick(id: string) {
    try {
      await updatePlantPrimaryPhoto(id);
      toast('Primary photo updated');
    } catch (error) {
      toast(
        `There was an updating the primary photo: ${(error as Error).message}`,
      );
    }
  }

  async function onDeletePhotoClick(id: string) {
    try {
      const result = confirm('Are you sure you want to delete this photo?');
      if (result) {
        await deletePlantPhoto(id);
        toast('Photo deleted');
      }
    } catch (error) {
      toast(
        `There was an issue deleting the photo: ${(error as Error).message}`,
      );
    }
  }

  function renderPhotoMetadataEditor() {
    if (!imageMetadataEditorOpen || !photos) return;

    return (
      <ProtectedLayout>
        <div className="absolute top-0 left-0 touch-none bg-black bg-opacity-80 w-full pt-safe h-screen overflow-scroll">
          <ImageEditorComponent
            photos={photos}
            onClose={() => setImageMetadataEditorOpen(false)}
            onSetPrimaryPhoto={onUpdatePrimaryPhotoClick}
            onDeletePhoto={onDeletePhotoClick}
          />
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <div className="h-full w-full bg-white">
      <div className="sm:flex h-full">
        <div className="relative sm:w-1/2 pt-safe">
          {renderCarousel()}
          <div className="text-xl absolute top-safe left-0 p-3 font-semibold text-white bg-black bg-opacity-50 w-full sm:max-w-fit">
            <PlantTitleComponent {...plant} />
          </div>
          <ProtectedLayout>
            <button
              className="absolute bottom-4 right-4 text-white rounded-full
          font-semibold bg-emerald-900 px-4 py-2 text-sm cursor-pointer hover:opacity-90"
              onClick={() => setImageMetadataEditorOpen(true)}
            >
              Edit photo metadata
            </button>
          </ProtectedLayout>
        </div>
        <div className="sm:w-1/2">
          <PlantDescription plantId={plantSite.plantId} />
        </div>
      </div>
      {renderPhotoMetadataEditor()}
    </div>
  );
}

import { usePlantSitePhotos } from '../../../hooks/use-plant-site-photos.hook';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { PlantDescription } from '../../Plant/Show/PlantDescription';
import { Plant } from '../../../types/api/plant.type';
import { PlantSite } from '../../../types/api/plant-site.type';
import { PlantTitleComponent } from '../../../components/PlantTitleComponent';
import { ProtectedLayout } from '../../ProtectedLayout';
import { ImageEditorComponent } from '../../../components/ImageEditorComponent';
import { useEffect, useState } from 'react';
import {
  deletePlantPhoto,
  updatePlantPrimaryPhoto,
} from '../../../services/api/plant-site/plant-site-photo.service';
import { toast } from 'react-toastify';
import { deletePlantSite } from '../../../services/api/plant-site/plant-site.service';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  blobDataTable,
  plantSitePhotoUploadTable,
} from '../../../services/offline.database';
import { addPlantSitePhotoUpload } from '../../../services/api/plant-site/plant-site-photo-upload.service';
import { Photo } from '../../../types/api/photo.type';
import blobToDataUrlService from '../../../services/blob-to-data-url.service';
import { generateImagePreview } from '../../../services/preview-image-generator';
import { ImageGridComponent } from '../../../components/ImageGridComponent';
import { MapPreviewComponent } from '../../../components/MapPreviewComponent';

type LoaderData = { plant: Plant; plantSite: PlantSite };

export function PlantSiteInformation() {
  const { plantSite, plant } = useLoaderData() as LoaderData;
  const photos = usePlantSitePhotos(plantSite.id);
  const photosToUpload = useLiveQuery(() =>
    plantSitePhotoUploadTable.where({ plantSiteId: plantSite.id }).toArray(),
  );
  const [convertedPhotosToUpload, setConvertedPhotosToUpload] = useState<
    Photo[]
  >([]);
  const [imageMetadataEditorOpen, setImageMetadataEditorOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const convertUploadsToPhotos = async () => {
      if (!photosToUpload) return;

      const photos = await Promise.all(
        photosToUpload.map(async (photo) => {
          const blobData = await blobDataTable.get(photo.blobDataId);
          const dataUrl = await blobToDataUrlService.convert(
            new Blob([blobData!.data]),
          );
          return {
            id: photo.id!.toString(),
            dataUrl: dataUrl || '',
            primaryPhoto: false,
          };
        }),
      );

      setConvertedPhotosToUpload(photos);
    };

    convertUploadsToPhotos();
  }, [photosToUpload]);

  function renderImageGrid() {
    if (!photos || photos.length === 0) return;

    return (
      <ImageGridComponent imageUrls={photos.map((photo) => photo.dataUrl)} />
    );
  }

  async function onImageAdded(event: React.ChangeEvent<HTMLInputElement>) {
    const newPhoto = event.target.files?.item(0);
    if (newPhoto) {
      const previewImage = await generateImagePreview(newPhoto);
      await addPlantSitePhotoUpload(plantSite.id, newPhoto, previewImage);
    }
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

  async function onDeletePlantSiteClick(id: string) {
    try {
      const result = confirm('Are you sure you want delete the plant site?');
      if (result) {
        await deletePlantSite(id);
        navigate(-1);
        toast('Plant site deleted');
      }
    } catch (error) {
      toast(
        `There was an issue deleting the plant site: ${
          (error as Error).message
        }`,
      );
    }
  }

  function deletePhotoUpload(id: string) {
    try {
      const result = confirm('Are you sure you want delete this photo upload?');
      if (result) {
        plantSitePhotoUploadTable.delete(Number(id));
      }
    } catch (error) {
      toast(`There was an issue deleting photo: ${(error as Error).message}`);
    }
  }

  function renderPhotoMetadataEditor() {
    if (!imageMetadataEditorOpen || !photos) return;

    return (
      <ProtectedLayout>
        <div className="absolute top-0 left-0 touch-none bg-black bg-opacity-80 w-full pt-safe h-screen overflow-scroll">
          <ImageEditorComponent
            photos={photos}
            photosToUpload={convertedPhotosToUpload || []}
            onImageAdded={onImageAdded}
            onClose={() => setImageMetadataEditorOpen(false)}
            onSetPrimaryPhoto={onUpdatePrimaryPhotoClick}
            onDeletePhoto={onDeletePhotoClick}
            onDeletePhotoUpload={deletePhotoUpload}
          />
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <div className="h-full w-full bg-white">
      <div className="sm:flex h-full">
        <div className="relative sm:w-1/2 pt-safe">
          {renderImageGrid()}
          <div className="top-safe left-1 mt-1 absolute top-safe">
            <PlantTitleComponent {...plant} />
          </div>
          <ProtectedLayout>
            <div className="flex absolute bottom-4 right-4">
              <button
                className=" text-white rounded-full
          font-semibold bg-emerald-900 px-4 py-2 text-sm cursor-pointer hover:opacity-90 mr-2"
                onClick={() => setImageMetadataEditorOpen(true)}
              >
                Edit photos
              </button>
              <button
                className="text-white rounded-full
          font-semibold bg-red-500 px-4 py-2 text-sm cursor-pointer hover:opacity-90"
                onClick={() => onDeletePlantSiteClick(plantSite.id)}
              >
                Delete
              </button>
            </div>
          </ProtectedLayout>
        </div>
        <div className="sm:w-1/2">
          <PlantDescription plantId={plantSite.plantId} />
        </div>
      </div>
      {renderPhotoMetadataEditor()}
      <MapPreviewComponent plantSites={[plantSite]} />
    </div>
  );
}

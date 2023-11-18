import type { PlantSiteUpload } from '../../types/api/upload/plant-site-upload.type';
import { getFullPlantName } from '../../utils/plant-name-decorator.util';
import { deletePlantSite } from '../../services/api/plant-site/plant-site-upload.service';
import trashSvg from '../../assets/svg/trash-2.svg';
import editSvg from '../../assets/svg/edit.svg';
import { usePlant } from '../../hooks/use-plant.hook';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import {
  blobDataTable,
  plantSiteUploadPhotoTable,
} from '../../services/offline.database';
import blobToDataUrlService from '../../services/blob-to-data-url.service';
import { toast } from 'react-toastify';
import { FullScreenImagePreviewComponent } from '../../components/FullScreenImagePreviewComponent';

type PreviewPhoto = { dataUrl: string; id: number };

export function PlantSiteComponent(
  props: PlantSiteUpload & {
    isUploading: boolean;
  },
) {
  const plant = usePlant(props.plantId);

  const [previewImages, setPreviewImages] = useState<PreviewPhoto[]>([]);
  const [viewFullScreen, setViewFullScreen] = useState(false);
  const [fullScreenPreviewImage, setFullScreenPreviewImage] = useState('');

  useEffect(() => {
    const fetchPreviewData = async () => {
      const plantSiteUploadPhotos = await plantSiteUploadPhotoTable
        .where({ plantSiteUploadId: props.id })
        .toArray();

      const imageData: PreviewPhoto[] = [];
      for (const photo of plantSiteUploadPhotos) {
        const blobData = await blobDataTable.get(photo.previewPhotoBlobDataId);

        if (blobData) {
          const dataUrl = await blobToDataUrlService.convert(
            new Blob([blobData.data]),
          );

          if (dataUrl) imageData.push({ dataUrl: dataUrl, id: photo.id! });
        }
      }

      setPreviewImages(imageData);
    };

    fetchPreviewData();
  }, []);

  function deleteUpload(evt: React.MouseEvent) {
    evt.preventDefault();
    try {
      const result = confirm(
        'Are you sure you want to delete this plant site upload?',
      );
      if (result) {
        if (props.id) deletePlantSite(props.id);
        toast('Plant site upload deleted');
      }
    } catch (error) {
      toast(
        `There was an issue deleting the plant site: ${
          (error as Error).message
        }`,
      );
    }
  }

  function renderDelete() {
    if (props.isUploading) return;

    return (
      <div
        className="flex items-center h-9 p-2 px-4 w-fit rounded-full bg-red-600 hover:opacity-60 cursor-pointer"
        onClick={deleteUpload}
      >
        <span className="text-white text-sm font-semibold">Delete</span>
        <img
          src={trashSvg}
          className="ml-1 h-full"
          data-cy={`delete-plant-${props.id}`}
        />
      </div>
    );
  }

  function renderEdit() {
    if (props.isUploading) return;

    return (
      <Link
        to={`/plant-site/${props.id}/edit`}
        data-cy={`edit-plant-${props.id}`}
      >
        <div className="flex items-center h-9 w-fit p-2 px-4 rounded-full bg-sky-500 hover:opacity-60 cursor-pointer mr-2">
          <span className="text-white text-sm font-semibold">Edit</span>
          <img
            src={editSvg}
            className="ml-1.5 h-full w-4"
            data-cy={`edit-plant-${props.id}`}
          />
        </div>
      </Link>
    );
  }

  function renderPlantInfo() {
    if (!plant) {
      return (
        <div>
          <div className="flex justify-between items-center mb-3">
            <p>Missing information</p>
          </div>
          <div className="flex mb-3">
            {renderEdit()}
            {renderDelete()}
          </div>
        </div>
      );
    }
    return (
      <div>
        <div className="flex justify-between items-center mb-3">
          <p>{getFullPlantName(plant)}</p>
        </div>
        <div className="flex mb-3">
          {renderEdit()}
          {renderDelete()}
        </div>
      </div>
    );
  }

  function renderFullScreenPreview() {
    if (!viewFullScreen) return;

    return (
      <FullScreenImagePreviewComponent
        src={fullScreenPreviewImage}
        onClose={() => setViewFullScreen(false)}
      />
    );
  }

  async function viewPreviewImageFullScreen(id: number) {
    const plantSitePhoto = await plantSiteUploadPhotoTable.get(id);
    if (plantSitePhoto) {
      const photoBlob = await blobDataTable.get(plantSitePhoto.blobDataId);
      if (photoBlob) {
        const dataUrl = await blobToDataUrlService.convert(
          new Blob([photoBlob.data]),
        );

        setFullScreenPreviewImage(dataUrl || '');
        setViewFullScreen(true);
      }
    }
  }

  return (
    <div className="w-full mb-5">
      {renderPlantInfo()}
      <div className="grid grid-cols-3 sm:grid-cols-8 gap-2 min-h-[11rem]">
        {previewImages.map(({ dataUrl, id }) => (
          <div className="h-44" key={id}>
            <img
              src={dataUrl}
              className="mb-3 inline-block cursor-zoom-in object-cover h-full w-full"
              onClick={() => viewPreviewImageFullScreen(id)}
            />
          </div>
        ))}
      </div>
      {renderFullScreenPreview()}
    </div>
  );
}

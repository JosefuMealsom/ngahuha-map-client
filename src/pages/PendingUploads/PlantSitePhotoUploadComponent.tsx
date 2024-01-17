import { useEffect, useState } from 'react';
import { PlantSitePhotoUpload } from '../../types/api/upload/plant-site-upload.type';
import {
  blobDataTable,
  plantSitePhotoUploadTable,
} from '../../services/offline.database';
import blobToDataUrlService from '../../services/blob-to-data-url.service';
import { usePlantFromPlantSite } from '../../hooks/use-plant-from-plant-site.hook';
import { FullScreenImagePreviewComponent } from '../../components/FullScreenImagePreviewComponent';
import { Link } from 'react-router-dom';

export function PlantSitePhotoUploadComponent(
  props: PlantSitePhotoUpload & { isUploading: boolean },
) {
  const [imageUrl, setImageUrl] = useState('');
  const plant = usePlantFromPlantSite(props.plantSiteId);
  const [fullScreenPreviewImage, setFullScreenPreviewImage] = useState('');
  const [viewFullScreen, setViewFullScreen] = useState(false);

  useEffect(() => {
    const fetchPreviewData = async () => {
      if (!props.previewPhotoBlobDataId) return;

      const previewBlob = await blobDataTable.get(props.previewPhotoBlobDataId);

      if (previewBlob) {
        const photoData = await blobToDataUrlService.convert(
          new Blob([previewBlob.data]),
        );

        if (photoData) {
          setImageUrl(photoData);
        }
      }
    };

    fetchPreviewData();
  }, []);

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
    const plantSitePhoto = await plantSitePhotoUploadTable.get(id);
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

  function renderEdit() {
    if (props.isUploading) return;

    return (
      <Link to={`/plant-site/${props.plantSiteId}`}>
        <div className="flex items-center h-9 w-fit p-2 px-4 rounded-full bg-sky-500 hover:opacity-60 cursor-pointer mr-2 mb-2">
          <span className="text-white text-sm font-semibold">
            View plant site
          </span>
        </div>
      </Link>
    );
  }

  return (
    <div className="mt-2 relative mb-2 px-6">
      <p className="mb-2">Pending upload for {plant?.species}</p>
      {renderEdit()}
      <img
        className="rounded-lg mb-2 w-1/3"
        src={imageUrl}
        onClick={() => viewPreviewImageFullScreen(props.id!)}
      />
      {renderFullScreenPreview()}
    </div>
  );
}

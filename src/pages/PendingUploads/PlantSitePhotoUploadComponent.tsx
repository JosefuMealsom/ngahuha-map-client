import { useEffect, useState } from 'react';
import { PlantSitePhotoUpload } from '../../types/api/upload/plant-site-upload.type';
import { blobDataTable } from '../../services/offline.database';
import blobToDataUrlService from '../../services/blob-to-data-url.service';

export function PlantSitePhotoUploadComponent(props: PlantSitePhotoUpload) {
  const [imageUrl, setImageUrl] = useState('');

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

  return (
    <div className="py-2">
      <h3 className="font-bold mt-5 text-sm relative mb-1">
        Plant site photo: {props.id}
      </h3>
      <img src={imageUrl} />
      <p className="text-sm">Photo for plant site {props.plantSiteId}</p>
    </div>
  );
}

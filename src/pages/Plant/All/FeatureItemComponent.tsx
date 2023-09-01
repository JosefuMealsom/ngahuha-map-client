import { featurePhotoTable } from '../../../services/offline.database';
import { useEffect, useState } from 'react';
import blobToDataUrlService from '../../../services/blob-to-data-url.service';
import { Feature } from '../../../types/api/feature.type';

export function FeatureItemComponent(props: Feature) {
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    const getFeatureImage = async () => {
      const previewImage = await featurePhotoTable
        .where({ featureId: props.id })
        .first();

      if (!previewImage || !previewImage?.data) return;

      const photoData = await blobToDataUrlService.convert(
        new Blob([previewImage.data]),
      );

      if (photoData) {
        setPreviewImage(photoData);
      }
    };

    getFeatureImage();
  }, []);

  function renderImage() {
    if (previewImage.length === 0) return;

    return <img src={previewImage} className="w-full h-full object-cover" />;
  }

  function renderFeatureInfo() {
    return (
      <div className="h-full sm:h-96 cursor-pointer hover:opacity-90 bg-white">
        <div className="w-full h-full relative min-h-[15rem]">
          {renderImage()}
          <div className="absolute top-0 p-3 bg-black bg-opacity-40 w-full text-white font-semibold text-lg">
            {props.name}
          </div>
        </div>
      </div>
    );
  }

  return (
    // <Link to={`/plants/${props.id}`}>
    <div className="w-full">{renderFeatureInfo()}</div>
    // </Link>
  );
}

import { useState } from 'react';
import blobToDataUrlService from '../services/blob-to-data-url.service';

export function PlantPhotoImage(props: { photoImage: File }) {
  const [previewImage, setPreviewImage] = useState('');

  const convertFileToPreviewImage = async () => {
    const photoData = await blobToDataUrlService.convert(props.photoImage);
    if (photoData) {
      setPreviewImage(photoData);
    }
  };

  convertFileToPreviewImage();

  function renderPhotos() {
    return <img src={previewImage} className="mb-3 w-1/4" />;
  }

  return <div className="w-full mb-5">{renderPhotos()}</div>;
}

import { useEffect, useState } from 'react';
import blobToDataUrlService from '../../../services/blob-to-data-url.service';
import closeImageUrl from '../../../assets/svg/x-white.svg';

export function PlantPhotoImage(props: {
  file: Blob;
  id: string;
  onRemoveHandler: (id: string) => void;
}) {
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    const convertFileToPreviewImage = async () => {
      const photoData = await blobToDataUrlService.convert(props.file);
      if (photoData) {
        setPreviewImage(photoData);
      }
    };

    convertFileToPreviewImage();
  });

  const onRemoveClick = () => {
    props.onRemoveHandler(props.id);
  };

  return (
    <div className="relative">
      <div className="relative inline-block" data-cy="photo-form-photo">
        <img
          src={closeImageUrl}
          className="absolute top-2 right-2 w-8 h-8 p-2 rounded-full bg-red-600 fill cursor-pointer hover:opacity-60"
          onClick={onRemoveClick}
          data-cy="remove-photo-button"
        />
        <img src={previewImage} className="mb-3 sm:w-52 inline-block" />
      </div>
    </div>
  );
}

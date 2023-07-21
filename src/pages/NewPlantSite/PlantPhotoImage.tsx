import React, { useEffect, useState } from 'react';
import blobToDataUrlService from '../../services/blob-to-data-url.service';
import closeImageUrl from '../../assets/svg/x-circle.svg';

export function PlantPhotoImage(props: {
  file: File;
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
    <div className="mb-5 block relative">
      <div className="relative inline-block" data-cy="photo-form-photo">
        <img
          src={closeImageUrl}
          className="absolute top-2 right-2 w-6 h-6 cursor-pointer hover:opacity-60"
          onClick={onRemoveClick}
          data-cy="remove-photo-button"
        />
        <img src={previewImage} className="mb-3 w-52 inline-block" />
      </div>
    </div>
  );
}

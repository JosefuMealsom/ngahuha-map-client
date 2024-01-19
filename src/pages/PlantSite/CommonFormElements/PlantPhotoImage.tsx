import { useContext, useEffect, useState } from 'react';
import blobToDataUrlService from '../../../services/blob-to-data-url.service';
import { FullScreenImagePreviewComponent } from '../../../components/FullScreenImagePreviewComponent';
import starImageUrl from '../../../assets/svg/star.svg';
import { PlantFormContext } from './PlantFormContext';

export function PlantPhotoImage(props: {
  file: Blob;
  id: string;
  onRemoveHandler: (id: string) => void;
  primaryPhoto: boolean;
}) {
  const [previewImage, setPreviewImage] = useState('');
  const [viewFullScreen, setViewFullScreen] = useState(false);

  const context = useContext(PlantFormContext);

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

  function renderFullScreenPreview() {
    if (!viewFullScreen) return;

    return (
      <FullScreenImagePreviewComponent
        src={previewImage}
        onClose={() => setViewFullScreen(false)}
      />
    );
  }

  function renderPrimaryPhotoButton() {
    if (props.primaryPhoto) return;

    return (
      <button
        className="rounded-full text-xs bg-emerald-600 px-4 py-2
      text-white font-semibold hover:outline hover:outline-2 hover:outline-blue-500 mb-1"
        onClick={() => context?.setPrimaryPhoto(props.id)}
      >
        Set as primary photo
      </button>
    );
  }

  function renderPrimaryPhotoIndicator() {
    if (!props.primaryPhoto) return;

    return (
      <img src={starImageUrl} className="absolute top-3 right-3 h-7 w-7" />
    );
  }

  return (
    <div className="relative sm:h-96 h-56" data-cy="photo-form-photo">
      <img
        src={previewImage}
        onClick={() => setViewFullScreen(true)}
        className="mb-3 inline-block cursor-zoom-in object-cover w-full h-full rounded-lg"
      />
      {renderFullScreenPreview()}
      <div className="absolute sm:bottom-3 bottom-5 right-0 flex flex-col items-end">
        {renderPrimaryPhotoButton()}
        <button
          className="px-4 py-2 rounded-full bg-red-600
          text-white text-xs font-semibold fill cursor-pointer hover:opacity-60"
          onClick={onRemoveClick}
          data-cy="remove-photo-button"
        >
          Remove photo
        </button>
      </div>
      {renderPrimaryPhotoIndicator()}
    </div>
  );
}

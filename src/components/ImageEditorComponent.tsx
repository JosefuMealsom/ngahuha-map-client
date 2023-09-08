import { useEffect, useState } from 'react';
import { Photo } from '../types/api/photo.type';
import { FullScreenImagePreviewComponent } from './FullScreenImagePreviewComponent';
import closeImgUrl from '../assets/svg/x-white.svg';
import starImgUrl from '../assets/svg/star.svg';

export function ImageEditorComponent(props: {
  photos: Photo[];
  onClose: () => any;
  onSetPrimaryPhoto: (id: string) => any;
  onDeletePhoto: (id: string) => any;
}) {
  const [viewFullScreen, setViewFullScreen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  function onPreviewClick(imageSrc: string) {
    setSelectedImage(imageSrc);
    setViewFullScreen(true);
  }

  function renderFullScreenPreview() {
    if (!viewFullScreen) return;

    return (
      <FullScreenImagePreviewComponent
        src={selectedImage}
        onClose={() => setViewFullScreen(false)}
      />
    );
  }

  function renderPrimaryPhotoIndicator(photo: Photo) {
    if (!photo.primaryPhoto) return;

    return <img src={starImgUrl} className="absolute top-3 right-3 h-7 w-7" />;
  }

  function renderPrimaryPhotoButton(photo: Photo) {
    if (photo.primaryPhoto) return;

    return (
      <button
        className="rounded-md text-xs bg-emerald-600 py-1 px-2 mr-2
      text-white font-semibold hover:outline hover:outline-2 hover:outline-blue-500"
        onClick={() => props.onSetPrimaryPhoto(photo.id)}
      >
        Set as primary photo
      </button>
    );
  }

  function renderDeleteButton(photo: Photo) {
    if (props.photos.length <= 1 || photo.primaryPhoto) return;

    return (
      <button
        className="rounded-md text-xs bg-red-600 py-1 px-2 mr-2
      text-white font-semibold hover:outline hover:outline-2 hover:outline-blue-500"
        onClick={() => props.onDeletePhoto(photo.id)}
      >
        Delete
      </button>
    );
  }

  return (
    <div className="relative pt-safe">
      <div className="mb-4 w-full h-full overflow-scroll p-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 overflow-visible">
          {props.photos.map((photo) => (
            <div
              className="overflow-hidden rounded-md hover:outline-blue-500
              hover:outline hover:outline-2 cursor-pointer h-48 sm:h-80 relative"
              key={photo.id}
            >
              <img
                className="object-cover h-full w-full"
                src={photo.dataUrl}
                draggable={false}
                onClick={() => onPreviewClick(photo.dataUrl)}
              />
              {renderPrimaryPhotoIndicator(photo)}
              <div className="absolute bottom-2 right-2 flex">
                {renderPrimaryPhotoButton(photo)}
                {renderDeleteButton(photo)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <img
        src={closeImgUrl}
        className="absolute top-3 right-3 h-7 w-7 cursor-pointer"
        onClick={props.onClose}
      />
      {renderFullScreenPreview()}
    </div>
  );
}

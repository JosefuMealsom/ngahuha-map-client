import { useState } from 'react';
import { Photo } from '../types/api/photo.type';
import { FullScreenImagePreviewComponent } from './FullScreenImagePreviewComponent';
import closeImgUrl from '../assets/svg/x-white.svg';

export function ImageEditorComponent(props: {
  photos: Photo[];
  onClose: () => any;
}) {
  const [viewFullScreen, setViewFullScreen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  function onImageClick(imageSrc: string) {
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

  return (
    <div>
      <div className="mb-4 w-full h-full overflow-scroll p-5">
        <div className="grid grid-cols-4 gap-4">
          {props.photos.map((photo) => (
            <div
              className="overflow-hidden rounded-md hover:outline-blue-500
              hover:outline hover:outline-2 cursor-pointer sm:h-80"
            >
              <img
                className="object-cover h-full w-full"
                src={photo.dataUrl}
                onClick={() => onImageClick(photo.dataUrl)}
              />
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

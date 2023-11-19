import { useState } from 'react';
import { FullScreenImagePreviewComponent } from './FullScreenImagePreviewComponent';

export function ImageGridComponent(props: { imageUrls: string[] }) {
  const [fullScreenPreviewImage, setFullScreenPreviewImage] = useState('');
  const [viewFullScreen, setViewFullScreen] = useState(false);

  const imagesWithUniqueKey = props.imageUrls.map((image) => ({
    key: crypto.randomUUID(),
    dataUrl: image,
  }));

  function renderFullScreenPreview() {
    if (!viewFullScreen) return;

    return (
      <FullScreenImagePreviewComponent
        src={fullScreenPreviewImage}
        onClose={() => setViewFullScreen(false)}
      />
    );
  }

  function renderNonPrimaryImages() {
    if (imagesWithUniqueKey.length <= 1) return;

    let gridColClass = 'grid-cols-3';

    const length = imagesWithUniqueKey.length - 1;
    if (length % 4 === 0) {
      gridColClass = 'grid-cols-4';
    } else if (length % 2 === 0) {
      gridColClass = 'grid-cols-2';
    }

    return (
      <div className={`${gridColClass} grid gap-1 flex-grow mt-1 mb-2`}>
        {imagesWithUniqueKey.slice(1).map((image) => (
          <div className="h-40 sm:h-48">
            <img
              className="h-full w-full object-cover rounded-lg overflow-hidden cursor-pointer"
              key={image.key}
              src={image.dataUrl}
              onClick={() => viewPreviewImageFullScreen(image.dataUrl)}
            />
          </div>
        ))}
      </div>
    );
  }

  async function viewPreviewImageFullScreen(dataUrl: string) {
    setFullScreenPreviewImage(dataUrl || '');
    setViewFullScreen(true);
  }

  return (
    <div className="flex flex-col sm:h-screen">
      <img
        className="w-full object-cover h-full cursor-pointer"
        key={imagesWithUniqueKey[0].key}
        src={imagesWithUniqueKey[0].dataUrl}
        onClick={() =>
          viewPreviewImageFullScreen(imagesWithUniqueKey[0].dataUrl)
        }
      />
      {renderNonPrimaryImages()}

      {renderFullScreenPreview()}
    </div>
  );
}

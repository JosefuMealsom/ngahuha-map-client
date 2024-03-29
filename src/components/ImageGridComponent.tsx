import { useState } from 'react';
import { FullScreenImagePreviewComponent } from './FullScreenImagePreviewComponent';
import { chunk } from 'underscore';

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

  function renderRow(row: { key: string; dataUrl: string }[]) {
    // Image when there is only 1 item in the row looks strange, therefore
    // added this logic here to make the row taller when there is only one item.
    const containerHeight = row.length === 1 ? 'h-60 sm:h-80' : 'h-40 sm:h-48';

    return (
      <div className={`flex w-full ${containerHeight} mb-1 px-1 gap-1`}>
        {row.map((image) => (
          <div className="flex-grow-1">
            <img
              className="h-full w-full object-cover rounded-lg h- overflow-hidden cursor-pointer"
              key={image.key}
              src={image.dataUrl}
              onClick={() => viewPreviewImageFullScreen(image.dataUrl)}
            />
          </div>
        ))}
      </div>
    );
  }

  function renderNonPrimaryImages() {
    if (imagesWithUniqueKey.length <= 1) return;

    const gridItems = imagesWithUniqueKey.slice(1);
    const rows = chunk(gridItems, 3);

    return (
      <div className={`flex-grow mt-1 mb-1`}>
        {rows.map((row) => renderRow(row))}
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
        className="w-full object-cover h-full cursor-pointer rounded-lg overflow-hidden px-1 pt-1"
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

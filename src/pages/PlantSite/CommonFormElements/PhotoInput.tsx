import cameraUrl from '../../../assets/svg/camera.svg';
import { PlantPhotoImage } from './PlantPhotoImage';

type PhotoFile = {
  id: string;
  file: Blob;
  primaryPhoto: boolean;
};

export function PhotoInput(props: {
  photos: PhotoFile[];
  onPhotoChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPhotoRemoveHandler: (photoId: string) => void;
}) {
  const { photos, onPhotoChangeHandler, onPhotoRemoveHandler } = props;

  function onPhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    onPhotoChangeHandler(event);
  }

  function renderPhotos() {
    if (photos.length === 0) return;

    return (
      <div data-cy="plant-form-images">
        <label className="block mb-3 font-semibold text-inverted-background">
          Photos
        </label>
        <div className="sm:grid sm:grid-cols-4 sm:gap-2">
          {photos?.map((photoImage) => (
            <PlantPhotoImage
              key={photoImage.id}
              {...photoImage}
              onRemoveHandler={onPhotoRemoveHandler}
              primaryPhoto={photoImage.primaryPhoto}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between">
        <label
          htmlFor="photo"
          className="py-2 px-4 text-sm font-semibold text-white
          bg-forest border-forest cursor-pointer  mb-7 inline-block rounded-full"
          data-cy="add-photo"
        >
          Take photo
          <img
            src={cameraUrl}
            className="inline-block ml-2 mr-1 h-4 align-middle relative -top-0.5"
          />
          <input
            type="file"
            capture="environment"
            id="photo"
            accept="image/*"
            className="hidden"
            onChange={onPhotoChange}
          />
        </label>
        <label
          htmlFor="photoFromDevice"
          className="py-2 px-4 text-sm font-semibold text-white
          bg-sky-500 border-sky-500 cursor-pointer mb-7 inline-block rounded-full sm:hidden ml-2"
        >
          Add image from device
          <input
            type="file"
            id="photoFromDevice"
            accept="image/*"
            className="hidden"
            onChange={onPhotoChange}
          />
        </label>
      </div>
      {renderPhotos()}
    </div>
  );
}

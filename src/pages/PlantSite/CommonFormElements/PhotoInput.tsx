import cameraUrl from '../../../assets/svg/camera.svg';
import { PlantPhotoImage } from './PlantPhotoImage';

type PhotoFile = {
  id: string;
  file: Blob;
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
        <label className="block mb-3 font-semibold">Photos</label>
        {photos?.map((photoImage) => (
          <PlantPhotoImage
            key={photoImage.id}
            {...photoImage}
            onRemoveHandler={onPhotoRemoveHandler}
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div>
        <label
          htmlFor="photo"
          className="border-solid border-black border p-2 hover:bg-gray-300 cursor-pointer mb-7 inline-block rounded-md"
          data-cy="add-photo"
        >
          Add photo
          <img
            src={cameraUrl}
            className="inline-block ml-2 mr-1 h-5 align-middle relative -top-0.5"
          />
        </label>
        <input
          type="file"
          capture="environment"
          id="photo"
          accept="image/*"
          className="hidden"
          onChange={onPhotoChange}
        />
      </div>
      {renderPhotos()}
    </div>
  );
}

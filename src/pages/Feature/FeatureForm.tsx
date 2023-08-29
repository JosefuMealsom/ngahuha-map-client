import { useState } from 'react';
import { MarkDownEditorComponent } from '../../components/MarkdownEditorComponent';
import { PhotoInput } from '../PlantSite/CommonFormElements/PhotoInput';
import { PhotoFile } from '../../types/api/upload/plant-site-upload.type';
import { GeolocationLockOnComponent } from '../../components/GeolocationLockOnComponent';
import { LatLong } from '../../types/lat-long.type';

export function FeatureForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<PhotoFile[]>([]);
  const [position, setPosition] = useState<LatLong>();

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    // props.onSubmitHandler();
  }

  async function onPhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newPhoto = event.target.files?.item(0);
    if (newPhoto) {
      const photosCopy = [...photos];

      photosCopy.push({
        file: newPhoto,
        id: crypto.randomUUID(),
      });

      setPhotos(photosCopy);
    }
  }

  function removePlantPhoto(photoIdToRemove: string) {
    const photosCopy = photos.filter(
      (photoFile) => photoFile.id !== photoIdToRemove,
    );
    setPhotos(photosCopy);
  }

  return (
    <form onSubmit={onSubmit} className="bg-background w-full">
      <label className="mb-2 text-inverted-background text-sm font-bold block">
        Feature name
      </label>
      <input
        type="text"
        className="w-full py-2 px-4 border font-light border-gray-400 rounded-full mb-5"
        placeholder="Feature"
        value={name}
        onChange={(event) => {
          setName(event.target.value);
        }}
        data-cy="species-input"
      />

      <label className="mb-2 text-inverted-background text-sm font-bold block">
        Description
      </label>
      <MarkDownEditorComponent
        onChangeHandler={(value) => setDescription(value)}
        className="sm:overflow-scroll py-6"
        value={description}
        data-cy="description-input"
      />

      <div className="relative mb-5">
        <PhotoInput
          photos={photos}
          onPhotoChangeHandler={onPhotoChange}
          onPhotoRemoveHandler={removePlantPhoto}
        />
      </div>

      <div className="mb-3">
        <GeolocationLockOnComponent
          onGeolocationLocked={(coordinates) => setPosition(coordinates)}
          onLockingOn={() => setPosition(undefined)}
        />
      </div>

      <div className="pb-10">
        <input
          className="block border-solid border px-4 py-2 text-sm rounded-full bg-sky-600
        font-semibold text-white hover:bg-gray-300 cursor-pointer"
          type="submit"
          data-cy="create-feature"
          value="Save offline"
        />
      </div>
    </form>
  );
}
import { useState } from 'react';
import { MarkDownEditorComponent } from '../../components/MarkdownEditorComponent';
import { PhotoInput } from '../PlantSite/CommonFormElements/PhotoInput';
import { PhotoFile } from '../../types/api/upload/plant-site-upload.type';
import { GeolocationLockOnComponent } from '../../components/GeolocationLockOnComponent';
import { LatLong } from '../../types/lat-long.type';
import { AccuracyIndicator } from '../PlantSite/CommonFormElements/AccuracyIndicator';
import { putFeatureWithPhotos } from '../../services/api/feature-upload.service';
import { toast } from 'react-toastify';

export function FeatureForm(props: { onSaveHandlerSuccess: () => any }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<PhotoFile[]>([]);
  const [position, setPosition] = useState<LatLong>();

  async function saveFeatureOffline(event: React.FormEvent) {
    event.preventDefault();

    if (photos.length === 0 || !position) {
      return;
    }
    try {
      await putFeatureWithPhotos(
        name,
        description,
        position,
        photos.map((photo) => photo.file),
      );
      props.onSaveHandlerSuccess();
    } catch (error) {
      toast(
        `There was an error adding the feature: ${(error as Error).message}`,
      );
    }
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

  function renderAccuracyIndicator() {
    if (!position) return;

    return <AccuracyIndicator position={position} />;
  }

  return (
    <form onSubmit={saveFeatureOffline} className="bg-background w-full">
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

      <div className="pb-3">
        <div className="pb-3">
          <GeolocationLockOnComponent
            onGeolocationLocked={(coordinates) => setPosition(coordinates)}
            onLockingOn={() => setPosition(undefined)}
          />
        </div>
        {renderAccuracyIndicator()}
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

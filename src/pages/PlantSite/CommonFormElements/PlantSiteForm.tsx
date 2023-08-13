import React, { FormEvent, useState } from 'react';
import AutocompleteComponent from '../../../components/AutocompleteComponent';
import { plantTable } from '../../../services/offline.database';
import { getFullPlantName } from '../../../utils/plant-name-decorator.util';
import { useLiveQuery } from 'dexie-react-hooks';
import { addPlantSiteWithPhoto } from '../../../services/api/plant-site-upload.service';
import { AccuracyIndicator } from '../CommonFormElements/AccuracyIndicator';
import { PhotoInput } from '../CommonFormElements/PhotoInput';
import { PhotoFile } from '../../../types/api/upload/plant-site-upload.type';
import { LatLong } from '../../../types/lat-long.type';
import { GeolocationLockOnComponent } from '../../../components/GeolocationLockOnComponent';

export function PlantSiteForm(props: {
  onSaveHandlerSuccess: () => void;
  plantNameValue?: string;
  plantSiteUploadId?: number;
  photoFiles?: PhotoFile[];
  coordinates?: LatLong;
}) {
  const [photos, setPhotos] = useState<PhotoFile[]>(props.photoFiles || []);
  const [plantNameValue, setPlantNameValue] = useState<string>(
    props.plantNameValue || '',
  );
  const [position, setPosition] = useState(props.coordinates);

  const plantList = useLiveQuery(async () => {
    const allPlants = await plantTable.toArray();
    return allPlants.map((plant) => ({
      name: getFullPlantName(plant),
      id: plant.id,
    }));
  });

  async function savePhotoLocally(event: FormEvent) {
    event.preventDefault();

    const plantId = findPlantIdByFullName();

    if (photos.length === 0 || !position) {
      return;
    }

    await addPlantSiteWithPhoto(
      photos.map((photo) => photo.file),
      position,
      plantId,
      props.plantSiteUploadId,
    );

    props.onSaveHandlerSuccess();
  }

  function findPlantIdByFullName() {
    return plantList?.find((plant) => plant.name === plantNameValue)?.id;
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

  function renderSave() {
    if (photos.length === 0 || !position) return;

    return (
      <div className="pb-10">
        <input
          className="block border-solid  border px-6 py-2 bg-sky-600
        font-semibold tracking-wide text-white hover:bg-gray-300 cursor-pointer"
          type="submit"
          data-cy="save-plant-site"
          value="Save offline to upload later"
        />
      </div>
    );
  }

  function renderTipAboutMissingPlant() {
    if (photos.length > 0 && !plantNameValue) {
      return (
        <p className="mb-5 text-blue-700">
          Note: You can save the plant site now, but you will need to identify
          it before you upload it on the pending uploads page
        </p>
      );
    }
  }

  function renderPosition() {
    if (!position) return;

    return <AccuracyIndicator position={position} />;
  }

  return (
    <form onSubmit={savePhotoLocally} className="bg-white w-full">
      <div
        className="mb-7 relative sm:max-w-md"
        data-cy="plant-form-autocomplete-container"
      >
        <div className="relative z-10">
          <AutocompleteComponent
            items={plantList?.map((plantItem) => plantItem.name) || []}
            placeholder="Type species name to search"
            onChangeHandler={(value: string) => setPlantNameValue(value)}
            suggestionText="Available species"
            value={plantNameValue}
          />
        </div>
      </div>
      <div className="relative mb-5">
        <PhotoInput
          photos={photos}
          onPhotoChangeHandler={onPhotoChange}
          onPhotoRemoveHandler={removePlantPhoto}
        />
      </div>
      <div className="mb-8">
        <GeolocationLockOnComponent
          onGeolocationLocked={(coordinates) => setPosition(coordinates)}
          onLockingOn={() => setPosition(undefined)}
        />
        {renderPosition()}
      </div>
      {renderTipAboutMissingPlant()}
      {renderSave()}
    </form>
  );
}

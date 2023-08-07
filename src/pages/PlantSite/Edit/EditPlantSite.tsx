import { PlantSiteForm } from '../CommonFormElements/PlantSiteForm';
import { Plant } from '../../../types/api/plant.type';
import { useLoaderData } from 'react-router-dom';
import { getFullPlantName } from '../../../utils/plant-name-decorator.util';
import React, { FormEvent, useState } from 'react';
import AutocompleteComponent from '../../../components/AutocompleteComponent';
import { plantTable } from '../../../services/offline.database';
import { useLiveQuery } from 'dexie-react-hooks';
import { addPlantSiteWithPhoto } from '../../../services/api/plant-site-upload.service';
import { usePosition } from '../../../hooks/use-position.hook';
import { useNavigate } from 'react-router-dom';
import { AccuracyIndicator } from '../CommonFormElements/AccuracyIndicator';
import { PhotoInput } from '../CommonFormElements/PhotoInput';
import { PlantSiteUpload } from '../../../types/api/upload/plant-site-upload.type';

type EditLoaderData = {
  plantSiteUpload: PlantSiteUpload;
  plant?: Plant;
};
type PhotoFile = {
  id: string;
  file: File;
};

export function EditPlantSite() {
  const { plantSiteUpload, plant } = useLoaderData() as EditLoaderData;

  const [photos, setPhotos] = useState<PhotoFile[]>([]);
  const [plantNameValue, setPlantNameValue] = useState<string>(
    getPlantName() || '',
  );
  const liveCoords = usePosition();
  const navigate = useNavigate();

  const plantList = useLiveQuery(async () => {
    const allPlants = await plantTable.toArray();
    return allPlants.map((plant) => ({
      name: getFullPlantName(plant),
      id: plant.id,
    }));
  });

  function getPlantName() {
    if (!plant) return '';

    return getFullPlantName(plant);
  }

  async function savePhotoLocally(event: FormEvent) {
    event.preventDefault();

    const plantId = findPlantIdByFullName();

    if (photos.length === 0 || !liveCoords) {
      return;
    }

    await addPlantSiteWithPhoto(
      photos.map((photo) => photo.file),
      liveCoords,
      plantId,
      plantSiteUpload?.id,
    );

    navigate('/');
  }

  function findPlantIdByFullName() {
    // Case where there is a plant with a blank name
    // Should fix this in the database
    if (plantNameValue?.length === 0) return;

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

  function renderLiveLocation() {
    if (photos.length === 0 || !liveCoords) return;

    return <AccuracyIndicator position={liveCoords} />;
  }

  function removePlantPhoto(photoIdToRemove: string) {
    const photosCopy = photos.filter(
      (photoFile) => photoFile.id !== photoIdToRemove,
    );
    setPhotos(photosCopy);
  }

  function renderSave() {
    if (photos.length === 0) return;

    return (
      <input
        className="block border-solid  border px-6 py-2 bg-sky-600
        font-semibold tracking-wide text-white hover:bg-gray-300 cursor-pointer"
        type="submit"
        data-cy="save-plant-site"
        value="Lock in location and save!"
        onSubmit={savePhotoLocally}
      />
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

  return (
    <div className="h-full">
      <div className="absolute top-0 pt-14 left-0 bg-white w-full h-full px-6">
        <form onSubmit={savePhotoLocally}>
          <h1 className="font-bold mt-5 mb-7 text-xl">Add a new location</h1>
          <div
            className="mb-7 z-10 relative max-w-md"
            data-cy="plant-form-autocomplete-container"
          >
            <AutocompleteComponent
              items={plantList?.map((plantItem) => plantItem.name) || []}
              placeholder="Type species name to search"
              onChangeHandler={(value: string) => setPlantNameValue(value)}
              suggestionText="Available species"
              value={plantNameValue}
            />
          </div>
          <PhotoInput
            photos={photos}
            onPhotoChangeHandler={onPhotoChange}
            onPhotoRemoveHandler={removePlantPhoto}
          />
          {renderLiveLocation()}
          {renderTipAboutMissingPlant()}
          {renderSave()}
        </form>
      </div>
    </div>
  );
}

import React, { FormEvent, useState } from 'react';
import { ButtonComponent } from './ButtonComponent';
import AutocompleteComponent from './AutocompleteComponent';
import { plantTable } from '../services/offline.database';
import { getFullPlantName } from '../utils/plant-name-decorator.util';
import { useLiveQuery } from 'dexie-react-hooks';
import { addPlantSiteWithPhoto } from '../services/api/plant-site-upload.service';
import cameraUrl from '../assets/svg/camera.svg';
import { usePosition } from '../hooks/use-position.hook';
import { useAppStore } from '../store/app.store';
import { PlantPhotoImage } from './PlantPhotoImage';

type PhotoFile = {
  id: string;
  file: File;
};

export function PlantPhotoForm() {
  const [photos, setPhotos] = useState<PhotoFile[]>([]);
  const [plantNameValue, setPlantNameValue] = useState<string>();

  const currentView = useAppStore((state) => state.activeView);
  const setActiveView = useAppStore((state) => state.setActiveView);
  const liveCoords = usePosition();

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

    if (photos.length === 0 || !plantId || !liveCoords) {
      return;
    }

    await addPlantSiteWithPhoto(
      photos.map((photo) => photo.file),
      liveCoords,
      plantId,
    );

    resetForm();
    setActiveView('ViewMap');
  }

  function findPlantIdByFullName() {
    return plantList?.find((plant) => plant.name === plantNameValue)?.id;
  }

  function resetForm() {
    setPhotos([]);
    setPlantNameValue('');
  }

  async function onPhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newPhoto = event.target.files?.item(0);
    if (newPhoto) {
      const photosCopy = [...photos];

      const array = new Uint32Array(10);
      crypto.getRandomValues(array);

      photosCopy.push({
        file: newPhoto,
        id: crypto.randomUUID(),
      });

      setPhotos(photosCopy);
    }
  }

  function isViewActive() {
    return currentView == 'AddPlant';
  }

  function toggleView() {
    if (isViewActive()) {
      setActiveView('ViewMap');
    } else {
      setActiveView('AddPlant');
    }
  }

  function renderPhotos() {
    if (photos.length === 0) return;

    console.log('fds');
    return (
      <div data-cy="plant-form-images">
        <label className="block mb-3 font-semibold">Photos</label>
        {photos?.map((photoImage) => (
          <PlantPhotoImage
            key={photoImage.id}
            {...photoImage}
            onRemoveHandler={removePlantPhoto}
          />
        ))}
      </div>
    );
  }

  function removePlantPhoto(photoIdToRemove: string) {
    const photosCopy = photos.filter(
      (photoFile) => photoFile.id !== photoIdToRemove,
    );
    setPhotos(photosCopy);
  }

  function renderLiveLocation() {
    if (photos.length === 0 || !liveCoords) return;

    return (
      <div className="mb-5">
        <div className="inline-block">
          <h3 className="font-bold">Latitude</h3>
          <p>{liveCoords.latitude.toFixed(2)}</p>
        </div>
        <div className="inline-block ml-6">
          <h3 className="font-bold">Longitude</h3>
          <p>{liveCoords.longitude.toFixed(2)}</p>
        </div>
        <div className="block mt-3 ">
          <p>
            Accurate to within{' '}
            <span className={getAccuracyColorIndicator(liveCoords.accuracy)}>
              {liveCoords.accuracy.toFixed(2)}
              <b>m</b>
            </span>
          </p>
        </div>
      </div>
    );
  }

  function getAccuracyColorIndicator(accuracy: number) {
    if (accuracy > 20) {
      return 'text-red-600';
    } else if (accuracy > 10 && accuracy < 20) {
      return 'text-yellow-600';
    } else {
      return 'text-green-600';
    }
  }

  function renderSave() {
    if (photos.length === 0 || !plantNameValue) {
      return;
    }
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

  function renderModalButton() {
    const buttonVisible =
      currentView === 'AddPlant' || currentView === 'ViewMap';

    if (!buttonVisible) {
      return;
    }
    return (
      <ButtonComponent
        text={isViewActive() ? 'Close' : 'New plant site'}
        onClickHandler={() => toggleView()}
        className="absolute top-2 right-3"
      ></ButtonComponent>
    );
  }

  return (
    <div>
      <div
        className={`${
          isViewActive() ? '' : 'hidden'
        } absolute top-0 pt-14 left-0 bg-white w-full h-full p-6`}
      >
        <form onSubmit={savePhotoLocally}>
          <h1 className="font-bold mt-5 mb-7 text-xl">Add a new location</h1>
          <div className="mb-7 z-10 relative max-w-md">
            <AutocompleteComponent
              items={plantList?.map((plantItem) => plantItem.name) || []}
              placeholder="Type species name to search"
              onChangeHandler={(value: string) => setPlantNameValue(value)}
              suggestionText="Available species"
            />
          </div>
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
          {renderLiveLocation()}
          {renderSave()}
        </form>
      </div>
      {renderModalButton()}
    </div>
  );
}

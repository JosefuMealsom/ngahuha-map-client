import React, { FormEvent, useState } from 'react';
import geolocationService from '../services/geolocation.service';
import { ButtonComponent } from './ButtonComponent';
import blobToDataUrlService from '../services/blob-to-data-url.service';
import AutocompleteComponent from './AutocompleteComponent';
import { plantTable } from '../services/offline.database';
import { getFullPlantName } from '../utils/plant-name-decorator.util';
import { useLiveQuery } from 'dexie-react-hooks';
import { addPlantSiteWithPhoto } from '../services/api/plant-site-upload.service';
import cameraUrl from '../assets/svg/camera.svg';

export function PlantPhotoForm() {
  const [photo, setPhotoInput] = useState<File>();
  const [plantNameValue, setPlantNameValue] = useState<string>();
  const [modalOpen, setModalState] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [currentPosition, setCurrentPosition] =
    useState<GeolocationCoordinates>();

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

    if (!currentPosition || !photo || !plantId) {
      return;
    }

    await addPlantSiteWithPhoto(photo, currentPosition, plantId);

    resetForm();
    toggleModal();
  }

  function findPlantIdByFullName() {
    return plantList?.find((plant) => plant.name === plantNameValue)?.id;
  }

  function resetForm() {
    setPhotoInput(undefined);
    setCurrentPosition(undefined);
    setPreviewImage('');
    setPlantNameValue('');
  }

  async function onPhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newPhoto = event.target.files?.item(0);
    if (newPhoto) {
      setPhotoInput(newPhoto);

      const photoData = await blobToDataUrlService.convert(newPhoto);
      if (photoData) {
        setPreviewImage(photoData);
      }
    }
    const position = await geolocationService.getCurrentPosition();
    if (position) {
      setCurrentPosition(position);
    }
  }

  function toggleModal() {
    setModalState(!modalOpen);
  }

  function renderGelocation() {
    if (!currentPosition) {
      return;
    }

    return (
      <p className="mb-3">
        Geolocation accurate to: {currentPosition.accuracy.toFixed(2)} metres
      </p>
    );
  }

  function renderPhotos() {
    if (!photo) {
      return;
    }
    return (
      <div>
        <label className="block mb-3 font-semibold">Photos</label>
        <img src={previewImage} className="mb-3 w-1/4" />
      </div>
    );
  }

  function renderSave() {
    if (!currentPosition || !photo || !plantNameValue) {
      return;
    }
    return (
      <input
        className="block border-solid  border px-6 py-2 bg-sky-600
        font-semibold tracking-wide text-white hover:bg-gray-300 cursor-pointer"
        type="submit"
        value="Save"
        onSubmit={savePhotoLocally}
      />
    );
  }

  return (
    <div>
      <div
        className={`${
          modalOpen ? '' : 'hidden'
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
            >
              Take photo
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
          {renderGelocation()}
          {renderSave()}
        </form>
      </div>
      <ButtonComponent
        text={modalOpen ? 'Close' : 'New plant site'}
        onClickHandler={toggleModal}
        className="absolute top-2 right-3"
      ></ButtonComponent>
    </div>
  );
}

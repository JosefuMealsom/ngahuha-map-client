import React, { FormEvent, useEffect, useState } from 'react';
import geolocationService from '../services/geolocation.service';
import { ButtonComponent } from './ButtonComponent';
import blobToDataUrlService from '../services/blob-to-data-url.service';
import { AutocompleteComponent } from './AutocompleteComponent';
import offlineDatabase from '../services/database/offline.database';

export function PlantPhotoForm() {
  const [photo, setPhotoInput] = useState<File>();
  const [genus, setGenus] = useState<string>();
  const [cultivar, setCultivar] = useState<string>();
  const [species, setSpecies] = useState<string>();

  const [genusList, setGenusList] = useState<string[]>([]);
  const [speciesList, setSpeciesList] = useState<string[]>([]);

  useEffect(() => {
    const populateGenusList = async () => {
      const genera = await offlineDatabase.genus.toArray();
      setGenusList(genera.map((genus) => genus.name));

      const allSpecies = await offlineDatabase.species.toArray();
      setSpeciesList(allSpecies.map((species) => species.name));
    };
    populateGenusList();
  });

  const [modalOpen, setModalState] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [currentPosition, setCurrentPosition] =
    useState<GeolocationCoordinates>();

  async function savePhotoLocally(event: FormEvent) {
    event.preventDefault();

    if (!species || !genus || !currentPosition || !photo) {
      return;
    }
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

  return (
    <div>
      <div
        className={`${
          modalOpen ? '' : 'hidden'
        } absolute top-0 pt-14 left-0 bg-white w-full h-full p-6`}
      >
        <form onSubmit={savePhotoLocally}>
          <h1 className="font-bold mt-5 mb-3">Add a new plant</h1>
          <label htmlFor="genera" className="block">
            Genus
          </label>
          <AutocompleteComponent items={genusList} placeholder="Genus name" />

          <label htmlFor="test" className="block">
            Species
          </label>
          <AutocompleteComponent
            items={speciesList}
            placeholder="Species name"
          />
          <label htmlFor="cultivar" className="block">
            Cultivar
          </label>
          <input
            id="cultivar"
            name="cultivar"
            type="text"
            className="mb-3 w-full"
            placeholder="Cultivar name"
            onChange={(e) => {
              setCultivar(e.target.value);
            }}
          />
          <div>
            <label
              htmlFor="photo"
              className="border-solid border-black border-2 p-2 hover:bg-gray-300 cursor-pointer mb-2 inline-block"
            >
              Take photo
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
          <img src={previewImage} className="mb-3 max-w-lg w-full" />
          <p className="mb-3">
            Geolocation accurate to: {currentPosition?.accuracy.toFixed(2)}{' '}
            metres
          </p>
          <input
            className="block border-solid border-black border-2 p-2 hover:bg-gray-300 cursor-pointer"
            type="submit"
            value="Save"
            onSubmit={savePhotoLocally}
          />
        </form>
      </div>
      <ButtonComponent
        text={modalOpen ? 'Close' : 'New plant site'}
        onClickHandler={toggleModal}
        className="absolute top-2 right-3"
        id="plant-form-btn"
      ></ButtonComponent>
    </div>
  );
}

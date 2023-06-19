import React, { FormEvent, createRef, useRef, useState } from 'react';
import photoDatabaseService from '../services/plant-site-photo-database.service';
import geolocationService from '../services/geolocation.service';
import fileToDataUrlService from '../services/file-to-data-url.service';
import { ButtonComponent } from './ButtonComponent';

export function PlantPhotoForm() {
  const [photo, setPhotoInput] = useState<File>();
  const [modalOpen, setModalState] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [currentPosition, setCurrentPosition] =
    useState<GeolocationCoordinates>();

  async function savePhotoLocally(event: FormEvent) {
    event.preventDefault();
    if (photo && currentPosition) {
      const success = await photoDatabaseService.add(photo, currentPosition);

      if (success) {
        toggleModal();
      }
    }
  }

  async function onPhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newPhoto = event.target.files?.item(0);
    if (newPhoto) {
      setPhotoInput(newPhoto);

      const photoData = await fileToDataUrlService.convert(newPhoto);
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
          <label htmlFor="genus" className="block">
            Genus
          </label>
          <input
            id="genus"
            type="text"
            className="mb-3 w-full"
            placeholder="Genus name"
          />
          <label htmlFor="species" className="block">
            Species
          </label>
          <input
            id="species"
            type="text"
            className="mb-3 w-full"
            placeholder="Species name"
          />
          <label htmlFor="cultivar" className="block">
            Cultivar
          </label>
          <input
            id="cultivar"
            type="text"
            className="mb-3 w-full"
            placeholder="Cultivar name"
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
        text={modalOpen ? 'Close' : 'New plant'}
        onClickHandler={toggleModal}
        className="absolute top-2 right-3"
        id="plant-form-btn"
      ></ButtonComponent>
    </div>
  );
}

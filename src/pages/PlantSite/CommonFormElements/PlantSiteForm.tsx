import React, { FormEvent, createContext, useState } from 'react';
import AutocompleteComponent from '../../../components/AutocompleteComponent';
import { plantTable } from '../../../services/offline.database';
import { useLiveQuery } from 'dexie-react-hooks';
import { addPlantSiteWithPhoto } from '../../../services/api/plant-site/plant-site-upload.service';
import { AccuracyIndicator } from '../CommonFormElements/AccuracyIndicator';
import { PhotoInput } from '../CommonFormElements/PhotoInput';
import { PhotoFile } from '../../../types/api/upload/plant-site-upload.type';
import { LatLong } from '../../../types/lat-long.type';
import { GeolocationLockOnComponent } from '../../../components/GeolocationLockOnComponent';
import { SearchPlantsFilter } from '../../../services/filter/search-plants.filter';
import { SearchFilterMatch } from '../../../types/filter.type';
import { Plant } from '../../../types/api/plant.type';
import { PlantFormContext } from './PlantFormContext';
import { findWhere } from 'underscore';

export function PlantSiteForm(props: {
  onSaveHandlerSuccess: () => void;
  plantNameValue?: string;
  plantSiteUploadId?: number;
  photoFiles?: PhotoFile[];
  coordinates?: LatLong;
}) {
  const [photos, setPhotos] = useState<PhotoFile[]>(props.photoFiles || []);
  const [position, setPosition] = useState(props.coordinates);
  const [searchPlantsFilter, setSearchPlantsFilter] = useState(
    new SearchPlantsFilter([]),
  );
  const [selectedPlant, setSelectedPlant] = useState<Plant>();

  useLiveQuery(async () => {
    const allPlants = await plantTable.toArray();
    setSearchPlantsFilter(new SearchPlantsFilter(allPlants));
  });

  function setPrimaryPhoto(photoFileId: string) {
    if (photos.length === 0) return;

    const photosCopy = [...photos];

    const newPrimaryPhoto = findWhere(photosCopy, { id: photoFileId });
    if (newPrimaryPhoto) {
      photosCopy.forEach((p) => (p.primaryPhoto = false));
      newPrimaryPhoto.primaryPhoto = true;

      setPhotos(photosCopy);
    }
  }

  async function savePhotoLocally(event: FormEvent) {
    event.preventDefault();

    if (photos.length === 0 || !position) {
      return;
    }

    const mappedPhotos = photos.map((photo) => ({
      file: photo.file,
      primaryPhoto: photo.primaryPhoto,
    }));

    await addPlantSiteWithPhoto(
      mappedPhotos,
      position,
      selectedPlant?.id,
      props.plantSiteUploadId,
    );

    props.onSaveHandlerSuccess();
  }

  async function onPhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newPhoto = event.target.files?.item(0);
    if (newPhoto) {
      const photosCopy = [...photos];

      let isPrimaryPhoto = photosCopy.length === 0 ? true : false;

      photosCopy.push({
        file: newPhoto,
        id: crypto.randomUUID(),
        primaryPhoto: isPrimaryPhoto,
      });

      setPhotos(photosCopy);
    }
  }

  function removePlantPhoto(photoIdToRemove: string) {
    const photosCopy = photos.filter(
      (photoFile) => photoFile.id !== photoIdToRemove,
    );

    const primaryPhotoSet = findWhere(photosCopy, {
      primaryPhoto: true,
    });

    if (!primaryPhotoSet && photosCopy.length > 0) {
      photosCopy[0].primaryPhoto = true;
    }

    setPhotos(photosCopy);
  }

  function renderSave() {
    if (photos.length === 0 || !position) return;

    return (
      <div className="pb-10">
        <input
          className="block border-solid border px-4 py-2 text-sm rounded-full bg-sky-600
        font-semibold text-white hover:bg-gray-300 cursor-pointer"
          type="submit"
          data-cy="save-plant-site"
          value="Save offline"
        />
      </div>
    );
  }

  function renderTipAboutMissingPlant() {
    if (photos.length > 0 && !selectedPlant) {
      return (
        <p className="pb-5 text-xs text-blue-700">
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
    <PlantFormContext.Provider value={{ setPrimaryPhoto: setPrimaryPhoto }}>
      <form onSubmit={savePhotoLocally} className="w-full">
        <div
          className="mb-7 relative sm:max-w-md"
          data-cy="plant-form-autocomplete-container"
        >
          <div className="relative z-10">
            <AutocompleteComponent
              searchFilter={searchPlantsFilter}
              placeholder="Type species name to search"
              onItemSelectHandler={(match: SearchFilterMatch<Plant>) =>
                setSelectedPlant(match.data)
              }
              suggestionText="Available species"
              // value={plantNameValue}
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
        <div className="pb-3">
          <GeolocationLockOnComponent
            onGeolocationLocked={(coordinates) => setPosition(coordinates)}
            onLockingOn={() => setPosition(undefined)}
          />
        </div>
        <div>{renderPosition()}</div>
        {renderTipAboutMissingPlant()}
        {renderSave()}
      </form>
    </PlantFormContext.Provider>
  );
}

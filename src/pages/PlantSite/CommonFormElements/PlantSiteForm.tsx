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
import { SearchPlantsFilter } from '../../../services/filter/search-plants.filter';
import { SearchFilterMatch } from '../../../types/filter.type';
import { Plant } from '../../../types/api/plant.type';

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

  const plantList = useLiveQuery(async () => {
    const allPlants = await plantTable.toArray();
    setSearchPlantsFilter(new SearchPlantsFilter(allPlants));
    return allPlants.map((plant) => ({
      name: getFullPlantName(plant),
      id: plant.id,
    }));
  });

  async function savePhotoLocally(event: FormEvent) {
    event.preventDefault();

    if (photos.length === 0 || !position || !selectedPlant) {
      return;
    }

    await addPlantSiteWithPhoto(
      photos.map((photo) => photo.file),
      position,
      selectedPlant.id,
      props.plantSiteUploadId,
    );

    props.onSaveHandlerSuccess();
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
      <div className="mb-2">
        <GeolocationLockOnComponent
          onGeolocationLocked={(coordinates) => setPosition(coordinates)}
          onLockingOn={() => setPosition(undefined)}
        />
      </div>
      <div>{renderPosition()}</div>
      {renderTipAboutMissingPlant()}
      {renderSave()}
    </form>
  );
}

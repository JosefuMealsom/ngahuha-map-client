import React, { FormEvent, useState } from 'react';
import photoDatabaseService from '../services/plant-site-photo-database.service';
import geolocationService from '../services/geolocation-service';

export function PlantPhotoForm() {
  const [photo, setPhotoInput] = useState<File>();

  async function savePhotoLocally(event: FormEvent) {
    if (photo) {
      const position = await geolocationService.getCurrentPosition();
      photoDatabaseService.add(photo, position);
    }
    event.preventDefault();
  }

  return (
    <div>
      <form onSubmit={savePhotoLocally}>
        <input
          type="file"
          capture="user"
          accept="image/*"
          className="mb-4"
          onChange={(event) =>
            setPhotoInput(event.target.files?.item(0) || undefined)
          }
        />
        <input
          className="block border-solid border-black border-2 p-2 hover:bg-gray-300 cursor-pointer"
          type="submit"
          onSubmit={savePhotoLocally}
        />
      </form>
    </div>
  );
}

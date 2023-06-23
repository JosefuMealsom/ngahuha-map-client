import { useEffect, useState } from 'react';
import plantSitePhotoDatabaseService from '../services/api/plant-site.service';
import type { PlantSite } from '../types/api/plant-site.type';
import { ButtonComponent } from './ButtonComponent';
import offlineDatabase from '../services/database/offline.database';
import { Genus } from '../types/api/genus.type';
import { Species } from '../types/api/species.type';

export function PlantSiteComponent(props: PlantSite) {
  const [photoDataUrl, setPhotoDataUrl] = useState('');
  const [species, setSpecies] = useState<Species>();
  const [genus, setGenus] = useState<Genus>();

  const getSpeciesInfo = async () => {
    const species = await offlineDatabase.species.get(props.speciesId);

    if (!species) {
      return;
    }

    const genus = await offlineDatabase.genus.get(species.genusId);
    setSpecies(species);
    setGenus(genus);
  };

  useEffect(() => {
    getSpeciesInfo();
  }, []);

  function editPhoto() {}

  function renderSpeciesInfo() {
    if (!species || !genus) {
      return;
    }

    return (
      <div>
        <h1 className="font-bold">Genus</h1>
        <p>{genus.name}</p>
        <h1 className="font-bold">Species</h1>
        <p>{species.name}</p>
        <h1 className="font-bold">Cultivar</h1>
        <p>{species.cultivar}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-40 mb-5">
      <div className="inline-block align-middle">{renderSpeciesInfo()}</div>
      <ButtonComponent
        onClickHandler={editPhoto}
        className="absolute right-4 text-right"
        text="Edit"
      ></ButtonComponent>
    </div>
  );
}

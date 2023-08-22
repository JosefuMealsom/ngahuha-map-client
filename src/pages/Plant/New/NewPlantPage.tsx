import { FormEvent, useState } from 'react';
import { createPlant } from '../../../services/api/plant.service';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export function NewPlantPage() {
  const navigate = useNavigate();

  const [species, setSpecies] = useState('');
  const [subSpecies, setSubspecies] = useState('');
  const [description, setDescription] = useState('');

  async function createPlantSite(event: FormEvent) {
    event.preventDefault();

    try {
      await createPlant(species, subSpecies, description);
      toast('Plant created successfully');
      navigate('/', { replace: true });
    } catch (error) {
      toast(`An error occured when creating the plant: ${error}`);
    }
  }

  return (
    <div className="absolute top-0 pt-safe left-0 bg-background w-full h-full">
      <div className="w-full bg-background px-6 pt-7">
        <h1 className="font-bold mb-7 text-xl text-inverted-background">
          Create a new plant
        </h1>
        <form
          onSubmit={createPlantSite}
          className="bg-background w-full sm:w-96"
        >
          <label className="mb-2 text-inverted-background text-sm font-bold block">
            Species
          </label>
          <input
            type="text"
            className="w-full py-2 px-4 border font-light border-gray-400 rounded-full mb-5"
            placeholder="Species"
            value={species}
            onChange={(event) => {
              setSpecies(event.target.value);
            }}
            data-cy="species-input"
          />

          <label className="mb-2 text-inverted-background text-sm font-bold block">
            Subspecies
          </label>
          <input
            type="text"
            className="w-full py-2 px-4 border font-light border-gray-400 rounded-full mb-5"
            placeholder="Optional"
            value={subSpecies}
            onChange={(event) => {
              setSubspecies(event.target.value);
            }}
            data-cy="subspecies-input"
          />

          <label className="mb-2 text-inverted-background text-sm font-bold block">
            Description
          </label>
          <input
            type="text"
            className="w-full py-2 px-4 border font-light border-gray-400 rounded-full mb-5"
            placeholder="Optional"
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
            }}
            data-cy="description-input"
          />

          <div className="pb-10">
            <input
              className="block border-solid border px-4 py-2 text-sm rounded-full bg-sky-600
              font-semibold text-white hover:bg-gray-300 cursor-pointer"
              type="submit"
              value="Create new plant"
              onSubmit={createPlantSite}
              data-cy="create-plant"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

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
      toast(
        `An error occured when creating the plant: ${(error as Error).message}`,
      );
    }
  }

  return (
    <div className="absolute top-0 pt-14 left-0 bg-white w-full h-full">
      <div className="w-full bg-white px-6">
        <h1 className="font-bold mt-5 mb-7 text-xl">Create a new plant</h1>
        <form onSubmit={createPlantSite} className="bg-white w-full sm:w-96">
          <label className="mb-5">Species</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-400 rounded-md mb-5"
            placeholder="Species"
            value={species}
            onChange={(event) => {
              setSpecies(event.target.value);
            }}
            data-cy="species-input"
          />

          <label className="mb-5">Subspecies</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-400 rounded-md mb-5"
            placeholder="Optional"
            value={subSpecies}
            onChange={(event) => {
              setSubspecies(event.target.value);
            }}
            data-cy="subspecies-input"
          />

          <label className="mb-5">Description</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-400 rounded-md mb-5"
            placeholder="Optional"
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
            }}
            data-cy="description-input"
          />

          <div className="pb-10">
            <input
              className="block border-solid  border px-6 py-2 bg-sky-600
        font-semibold tracking-wide text-white hover:bg-gray-300 cursor-pointer"
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

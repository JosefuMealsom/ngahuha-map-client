import { useState } from 'react';
import { Plant } from '../../types/api/plant.type';
import { MarkDownEditorComponent } from '../../components/MarkdownEditorComponent';

export function PlantForm(props: {
  plant?: Plant;
  onSubmitHandler: (data: CreatePlantData) => void;
}) {
  const { plant } = props;
  const [species, setSpecies] = useState(plant?.species || '');
  const [subSpecies, setSubspecies] = useState(plant?.cultivar || '');
  const [description, setDescription] = useState(plant?.description || '');
  const [typesValue, setTypesValue] = useState(
    plant?.extendedInfo?.types.join(',') || '',
  );
  const [tagsValue, setTagsValue] = useState(
    plant?.extendedInfo?.tags.join(',') || '',
  );
  const [commonNamesValue, setCommonNamesValue] = useState(
    plant?.extendedInfo?.commonNames.join(',') || '',
  );

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    const tags = tagsValue ? tagsValue.split(',') : [];
    const types = typesValue ? typesValue.split(',') : [];
    const commonNames = commonNamesValue ? commonNamesValue.split(',') : [];

    props.onSubmitHandler({
      species: species,
      cultivar: subSpecies,
      description: description,
      extendedInfo: { tags: tags, types: types, commonNames: commonNames },
    });
  }

  return (
    <form onSubmit={onSubmit} className="bg-background w-full">
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
      <MarkDownEditorComponent
        onChangeHandler={(value) => setDescription(value)}
        className="sm:overflow-scroll py-6"
        value={plant?.description}
        data-cy="description-input"
      />
      <h1 className="mb-5 text-sm font-bold">
        Extended information (optional)
      </h1>
      <label className="mb-2 text-inverted-background text-sm font-bold block">
        Types
      </label>
      <input
        type="text"
        className="w-full py-2 px-4 border font-light border-gray-400 rounded-full mb-5"
        placeholder="Types"
        value={typesValue}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setTypesValue(event.target.value)
        }
        data-cy="types-input"
      />
      <label className="mb-2 text-inverted-background text-sm font-bold block">
        Tags
      </label>
      <input
        type="text"
        className="w-full py-2 px-4 border font-light border-gray-400 rounded-full mb-5"
        placeholder="Tags"
        value={tagsValue}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setTagsValue(event.target.value)
        }
        data-cy="tags-input"
      />
      <label className="mb-2 text-inverted-background text-sm font-bold block">
        Common names
      </label>
      <input
        type="text"
        className="w-full py-2 px-4 border font-light border-gray-400 rounded-full mb-5"
        placeholder="Common names"
        value={commonNamesValue}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setCommonNamesValue(event.target.value)
        }
        data-cy="common-names-input"
      />
      <p className="mb-5 text-inverted-background text-xs">
        To add multiple tags, types or common names, separate each entry with
        ','
      </p>
      <div className="pb-10">
        <input
          className="block border-solid border px-4 py-2 text-sm rounded-full bg-sky-600
        font-semibold text-white hover:bg-gray-300 cursor-pointer"
          type="submit"
          data-cy="create-plant"
          value="Save"
        />
      </div>
    </form>
  );
}

import { toast } from 'react-toastify';
import { Plant } from '../../../types/api/plant.type';
import React, { useState } from 'react';
import { updateExtendedInfo } from '../../../services/api/plant.service';

export function ExtendedInfoEditor(props: { plant: Plant }) {
  const { plant } = props;
  const [typesValue, setTypesValue] = useState<string>(
    plant.extendedInfo?.types?.join(','),
  );
  const [tagsValue, setTagsValue] = useState<string>(
    plant.extendedInfo?.tags?.join(','),
  );
  const [commonNamesValue, setCommonNamesValue] = useState<string>(
    plant.extendedInfo?.commonNames?.join(','),
  );

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    const tags = tagsValue ? tagsValue.split(',') : [];
    const types = typesValue ? typesValue.split(',') : [];
    const commonNames = commonNamesValue ? commonNamesValue.split(',') : [];

    try {
      await updateExtendedInfo(plant.id, {
        tags: tags,
        types: types,
        commonNames: commonNames,
      });
      toast('Extended info successfully updated');
    } catch (error) {
      toast(
        `There was an error updating the plant: ${(error as Error).message}`,
      );
    }
  }

  return (
    <form onSubmit={onSubmit}>
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
          data-cy="save-extended-info"
          value="Update info"
        />
      </div>
    </form>
  );
}

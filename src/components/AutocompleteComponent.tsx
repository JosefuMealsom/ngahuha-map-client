import Fuse from 'fuse.js';
import React, { useState } from 'react';
import closeIconUrl from '../assets/svg/x.svg';

export default function AutocompleteComponent(props: {
  items: string[];
  placeholder: string;
  onChangeHandler?: (value: string) => any;
}) {
  const [textMatches, setTextMatches] = useState<String[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [autocompleteOpen, setAutocompleteOpen] = useState(false);

  const fuse = new Fuse(props.items, { includeScore: true, distance: 100 });

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    setAutocompleteOpen(true);
    updateInputValue(event.target.value);
  }

  function onItemClick(text: string) {
    setAutocompleteOpen(false);
    updateInputValue(text as string);
  }

  function onClearClick() {
    setAutocompleteOpen(false);
    updateInputValue('');
  }

  function updateInputValue(text: string) {
    setInputValue(text);
    const result = fuse.search(text, { limit: 5 });
    setTextMatches(result.map((match) => match.item));

    if (props.onChangeHandler) {
      props.onChangeHandler(text);
    }
  }

  return (
    <div>
      <div className="relative mb-3">
        <label>
          <input
            type="text"
            className="w-full py-2 px-2 border border-gray-500 rounded-sm"
            placeholder={props.placeholder}
            value={inputValue}
            onChange={onChange}
          />
          <img
            src={closeIconUrl}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-10 p-2"
            onClick={onClearClick}
          />
        </label>
      </div>
      <div className={`${autocompleteOpen ? '' : 'hidden '} block relative`}>
        <ul className="absolute top-0 bg-white drop-shadow-lg w-full">
          {textMatches.map((text) => (
            <li
              className="hover:bg-gray-50 cursor-pointer py-3 px-3 w-full"
              onClick={() => onItemClick(text as string)}
            >
              {text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

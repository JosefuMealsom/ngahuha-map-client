import Fuse from 'fuse.js';
import React, { RefObject, createRef, useState } from 'react';
import closeIconUrl from '../assets/svg/x.svg';

export default function AutocompleteComponent(props: {
  items: string[];
  placeholder: string;
  onChangeHandler?: (value: string) => any;
  suggestionText?: string;
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

  function renderSuggestionText() {
    if (!props.suggestionText || textMatches.length === 0) {
      return;
    }
    return (
      <h3 className="ml-3 mt-2 font-bold text-xs">{props.suggestionText}</h3>
    );
  }

  return (
    <div>
      <div className="relative mb-3">
        <label>
          <input
            type="text"
            className="w-full py-2 px-2 border border-gray-400 rounded-md"
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
        <div className="absolute top-0 bg-white drop-shadow-lg w-full">
          {renderSuggestionText()}
          <ul>
            {textMatches.map((text) => (
              <li
                key={text as string}
                className="hover:bg-gray-50 cursor-pointer py-3 px-3 w-full"
                onClick={() => onItemClick(text as string)}
              >
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

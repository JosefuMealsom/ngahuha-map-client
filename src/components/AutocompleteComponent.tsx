import Fuse from 'fuse.js';
import React, { useEffect, useState } from 'react';
import closeIconUrl from '../assets/svg/x.svg';

export default function AutocompleteComponent(props: {
  items: string[];
  placeholder: string;
  onChangeHandler?: (value: string) => any;
  onItemSelectHandler?: (value: string) => any;
  onClearHandler?: () => any;
  suggestionText?: string;
}) {
  const [textMatches, setTextMatches] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [autocompleteOpen, setAutocompleteOpen] = useState(false);
  const [autocompleteIndex, setAutocompleteIndex] = useState(-1);

  const fuse = new Fuse(props.items, { includeScore: true, distance: 100 });

  useEffect(() => {
    setAutocompleteIndex(-1);
  }, [autocompleteOpen]);

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    setAutocompleteOpen(true);
    updateInputValue(event.target.value);
  }

  function onItemClick(text: string) {
    setAutocompleteOpen(false);
    updateInputValue(text);
    if (props.onItemSelectHandler) {
      props.onItemSelectHandler(text);
    }
  }

  function onClearClick() {
    setAutocompleteOpen(false);
    updateInputValue('');

    if (props.onClearHandler) {
      props.onClearHandler();
    }
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

  function onKeyUp(event: React.KeyboardEvent<HTMLDivElement>) {
    switch (event.key) {
      case 'ArrowUp':
        getPreviousEntry();
        break;
      case 'ArrowDown':
        getNextEntry();
        break;
      case 'Escape':
        setAutocompleteIndex(-1);
        setAutocompleteOpen(false);
        break;
      case 'Enter':
        if (!autocompleteOpen) return;
        onItemClick(textMatches[autocompleteIndex]);
        break;
    }
  }

  function getPreviousEntry() {
    let prevIndex: number;
    if (autocompleteIndex <= -1) {
      prevIndex = textMatches.length - 1;
    } else {
      prevIndex = autocompleteIndex - 1;
    }

    setAutocompleteOpen(true);
    setAutocompleteIndex(prevIndex);
  }

  function getNextEntry() {
    let nextIndex: number;
    if (autocompleteIndex >= textMatches.length - 1) {
      nextIndex = -1;
    } else {
      nextIndex = autocompleteIndex + 1;
    }

    setAutocompleteOpen(true);
    setAutocompleteIndex(nextIndex);
  }

  return (
    <div className="w-full" onKeyUp={onKeyUp}>
      <div className="relative mb-3">
        <label>
          <input
            type="text"
            className="w-full p-2 border border-gray-400 rounded-md"
            placeholder={props.placeholder}
            value={inputValue}
            onChange={onChange}
          />
          <img
            src={closeIconUrl}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-10 p-2 cursor-pointer"
            onClick={onClearClick}
            data-cy="autocomplete-clear-button"
          />
        </label>
      </div>
      <div className={`${autocompleteOpen ? '' : 'hidden '} block relative`}>
        <div className="absolute top-0 bg-white drop-shadow-lg w-full">
          {renderSuggestionText()}
          <ul>
            {textMatches.map((text, index) => (
              <li
                key={text as string}
                className={`hover:bg-gray-50 cursor-pointer py-3 px-3 w-full ${
                  autocompleteIndex === index ? 'bg-gray-50' : ''
                }`}
                onClick={() => onItemClick(text as string)}
                data-cy="autocomplete-entry"
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

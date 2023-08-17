import React, { useEffect, useState } from 'react';
import closeIconUrl from '../assets/svg/x.svg';
import { SearchFilter, SearchFilterMatch } from '../types/filter.type';
import { debounce } from 'underscore';

export default function AutocompleteComponent<T>(props: {
  searchFilter: SearchFilter<T>;
  placeholder: string;
  onChangeHandler?: (value: string) => any;
  onItemSelectHandler?: (match: SearchFilterMatch<T>) => any;
  onClearHandler?: () => any;
  suggestionText?: string;
  value?: string;
}) {
  const [searchMatches, setSearchMatches] = useState<SearchFilterMatch<T>[]>(
    [],
  );
  const [inputValue, setInputValue] = useState(props.value || '');
  const [autocompleteOpen, setAutocompleteOpen] = useState(false);
  const [autocompleteIndex, setAutocompleteIndex] = useState(-1);
  const debouncedUpdateInput = debounce(updateInputValue, 500);

  useEffect(() => {
    setAutocompleteIndex(-1);
  }, [autocompleteOpen]);

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    setAutocompleteOpen(true);
    setInputValue(event.target.value);
    debouncedUpdateInput.cancel();
    debouncedUpdateInput(event.target.value);
  }

  function onItemClick(match: SearchFilterMatch<T>) {
    setAutocompleteOpen(false);
    setInputValue(match.description);

    if (props.onItemSelectHandler) {
      props.onItemSelectHandler(match);
    }
  }

  function onClearClick() {
    setAutocompleteOpen(false);
    debouncedUpdateInput.cancel();
    setInputValue('');
    updateInputValue('');

    if (props.onClearHandler) {
      props.onClearHandler();
    }
  }

  function updateInputValue(text: string) {
    if (text === '') {
      setAutocompleteOpen(false);
      return;
    }

    setSearchMatches(props.searchFilter.search(text));

    if (props.onChangeHandler) {
      props.onChangeHandler(text);
    }
  }

  function renderSuggestionText() {
    if (!props.suggestionText || searchMatches.length === 0) {
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
        onItemClick(searchMatches[autocompleteIndex]);
        break;
    }
  }

  function getPreviousEntry() {
    let prevIndex: number;
    if (autocompleteIndex <= -1) {
      prevIndex = searchMatches.length - 1;
    } else {
      prevIndex = autocompleteIndex - 1;
    }

    setAutocompleteOpen(true);
    setAutocompleteIndex(prevIndex);
  }

  function getNextEntry() {
    let nextIndex: number;
    if (autocompleteIndex >= searchMatches.length - 1) {
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
            className="w-full py-2 px-4 border font-light border-gray-400 rounded-full"
            placeholder={props.placeholder}
            value={inputValue}
            onChange={onChange}
          />
          <img
            src={closeIconUrl}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 p-2 cursor-pointer"
            onClick={onClearClick}
            data-cy="autocomplete-clear-button"
          />
        </label>
      </div>
      <div className={`${autocompleteOpen ? '' : 'hidden '} block relative`}>
        <div className="absolute top-0 bg-white drop-shadow-lg w-full">
          {renderSuggestionText()}
          <ul className="max-h-72 overflow-scroll">
            {searchMatches.map((match, index) => (
              <li
                key={match.description}
                className={`hover:bg-gray-50 cursor-pointer py-3 px-3 w-full ${
                  autocompleteIndex === index ? 'bg-gray-50' : ''
                }`}
                onClick={() => onItemClick(match)}
                data-cy="autocomplete-entry"
              >
                {match.description}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

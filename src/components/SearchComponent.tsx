import React, { ReactHTML, useEffect, useState } from 'react';
import closeIconUrl from '../assets/svg/x.svg';
import { debounce } from 'underscore';
import { SearchFilter, SearchFilterMatch } from '../types/filter.type';

export default function SearchComponent<T>(props: {
  searchFilter: SearchFilter<T>;
  placeholder: string;
  onChange?: (value: string) => any;
  onClearHandler?: () => any;
  onMatchesChange?: (matches: SearchFilterMatch<T>[]) => any;
  suggestionText?: string;
  value?: string;
}) {
  const [searchMatches, setSearchMatches] = useState<SearchFilterMatch<T>[]>();
  const [inputValue, setInputValue] = useState(props.value || '');

  useEffect(() => {
    if (props.onMatchesChange && searchMatches) {
      props.onMatchesChange(searchMatches);
    }
  }, [searchMatches]);

  useEffect(() => {
    if (!props.value) return;

    const matches = props.searchFilter.search(inputValue);
    setSearchMatches(matches);
    if (props.onChange) {
      props.onChange(inputValue);
    }
    if (props.onMatchesChange && matches) {
      props.onMatchesChange(matches);
    }
  }, [props.searchFilter]);

  const debouncedUpdateTextMatches = debounce(updateTextMatches, 500);

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    updateInputValue(event.target.value);

    if (props.onChange) {
      props.onChange(event.target.value);
    }
  }

  function onClearClick() {
    updateInputValue('');

    if (props.onChange) {
      props.onChange('');
    }
    if (props.onClearHandler) {
      props.onClearHandler();
    }
  }

  function updateInputValue(text: string) {
    setInputValue(text);
    debouncedUpdateTextMatches(text);
  }

  function updateTextMatches(text: string) {
    setSearchMatches(props.searchFilter.search(text));
  }

  return (
    <div className="w-full">
      <div className="relative">
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
    </div>
  );
}

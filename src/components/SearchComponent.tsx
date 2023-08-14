import React, { useEffect, useState } from 'react';
import closeIconUrl from '../assets/svg/x.svg';
import { debounce } from 'underscore';
import { SearchFilter, SearchFilterMatch } from '../types/filter.type';

export default function SearchComponent<T>(props: {
  searchFilter: SearchFilter<T>;
  placeholder: string;
  onClearHandler?: () => any;
  onMatchesChange?: (matches: SearchFilterMatch<T>[]) => any;
  suggestionText?: string;
}) {
  const [searchMatches, setSearchMatches] = useState<SearchFilterMatch<T>[]>(
    [],
  );
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (props.onMatchesChange) {
      props.onMatchesChange(searchMatches);
    }
  }, [searchMatches]);

  const debouncedUpdateTextMatches = debounce(updateTextMatches, 500);

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    updateInputValue(event.target.value);
  }

  function onClearClick() {
    updateInputValue('');

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
            className="absolute right-1 top-1/2 -translate-y-1/2 w-10 p-2 cursor-pointer"
            onClick={onClearClick}
            data-cy="autocomplete-clear-button"
          />
        </label>
      </div>
    </div>
  );
}

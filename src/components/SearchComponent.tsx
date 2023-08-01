import Fuse from 'fuse.js';
import React, { useEffect, useState } from 'react';
import closeIconUrl from '../assets/svg/x.svg';
import { debounce } from 'underscore';

export default function SearchComponent(props: {
  items: string[];
  placeholder: string;
  onClearHandler?: () => any;
  onTextMatchesChange?: (matches: string[]) => any;
  suggestionText?: string;
}) {
  const [textMatches, setTextMatches] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  const fuse = new Fuse(props.items, {
    includeScore: true,
    distance: 100,
    threshold: 0.2,
  });

  useEffect(() => {
    if (props.onTextMatchesChange) {
      props.onTextMatchesChange(textMatches);
    }
  }, [textMatches]);

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
    const result = fuse.search(text);
    setTextMatches(result.map((match) => match.item));
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

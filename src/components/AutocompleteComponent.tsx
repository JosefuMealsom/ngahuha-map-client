import Fuse from 'fuse.js';
import React, { useState } from 'react';

export default function AutocompleteComponent(props: {
  items: string[];
  placeholder: string;
}) {
  const [textMatches, setTextMatches] = useState<String[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [autocompleteOpen, setAutocompleteOpen] = useState(false);
  const fuse = new Fuse(props.items, { includeScore: true, distance: 10 });

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    setAutocompleteOpen(true);
    updateInputValue(event.target.value);
  }

  function onItemClick(text: string) {
    setAutocompleteOpen(false);
    updateInputValue(text as string);
  }

  function updateInputValue(text: string) {
    setInputValue(text);
    const result = fuse.search(text, { limit: 5 });
    setTextMatches(result.map((match) => match.item));
  }

  return (
    <div>
      <input
        type="text"
        className="mb-3 w-full"
        placeholder={props.placeholder}
        value={inputValue}
        onChange={onChange}
      />
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

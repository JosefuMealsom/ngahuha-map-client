import { useState } from 'react';

export function ActiveFilterButtonComponent(props: {
  text: string;
  onClickHandler: () => void;
  active: boolean;
}) {
  function onButtonClick() {
    props.onClickHandler();
  }

  return (
    <button
      className={`border p-2 cursor-pointer rounded-md ${
        props.active
          ? 'bg-sky-500 text-white'
          : 'text-sky-500 border-sky-500 bg-white border-solid'
      }`}
      onClick={onButtonClick}
    >
      {props.text}
    </button>
  );
}

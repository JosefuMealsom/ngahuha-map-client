import { MouseEventHandler } from 'react';

export function ButtonComponent(props: {
  text: string;
  id?: string;
  className?: string;
  onClickHandler?: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      id={props.id}
      className={`${props.className} border-solid border-black border-2 p-2 hover:bg-gray-300 cursor-pointer mb-2`}
      onClick={props.onClickHandler}
    >
      {props.text}
    </button>
  );
}

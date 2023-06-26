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
      className={`${props.className} border-solid border-black bg-white border p-2 hover:bg-gray-300 cursor-pointer mb-2 rounded-md`}
      onClick={props.onClickHandler}
    >
      {props.text}
    </button>
  );
}

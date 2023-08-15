import { ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';

export function ActiveFilterLinkComponent(props: {
  active: boolean;
  link: string;
  text: string;
  replace?: boolean;
}) {
  return (
    <Link
      to={props.link}
      className={`border p-2 cursor-pointer rounded-md h-max ${
        props.active
          ? 'bg-sky-500 text-white'
          : 'text-sky-500 border-sky-500 bg-white border-solid'
      }`}
      replace={props.replace || false}
    >
      {props.text}
    </Link>
  );
}

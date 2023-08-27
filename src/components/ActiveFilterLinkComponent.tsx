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
      className={`border block py-2 text-xs px-4 font-bold cursor-pointer rounded-full ${
        props.active
          ? 'bg-forest text-white border-forest'
          : 'text-white border-slate-300 bg-slate-300 border-solid'
      }`}
      replace={props.replace || false}
    >
      {props.text}
    </Link>
  );
}

import { Link } from 'react-router-dom';

export function LinkComponent(props: {
  text: string;
  className?: string;
  link: string;
}) {
  return (
    <Link
      to={props.link}
      className={`${props.className} border-solid border-black bg-white border p-2 hover:bg-gray-300 cursor-pointer mb-2 rounded-md text-xs sm:text-base`}
    >
      {props.text}
    </Link>
  );
}

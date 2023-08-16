import { Link } from 'react-router-dom';

export function LinkComponent(props: {
  text: string;
  className?: string;
  link: string;
}) {
  return (
    <Link
      to={props.link}
      className={`${props.className} border-none bg-white border p-1
      py-2 cursor-pointer mb-2 rounded-md text-[0.65rem] sm:text-sm`}
    >
      {props.text}
    </Link>
  );
}

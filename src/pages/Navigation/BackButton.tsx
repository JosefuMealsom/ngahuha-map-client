import { useNavigate } from 'react-router-dom';

export function BackButton() {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(-1)}
      className="mr-1 px-4 border border-sky-500 bg-sky-500
    rounded-full text-white font-semibold text-xs py-2"
    >
      Back
    </div>
  );
}

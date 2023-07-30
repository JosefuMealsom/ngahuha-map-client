import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  function renderError(error: unknown) {
    if (!isRouteErrorResponse(error)) {
      return;
    }

    return (
      <div className="text-center">
        <i>
          {error.status}: {error.statusText}
        </i>
        <br />
        <i>{error.data?.message}</i>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <div>
        <h1 className="font-black text-5xl mb-6 text-center">Oops!</h1>
        <p className="mb-3">Sorry, an unexpected error has occurred.</p>
        {renderError(error)}
      </div>
    </div>
  );
}

import { rest } from 'msw';
import { setupServer } from 'msw/node';

export const mockServer = setupServer();

type httpMethods = 'get' | 'post' | 'patch' | 'delete';

export const mockApiCall = (
  httpVerb: httpMethods,
  path: string,
  status: number,
  body: any,
) => {
  mockServer.use(
    rest[httpVerb](path, (request, response, context) =>
      response(context.status(status), context.json(body)),
    ),
  );
};

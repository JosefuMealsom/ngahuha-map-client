import { rest } from 'msw';
import { setupServer } from 'msw/node';

export const mockServer = setupServer();

type httpMethods = 'get' | 'post' | 'patch' | 'delete';

export const mockApiCall = (
  path: string,
  body: any,
  httpVerb?: httpMethods,
  status?: number,
) => {
  mockServer.use(
    rest[httpVerb || 'get'](path, (request, response, context) =>
      response(context.status(status || 200), context.json(body)),
    ),
  );
};

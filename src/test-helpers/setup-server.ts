import { afterAll, afterEach, beforeAll } from 'vitest';
import { mockServer } from './fetch-stub';

beforeAll(() => mockServer.listen({ onUnhandledRequest: 'error' }));
afterAll(() => mockServer.close());
afterEach(() => mockServer.resetHandlers());

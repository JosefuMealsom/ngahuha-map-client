import { vi, expect } from 'vitest';

const stubbedFetch = vi.fn();
global.fetch = stubbedFetch;

export const stubFetchResponse = (data: {}) => {
  stubbedFetch.mockResolvedValue({
    ok: true,
    json: () => new Promise((resolve) => resolve(data)),
  });
};

export const assertEndPointCalled = (url: string) => {
  expect(stubbedFetch).toHaveBeenCalledWith(url);
};

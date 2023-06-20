import { vi, expect } from 'vitest';

const stubbedFetch = vi.fn();
global.fetch = stubbedFetch;

export const fetchStub = {
  stubFetchResponse(data: {}) {
    stubbedFetch.mockResolvedValue({
      json: () => new Promise((resolve) => resolve(data)),
    });
  },

  assertEndPointCalled(url: string) {
    expect(stubbedFetch).toHaveBeenCalledWith(url);
  },
};

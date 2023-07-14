import { vi } from 'vitest';

export const stubArrayBufferCall = () => {
  global.Blob.prototype.arrayBuffer = vi.fn(
    () => new Promise<ArrayBuffer>((success) => success(new ArrayBuffer(8))),
  );
};

import { describe, it, expect, vitest } from 'vitest';
import * as index from './index.js';

vitest.mock('./cache.js', () => ({
  createCache: 'cache',
}));
vitest.mock('./enums/index.js', () => ({
  enums: 'enums',
}));

describe('dataStructure:index', () => {
  describe('happy path', () => {
    it('should export only this', () => {
      const normalized = Object.entries(index).reduce<Record<string | number, unknown>>(
        (acc, [key, value]: [string, unknown]) => {
          if (typeof key !== 'symbol') {
            acc[key] = value;
          }
          return acc;
        },
        {},
      );
      expect(normalized).toEqual({
        enums: 'enums',
        createCache: 'cache',
        default: 'cache',
      });
    });
  });
});

import { describe, it, expect, vitest } from 'vitest';
import * as index from './index.js';

vitest.mock('./LeastFrequentlyUsed.ts', () => ({
  lfu: 'LeastFrequentlyUsed',
}));
vitest.mock('./LeastRecentlyUsed.js', () => ({ lru: 'LeastRecentlyUsed' }));

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
        lfu: 'LeastFrequentlyUsed',
        lru: 'LeastRecentlyUsed',
      });
    });
  });
});

import { describe, it, expect } from 'vitest';
import { createCache } from './cache.js';
import { LRU, LFU } from './engines/index.js';
import { CacheType } from './enums/CacheType.js';

describe('cache factory', () => {
  it('should create a default cache instance of LRU if no engine is mentioned', () => {
    const cache1 = createCache();
    expect(cache1 instanceof LRU).toBe(true);
  });

  it('should create cache instance if proper engine in mentioned', () => {
    const cache1 = createCache({ engine: CacheType.LRU });
    expect(cache1 instanceof LRU).toBe(true);
  });

  it('should create LFU cache instance', () => {
    const cache1 = createCache({ engine: CacheType.LFU });
    expect(cache1 instanceof LFU).toBe(true);
  });

  it('should throw error if engine type is not implemented', () => {
    expect(() => createCache({ engine: 'NOT_HERE' as CacheType })).toThrow(
      `Cache type "NOT_HERE" not supported. [Value as string: "NOT_HERE"]`,
    );
  });
});

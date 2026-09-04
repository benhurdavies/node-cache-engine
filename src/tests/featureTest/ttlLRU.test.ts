import { describe, it, expect } from 'vitest';
import { createCache } from '../../cache.js';
import { CacheType } from '../../enums/CacheType.js';

describe('cache engine ttl (LRU)', () => {
  it('expires entries added with a cache-wide ttl', () => {
    let clock = 0;
    const now = (): number => clock;
    const cache = createCache({ size: 3, ttl: 100, now });

    cache.add('key1', { msg: 'key1' });
    clock = 101;

    expect(cache.get('key1')).toBe(undefined);
    expect(cache.size()).toBe(0);
  });

  it('lets a per-entry ttl override the cache-wide ttl', () => {
    let clock = 0;
    const now = (): number => clock;
    const cache = createCache({ size: 3, ttl: 1000, now });

    cache.add('short', { msg: 'short' }, { ttl: 10 });
    cache.add('long', { msg: 'long' });
    clock = 11;

    expect(cache.get('short')).toBe(undefined);
    expect(cache.get('long')).toEqual({ msg: 'long' });
  });

  it('never expires entries when no ttl is configured', () => {
    const cache = createCache({ size: 3 });

    cache.add('key1', { msg: 'key1' });

    expect(cache.get('key1')).toEqual({ msg: 'key1' });
  });

  it('throws a clear error for an invalid cache-wide ttl', () => {
    expect(() => createCache({ ttl: 0 })).toThrow();
    expect(() => createCache({ ttl: -1 })).toThrow();
    expect(() => createCache({ ttl: NaN })).toThrow();
    expect(() => createCache({ ttl: Infinity })).toThrow();
    expect(() => createCache({ ttl: 1.5 })).toThrow('ttl must be a positive integer');
  });

  it('throws when a ttl is configured for the LFU engine', () => {
    expect(() => createCache({ engine: CacheType.LFU, ttl: 100 })).toThrow('TTL is supported by the LRU engine only');
  });
});

import { describe, it, expect } from 'vitest';
import { createCache } from '../../cache.js';
import { CacheType } from '../../enums/CacheType.js';

describe('cache engine ttl (LRU)', () => {
  it('expires entries added with a cache-wide ttl', () => {
    let clock = 0;
    const cache = createCache({ size: 3, ttl: 100, now: () => clock });

    cache.add('key1', { msg: 'key1' });
    clock = 101;

    expect(cache.get('key1')).toBe(undefined);
    expect(cache.size()).toBe(0);
  });

  it('lets a per-entry ttl override the cache-wide ttl', () => {
    let clock = 0;
    const cache = createCache({ size: 3, ttl: 1000, now: () => clock });

    cache.add('short', { msg: 'short' }, { ttl: 10 });
    cache.add('long', { msg: 'long' });
    clock = 11;

    expect(cache.get('short')).toBe(undefined);
    expect(cache.get('long')).toEqual({ msg: 'long' });
  });

  it('rejects an invalid cache-wide ttl', () => {
    expect(() => createCache({ ttl: 1.5 })).toThrow('ttl must be a positive integer');
  });

  it('rejects a ttl for the LFU engine, cache-wide and per entry', () => {
    const message = 'TTL is supported by the LRU engine only';
    expect(() => createCache({ engine: CacheType.LFU, ttl: 100 })).toThrow(message);

    const lfu = createCache({ engine: CacheType.LFU });
    expect(() => {
      lfu.add('key1', { msg: 'key1' }, { ttl: 100 });
    }).toThrow(message);
  });
});

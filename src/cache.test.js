import createCache from './cache';
import LRU from './engines/LeastRecentlyUsed';
import LFU from './engines/LeastFrequentlyUsed';

describe('cache factory', () => {
  it('should create a default cache instance of LRU if no engine is mentioned', () => {
    const cache1 = createCache();
    expect(cache1 instanceof LRU).toBe(true);
  });

  it('should create cache instance if proper engine in mentioned', () => {
    const cache1 = createCache({ engine: 'LRU' });
    expect(cache1 instanceof LRU).toBe(true);
  });

  it('should create LFU cache instance', () => {
    const cache1 = createCache({ engine: 'LFU' });
    expect(cache1 instanceof LFU).toBe(true);
  });

  it('should throw error if engine type is not implemented', () => {
    expect(() => createCache({ engine: 'NOT_HERE' })).toThrow(
      `Engine : NOT_HERE is not implemented`,
    );
  });
});

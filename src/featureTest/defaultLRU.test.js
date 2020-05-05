import cacheEngine from '../main';

describe('cache engine default lru', () => {
  it('should test all features', () => {
    const cache = cacheEngine();

    cache.add('key1', { msg: 'key1' });
    cache.add('key2', { msg: 'key2' });

    expect(cache.size()).toBe(2);
    expect(cache.get('key2')).toEqual({ msg: 'key2' });
    expect(cache.has('key1')).toBe(true);

    cache.remove('key1');

    expect(cache.size()).toBe(1);
    expect(cache.get('key1')).toBe(undefined);
    expect(cache.has('key1')).toBe(false);
  });
});

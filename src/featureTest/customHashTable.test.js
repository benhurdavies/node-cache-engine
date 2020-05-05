import cacheEngine from '../main';
import { get, add, remove, clear, size, has } from '../hashTableSymbol';

describe('cache engine lru with custom hash table', () => {
  // custom hashTable
  const mockHTAdd = jest.fn();
  const mockHTRemove = jest.fn();
  const mockHTGet = jest.fn();
  const mockHTHas = jest.fn();

  const hashTable = function() {
    const store = {};

    this[add] = (key, value) => {
      mockHTAdd(key, value);
      store[key] = value;
    };

    this[remove] = key => {
      mockHTRemove(key);
      delete store[key];
    };

    this[get] = key => {
      mockHTGet(key);
      return store[key];
    };

    this[clear] = () => {
      store = {};
    };

    this[has] = key => {
      mockHTHas(key);
      return store.hasOwnProperty(key);
    };

    this[size] = () => {
      return Object.keys(store).length;
    };
  };

  it('should satisfy all features', () => {
    const cache = cacheEngine({ HashTable: hashTable });

    cache.add('key1', { msg: 'key1' });
    cache.add('key2', { msg: 'key2' });
    expect(mockHTAdd).toHaveBeenCalledTimes(2);

    expect(cache.size()).toBe(2);
    expect(cache.get('key2')).toEqual({ msg: 'key2' });
    expect(cache.has('key1')).toBe(true);
    expect(mockHTGet).toHaveBeenCalledTimes(1);

    cache.remove('key1');

    expect(mockHTRemove).toHaveBeenCalledTimes(1);
    expect(cache.size()).toBe(1);
    expect(cache.get('key1')).toBe(undefined);
    expect(cache.has('key1')).toBe(false);
  });
});

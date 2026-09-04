import { describe, it, expect, vitest } from 'vitest';
import cacheEngine from '../../index.js';
import type { HashTable } from '../../dataStructure/HashTable.js';

describe('cache engine lru with custom hash table', () => {
  // custom hashTable
  const mockHTAdd = vitest.fn();
  const mockHTRemove = vitest.fn();
  const mockHTGet = vitest.fn();
  const mockHTHas = vitest.fn();

  class CustomHashTable<Value, Key = string> implements HashTable<Value, Key> {
    readonly #store: Map<Key, Value>;

    constructor() {
      this.#store = new Map();
    }

    add(key: Key, value: Value): void {
      mockHTAdd(key, value);
      this.#store.set(key, value);
    }

    remove(key: Key): void {
      mockHTRemove(key);
      this.#store.delete(key);
    }

    get(key: Key): Value | undefined {
      mockHTGet(key);
      return this.#store.get(key);
    }

    clear(): void {
      this.#store.clear();
    }

    has(key: Key): boolean {
      mockHTHas(key);
      // eslint-disable-next-line no-prototype-builtins
      return this.#store.has(key);
    }

    size(): number {
      return Object.keys(this.#store).length;
    }
  }

  it('should satisfy all features', () => {
    const cache = cacheEngine({ HashTable: CustomHashTable });

    cache.add('key1', { msg: 'key1' });
    cache.add('key2', { msg: 'key2' });
    expect(mockHTAdd).toHaveBeenCalledTimes(2);

    expect(cache.size()).toBe(2);
    expect(cache.get('key2')).toEqual({ msg: 'key2' });
    expect(cache.has('key1')).toBe(true);
    // add() now looks up the key first (to update in place instead of
    // orphaning an existing node), and has() now looks up the node too (to
    // check lazy TTL expiry), so: 2 add() + 1 explicit get() + 1 has().
    expect(mockHTGet).toHaveBeenCalledTimes(4);

    cache.remove('key1');

    expect(mockHTRemove).toHaveBeenCalledTimes(1);
    expect(cache.size()).toBe(1);
    expect(cache.get('key1')).toBe(undefined);
    expect(cache.has('key1')).toBe(false);
  });
});

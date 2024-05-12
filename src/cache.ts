import type { Cache } from './types/Cache.js';
import { type HashTableConstructor, MapHashTable } from './dataStructure/HashTable.js';
import { LRU, LFU } from './engines/index.js';
import { CacheType } from './enums/CacheType.js';
import { assertUnreachable } from './utils/never.js';

export type CreateCacheParameters = {
  size?: number;
  engine?: CacheType;
  HashTable?: HashTableConstructor;
};

export function createCache<Value, Key = string>(params?: CreateCacheParameters): Cache<Value, Key> {
  const { size = Number.MAX_SAFE_INTEGER, engine = CacheType.LRU, HashTable = MapHashTable } = params ?? {};
  switch (engine) {
    case CacheType.LRU:
      return new LRU<Value, Key>({ size, HashTable });
    case CacheType.LFU:
      return new LFU<Value, Key>({ size, HashTable });
    default:
      return assertUnreachable(`Cache type "${String(engine)}" not supported.`, engine);
  }
}

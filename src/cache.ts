import type { Cache } from './types/Cache.js';
import type { Ttl } from './utils/helper.js';
import { type HashTableConstructor, MapHashTable } from './dataStructure/HashTable.js';
import { LRU, LFU } from './engines/index.js';
import { CacheType } from './enums/CacheType.js';
import { assertUnreachable } from './utils/never.js';

export type CreateCacheParameters = {
  size?: number;
  engine?: CacheType;
  HashTable?: HashTableConstructor;
  ttl?: Ttl;
  now?: () => number;
};

export function createCache<Value, Key = string>(params?: CreateCacheParameters): Cache<Value, Key> {
  const { size = Number.MAX_SAFE_INTEGER, engine = CacheType.LRU, HashTable = MapHashTable, ttl, now } = params ?? {};
  switch (engine) {
    case CacheType.LRU:
      return new LRU<Value, Key>({ size, HashTable, ttl, now });
    case CacheType.LFU:
      if (ttl !== undefined) throw new Error('TTL is supported by the LRU engine only');
      return new LFU<Value, Key>({ size, HashTable });
    default:
      return assertUnreachable(`Cache type "${String(engine)}" not supported.`, engine);
  }
}

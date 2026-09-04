import type { Ttl } from '../utils/helper.js';

export interface Cache<Value, Key = string> {
  add(key: Key, value: Value, options?: { ttl?: Ttl }): void;
  remove(key: Key): void;
  get(key: Key): Value | undefined;
  clearAll(): void;
  has(key: Key): boolean;
  size(): number;
  toArray(): Value[];
}

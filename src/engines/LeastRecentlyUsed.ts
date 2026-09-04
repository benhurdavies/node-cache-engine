import { type HashTable, type HashTableConstructor, MapHashTable } from '../dataStructure/HashTable.js';
import { type DoublyLinkedListNode, DoublyLinkedList } from '../dataStructure/DoublyLinkedList.js';
import type { Cache } from '../types/Cache.js';
import { assertTtl, type Ttl } from '../utils/helper.js';

export type LruEntry<Value, Key = string> = {
  key: Key;
  value: Value;
  /** Clock time at which the entry expires; `Infinity` when it never does. */
  expiresAt: number;
};

type LruNode<Value, Key> = DoublyLinkedListNode<LruEntry<Value, Key>>;

export class LRU<Value, Key = string> implements Cache<Value, Key> {
  readonly #size: number;

  readonly #hashTable: HashTable<LruNode<Value, Key>, Key>;

  readonly #linkList = new DoublyLinkedList<LruEntry<Value, Key>>();

  /** Cache-wide ttl in milliseconds; `Infinity` when entries never expire. */
  readonly #ttl: number;

  readonly #now: () => number;

  constructor({
    size = Number.MAX_SAFE_INTEGER,
    HashTable = MapHashTable,
    ttl,
    now = Date.now,
  }: {
    size?: number;
    HashTable?: HashTableConstructor;
    ttl?: Ttl;
    now?: () => number;
  }) {
    if (size <= 0) throw Error('LRU size specified should be greater than zero');
    if (ttl !== undefined) assertTtl(ttl);
    this.#size = size;
    this.#hashTable = new HashTable();
    this.#ttl = ttl ?? Infinity;
    this.#now = now;
  }

  public add(key: Key, value: Value, options?: { ttl?: Ttl }): void {
    if (options?.ttl !== undefined) assertTtl(options.ttl);
    const expiresAt = this.#now() + (options?.ttl ?? this.#ttl);

    const existing = this.#hashTable.get(key);
    if (existing) {
      existing.value.value = value;
      existing.value.expiresAt = expiresAt;
      this.#linkList.moveToFirst(existing);
      return;
    }

    if (this.size() >= this.#size) this.#handleOverflow();
    this.#hashTable.add(key, this.#linkList.addFirst({ key, value, expiresAt }));
  }

  public remove(key: Key): boolean {
    const node = this.#hashTable.get(key);
    if (!node) return false;
    this.#removeNode(node);
    return true;
  }

  public get(key: Key): Value | undefined {
    const node = this.#liveNode(key);
    if (!node) return undefined;
    this.#linkList.moveToFirst(node);
    return node.value.value;
  }

  public has(key: Key): boolean {
    return this.#liveNode(key) !== undefined;
  }

  /** O(1). May overcount: expired entries are only removed when get/has touches them or overflow evicts them. */
  public size(): number {
    return this.#linkList.size();
  }

  public clearAll(): void {
    this.#hashTable.clear();
    this.#linkList.clearAll();
  }

  public toArray(): Value[] {
    return this.#linkList
      .toArray()
      .filter((entry) => !this.#isExpired(entry))
      .map((entry) => entry.value);
  }

  /** The node stored under `key`, or undefined if there is none or it has expired (in which case it is removed). */
  #liveNode(key: Key): LruNode<Value, Key> | undefined {
    const node = this.#hashTable.get(key);
    if (!node) return undefined;
    if (!this.#isExpired(node.value)) return node;
    this.#removeNode(node);
    return undefined;
  }

  #isExpired(entry: LruEntry<Value, Key>): boolean {
    return entry.expiresAt <= this.#now();
  }

  #removeNode(node: LruNode<Value, Key>): void {
    this.#linkList.remove(node);
    this.#hashTable.remove(node.value.key);
  }

  #handleOverflow(): void {
    const node = this.#linkList.getLastNode();
    if (!node) throw new Error('Failed to find overflow node');
    this.#removeNode(node);
  }
}

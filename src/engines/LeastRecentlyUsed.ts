import { type HashTable, type HashTableConstructor, MapHashTable } from '../dataStructure/HashTable.js';
import { type DoublyLinkedListNode, DoublyLinkedList } from '../dataStructure/DoublyLinkedList.js';
import type { Cache } from '../types/Cache.js';
import { assertTtl, type Ttl } from '../utils/helper.js';

export type LruEntry<Value, Key = string> = {
  key: Key;
  value: Value;
  expiresAt?: number;
};

export class LRU<Value, Key = string> implements Cache<Value, Key> {
  readonly #size: number;

  readonly #hashTable: HashTable<DoublyLinkedListNode<LruEntry<Value, Key>>, Key>;

  readonly #linkList = new DoublyLinkedList<LruEntry<Value, Key>>();

  readonly #ttl?: Ttl;

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
    this.#ttl = ttl;
    this.#now = now;
  }

  public add(key: Key, value: Value, options?: { ttl?: Ttl }): void {
    if (options?.ttl !== undefined) assertTtl(options.ttl);
    const ttl = options?.ttl ?? this.#ttl;
    const expiresAt = ttl === undefined ? undefined : this.#now() + ttl;

    const existingNode = this.#hashTable.get(key);
    if (existingNode) {
      existingNode.value.value = value;
      existingNode.value.expiresAt = expiresAt;
      this.#linkList.moveToFirst(existingNode);
      return;
    }

    if (this.size() >= this.#size) this.#handleOverflow();
    const payload: LruEntry<Value, Key> = { key, value, expiresAt };
    this.#linkList.addFirst(payload);
    const node = this.#linkList.getFirstNode();
    if (!node) throw new Error('Failed to add value');
    this.#hashTable.add(key, node);
  }

  public remove(key: Key): boolean {
    const node = this.#hashTable.get(key);
    if (!node) return false;
    this.#removeNode(node);
    return true;
  }

  public get(key: Key): Value | undefined {
    const node = this.#hashTable.get(key);
    if (!node) return undefined;
    if (this.#isExpired(node.value)) {
      this.#removeNode(node);
      return undefined;
    }
    this.#linkList.moveToFirst(node);
    return node.value.value;
  }

  public has(key: Key): boolean {
    const node = this.#hashTable.get(key);
    if (!node) return false;
    if (this.#isExpired(node.value)) {
      this.#removeNode(node);
      return false;
    }
    return true;
  }

  // O(1). This can overcount entries that have expired but have not yet
  // been read/has-checked (which lazily evict them) or evicted by overflow -
  // an expired-but-untouched entry is still counted here until then.
  public size(): number {
    return this.#linkList.size();
  }

  public clearAll(): void {
    this.#hashTable.clear();
    this.#linkList.clearAll();
  }

  public toArray(): Value[] {
    const now = this.#now();
    return this.#linkList
      .toArray()
      .filter((entry: LruEntry<Value, Key>) => entry.expiresAt === undefined || entry.expiresAt > now)
      .map((entry: LruEntry<Value, Key>) => entry.value);
  }

  #isExpired(entry: LruEntry<Value, Key>): boolean {
    return entry.expiresAt !== undefined && entry.expiresAt <= this.#now();
  }

  #removeNode(node: DoublyLinkedListNode<LruEntry<Value, Key>>): void {
    this.#linkList.remove(node);
    this.#hashTable.remove(node.value.key);
  }

  #handleOverflow(): void {
    const node = this.#linkList.getLastNode();
    if (!node) {
      throw new Error('Failed to find overflow node');
    }
    this.#removeNode(node);
  }
}

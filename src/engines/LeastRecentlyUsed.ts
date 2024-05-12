import { type HashTable, type HashTableConstructor, MapHashTable } from '../dataStructure/HashTable.js';
import { type DoublyLinkedListNode, DoublyLinkedList } from '../dataStructure/DoublyLinkedList.js';
import type { Cache } from '../types/Cache.js';

export type LruEntry<Value, Key = string> = {
  key: Key;
  value: Value;
};

export class LRU<Value, Key = string> implements Cache<Value, Key> {
  readonly #size: number;

  readonly #hashTable: HashTable<DoublyLinkedListNode<LruEntry<Value, Key>>, Key>;

  readonly #linkList = new DoublyLinkedList<LruEntry<Value, Key>>();

  constructor({
    size = Number.MAX_SAFE_INTEGER,
    HashTable = MapHashTable,
  }: {
    size?: number;
    HashTable?: HashTableConstructor;
  }) {
    if (size <= 0) throw Error('LRU size specified should be greater than zero');
    this.#size = size;
    this.#hashTable = new HashTable();
  }

  public add(key: Key, value: Value): void {
    if (this.size() >= this.#size) this.#handleOverflow();
    const payload = { key, value };
    this.#linkList.addFirst(payload);
    const node = this.#linkList.getFirstNode();
    if (!node) throw new Error('Failed to add value');
    this.#hashTable.add(key, node);
  }

  public remove(key: Key): boolean {
    if (this.has(key)) {
      const node = this.#hashTable.get(key);
      if (!node) {
        throw new Error('Failed to find node in hash table');
      }
      this.#linkList.remove(node);
      this.#hashTable.remove(key);
      return true;
    }
    return false;
  }

  public get(key: Key): Value | undefined {
    const node = this.#hashTable.get(key);
    if (node) {
      this.#linkList.moveToFirst(node);
      return node.value.value;
    }
    return undefined;
  }

  public has(key: Key): boolean {
    return this.#hashTable.has(key);
  }

  public size(): number {
    return this.#linkList.size();
  }

  public clearAll(): void {
    this.#hashTable.clear();
    this.#linkList.clearAll();
  }

  public toArray(): Value[] {
    return this.#linkList.toArray().map((entry: LruEntry<Value, Key>) => entry.value);
  }

  #handleOverflow(): void {
    const node = this.#linkList.getLastNode();
    if (!node) {
      throw new Error('Failed to find overflow node');
    }
    this.#hashTable.remove(node.value.key);
    this.#linkList.remove(node);
  }
}

import {
  type HashTable,
  type HashTableConstructor,
  type DoublyLinkedListNode,
  DoublyLinkedList,
  MapHashTable,
} from '../dataStructure/index.js';
import { isPositiveInteger } from '../utils/helper.js';
import type { Cache } from '../types/Cache.js';

export type LfuPayload<Value, Key = string> = {
  key: Key;
  value: Value;
};

export type LfuFrequency<Value, Key = string> = {
  value: number;
  items: DoublyLinkedList<LfuFrequencyItem<Value, Key>>;
};

export type LfuFrequencyItem<Value, Key = string> = {
  payload: LfuPayload<Value, Key>;
  parent: DoublyLinkedListNode<LfuFrequency<Value, Key>>;
};

export type LfuFrequencyItemNode<Value, Key = string> = DoublyLinkedListNode<LfuFrequencyItem<Value, Key>>;

export type LfuFrequencyNode<Value, Key = string> = DoublyLinkedListNode<LfuFrequency<Value, Key>>;

export class LFU<Value, Key = string> implements Cache<Value, Key> {
  readonly #size: number;

  readonly #hashTable: HashTable<LfuFrequencyItemNode<Value, Key>, Key>;

  readonly #frequencies = new DoublyLinkedList<LfuFrequency<Value, Key>>();

  #length = 0;

  constructor({
    size = Number.MAX_SAFE_INTEGER,
    HashTable = MapHashTable,
  }: {
    size?: number;
    HashTable?: HashTableConstructor;
  }) {
    if (!isPositiveInteger(size)) throw Error('LFU size specified should be greater than zero');
    this.#hashTable = new HashTable();
    this.#size = size;
  }

  public add(key: Key, value: Value): void {
    if (this.size() >= this.#size) {
      this.#handleOverflow();
    }
    const payload: LfuPayload<Value, Key> = { key, value };
    const fNode = this.#addToFrequency(payload);
    this.#hashTable.add(key, fNode);
    this.#length += 1;
  }

  public get(key: Key): Value | undefined {
    let fItemNode = this.#hashTable.get(key);
    if (!fItemNode) return undefined;
    fItemNode = this.#incrementFrequency(fItemNode);
    return fItemNode.value.payload.value;
  }

  public remove(key: Key): boolean {
    if (!this.has(key)) return false;

    const fNode = this.#hashTable.get(key);
    if (!fNode) throw new Error('Failed to find node in hash table');
    this.#removeFromFrequency(fNode);
    this.#hashTable.remove(key);
    this.#length -= 1;
    return true;
  }

  public has(key: Key): boolean {
    return this.#hashTable.has(key);
  }

  public size(): number {
    return this.#length;
  }

  public clearAll(): void {
    this.#hashTable.clear();
    this.#frequencies.clearAll();
    this.#length = 0;
  }

  public toArray(): Value[] {
    const entries = new Set<Value>();
    this.#frequencies.toArray().forEach(({ items }) => {
      items.toArray().forEach(({ payload }) => {
        entries.add(payload.value);
      });
    });
    return Array.from(entries);
  }

  #addToFrequency(payload: LfuPayload<Value, Key>): LfuFrequencyItemNode<Value, Key> {
    // frequency start with 1
    let first = this.#frequencies.getFirstNode();
    if (first?.value.value !== 1) {
      first = this.#frequencies.addFirst(this.#newFrequency(1));
    }
    const newItem: LfuFrequencyItem<Value, Key> = { payload, parent: first };
    return first.value.items.addFirst(newItem);
  }

  #incrementFrequency(fItemNode: LfuFrequencyItemNode<Value, Key>): LfuFrequencyItemNode<Value, Key> {
    const currentFrequencyNode = fItemNode.value.parent;
    let nextFrequencyNode = currentFrequencyNode.next;
    const nextFrequency = currentFrequencyNode.value.value + 1;

    if (!Number.isSafeInteger(nextFrequency)) return fItemNode;

    if (nextFrequency !== nextFrequencyNode?.value.value) {
      nextFrequencyNode = this.#frequencies.addNext(currentFrequencyNode, this.#newFrequency(nextFrequency));
    }

    const newItemNode = this.#moveItemFromFrequency({
      source: currentFrequencyNode,
      target: nextFrequencyNode,
      item: fItemNode,
    });
    this.#hashTable.add(fItemNode.value.payload.key, newItemNode);
    return newItemNode;
  }

  #moveItemFromFrequency({
    source,
    target,
    item,
  }: {
    source: LfuFrequencyNode<Value, Key>;
    target: LfuFrequencyNode<Value, Key>;
    item: LfuFrequencyItemNode<Value, Key>;
  }): LfuFrequencyItemNode<Value, Key> {
    const { payload } = item.value;
    const { items } = source.value;
    items.remove(item);
    if (items.size() === 0) {
      this.#frequencies.remove(source);
    }
    const newItem: LfuFrequencyItem<Value, Key> = { payload, parent: target };
    return target.value.items.addFirst(newItem);
  }

  #removeFromFrequency(fItemNode: LfuFrequencyItemNode<Value, Key>): void {
    const { parent } = fItemNode.value;
    const { items } = parent.value;
    items.remove(fItemNode);
    if (items.size() === 0) {
      this.#frequencies.remove(parent);
    }
  }

  #newFrequency(value: number): LfuFrequency<Value, Key> {
    return { value, items: new DoublyLinkedList() };
  }

  #handleOverflow(): void {
    const leastFrequencyNode = this.#frequencies.getFirstNode();
    if (!leastFrequencyNode) throw new Error('Failed to find least frequency node');
    const fItemNode = leastFrequencyNode.value.items.getLastNode();
    if (!fItemNode) throw new Error('Failed to find least frequency item node');
    this.remove(fItemNode.value.payload.key);
  }
}

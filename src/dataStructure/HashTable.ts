export type HashTableConstructor = new <Value, Key = string>() => HashTable<Value, Key>;

export interface HashTable<Value, Key = string> {
  add(key: Key, value: Value): void;
  remove(key: Key): void;
  get(key: Key): Value | undefined;
  clear(): void;
  has(key: Key): boolean;
  size(): number;
}

export class MapHashTable<Value, Key = string> implements HashTable<Value, Key> {
  readonly #store = new Map<Key, Value>();

  public add(key: Key, value: Value): void {
    this.#store.set(key, value);
  }

  public remove(key: Key): void {
    this.#store.delete(key);
  }

  public get(key: Key): Value | undefined {
    return this.#store.get(key);
  }

  public clear(): void {
    this.#store.clear();
  }

  public has(key: Key): boolean {
    return this.#store.has(key);
  }

  public size(): number {
    return this.#store.size;
  }
}

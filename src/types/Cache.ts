export interface Cache<Value, Key = string> {
  add(key: Key, value: Value): void;
  remove(key: Key): void;
  get(key: Key): Value | undefined;
  clearAll(): void;
  has(key: Key): boolean;
  size(): number;
  toArray(): Value[];
}

export type DoublyLinkedListNode<Value> = {
  prev: DoublyLinkedListNode<Value> | null;
  next: DoublyLinkedListNode<Value> | null;
  value: Value;
};

export class DoublyLinkedList<Value> implements Iterable<DoublyLinkedListNode<Value>> {
  #first: DoublyLinkedListNode<Value> | null = null;

  #last: DoublyLinkedListNode<Value> | null = null;

  #length = 0;

  public addFirst(value: Value): DoublyLinkedListNode<Value> {
    if (this.#length === 0) {
      this.#addFirstItem(value);
    } else {
      const node = createNode<Value>({ prev: null, next: this.#first, value });
      if (!this.#first) {
        throw new Error('Failed to find first node while adding later item');
      }
      this.#first.prev = node;
      this.#first = node;
    }
    this.#length += 1;
    if (!this.#first) {
      throw new Error('Failed to add first node');
    }
    return this.#first;
  }

  #addFirstItem(value: Value): void {
    const node = createNode({ prev: null, next: null, value });
    this.#last = node;
    this.#first = this.#last;
  }

  public moveToFirst(node: DoublyLinkedListNode<Value>): void {
    if (this.#length > 1) {
      if (!this.#first) {
        throw new Error('Failed to identify first node');
      }
      this.#remove(node);
      node.prev = null;
      node.next = this.#first;
      this.#first.prev = node;
      this.#first = node;
    }
  }

  public addLast(value: Value): DoublyLinkedListNode<Value> {
    if (this.#length === 0) {
      this.#addFirstItem(value);
    } else {
      const node = createNode({ prev: this.#last, next: null, value });
      if (!this.#last) {
        throw new Error('Failed to find last node while adding later item');
      }
      this.#last.next = node;
      this.#last = node;
    }
    this.#length += 1;
    if (!this.#last) {
      throw new Error('Failed to add last node');
    }
    return this.#last;
  }

  public addNext(node: DoublyLinkedListNode<Value>, value: Value): DoublyLinkedListNode<Value> {
    if (node === this.#last) return this.addLast(value);
    const newNode = createNode({ prev: node, next: node.next, value });
    node.next = newNode;
    if (!newNode.next) {
      throw new Error('Failed to add next node');
    }
    newNode.next.prev = newNode;
    this.#length += 1;
    return newNode;
  }

  public addPrev(node: DoublyLinkedListNode<Value>, value: Value): DoublyLinkedListNode<Value> {
    if (node === this.#first) return this.addFirst(value);
    const newNode = createNode({ prev: node.prev, next: node, value });
    node.prev = newNode;
    if (!newNode.prev) {
      throw new Error('Failed to add prev node');
    }
    newNode.prev.next = newNode;
    this.#length += 1;
    return newNode;
  }

  public remove(node: DoublyLinkedListNode<Value>): void {
    if (this.#length === 0) return;
    this.#remove(node);
    node.prev = null;
    node.next = null;
    this.#length -= 1;
  }

  public clearAll(): void {
    this.#first = null;
    this.#last = null;
    this.#length = 0;
  }

  #remove({ prev, next }: DoublyLinkedListNode<Value>): void {
    if (prev) prev.next = next;
    else this.#first = next;

    if (next) next.prev = prev;
    else this.#last = prev;
  }

  public size(): number {
    return this.#length;
  }

  public getFirstNode(): Readonly<DoublyLinkedListNode<Value>> | null {
    return this.#first;
  }

  public getLastNode(): Readonly<DoublyLinkedListNode<Value>> | null {
    return this.#last;
  }

  public [Symbol.iterator](): Iterator<DoublyLinkedListNode<Value>> {
    let current = this.#first;
    return {
      next(): IteratorResult<DoublyLinkedListNode<Value>> {
        if (current) {
          const value = current;
          current = current.next;
          return { value, done: false };
        }
        return {
          done: true,
          value: null,
        };
      },
    };
  }

  public toDebug(): { prev?: Value; value: Value; next?: Value }[] {
    return Array.from(this, (item: DoublyLinkedListNode<Value>) => ({
      prev: item.prev?.value,
      value: item.value,
      next: item.next?.value,
    }));
  }

  public toArray(): Value[] {
    return Array.from(this, (item) => item.value);
  }
}

function createNode<T>({
  prev,
  next,
  value,
}: {
  prev: DoublyLinkedListNode<T> | null;
  next: DoublyLinkedListNode<T> | null;
  value: T;
}): DoublyLinkedListNode<T> {
  return {
    prev,
    next,
    value,
  };
}

function DoublyLinkedList() {
  let first = null;
  let last = null;
  let length = 0;

  this.addFirst = value => {
    if (length === 0) {
      addFirstItem(value);
    } else {
      const node = createNode({ prev: null, next: first, value });
      first.prev = node;
      first = node;
    }
    length++;
  };

  this.addLast = value => {
    if (length === 0) {
      addFirstItem(value);
    } else {
      const node = createNode({ prev: last, next: null, value });
      last.next = node;
      last = node;
    }
    length++;
  };

  this.remove = node => {
    if (length === 0) {
      return;
    }

    const { prev, next } = node;

    if (prev) first = prev.next = next;
    if (next) last = next.prev = prev;

    length--;
  };

  this.size = () => length;

  this.getFirst = () => first;
  this.getLast = () => last;

  function addFirstItem(value) {
    const node = createNode({ prev: null, next: null, value });
    first = last = node;
  }

  function createNode({ prev, next, value }) {
    return {
      prev,
      next,
      value,
    };
  }

  this[Symbol.iterator] = () => {
    let current = first;
    return {
      next() {
        if (current) {
          const { next, value } = current;
          current = next;
          return { value, done: false };
        } else {
          return {
            done: true,
          };
        }
      },
    };
  };

  this.toArray = () => {
    return Array.from(this);
  };
}

export default DoublyLinkedList;

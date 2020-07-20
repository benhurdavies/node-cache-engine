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

  this.moveToFirst = node => {
    if (length > 1) {
      remove(node);
      node.prev = null;
      node.next = first;
      first.prev = node;
      first = node;
    }
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
    remove(node);
    node.prev = null;
    node.next = null;
    length--;
  };

  function remove({ prev, next }) {
    if (prev) prev.next = next;
    else first = next;

    if (next) next.prev = prev;
    else last = prev;
  }

  this.size = () => length;
  this.getFirstNode = () => first;
  this.getLastNode = () => last;

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
          const value = current;
          current = current.next;
          return { value, done: false };
        } else {
          return {
            done: true,
          };
        }
      },
    };
  };

  this.toDebug = () => {
    return Array.from(this, item => ({
      prev: item.prev?.value,
      value: item.value,
      next: item.next?.value,
    }));
  };

  this.toArray = () => {
    return Array.from(this, item => item.value);
  };
}

export default DoublyLinkedList;

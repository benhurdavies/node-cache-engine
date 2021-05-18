import DoublyLinkedList from './DoublyLinkedList';

describe('DoublyLinkedList', () => {
  it('should add items with same order', () => {
    const list = new DoublyLinkedList();
    list.addFirst(1);
    list.addFirst(2);
    expect(list.toArray()).toEqual([2, 1]);
  });

  it('should able to remove node', () => {
    let removeItem = null;
    const list = new DoublyLinkedList();
    list.addFirst(1);
    removeItem = list.getFirstNode();
    list.addFirst(2);
    list.addLast(5);
    expect(list.toArray()).toEqual([2, 1, 5]);

    list.remove(removeItem);
    expect(list.toArray()).toEqual([2, 5]);
  });

  it('should give first and last item', () => {
    const list = new DoublyLinkedList();
    expect(list.getFirstNode()).toBe(null);
    expect(list.getLastNode()).toBe(null);

    list.addFirst(1);
    expect(list.getFirstNode().value).toBe(1);
    expect(list.getLastNode().value).toBe(1);

    list.addFirst(5);
    expect(list.getFirstNode().value).toBe(5);
    expect(list.getLastNode().value).toBe(1);

    list.addFirst(9);
    expect(list.getFirstNode().value).toBe(9);
    expect(list.getLastNode().value).toBe(1);

    list.remove(list.getLastNode());
    expect(list.getFirstNode().value).toBe(9);
    expect(list.getLastNode().value).toBe(5);

    let first = list.getFirstNode();
    list.remove(first);
    expect({ prev: first.prev, next: first.next }).toEqual({
      prev: null,
      next: null,
    });
    expect(list.getFirstNode().value).toBe(5);
    expect(list.getLastNode().value).toBe(5);

    list.remove(list.getFirstNode());
    expect(list.getFirstNode()).toBe(null);
    expect(list.getLastNode()).toBe(null);
  });

  it('use case test: 3 element remove last one and insert to first', () => {
    const list = new DoublyLinkedList();
    list.addFirst('A');
    list.addFirst('B');
    list.addFirst('C');

    const node = list.getLastNode();
    list.remove(node);
    expect(list.toArray()).toEqual(['C', 'B']);

    list.addFirst(node.value);
    expect(list.toArray()).toEqual(['A', 'C', 'B']);

    const last = list.getLastNode();
    expect(last.prev.value).toBe('C');
    expect(last.prev.prev.value).toBe('A');

    list.remove(last);
    list.addFirst(last.value);
    expect(list.getLastNode().prev.value).toBe('A');
  });

  it('should able add item in next position of node', () => {
    const list = new DoublyLinkedList();
    const one = list.addLast(1);
    const two = list.addLast(2);
    const three = list.addNext(one, 3);

    expect(list.toArray()).toEqual([1, 3, 2]);

    list.addNext(two, 5);
    expect(list.toArray()).toEqual([1, 3, 2, 5]);

    list.addNext(three, 4);
    expect(list.toArray()).toEqual([1, 3, 4, 2, 5]);
    expect(list.size()).toBe(5);
  });

  it('should able add item in prev position of node', () => {
    const list = new DoublyLinkedList();
    const one = list.addLast(1);
    const two = list.addLast(2);
    const zero = list.addPrev(one, 0);

    expect(list.toArray()).toEqual([0, 1, 2]);

    const three = list.addPrev(two, 3);
    expect(list.toArray()).toEqual([0, 1, 3, 2]);

    list.addPrev(three, 4);
    expect(list.toArray()).toEqual([0, 1, 4, 3, 2]);
    expect(list.size()).toBe(5);
  });

  it('should able to add next and prev prosition of node', () => {
    const list = new DoublyLinkedList();
    const one = list.addLast(1);
    list.addLast(2);

    const five = list.addNext(one, 5);
    list.addPrev(five, 6);

    expect(list.toArray()).toEqual([1, 6, 5, 2]);
  });

  it('should able to clearAll nodes', () => {
    const list = new DoublyLinkedList();
    list.addLast(1);
    list.addLast(2);
    expect(list.size()).toBe(2);

    list.clearAll();
    expect(list.size()).toBe(0);
    expect(list.toArray()).toEqual([]);

    list.addLast(1);
    list.addLast(2);
    list.addFirst(-5);
    expect(list.toArray()).toEqual([-5, 1, 2]);
  });
});

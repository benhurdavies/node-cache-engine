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
    removeItem = list.getFirst();
    list.addFirst(2);
    list.addLast(5);
    expect(list.toArray()).toEqual([2, 1, 5]);

    list.remove(removeItem);
    expect(list.toArray()).toEqual([2, 5]);
  });

  it('should give first and last item', () => {
    const list = new DoublyLinkedList();
    expect(list.getFirst()).toBe(null);
    expect(list.getLast()).toBe(null);

    list.addFirst(1);
    expect(list.getFirst().value).toBe(1);
    expect(list.getLast().value).toBe(1);

    list.addFirst(5);
    expect(list.getFirst().value).toBe(5);
    expect(list.getLast().value).toBe(1);

    list.addFirst(9);
    expect(list.getFirst().value).toBe(9);
    expect(list.getLast().value).toBe(1);

    list.remove(list.getLast());
    expect(list.getFirst().value).toBe(9);
    expect(list.getLast().value).toBe(5);

    list.remove(list.getFirst());
    expect(list.getFirst().value).toBe(5);
    expect(list.getLast().value).toBe(5);

    list.remove(list.getFirst());
    expect(list.getFirst()).toBe(null);
    expect(list.getLast()).toBe(null);
  });

  it('use case test: 3 element remove last one and insert to first', () => {
    const list = new DoublyLinkedList();
    list.addFirst('A');
    list.addFirst('B');
    list.addFirst('C');

    const node = list.getLast();
    list.remove(node);
    expect(list.toArray()).toEqual(['C', 'B']);

    list.addFirst(node.value);
    expect(list.toArray()).toEqual(['A', 'C', 'B']);

    const last = list.getLast();
    expect(last.prev.value).toBe('C');
    expect(last.prev.prev.value).toBe('A');

    list.remove(last);
    list.addFirst(last.value);
    expect(list.getLast().prev.value).toBe('A');
  });
});

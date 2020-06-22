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

    list.remove(list.getFirstNode());
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
});

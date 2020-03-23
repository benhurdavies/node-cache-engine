import DoublyLinkedList from './DoublyLinkedList';

describe('DoublyLinkedList', () => {
  it('should add with order', () => {
    const list = new DoublyLinkedList();
    list.addFirst(1);
    list.addFirst(2);
    expect(list.toArray()).toEqual([2,1]);
  });
});

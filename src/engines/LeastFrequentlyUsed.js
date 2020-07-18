import DefaultHashTable from '../dataStructure/HashTable';
import DoublyLinkedList from '../dataStructure/DoublyLinkedList';
import { add as hAdd, get as hGet, has as Hhas } from '../hashTableSymbol';

function LeastFrequentlyUsed({
  size = Number.MAX_SAFE_INTEGER,
  HashTable = DefaultHashTable,
}) {
  if (size <= 0) throw Error('LRU size specified should be greater than zero');

  const hashTable = new HashTable();
  const frequencies = new DoublyLinkedList(); // frequency object {payload, items}
  let length = 0;

  this.add = (key, value) => {
    const payload = { key, value };
    const fItem = addToFrequency(payload);
    hashTable[hAdd](key, fItem);
    length++;
  };

  this.get = key => {
    let fNode = hashTable[hGet](key);
    if (!fNode) return undefined;
    fNode = incrementFrequency(fNode);
    return fNode.payload.value;
  };

  function addToFrequency(payload) {
    // frequency start with 1
    let first = frequencies.getFirstNode();
    if (first.value !== 1) {
      first = frequencies.addFirst(newFrequency(1));
    }
    const newItem = newFrequencyItem({ payload, parent: first });
    first.items.addFirst(newItem);
    return newItem;
  }

  function incrementFrequency(fNode) {
    const currentFrequencyNode = fNode.parent;
    let nextFrequencyNode = currentFrequencyNode.next;
    const nextFrequency = currentFrequencyNode.value + 1;

    if (nextFrequency !== nextFrequencyNode.value) {
      nextFrequencyNode = currentFrequencyNode.addNext(
        newFrequency(nextFrequency),
      );
    }

    const newItem = moveItemFromFrequency({
      source: currentFrequencyNode,
      traget: nextFrequency,
      item: fNode,
    });
    hashTable[hAdd](key, newItem);
    return newItem;
  }

  function moveItemFromFrequency({ source, traget, item }) {
    const { payload } = item;
    source.items.remove(item);
    if (source.items.size() === 0) {
      frequencies.remove(source);
    }

    const newItem = newFrequencyItem({ payload, parent: traget });
    traget.items.addFirst(newItem);
    return newItem;
  }

  function newFrequencyItem({ payload, parent }) {
    return { payload, parent };
  }

  function newFrequency(value) {
    return { value, items: new DoublyLinkedList() };
  }
}

export default LeastFrequentlyUsed;

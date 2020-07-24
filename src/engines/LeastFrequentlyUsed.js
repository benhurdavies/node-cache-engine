import DefaultHashTable from '../dataStructure/HashTable';
import DoublyLinkedList from '../dataStructure/DoublyLinkedList';
import { isPositiveInteger } from '../helper';
import {
  add as hAdd,
  get as hGet,
  has as hHas,
  remove as hRemove,
} from '../hashTableSymbol';

function LeastFrequentlyUsed({
  size = Number.MAX_SAFE_INTEGER,
  HashTable = DefaultHashTable,
}) {
  if (!isPositiveInteger(size))
    throw Error('LFU size specified should be greater than zero');

  const hashTable = new HashTable();
  const frequencies = new DoublyLinkedList(); // frequency object {value, items}
  let length = 0;

  this.add = (key, value) => {
    if (this.size() >= size) {
      handleOverflow();
    }
    const payload = { key, value };
    const fNode = addToFrequency(payload);
    hashTable[hAdd](key, fNode);
    length++;
  };

  this.get = key => {
    let fItemNode = hashTable[hGet](key);
    if (!fItemNode) return undefined;
    fItemNode = incrementFrequency(fItemNode);
    return fItemNode.value.payload.value;
  };

  this.remove = key => {
    if (!this.has(key)) return false;

    const fNode = hashTable[hGet](key);
    removeFromFrequency(fNode);
    hashTable[hRemove](key);
    length--;
    return true;
  };

  this.has = key => {
    return hashTable[hHas](key);
  };

  this.size = () => {
    return length;
  };

  function addToFrequency(payload) {
    // frequency start with 1
    let first = frequencies.getFirstNode();
    if (first?.value?.value !== 1) {
      first = frequencies.addFirst(newFrequency(1));
    }

    const newItem = newFrequencyItem({ payload, parent: first });
    return first.value.items.addFirst(newItem);
  }

  function incrementFrequency(fItemNode) {
    const currentFrequencyNode = fItemNode.value.parent;
    let nextFrequencyNode = currentFrequencyNode.next;
    const nextFrequency = currentFrequencyNode.value.value + 1;

    if (nextFrequency !== nextFrequencyNode?.value?.value) {
      nextFrequencyNode = frequencies.addNext(
        currentFrequencyNode,
        newFrequency(nextFrequency),
      );
    }

    const newItemNode = moveItemFromFrequency({
      source: currentFrequencyNode,
      traget: nextFrequencyNode,
      item: fItemNode,
    });
    hashTable[hAdd](fItemNode.value.payload.key, newItemNode);
    return newItemNode;
  }

  function moveItemFromFrequency({ source, traget, item }) {
    const { payload } = item.value;
    const { items } = source.value;
    items.remove(item);
    if (items.size() === 0) {
      frequencies.remove(source);
    }

    const newItem = newFrequencyItem({ payload, parent: traget });
    return traget.value.items.addFirst(newItem);
  }

  function removeFromFrequency(fItemNode) {
    const { parent } = fItemNode.value;
    const { items } = parent.value;
    items.remove(fItemNode);
    if (items.size() === 0) {
      frequencies.remove(parent);
    }
  }

  function newFrequencyItem({ payload, parent }) {
    return { payload, parent };
  }

  function newFrequency(value) {
    return { value, items: new DoublyLinkedList() };
  }

  const handleOverflow = () => {
    const leastFrequencyNode = frequencies.getFirstNode();
    const fItemNode = leastFrequencyNode.value.items.getLastNode();
    this.remove(fItemNode.value.payload.key);
  };
}

export default LeastFrequentlyUsed;

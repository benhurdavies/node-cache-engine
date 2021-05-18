import DefaultHashTable from '../dataStructure/HashTable';
import DoublyLinkedList from '../dataStructure/DoublyLinkedList';
import * as hashTableProp from '../hashTableSymbol';

function LeastRecentlyUsed({
  size = Number.MAX_SAFE_INTEGER,
  HashTable = DefaultHashTable,
}) {
  if (size <= 0) throw Error('LRU size specified should be greater than zero');

  const hashTable = new HashTable();
  const linkList = new DoublyLinkedList();

  this.add = (key, value) => {
    if (this.size() >= size) handleOverflow();
    const payload = { key, value };
    linkList.addFirst(payload);
    hashTable[hashTableProp.add](key, linkList.getFirstNode());
  };

  this.remove = key => {
    if (this.has(key)) {
      const node = hashTable[hashTableProp.get](key);
      linkList.remove(node);
      hashTable[hashTableProp.remove](key);
      return true;
    }
    return false;
  };

  this.get = key => {
    const node = hashTable[hashTableProp.get](key);
    if (node) {
      linkList.moveToFirst(node);
      return node.value.value;
    }
    return undefined;
  };

  this.has = key => {
    return hashTable[hashTableProp.has](key);
  };

  this.size = () => {
    return linkList.size();
  };

  this.clearAll = () =>{
    hashTable[hashTableProp.clear]();
    linkList.clearAll();
  }

  this.toArray = () => {
    return linkList.toArray();
  };

  function handleOverflow() {
    const node = linkList.getLastNode();
    hashTable[hashTableProp.remove](node.value.key);
    linkList.remove(node);
  }
}

export default LeastRecentlyUsed;

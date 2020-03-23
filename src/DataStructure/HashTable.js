import { get, add, remove, clear, size } from '../hashTableSymbol';

function HashTable() {
  const store = new Map();

  this[add] = (key, value) => {
    store.set(key, value);
  };

  this[remove] = key => {
    store.delete(key);
  };

  this[get] = key => {
    return store.get(key);
  };

  this[clear] = () => {
    store.clear();
  };

  this[size] = () => {
    return store.size;
  };
}

export default HashTable;

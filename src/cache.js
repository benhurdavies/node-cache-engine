import DefaultHashTable from './dataStructure/HashTable';
import LRU from './engines/LeastRecentlyUsed';

function factory({
  size = Number.MAX_SAFE_INTEGER,
  engine = 'LRU',
  HashTable = DefaultHashTable,
} = {}) {
  switch (engine) {
    case 'LRU':
      return new LRU({ size, HashTable });
    default:
      throw Error(`Engine : ${engine} is not implemented`);
  }
}

export default factory;

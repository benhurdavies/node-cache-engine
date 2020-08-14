import DefaultHashTable from './dataStructure/HashTable';
import LRU from './engines/LeastRecentlyUsed';
import LFU from './engines/LeastFrequentlyUsed';

function factory({
  size = Number.MAX_SAFE_INTEGER,
  engine = 'LRU',
  HashTable = DefaultHashTable,
} = {}) {
  switch (engine.toLocaleUpperCase()) {
    case 'LRU':
      return new LRU({ size, HashTable });
    case 'LFU':
      return new LFU({ size, HashTable });
    default:
      throw Error(
        `Engine : ${engine} is not implemented. Currently we have only 'LRU' and 'LFU' engine.`,
      );
  }
}

export default factory;

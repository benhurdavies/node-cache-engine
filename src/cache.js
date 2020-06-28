import DefaultHashTable from './dataStructure/HashTable';
import LRU from './engines/LeastRecentlyUsed';
import TTL from './engines/TimeToLive';

function factory({
  size = Number.MAX_SAFE_INTEGER,
  engine = 'LRU',
  HashTable = DefaultHashTable,
  defaultTTL,
} = {}) {
  switch (engine) {
    case 'LRU':
      return new LRU({ size, HashTable });
    case 'TTL':
      return new TTL({ HashTable, defaultTTL });
    default:
      throw Error(`Engine : ${engine} is not implemented. Engine options are 'LRU', 'TTL'`);
  }
}

export default factory;

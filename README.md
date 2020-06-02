# node-cache-engine (supports browser and node)

[![](https://github.com/benhurdavies/node-cache-engine/workflows/Test%20CI/badge.svg?branch=master)](https://github.com/benhurdavies/node-cache-engine/actions?query=workflow%3A%22Test+CI%22)

Simple and High performing cache engine package for node/javascript. It using default cache replacement is LRU (Least Recently Used) cache engine and hash table as javascript Map Object.

### Installation

```bash
npm install --save node-cache-engine
```

```javascript
const cache = cacheEngine(); // creating instance of cache with default configuration

cache.add('key', 'value'); // add into cache
cache.get('key'); // get from cache
cache.has('key'); // checking from key is existing in cache
cache.remove('key'); // removing from cache
cache.size(); // get the size of cache
```

### Option for creating cache instance

```javascript
const cache = cacheEngine({
  size = 100, // Maximum size for the cache. default value is Number.MAX_SAFE_INTEGER
  engine = 'LRU', // cache replacement engine default is LRU (Least Recently Used)
  HashTable = YourCustomHashTable, // for custom hash Table. default hastTable is 'src/dataStructure/HashTable.js'
}); 
```

### Creating Custom HashTable
When and Why you should create custom hash table?  
The default hash table implemented with `Map`. If you want much more performance than default you can implement your own (like node wrapped c++ hash table). I think 1 to 5 million cache entry default hast table is fine if your use case is more than this go for custom hash table.  

To implement custom hashTable you have to use methods with symbols name provided from the package. [example](src/featureTest/customHashTable.test.js)


#### Next?
* TTL engine.
* TTL combining with LRU engine

# node-cache-engine (supports browser and node)

[![](https://github.com/benhurdavies/node-cache-engine/workflows/Test%20CI/badge.svg?branch=master)](https://github.com/benhurdavies/node-cache-engine/actions?query=workflow%3A%22Test+CI%22)

Simple and High performing cache engine package for node/javascript. It using default cache replacement is LRU (Least Recently Used) cache engine and hash table as javascript Map Object.

### Installation

```bash
npm install --save node-cache-engine
```

```javascript
import { createCache } from 'node-cache-engine';

const cache = createCache(); // creating instance of cache with default configuration

cache.add('key', 'value'); // add into cache
cache.get('key'); // get from cache
cache.has('key'); // checking from key is existing in cache
cache.remove('key'); // removing from cache
cache.size(); // get the size of cache
```

### Option for creating cache instance

```javascript
import { createCache } from 'node-cache-engine';

const cache = createCache({
  size: 100, // Maximum size for the cache. default value is Number.MAX_SAFE_INTEGER
  engine: 'LRU', // cache replacement engine default is LRU (Least Recently Used)
  HashTable: YourCustomHashTable, // for custom hash Table. default hashTable is 'src/dataStructure/HashTable.js'
  ttl: 60_000, // LRU only. Time to live in ms applied to every entry. Omitted/undefined means entries never expire.
  now: () => Date.now(), // Optional injectable clock, used to compute/check expiry. Defaults to Date.now.
});
```

#### Supported cache replacement engines and options

| Engines Name          | key | supported options         |
| --------------------- | --- | ------------------------- |
| Least Recently Used   | LRU | HashTable, size, ttl, now |
| Least Frequently Used | LFU | HashTable, size           |

#### Time complexity of engine methods

<table>
  <tr>
    <th>Engine</th>
    <th>Method</th>
    <th>Time complexity </th>
  </tr>
  <tr>
    <td rowspan=5>LRU/LFU</td>
    <td>add</td>
    <td>O(1)</td>
  </tr>
  <tr>
    <td>get</td>
    <td>O(1)</td>
  </tr>
  <tr>
    <td>has</td>
    <td>O(1)</td>
  </tr>
  <tr>
    <td>remove</td>
    <td>O(1)</td>
  </tr>
  <tr>
    <td>size</td>
    <td>O(1)</td>
  </tr>
</table>

### Methods available on cache engines

<table>
  <tr>
    <th>Methods</th>
    <th>LRU</th>
    <th>LFU</th>
  </tr>
  <tr>
    <td>add</td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td>get</td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td>has</td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td>remove</td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td>size</td>
    <td>✅</td>
    <td>✅</td>
  </tr>
  <tr>
    <td>clearAll</td>
    <td>✅</td>
    <td>❌</td>
  </tr>
  <tr>
    <td>toArray</td>
    <td>✅</td>
    <td>❌</td>
  </tr>
</table>

### Creating Custom HashTable

When and Why you should create custom hash table?  
The default hash table implemented with `Map`. If you want much more performance than default you can implement your own (like node wrapped c++ hash table). I think 1 to 5 million cache entry default hash table is fine if your use case is more than this go for custom hash table.

To implement custom hashTable you have to use methods with symbols name provided from the package. [example](src/featureTest/customHashTable.test.js)

### Time to live (TTL)

TTL is supported by the **LRU engine only**; passing a `ttl` to the LFU engine throws.

```javascript
import { createCache } from 'node-cache-engine';

const cache = createCache({ size: 100, ttl: 60_000 }); // every entry expires 60 s after it was added

cache.add('key', 'value'); // expires in 60 s
cache.add('other', 'value', { ttl: 5_000 }); // a per-entry ttl overrides the cache-wide one
cache.get('key'); // reading does not extend the ttl
cache.add('key', 'new value'); // re-adding a key starts a fresh ttl window
```

- A `ttl` is a positive integer of milliseconds; anything else throws from `createCache`, `new LRU(...)` and
  `add(...)`. Omit it and entries never expire. The `Ttl` type is exported.
- Expiry is **lazy**: `get` and `has` remove an expired entry and report it absent, and `toArray()` skips expired
  entries. Nothing scans for expired entries, so `size()` stays O(1) but may still count entries that have
  expired and not been touched since.

#### Next?

- TTL engine (eviction purely by expiry, independent of LRU/LFU)

## Contribute

Contributions to this project are always welcome.  
Please read [CONTRIBUTING.md](CONTRIBUTING.md) for a How-to.

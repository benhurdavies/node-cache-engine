import DefaultHashTable from '../dataStructure/HashTable';
import DoublyLinkedList from '../dataStructure/DoublyLinkedList';
import * as hashTableProp from '../hashTableSymbol';

function TimeToLive({ HashTable = DefaultHashTable, defaultTTL } = {}) {
  const store = new HashTable();
  const timeSeriesIndex = new HashTable();
  const timeIndexInterval = 5 * 60 * 1000; // milliseconds.

  let lastRunGC = Date.now();

  this.add = (key, value, ttl = defaultTTL) => {
    if (!ttl)
      throw Error(
        'Expected ttl value. you can have to mention it in add method or mention as defaultTTL at constructor',
      );

    const expireTTL = Date.now() + ttl;
    const bucket = getTimeBucket(expireTTL);
    bucket.addFirst(key);
    const tNode = bucket.getFirst();
    const payload = { value, ttl: expireTTL, tNode };
    store[hashTableProp.add](key, payload);
  };

  this.get = key => {
    const payload = store[hashTableProp.get](key);
    if (payload) {
      const { ttl, value } = payload;
      if (checkIfElementExpire(payload)) return undefined;
      else return value;
    }
    return undefined;
  };

  this.has = key => {
    return store[hashTableProp.has](key);
  };

  this.remove = (key) => {
    if (this.has(key)) {
      const { ttl, tNode } = store[hashTableProp.get](key);
      const timeBucket = getTimeBucket(ttl);
      timeBucket.remove(tNode);
      store[hashTableProp.remove](key);
    }
  };

  this.size = () => {
    return store[hashTableProp.size]();
  };

  function getTimeBucket(expireTTL) {
    const timeIndex = getTimeIndex({ time: expireTTL, interval:timeIndexInterval });

    if (timeSeriesIndex[hashTableProp.has](timeIndex)) {
      return timeSeriesIndex[hashTableProp.get](timeIndex);
    } else {
      const list = new DoublyLinkedList();
      timeSeriesIndex[hashTableProp.add](timeIndex, list);
      return list;
    }
  }

  function checkIfElementExpire({ ttl }) {
    if (ttl < Date.now()) {
      const timeIndex = getTimeIndex({ time: ttl, interval:timeIndexInterval });
      cleanExpired(timeIndex);
      return true;
    }
    return false;
  }

  function cleanExpired(timeIndex) {
    const keys = timeSeriesIndex[hashTableProp.get][timeIndex];
    for (key of keys) {
      store[hashTableProp.remove](key);
    }
  }
}

// time : unix timestamp milliseconds
// interval : milliseconds (better to be factors of 60  (minutes))
function getTimeIndex({ time, interval }) {
  const timeParts = parseInt(time / interval, 10);
  const forwardIndexTime = timeParts * interval + interval;
  return forwardIndexTime;
}

export { getTimeIndex };
export default TimeToLive;

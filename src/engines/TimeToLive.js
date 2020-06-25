import DefaultHashTable from '../dataStructure/HashTable';
import DoublyLinkedList from '../dataStructure/DoublyLinkedList';
import * as hashTableProp from '../hashTableSymbol';

function TimeToLive({ HashTable = DefaultHashTable, defaultTTL } = {}) {
  const store = new HashTable();
  const timePartition = new HashTable();
  const timeIndexInterval = 5 * 60 * 1000; // milliseconds.

  let lowestTimePartition = Date.now();

  this.add = (key, value, ttl = defaultTTL) => {
    if (!ttl && Number.isInteger(ttl))
      throw Error(
        'Expected ttl value. you can have to mention it in add method or mention as defaultTTL at constructor',
      );

    const expireTTL = Date.now() + ttl;
    const bucket = getTimeBucket(expireTTL);
    bucket.addFirst(key);
    const tNode = bucket.getFirstNode();
    const payload = { value, ttl: expireTTL, tNode };
    store[hashTableProp.add](key, payload);
  };

  this.get = key => {
    const payload = store[hashTableProp.get](key);
    if (payload) {
      const { ttl, value } = payload;
      if (checkIfElementExpire({ ttl, key })) return undefined;
      else return value;
    }
    return undefined;
  };

  this.has = key => {
    return (
      store[hashTableProp.has](key) &&
      !checkIfElementExpire({ ttl: store[hashTableProp.get](key), key })
    );
  };

  this.remove = key => {
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

  this.runGC = () => {
    const cleanTo = getBackwardTimeIndex({ time: Date.now(), interval: timeIndexInterval });
    cleanExpiredBuckets(cleanTo);

    const nextCleanBucket = getForwardTimeIndex({ time: Date.now(), interval: timeIndexInterval });
    cleanNotExpiredBucket(nextCleanBucket);
  };

  function getTimeBucket(expireTTL) {
    const timeIndex = getForwardTimeIndex({
      time: expireTTL,
      interval: timeIndexInterval,
    });

    if (timePartition[hashTableProp.has](timeIndex)) {
      return timePartition[hashTableProp.get](timeIndex);
    } else {
      const list = new DoublyLinkedList();
      timePartition[hashTableProp.add](timeIndex, list);
      return list;
    }
  }

  const checkIfElementExpire = ({ ttl, key }) => {
    if (ttl < Date.now()) {
      const timeIndex = getBackwardTimeIndex({
        time: ttl,
        interval: timeIndexInterval,
      });
      this.remove(key);
      cleanExpiredBuckets(timeIndex);
      return true;
    }
    return false;
  };

  function cleanExpiredBucket(timeIndex) {
    if (timePartition[hashTableProp.has](timeIndex)) {
      const tNodes = timePartition[hashTableProp.get](timeIndex);
      for (const tNode of tNodes) {
        store[hashTableProp.remove](tNode.value);
      }
      timePartition[hashTableProp.remove](timeIndex);
    }
  }

  function cleanExpiredBuckets(tillTimeIndex) {
    const cleanFrom = getForwardTimeIndex({
      time: lowestTimePartition,
      interval: timeIndexInterval,
    });

    for (const curTimeIndex of getIndexBetween({
      from: cleanFrom,
      to: tillTimeIndex,
      interval: timeIndexInterval,
    })) {
      cleanExpiredBucket(curTimeIndex);
    }
    lowestTimePartition = tillTimeIndex;
  }

  function cleanNotExpiredBucket(timeIndex) {
    if (timePartition[hashTableProp.has](timeIndex)) {
      const tNodes = timePartition[hashTableProp.get](timeIndex);
      for (const { value: key } of tNodes) {
        const { ttl } = store[hashTableProp.get](key);
        if (ttl < Date.now()) {
          store[hashTableProp.remove](key);
        }
      }
    }
  }
}

// time : unix timestamp milliseconds
// interval : milliseconds (better to be factors of 60  (minutes))
function getForwardTimeIndex({ time, interval }) {
  const timeParts = parseInt(time / interval, 10);
  return timeParts * interval + interval;
}

function getBackwardTimeIndex({ time, interval }) {
  const timeParts = parseInt(time / interval, 10);
  return timeParts * interval;
}

function* getIndexBetween({ from, to, interval }) {
  for (let i = from; i <= to; i += interval) yield i;
}

export { getForwardTimeIndex, getBackwardTimeIndex, getIndexBetween };
export default TimeToLive;

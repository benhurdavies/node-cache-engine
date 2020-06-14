import DefaultHashTable from '../dataStructure/HashTable';
import * as hashTableProp from '../hashTableSymbol';

function TimeToLive({ HashTable = DefaultHashTable, defaultTTL }) {
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
    const payload = { value, ttl: expireTTL };
    store[hashTableProp.add](key,value);

    const timeIndex = getTimeIndex({time:expireTTL,timeIndexInterval});

    // if(timeSeriesIndex[hashTableProp.has](key)) timeSeriesIndex[hashTableProp.add][timeIndex].push()
    // timeSeriesIndex[hashTableProp.add](timeIndex,[key]);
  };
}

// time : unix timestamp milliseconds
// interval : milliseconds (better to be factors of 60  (minutes))
function getTimeIndex({ time, interval }) {
  const timeParts = parseInt(time / interval, 10);
  const forwardIndexTime = timeParts * interval + interval;
  return forwardIndexTime;
}

export { getTimeIndex };

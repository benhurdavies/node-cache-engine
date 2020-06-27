import MockDate from 'mockdate';

import TimeToLive, {
  getForwardTimeIndex,
  getBackwardTimeIndex,
  getIndexBetween,
} from './TimeToLive';

const toMinute = val => val * 60 * 1000;

describe('TimeToLive (TTL) : getForwardTimeIndex', () => {
  it('should index time to next upcoming interval', () => {
    const date1 = new Date('2020-06-14T03:23:34');
    expect(getForwardTimeIndex({ time: date1.getTime(), interval: toMinute(5) })).toBe(
      new Date('2020-06-14T03:25:00').getTime(),
    );

    const date2 = new Date('2020-06-14T03:43:36');
    expect(getForwardTimeIndex({ time: date2.getTime(), interval: toMinute(10) })).toBe(
      new Date('2020-06-14T03:50:00').getTime(),
    );

    const date3 = new Date('2020-06-14T03:43:36');
    expect(getForwardTimeIndex({ time: date3.getTime(), interval: toMinute(3) })).toBe(
      new Date('2020-06-14T03:45:00').getTime(),
    );
  });
});

describe('TimeToLive (TTL) : getBackwardTimeIndex', () => {
  it('should index time to before upcoming interval', () => {
    const date1 = new Date('2020-06-14T03:23:34');
    expect(getBackwardTimeIndex({ time: date1.getTime(), interval: toMinute(5) })).toBe(
      new Date('2020-06-14T03:20:00').getTime(),
    );

    const date2 = new Date('2020-06-14T03:43:36');
    expect(getBackwardTimeIndex({ time: date2.getTime(), interval: toMinute(10) })).toBe(
      new Date('2020-06-14T03:40:00').getTime(),
    );
  });
});

describe('TimeToLive (TTL) : getBackwardTimeIndex', () => {
  it('should generate index between from and to', () => {
    const interval = 5 * 60 * 1000;
    const date1 = new Date('2020-06-14T03:23:34');
    const date2 = new Date('2020-06-14T03:36:34');
    const from = getForwardTimeIndex({ time: date1.getTime(), interval });
    const to = getBackwardTimeIndex({ time: date2.getTime(), interval });

    expect([...getIndexBetween({ from, to, interval })]).toEqual([
      new Date('2020-06-14T03:25:00').getTime(),
      new Date('2020-06-14T03:30:00').getTime(),
      new Date('2020-06-14T03:35:00').getTime(),
    ]);
  });
});

describe('TimeToLive', () => {
  it('should have basic cache features', () => {
    const ttlCache = new TimeToLive();
    ttlCache.add('apple', 5, 1000);
    ttlCache.add('orange', 2, 2000);
    expect(ttlCache.get('apple')).toBe(5);
    expect(ttlCache.has('apple')).toBe(true);
    expect(ttlCache.size()).toBe(2);

    ttlCache.remove('apple');
    expect(ttlCache.size()).toBe(1);
    expect(ttlCache.get('apple')).toBe(undefined);
    expect(ttlCache.get('orange')).toBe(2);
  });

  it('should not return expired item', () => {
    MockDate.set(new Date('2020-06-25T03:25:00'));
    const ttlCache = new TimeToLive();
    ttlCache.add('ben', 5, 5000);
    expect(ttlCache.get('ben')).toBe(5);

    MockDate.set(new Date('2020-06-25T03:26:00'));
    expect(ttlCache.get('ben')).toBe(undefined);
    expect(ttlCache.size()).toBe(0);

    ttlCache.add('mango', 10, 180000);
    ttlCache.add('grape', 33, 660000);

    MockDate.set(new Date('2020-06-25T03:45:00'));
    expect(ttlCache.get('grape')).toBe(undefined);
    expect(ttlCache.size()).toBe(0);

    MockDate.reset();
  });

  it('should clean expired item when runGC calls', () => {
    MockDate.set(new Date('2020-06-25T03:24:00'));
    const ttlCache = new TimeToLive();

    ttlCache.add('test1', 5, 180000); // 3mint
    ttlCache.add('test2', 2, 660000); // 12 mint
    ttlCache.add('test3', 60, 900000); // 15 mint
    ttlCache.add('test4', 43, 1080000); // 18 mint
    expect(ttlCache.size()).toBe(4);

    MockDate.set(new Date('2020-06-25T03:40:00'));
    ttlCache.runGC();
    expect(ttlCache.size()).toBe(1);
  });
});

describe('TimeToLive error test', () => {
  it('should throw error ttl value is not given', () => {
    const ttlCache = new TimeToLive();
    expect(() => ttlCache.add('key1', 'value')).toThrow(
      'Expected ttl value (should be positive integer). ' +
        'you can have to mention it in add method or mention as defaultTTL at constructor',
    );

    expect(() => ttlCache.add('key1', 'value', 0)).toThrow(
      'Expected ttl value (should be positive integer). ' +
        'you can have to mention it in add method or mention as defaultTTL at constructor',
    );

    expect(() => ttlCache.add('key1', 'value', -1)).toThrow(
      'Expected ttl value (should be positive integer). ' +
        'you can have to mention it in add method or mention as defaultTTL at constructor',
    );
  });

  it('should not throw error ttl value is not give but defined as default TTL', () => {
    const ttlCache = new TimeToLive({ defaultTTL: 5000 });
    ttlCache.add('key1', 'value');
    expect(ttlCache.get('key1')).toBe('value');
  });
});

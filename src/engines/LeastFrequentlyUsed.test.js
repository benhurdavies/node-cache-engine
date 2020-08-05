import LFU from './LeastFrequentlyUsed';

describe('LeastFrequentlyUsed (LFU)', () => {
  it('should have basic methods', () => {
    const lfu = new LFU({ size: 10 });
    lfu.add('apple', 2);
    lfu.add('mango', 5);
    expect(lfu.get('apple')).toEqual(2);
    expect(lfu.get('mango')).toEqual(5);
    expect(lfu.has('apple')).toBe(true);
    expect(lfu.size()).toBe(2);

    lfu.remove('apple');
    expect(lfu.get('apple')).toBe(undefined);
    expect(lfu.has('apple')).toBe(false);
    expect(lfu.size()).toBe(1);

    lfu.remove('mango');
    expect(lfu.size()).toBe(0);
  });

  it('should remove lest frequently used item if overflow the size', () => {
    const lfu = new LFU({ size: 5 });
    lfu.add('A', 1);
    lfu.add('B', 2);
    lfu.add('C', 3);
    lfu.add('D', 4);
    lfu.add('F', 5);
    expect(lfu.size()).toBe(5);

    lfu.add('G', 6);
    expect(lfu.size()).toBe(5);
    expect(lfu.get('A')).toBe(undefined);

    lfu.get('B');
    lfu.get('B');
    lfu.get('C');
    lfu.add('H', 7);
    expect(lfu.get('D')).toBe(undefined);
    lfu.add('I', 8);
    expect(lfu.get('F')).toBe(undefined);

    lfu.get('G');
    lfu.get('G');
    lfu.get('H');
    lfu.get('H');
    lfu.get('I');
    lfu.get('I');

    lfu.add('J', 9);
    expect(lfu.get('C')).toBe(undefined);

    lfu.get('J');
    lfu.get('J');
    lfu.add('K', 10);
    expect(lfu.get('B')).toBe(undefined);
    expect(lfu.size()).toBe(5);
  });

  it('should throw error when size is less than 1', () => {
    expect(() => new LFU({ size: 0 })).toThrow(
      'LFU size specified should be greater than zero',
    );
  });
});

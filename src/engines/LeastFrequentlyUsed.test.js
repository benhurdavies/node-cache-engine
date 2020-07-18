import LeastFrequentlyUsed from './LeastFrequentlyUsed';

describe('LeastFrequentlyUsed (LFU)', () => {
  it('should have basic methods', () => {
    const lfu = new LeastFrequentlyUsed({ size: 10 });
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
});

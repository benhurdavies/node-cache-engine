import LRU from './LeastRecentlyUsed';

describe('LeastRecentlyUsed (LRU)', () => {
  it('should possible to add and remove from the cache', () => {
    const lru = new LRU({ size: 3 });

    lru.add('mango', 1);
    lru.add('apple', 15);
    expect(lru.get('mango')).toBe(1);

    lru.remove('mango');
    expect(lru.get('mango')).toBe(undefined);
  });

  it('should replace least recently used when it overflow', () => {
    const lru = new LRU({ size: 3 });

    lru.add('A', 'A');
    lru.add('B', 'B');
    lru.get('B');
    lru.add('C', 'C');
    lru.add('D', 'D');

    expect(lru.has('A')).toBe(false);
    expect(lru.has('B')).toBe(true);
    expect(lru.has('C')).toBe(true);
    expect(lru.has('D')).toBe(true);

    lru.get('B');
    lru.add('E', 'E');
    expect(lru.has('C')).toBe(false);
  });
});

import { describe, it, expect } from 'vitest';
import { LRU } from './LeastRecentlyUsed.js';

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

  it('should have clear all method', () => {
    const lru = new LRU({ size: 3 });
    lru.add('A', 'A');
    lru.add('B', 'B');
    expect(lru.size()).toBe(2);

    lru.clearAll();
    expect(lru.size()).toBe(0);

    lru.add('C', 'C');
    expect(lru.size()).toBe(1);
  });

  it('should throw error when size is less than 1', () => {
    expect(() => new LRU({ size: 0 })).toThrow('LRU size specified should be greater than zero');
  });

  describe('re-adding an existing key', () => {
    it('updates the value in place without growing size, and moves the key to MRU', () => {
      const lru = new LRU({ size: 3 });

      lru.add('A', 'A1');
      lru.add('B', 'B');
      expect(lru.size()).toBe(2);

      // Re-adding an existing key below capacity must not grow size() - a
      // naive add that always creates a new node would orphan the old one
      // and leave size() overcounting.
      lru.add('A', 'A2');
      expect(lru.size()).toBe(2);
      expect(lru.get('A')).toBe('A2');

      // A is now MRU (re-added last); B was never touched again and is LRU.
      lru.add('C', 'C');
      expect(lru.size()).toBe(3);

      // Overflow should evict the true LRU entry (B), leaving A, C, D intact.
      lru.add('D', 'D');
      expect(lru.has('B')).toBe(false);
      expect(lru.has('A')).toBe(true);
      expect(lru.has('C')).toBe(true);
      expect(lru.has('D')).toBe(true);
    });
  });

  describe('orphan node regression (re-adding a key must not orphan its old linked-list node)', () => {
    it('keeps size within bounds and returns A latest value after repeated re-adds interleaved with overflow', () => {
      const size = 3;
      const lru = new LRU({ size });
      const steps: [string, string][] = [
        ['A', 'A0'],
        ['B', 'B'],
        ['A', 'A1'],
        ['C', 'C'],
        ['A', 'A2'],
        ['D', 'D'],
        ['E', 'E'],
        ['A', 'A3'],
        ['F', 'F'],
        ['G', 'G'],
      ];

      steps.forEach(([key, value]) => {
        lru.add(key, value);
        // Reading 'A' between adds is realistic usage, and (with the pre-fix
        // orphaning bug) changes which node reaches the tail next - this is
        // what eventually causes overflow eviction to delete a live entry.
        lru.get('A');
        expect(lru.size()).toBeLessThanOrEqual(size);
      });

      expect(lru.has('A')).toBe(true);
      expect(lru.get('A')).toBe('A3');
    });
  });
});

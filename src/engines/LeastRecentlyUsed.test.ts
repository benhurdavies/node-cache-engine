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

  describe('TTL', () => {
    it('expires an entry lazily on get, removing it', () => {
      let clock = 0;
      const now = (): number => clock;
      const lru = new LRU({ size: 3, ttl: 100, now });

      lru.add('A', 'A');
      clock = 101;

      expect(lru.get('A')).toBe(undefined);
      expect(lru.size()).toBe(0);
    });

    it('expires an entry lazily on has, removing it', () => {
      let clock = 0;
      const now = (): number => clock;
      const lru = new LRU({ size: 3, ttl: 100, now });

      lru.add('A', 'A');
      clock = 101;

      expect(lru.has('A')).toBe(false);
      expect(lru.size()).toBe(0);
    });

    it('keeps an entry read before expiry present, and marks it MRU', () => {
      let clock = 0;
      const now = (): number => clock;
      const lru = new LRU({ size: 2, ttl: 100, now });

      lru.add('A', 'A');
      lru.add('B', 'B');
      clock = 50;
      expect(lru.get('A')).toBe('A');

      // A was just read, so it is MRU; overflow should evict B instead.
      lru.add('C', 'C');
      expect(lru.has('A')).toBe(true);
      expect(lru.has('B')).toBe(false);
      expect(lru.has('C')).toBe(true);
    });

    it('lets a per-entry ttl override the cache-wide ttl with a shorter duration', () => {
      let clock = 0;
      const now = (): number => clock;
      const lru = new LRU({ size: 3, ttl: 1000, now });

      lru.add('A', 'A', { ttl: 10 });
      clock = 11;

      expect(lru.get('A')).toBe(undefined);
    });

    it('lets a per-entry ttl override the cache-wide ttl with a longer duration', () => {
      let clock = 0;
      const now = (): number => clock;
      const lru = new LRU({ size: 3, ttl: 10, now });

      lru.add('A', 'A', { ttl: 1000 });
      clock = 11;

      expect(lru.get('A')).toBe('A');
    });

    it('never expires an entry when no ttl is configured anywhere, even after a large clock jump', () => {
      let clock = 0;
      const now = (): number => clock;
      const lru = new LRU({ size: 3, now });

      lru.add('A', 'A');
      clock = Number.MAX_SAFE_INTEGER;

      expect(lru.get('A')).toBe('A');
      expect(lru.has('A')).toBe(true);
    });

    it('omits expired entries from toArray', () => {
      let clock = 0;
      const now = (): number => clock;
      const lru = new LRU({ size: 3, ttl: 100, now });

      lru.add('A', 'A');
      lru.add('B', 'B', { ttl: 1000 });
      clock = 101;

      expect(lru.toArray()).toEqual(['B']);
    });

    it('resets expiresAt to a full fresh ttl when re-adding an existing key', () => {
      let clock = 0;
      const now = (): number => clock;
      const lru = new LRU({ size: 3, ttl: 100, now });

      lru.add('A', 'A1');
      clock = 90; // just before the original entry would expire
      lru.add('A', 'A2'); // re-add resets the ttl window

      clock = 150; // would have expired under the original window
      expect(lru.get('A')).toBe('A2');
    });

    it.each([0, -1, NaN, Infinity])('throws a clear error for an invalid cache-wide ttl of %s', (ttl) => {
      expect(() => new LRU({ size: 3, ttl })).toThrow();
    });

    it.each([0, -1, NaN, Infinity])('throws a clear error for an invalid per-entry ttl of %s', (ttl) => {
      const lru = new LRU({ size: 3 });
      expect(() => {
        lru.add('A', 'A', { ttl });
      }).toThrow();
    });

    it('throws a clear error for a non-number cache-wide ttl', () => {
      expect(() => new LRU({ size: 3, ttl: 'oops' as unknown as number })).toThrow();
    });

    it('throws a clear error for a non-number per-entry ttl', () => {
      const lru = new LRU({ size: 3 });
      expect(() => {
        lru.add('A', 'A', { ttl: 'oops' as unknown as number });
      }).toThrow();
    });
  });
});

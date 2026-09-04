import { beforeEach, describe, it, expect } from 'vitest';
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
    it('updates the value in place, keeps size unchanged and makes the key most recently used', () => {
      const lru = new LRU({ size: 3 });
      lru.add('A', 'A1');
      lru.add('B', 'B');

      lru.add('A', 'A2');
      expect(lru.size()).toBe(2);
      expect(lru.get('A')).toBe('A2');

      // B is now the least recently used entry, so it is the one overflow evicts.
      lru.add('C', 'C');
      lru.add('D', 'D');
      expect(lru.has('B')).toBe(false);
      expect(lru.has('A')).toBe(true);
      expect(lru.has('C')).toBe(true);
      expect(lru.has('D')).toBe(true);
    });

    it('never orphans a node: repeated re-adds interleaved with overflow keep size bounded and the key alive', () => {
      // Regression: add() used to link a fresh node for an existing key while Map.set overwrote the hash entry.
      // The orphan later reached the tail and overflow removed the *live* entry by key.
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
        lru.get('A');
        expect(lru.size()).toBeLessThanOrEqual(size);
      });

      expect(lru.get('A')).toBe('A3');
    });
  });

  describe('TTL', () => {
    let clock = 0;
    const now = (): number => clock;
    beforeEach(() => {
      clock = 0;
    });

    it('removes an expired entry on get and reports it absent', () => {
      const lru = new LRU({ size: 3, ttl: 100, now });
      lru.add('A', 'A');
      clock = 101;

      expect(lru.get('A')).toBe(undefined);
      expect(lru.size()).toBe(0);
    });

    it('removes an expired entry on has and reports it absent', () => {
      const lru = new LRU({ size: 3, ttl: 100, now });
      lru.add('A', 'A');
      clock = 101;

      expect(lru.has('A')).toBe(false);
      expect(lru.size()).toBe(0);
    });

    it('keeps an entry read before expiry and makes it most recently used', () => {
      const lru = new LRU({ size: 2, ttl: 100, now });
      lru.add('A', 'A');
      lru.add('B', 'B');
      clock = 50;
      expect(lru.get('A')).toBe('A');

      lru.add('C', 'C');
      expect(lru.has('A')).toBe(true);
      expect(lru.has('B')).toBe(false);
      expect(lru.has('C')).toBe(true);
    });

    it('lets a per-entry ttl shorten or extend the cache-wide ttl', () => {
      const lru = new LRU({ size: 3, ttl: 100, now });
      lru.add('short', 'short', { ttl: 10 });
      lru.add('long', 'long', { ttl: 1000 });
      lru.add('default', 'default');
      clock = 101;

      expect(lru.get('short')).toBe(undefined);
      expect(lru.get('default')).toBe(undefined);
      expect(lru.get('long')).toBe('long');
    });

    it('never expires an entry when no ttl is configured, even after a large clock jump', () => {
      const lru = new LRU({ size: 3, now });
      lru.add('A', 'A');
      clock = Number.MAX_SAFE_INTEGER;

      expect(lru.get('A')).toBe('A');
      expect(lru.toArray()).toEqual(['A']);
    });

    it('omits expired entries from toArray', () => {
      const lru = new LRU({ size: 3, ttl: 100, now });
      lru.add('A', 'A');
      lru.add('B', 'B', { ttl: 1000 });
      clock = 101;

      expect(lru.toArray()).toEqual(['B']);
    });

    it('starts a fresh ttl window when re-adding an existing key', () => {
      const lru = new LRU({ size: 3, ttl: 100, now });
      lru.add('A', 'A1');
      clock = 90;
      lru.add('A', 'A2');
      clock = 150; // past the original window, inside the new one

      expect(lru.get('A')).toBe('A2');
    });

    it('rejects an invalid cache-wide ttl', () => {
      expect(() => new LRU({ size: 3, ttl: 0 })).toThrow('ttl must be a positive integer');
    });

    it('rejects an invalid per-entry ttl before touching the cache', () => {
      const lru = new LRU({ size: 3 });
      expect(() => {
        lru.add('A', 'A', { ttl: 0.5 });
      }).toThrow('ttl must be a positive integer');
      expect(lru.has('A')).toBe(false);
    });
  });
});

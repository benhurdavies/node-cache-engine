import { describe, it, expect } from 'vitest';
import { assertTtl, isPositiveInteger } from './helper.js';

describe('helper', () => {
  it('should return true for positive number', () => {
    expect(isPositiveInteger(1)).toBe(true);
    expect(isPositiveInteger(178)).toBe(true);
    expect(isPositiveInteger(-1)).toBe(false);
    expect(isPositiveInteger(0)).toBe(false);
    expect(isPositiveInteger(1.8)).toBe(false);
    expect(isPositiveInteger(null as unknown as number)).toBe(false);
    expect(isPositiveInteger(undefined as unknown as number)).toBe(false);
    expect(isPositiveInteger('some' as unknown as number)).toBe(false);
    expect(isPositiveInteger('2' as unknown as number)).toBe(false);
  });

  it('should narrow unknown input without a cast', () => {
    const val: unknown = 42;
    expect(isPositiveInteger(val)).toBe(true);
    expect(isPositiveInteger({})).toBe(false);
    expect(isPositiveInteger([])).toBe(false);
  });

  it('assertTtl accepts a positive integer and throws for anything else', () => {
    expect(() => {
      assertTtl(1);
    }).not.toThrow();
    expect(() => {
      assertTtl(60_000);
    }).not.toThrow();
    [0, -1, 0.5, NaN, Infinity, -Infinity, '1000', null, undefined, {}].forEach((bad) => {
      expect(() => {
        assertTtl(bad);
      }).toThrow('ttl must be a positive integer (milliseconds)');
    });
  });
});

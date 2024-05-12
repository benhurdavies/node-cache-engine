import { describe, it, expect } from 'vitest';
import { isPositiveInteger } from './helper.js';

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
});
